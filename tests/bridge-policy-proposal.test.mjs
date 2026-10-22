import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const sql = readFileSync(new URL('../security/bridge-signals-parent-read-proposed.sql', import.meta.url), 'utf8');

test('proposed Bridge legacy parent read is scoped and consent-aware', () => {
  for (const required of [
    'FOR SELECT', 'TO authenticated', 'is_non_anonymous_user()',
    'is_verified_guardian()', 'revoked_at IS NULL',
    "pl.status = 'active'", 'pl.is_active = true',
    'pl.parent_user_id = (SELECT auth.uid())',
  ]) assert.ok(sql.includes(required), required);
  assert.doesNotMatch(sql, /FOR ALL\b|USING\s*\(\s*true\s*\)|DISABLE ROW LEVEL SECURITY|GRANT\s+ALL/i);
  assert.match(sql, /PROPOSED SECURITY FIX ONLY/);
});
