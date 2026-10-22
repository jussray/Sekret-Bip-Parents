import { readFileSync, lstatSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = resolve(fileURLToPath(new URL('../', import.meta.url)));
export const LOCK_FILE = 'guard/source-lock.json';
const SHA_RE = /^[0-9a-f]{40}$/;
const FORBIDDEN_PARTS = new Set(['', '.', '..']);

export function gitBlobSha(content) {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return createHash('sha1').update(Buffer.from('blob ' + bytes.length + '\0')).update(bytes).digest('hex');
}
function safePath(path) {
  if (typeof path !== 'string' || path.includes('\\') || path.startsWith('/')) return false;
  const parts = path.split('/');
  return parts.every(p => !FORBIDDEN_PARTS.has(p));
}
function immutableFiles(root, dir, errors) {
  const output = [];
  function visit(rel) {
    let children;
    try { children = readdirSync(resolve(root, rel), { withFileTypes: true }); }
    catch { errors.push('Missing protected directory: ' + rel); return; }
    for (const child of children) {
      const childPath = rel + '/' + child.name;
      if (child.isSymbolicLink()) errors.push('Protected symlink forbidden: ' + childPath);
      else if (child.isDirectory()) visit(childPath);
      else if (child.isFile()) output.push(childPath);
      else errors.push('Unexpected protected file type: ' + childPath);
    }
  }
  visit(dir);
  return output;
}
export function auditSource({
  root = REPO_ROOT,
  manifest = JSON.parse(readFileSync(resolve(root, LOCK_FILE), 'utf8')),
  readBytes = path => readFileSync(resolve(root, path)),
  fileStatus = path => lstatSync(resolve(root, path)),
  enumerate = true,
} = {}) {
  const errors = [];
  if (manifest.version !== 1 || manifest.policy !== 'SAUCE_GUARD_source_preservation') {
    errors.push('Invalid Sauce Guard policy or version');
    return { ok: false, errors, checked: 0 };
  }
  if (manifest.reference?.upstream_commit !== '015ac2d39bf5230530996880ea3cfa4f4707077b') errors.push('Pinned upstream commit mismatch');
  if (!Array.isArray(manifest.lockedFiles) || !Array.isArray(manifest.immutableFolders) || !manifest.lockedFiles.length) {
    errors.push('Missing source protection inventory');
    return { ok: false, errors, checked: 0 };
  }
  const paths = new Set();
  const hashes = new Map();
  let checked = 0;
  for (const { path, sha } of manifest.lockedFiles) {
    if (!safePath(path) || !SHA_RE.test(sha)) {
      errors.push('Invalid manifest path/hash: ' + String(path));
      continue;
    }
    if (paths.has(path)) { errors.push('Duplicate manifest path: ' + path); continue; }
    paths.add(path);
    hashes.set(path, sha);
    try {
      if (!fileStatus(path).isFile()) { errors.push('Not a regular file: ' + path); continue; }
      if (gitBlobSha(readBytes(path)) !== sha) errors.push('Source content changed: ' + path);
      checked++;
    } catch { errors.push('Missing or unreadable protected file: ' + path); }
  }
  if (enumerate) {
    for (const folder of manifest.immutableFolders) {
      if (!safePath(folder)) { errors.push('Invalid immutable folder: ' + String(folder)); continue; }
      for (const path of immutableFiles(root, folder, errors)) {
        if (!paths.has(path)) errors.push('Unrecorded file added inside preserved source: ' + path);
      }
    }
  }
  const pinnedPath = 'parent-app/EXPORT_MANIFEST.json';
  if (hashes.has(pinnedPath)) {
    try {
      const source = JSON.parse(readBytes(pinnedPath).toString());
      if (source.source?.commit !== manifest.reference.upstream_commit || source.files?.length !== 46) errors.push('Export source manifest changed');
      for (const file of source.files || []) {
        if (hashes.get(file.path) !== file.sha) errors.push('Pinned exported blob mismatch: ' + file.path);
      }
    } catch { errors.push('Unable to verify pinned export manifest'); }
  }
  const featurePairs = {
    ParentRoomScreen: 'room',
    ParentBridgeScreen: 'bridge',
    ParentPagesScreen: 'pages',
    ParentCircleScreen: 'circle',
    ParentApprovalsScreen: 'approvals',
  };
  for (const [name, feature] of Object.entries(featurePairs)) {
    const original = 'parent-app/exported/screens/' + name + '.tsx';
    const preserved = 'parent-app/src/features/' + feature + '/' + name.replace('Screen', 'Feature') + '.tsx';
    if (hashes.get(original) !== hashes.get(preserved)) errors.push('Feature snapshot differs from original: ' + feature);
  }
  return { ok: errors.length === 0, errors, checked };
}
const executedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (executedDirectly) {
  const result = auditSource();
  if (!result.ok) {
    for (const error of result.errors) console.error('SAUCE GUARD FAIL: ' + error);
    process.exitCode = 1;
  } else {
    console.log('SAUCE GUARD PASS: ' + result.checked + ' source blobs protected; no archival drift.');
  }
}
