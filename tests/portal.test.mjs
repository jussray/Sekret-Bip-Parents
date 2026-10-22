import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('public entry is parent front door only, with both account choices', async () => {
  const html = await read('public/index.html');
  assert.match(html, /Parent Front Door/);
  assert.match(html, /Create Parent Account/);
  assert.match(html, /I already have an account/);
  assert.match(html, /app\.sekretbip\.net\/signup\?side=parent/);
  assert.match(html, /app\.sekretbip\.net\/login\?side=parent/);
  assert.match(html, /No family information is loaded/);
  for (const denied of ['id="kits"', 'id="bridge"', 'id="reflection"', 'prompt-text', 'reflection-input', 'data-topic=', 'data-panel=', 'data-tab=']) {
    assert.equal(html.includes(denied), false, 'public screen has app control: ' + denied);
  }
  assert.doesNotMatch(html, /<form\b|<script\b|<iframe\b/i);
});
test('public JS contains no app functionality; original app is archived', async () => {
  const js = await read('public/app.js');
  assert.doesNotMatch(js, /getElementById|querySelector|addEventListener|fetch\s*\(|supabase|localStorage|sessionStorage|clipboard|AsyncStorage/);
  const original = await read('preserved/live-portal-20261022/app.js');
  assert.match(original, /data-topic/);
  const oldHtml = await read('preserved/live-portal-20261022/index.html');
  assert.match(oldHtml, /Conversation kits/);
});
test('headers protect front door, styling is responsive, build still works', async () => {
  const headers = await read('public/_headers');
  const css = await read('public/styles.css');
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /form-action 'none'/);
  assert.match(headers, /Cache-Control: no-store/);
  assert.match(css, /@media\(max-width:850px\)/);
  assert.ok((await stat(new URL('../scripts/build.mjs', import.meta.url))).size > 100);
});
