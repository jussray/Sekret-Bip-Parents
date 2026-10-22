import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolvePrivateParentFeature } from '../src/features/connection/privateGate.ts';
import { getParentMoodReply, parentMoods } from '../src/features/room/mood.ts';
import { conversationKits, selectCoachPrompt } from '../src/features/coach/prompts.ts';
import { MAX_REFLECTION_LENGTH, reflectionCount } from '../src/features/reflections/draft.ts';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
function allCode(dir) {
  return readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap(entry => {
    const path = dir + '/' + entry.name;
    return entry.isDirectory() ? allCode(path) : /\.(tsx?|jsx?|mjs)$/.test(entry.name) ? [[path, read(path)]] : [];
  });
}

test('private routes deny forged roles, links and grants', () => {
  for (const feature of ['bridge', 'circle', 'approvals', 'teen-link']) {
    for (const input of [undefined, { verified: true, role: 'guardian', isLinked: true, consent: true }, { jwt: 'fake', parentId: 'another-parent' }]) {
      const state = resolvePrivateParentFeature(feature, input);
      assert.equal(state.kind, 'locked');
      assert.match(state.reason, /server-enforced consent/);
    }
  }
});

test('room, coach and reflection domain models are standalone', () => {
  assert.deepEqual(parentMoods.map(x => x.key), ['heavy', 'hopeful', 'worried', 'okay']);
  assert.equal(getParentMoodReply('not-a-mood'), null);
  assert.ok(getParentMoodReply('hopeful'));
  assert.deepEqual(Object.keys(conversationKits), ['Check-in', 'Hard day', 'Boundaries', 'Repair']);
  assert.equal(selectCoachPrompt('Repair', 0), selectCoachPrompt('Repair', 2));
  assert.equal(MAX_REFLECTION_LENGTH, 1500);
  assert.equal(reflectionCount('abc'), '3 / 1500');
});

test('route files contain only navigation bindings, not feature logic', () => {
  for (const route of ['index', 'pages', 'coach', 'bridge', 'circle']) {
    const code = read('app/' + route + '.tsx');
    assert.match(code, /export default [A-Za-z]+View/);
    assert.doesNotMatch(code, /useState|AsyncStorage|supabase|fetch\(|getUser|select\(/);
  }
});

test('standalone runtime cannot import teen archive, access storage or fetch data', () => {
  for (const [path, code] of [...allCode('src'), ...allCode('app')]) {
    assert.doesNotMatch(code, /(?:from|require\()\s*['"][^'"]*(?:exported\/|upstream-parent\/|screens\/Parent)/, path);
    assert.doesNotMatch(code, /\b(?:localStorage|AsyncStorage|SecureStore|supabase|service_role|XMLHttpRequest|sendBeacon|document\.cookie)\b/i, path);
    assert.doesNotMatch(code, /\bfetch\s*\(/, path);
  }
  const config = JSON.parse(read('app.json'));
  assert.equal(config.expo.ios.bundleIdentifier, 'com.sekretbip.parent');
  assert.equal(config.expo.android.package, 'com.sekretbip.parent');
});
