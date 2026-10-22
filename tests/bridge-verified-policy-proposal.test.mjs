import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const get = file => readFileSync(new URL('../security/' + file, import.meta.url), 'utf8');

test('proposed parent Bridge policies retain every independent security condition', () => {
  const sql = get('bridge-parent-verified-read-proposed.sql');
  assert.equal((sql.match(/ALTER POLICY /g) || []).length, 2);
  for (const policy of ['bridge_share_requests_parent_select', 'bridge_summaries_parent_select']) {
    const section = sql.split('ALTER POLICY ' + policy)[1]?.split(';\n')[0];
    assert.ok(section, policy);
    for (const guard of [
      'TO authenticated',
      'public.is_non_anonymous_user()',
      'public.is_verified_guardian()',
      "pl.status = 'active'",
      'pl.is_active = true',
      'revoked_at IS NULL',
      'expires_at > now()',
      'auth.uid()',
      "'ready', 'viewed'",
    ]) assert.ok(section.includes(guard), policy + ' missing ' + guard);
  }
  assert.match(sql, /DO NOT RUN AGAINST PRODUCTION/);
  assert.doesNotMatch(sql, /DROP\s+TABLE|DELETE\s+FROM|TRUNCATE|DISABLE\s+ROW\s+LEVEL\s+SECURITY|FOR\s+ALL|USING\s*\(\s*true\s*\)/i);
});

test('legacy policy proposal does not silently grant parent any raw teen source', () => {
  const sql = get('bridge-signals-parent-read-proposed.sql');
  assert.match(sql, /is_verified_guardian\(\)/);
  assert.match(sql, /revoked_at IS NULL/);
  assert.match(sql, /is_active = true/);
  assert.doesNotMatch(sql, /SELECT \*|FROM public.journal_entries|FROM public.voice_notes/i);
});
