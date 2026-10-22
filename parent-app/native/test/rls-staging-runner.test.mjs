import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const get = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('RLS test runner is staging-only, read-only and denies secret keys', () => {
  const code = get('tools/staging-bridge-rls-smoke.mjs');
  assert.match(code, /production = 'tbsevonvegdnlyjgplmm'/);
  assert.match(code, /I_ACCEPT_READ_ONLY_STAGING_TESTS/);
  assert.match(code, /host\.hostname !== ref \+ '\.supabase\.co'/);
  assert.match(code, /sb_publishable_/);
  assert.match(code, /head: true, count: 'exact'/);
  assert.match(code, /is_verified_guardian/);
  assert.match(code, /client\.auth\.signOut\(\)/);
  assert.doesNotMatch(code, /\.insert\(|\.update\(|\.upsert\(|\.delete\(|\.rpc\('create|service_role/i);
  assert.match(code, /BIP_STAGE_SHARE_A_UNLINKED/);
});
