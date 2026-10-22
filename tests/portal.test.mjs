import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
test('independent parent entry point and clear privacy disclosure', async () => {
  const html = await read('public/index.html');
  assert.match(html, /Se’kret Bip Parents/);
  assert.match(html, /Parent Bridge/);
  assert.match(html, /teen intentionally chooses to share/);
  assert.match(html, /currently unavailable/);
  assert.match(html, /No private child information/);
  assert.doesNotMatch(html, /<form\b/i);
});
test('no child data, tracking, network uploads or persistent journal storage', async () => {
  const js = await read('public/app.js');
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie/);
  assert.doesNotMatch(js, /innerHTML\s*=/);
  assert.match(js, /textContent/);
  assert.match(js, /reflection\.value = ''/);
});
test('CSP restricts connections and disables embeds', async () => {
  const headers = await read('public/_headers');
  assert.match(headers, /connect-src 'self'/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /form-action 'none'/);
  assert.match(headers, /Cache-Control: no-store/);
});
test('static build source is present', async () => {
  assert.ok((await stat(new URL('../public/styles.css', import.meta.url))).size > 1000);
  assert.ok((await stat(new URL('../scripts/build.mjs', import.meta.url))).size > 100);
});
