import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const at = path => new URL('../' + path, import.meta.url);
const cases = [
  ['ParentRoomScreen', 'room'],
  ['ParentBridgeScreen', 'bridge'],
  ['ParentPagesScreen', 'pages'],
  ['ParentCircleScreen', 'circle'],
  ['ParentApprovalsScreen', 'approvals']
];

test('native parent features are byte-identical preserved exports with thin screen adapters', async () => {
  const manifest = JSON.parse(await readFile(at('parent-app/EXPORT_MANIFEST.json'), 'utf8'));
  const expectedSha = new Map(manifest.files.map(file => [file.path, file.sha]));
  assert.equal(manifest.source.commit, '015ac2d39bf5230530996880ea3cfa4f4707077b');
  for (const [screen, slug] of cases) {
    const sourcePath = 'parent-app/exported/screens/' + screen + '.tsx';
    const featurePath = 'parent-app/src/features/' + slug + '/' + screen.replace('Screen', 'Feature') + '.tsx';
    const adapterPath = 'parent-app/src/screens/' + screen + '.tsx';
    const source = await readFile(at(sourcePath));
    const feature = await readFile(at(featurePath));
    assert.deepEqual(feature, source, slug + ' feature must preserve original source bytes');
    const gitBlobSha = createHash('sha1')
      .update(Buffer.concat([Buffer.from('blob ' + source.length + '\0'), source]))
      .digest('hex');
    assert.equal(gitBlobSha, expectedSha.get(sourcePath), slug + ' pinned source blob must match');
    const adapter = await readFile(at(adapterPath), 'utf8');
    assert.equal(adapter, '// Thin screen adapter. The full parent-owned feature is preserved in ../features/' + slug + '/.\n' +
      'export { ' + screen + " } from '../features/" + slug + '/' + screen.replace('Screen','Feature') + "';\n");
  }
});

test('public release does not import mobile-only screen or teen-owned code', async () => {
  const app = await readFile(at('public/app.js'), 'utf8');
  const html = await readFile(at('public/index.html'), 'utf8');
  assert.doesNotMatch(app, /import\s+[^;]*(?:parent-app|exported|react-native|supabase|@\/)/);
  assert.doesNotMatch(html, /parent-app\/|upstream-parent\/|exported\/|src\/features\/|ReactNative/);
});
