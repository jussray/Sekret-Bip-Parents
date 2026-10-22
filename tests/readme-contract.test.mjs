import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('README documents separate parent surfaces and Sauce Guard', () => {
  const c = read('README.md');
  assert.match(c, /parent\.sekretbip\.net/);
  assert.match(c, /parent-app\/native\//);
  assert.match(c, /guard\/source-lock\.json/);
  assert.match(c, /No automated|No automatic|No merges/i);
  assert.doesNotMatch(c, /import React.*useState/);
  assert.equal(c.includes(String.fromCharCode(92,96)), false);
  assert.ok(c.includes(String.fromCharCode(96).repeat(3) + 'bash'));
});
test('Sauce Guard documentation names exact protected sources and limits', () => {
  const c = read('docs/SAUCE_GUARD.md');
  assert.match(c, /133/);
  assert.match(c, /every pull request/i);
  assert.match(c, /not.*approve releases/i);
  assert.equal(c.includes(String.fromCharCode(92,96)), false);
});
