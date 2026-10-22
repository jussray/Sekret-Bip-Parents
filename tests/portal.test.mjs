import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('parent public entry screen keeps existing visual markup and disclosures', async () => {
  const html = await read('public/index.html');
  const preserved = await read('preserved/live-portal-20261022/index.html');
  assert.equal(html.replace('<script type="module" src="/app.js"></script>', '<script src="/app.js" defer></script>'), preserved);
  assert.match(html, /Se’kret Bip Parents/);
  assert.match(html, /Parent Bridge/);
  assert.match(html, /teen intentionally chooses to share/);
  assert.match(html, /currently unavailable/);
  assert.match(html, /No private child information/);
  assert.doesNotMatch(html, /<form\b/i);
});

test('public entry composes feature modules, without storing or uploading child data', async () => {
  const app = await read('public/app.js');
  const featureFiles = ['public/features/conversation-kits.js', 'public/features/parent-reflections.js'];
  assert.match(app, /mountConversationKits/);
  assert.match(app, /mountParentReflections/);
  assert.doesNotMatch(app, /const prompts|reflection\.value|data-topic/);
  for (const file of ['public/app.js', ...featureFiles]) {
    const js = await read(file);
    assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie/);
    assert.doesNotMatch(js, /innerHTML\s*=/);
  }
  const archived = await read('preserved/live-portal-20261022/app.js');
  assert.match(archived, /let topic = 'check-in'/);
  assert.match(archived, /reflection\.value = ''/);
});

test('CSP restricts connections and disables embeds', async () => {
  const headers = await read('public/_headers');
  assert.match(headers, /connect-src 'self'/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /form-action 'none'/);
  assert.match(headers, /Cache-Control: no-store/);
});

test('static build source and pinned parent source export remain present', async () => {
  for (const path of [
    'public/styles.css',
    'scripts/build.mjs',
    'parent-app/EXPORT_MANIFEST.json',
    'parent-app/exported/screens/ParentRoomScreen.tsx',
    'parent-app/exported/screens/ParentBridgeScreen.tsx',
    'parent-app/exported/src/parent/features/sekret/ParentSekretCoachScreen.tsx'
  ]) {
    assert.ok((await stat(new URL('../' + path, import.meta.url))).size > 0, path);
  }
});
