import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundleRoot = join(repoRoot, 'parent-app/exports/parent-circle-v2-20261025');
const manifest = JSON.parse(readFileSync(join(bundleRoot, 'EXPORT_MANIFEST.json'), 'utf8'));

function gitBlobSha(buffer) {
  return createHash('sha1')
    .update(Buffer.from('blob ' + buffer.length + '\0'))
    .update(buffer)
    .digest('hex');
}

test('Parent Circle V2 export is pinned to the reviewed source head', () => {
  assert.equal(manifest.source.repository, 'jussray/Sekret-Bip');
  assert.equal(manifest.source.pull_request, 1189);
  assert.equal(manifest.source.head, 'b1e80d2840d5a73df1291b11029a31620c009633');
  assert.equal(manifest.files.length, 9);
  assert.equal(manifest.boundaries.production_deploy_authorized, false);
  assert.equal(manifest.boundaries.production_migration_apply_authorized, false);
  assert.equal(manifest.boundaries.account_or_user_data_exported, false);
});

test('every Parent Circle V2 exported file is byte-identical to its source Git blob', () => {
  for (const file of manifest.files) {
    const bytes = readFileSync(join(repoRoot, file.export_path));
    assert.equal(gitBlobSha(bytes), file.source_blob_sha, file.source_path);
  }
});

test('export contains only Parent Circle routes plus the reviewed support files', () => {
  const paths = manifest.files.map(file => file.source_path);
  const appPaths = paths.filter(path => path.startsWith('app/'));
  assert.deepEqual(appPaths.sort(), [
    'app/(parent)/circle/[id].tsx',
    'app/(parent)/circle/feed.tsx',
  ].sort());
  assert.equal(paths.some(path => path.includes('/(teen)/')), false);
  assert.equal(paths.some(path => /\.env(?:\.|$)/.test(path)), false);
  assert.equal(paths.filter(path => path.startsWith('supabase/migrations/')).length, 2);
});
