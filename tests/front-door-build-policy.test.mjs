import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('Pages production build explicitly excludes app features', () => {
  const build = read('scripts/build.mjs');
  const html = read('public/index.html');
  assert.match(build, /PUBLIC_FRONT_DOOR_FILES/);
  assert.match(build, /copyFile/);
  assert.doesNotMatch(build, /await cp\(src, out|await cp\(source,output/);
  assert.doesNotMatch(build, /PUBLIC_FRONT_DOOR_FILES\s*=\s*\[[^\]]*features/);
  assert.doesNotMatch(html, /<script\b|data-topic=|data-tab=|reflection-input/);
  assert.match(html, /Create Parent Account/);
  assert.match(html, /I already have an account/);
});
