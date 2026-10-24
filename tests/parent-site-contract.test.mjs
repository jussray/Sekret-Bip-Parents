import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = process.cwd();
const load = name => readFileSync(resolve(root, "site", name), "utf8");
const html = load("index.html"), js = load("app.js"), css = load("styles.css"), headers = load("_headers");
test("all parent navigation tabs have a corresponding panel", () => {
  const tabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map(m=>m[1]);
  const panels = [...html.matchAll(/data-panel="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(tabs, ["room","bridge","pages","coach","circle"]);
  assert.deepEqual(panels, tabs);
});
test("static parent entry never fetches or persists account records", () => {
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|supabase|api\.sekretbip\.net/i);
  assert.doesNotMatch(html, /<form\b|<iframe\b|<script[^>]*src="https?:/i);
  assert.match(html, /Nothing typed here is uploaded, stored or shared/);
});
test("site is production-shaped, responsive, and privacy gated", () => {
  assert.match(css, /@media\(max-width:750px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(html, /Private connection is locked/);
  assert.match(html, /Community access isn.t enabled here/);
  assert.match(html, /Skip to content/);
});
test("security response headers protect the public parent entry", () => {
  for (const value of ["default-src 'none'","connect-src 'none'","frame-ancestors 'none'","Referrer-Policy: no-referrer"]) assert.ok(headers.includes(value), value);
  assert.equal(load("robots.txt"), "User-agent: *\nDisallow: /\n");
});
test("legacy and export source boundaries are explicit", () => {
  assert.ok(existsSync(resolve(root, "PARENT_APP_ROLE.md")));
  assert.ok(existsSync(resolve(root, "upstream-parent", "app", "(parent)", "room.tsx")));
  assert.ok(existsSync(resolve(root, "legacy", "README.pre-parent-repurpose.md")));
});
