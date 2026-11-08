import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const project = fileURLToPath(new URL('../', import.meta.url));
const publicFiles = ['index.html', 'styles.css', 'app.js', '404.html', '_headers'];

test('parent build ships only welcome front-door files even if extra source is present', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'bip-parent-build-contract-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'public'));
  mkdirSync(join(root, 'scripts'));
  for (const name of publicFiles) copyFileSync(join(project, 'public', name), join(root, 'public', name));
  copyFileSync(join(project, 'scripts', 'build.mjs'), join(root, 'scripts', 'build.mjs'));
  writeFileSync(join(root, 'public', 'unreviewed-private-feature.js'), 'throw new Error("not deployable");');
  execFileSync(process.execPath, [join(root, 'scripts', 'build.mjs')], {
    cwd: root, env: { ...process.env, CF_PAGES_COMMIT_SHA: 'synthetic-contract-check' }, stdio: 'pipe'
  });
  const dist = join(root, 'dist');
  assert.deepEqual(readdirSync(dist).sort(), [...publicFiles, 'build-info.json'].sort());
  assert.equal(existsSync(join(dist, 'unreviewed-private-feature.js')), false);
  assert.match(readFileSync(join(dist, 'index.html'), 'utf8'), /Parent Front Door/);
  assert.match(readFileSync(join(dist, 'build-info.json'), 'utf8'), /welcome-only/);
});
