import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditSource, gitBlobSha, REPO_ROOT } from '../scripts/source-guard.mjs';
const load = p => readFileSync(resolve(REPO_ROOT, p));
const baseline = JSON.parse(load('guard/source-lock.json').toString());

test('Source inventory is verified in-place', () => {
  const state = auditSource();
  assert.equal(state.ok, true, state.errors.join('\n'));
  assert.equal(state.checked, baseline.lockedFiles.length);
  assert.equal(state.checked, 133);
});

test('Change and missing protected source both fail closed', () => {
  const altered = 'preserved/live-portal-20261022/index.html';
  const changed = auditSource({
    enumerate: false,
    readBytes: path => path === altered ? Buffer.concat([load(path), Buffer.from('unexpected')]) : load(path),
  });
  assert.equal(changed.ok, false);
  assert.ok(changed.errors.includes('Source content changed: ' + altered));
  const missing = 'legacy/README.pre-parent-export.md';
  const absent = auditSource({ enumerate: false, readBytes: path => { if (path === missing) throw Error('missing'); return load(path); } });
  assert.equal(absent.ok, false);
  assert.ok(absent.errors.includes('Missing or unreadable protected file: ' + missing));
});

test('Duplicate records, traversal paths and changed upstream origin are denied', () => {
  const first = baseline.lockedFiles[0];
  const duplicate = auditSource({ enumerate: false, manifest: { ...baseline, lockedFiles: [...baseline.lockedFiles, first] } });
  assert.ok(duplicate.errors.some(e => e.includes('Duplicate manifest path')));
  const traversal = auditSource({ enumerate: false, manifest: { ...baseline, lockedFiles: [{ path: '../bad', sha: first.sha }] } });
  assert.ok(traversal.errors.some(e => e.includes('Invalid manifest path')));
  const wrongOrigin = auditSource({ enumerate: false, manifest: { ...baseline, reference: { ...baseline.reference, upstream_commit: '0000000000000000000000000000000000000000' } } });
  assert.ok(wrongOrigin.errors.some(e => e.includes('Pinned upstream commit mismatch')));
  assert.notEqual(gitBlobSha(Buffer.from('A')), gitBlobSha(Buffer.from('B')));
});
