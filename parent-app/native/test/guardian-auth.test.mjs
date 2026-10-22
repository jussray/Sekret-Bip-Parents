import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { verifyCurrentGuardian } from '../src/features/auth/guardianEvidence.ts';
import { resolveEntryScreen } from '../src/features/auth/entryDecision.ts';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const self = 'mock-parent-id';
function fake({
  user = { id: self, is_anonymous: false },
  profile = { account_side: 'parent', onboarding_complete: true },
  verification = { verification_state: 'VERIFIED_GUARDIAN' },
  serverGuardian = true,
  identityError = null, profileError = null,
  verificationError = null, rpcError = null,
} = {}) {
  const history = [];
  const client = {
    auth: { getUser: async () => ({ data: { user }, error: identityError }) },
    from: table => {
      history.push(table);
      return {
        select: () => ({
          eq(column, uid) {
            history.push({ table, column, uid });
            return {
              maybeSingle: async () => ({
                data: table === 'app_profiles' ? profile : verification,
                error: table === 'app_profiles' ? profileError : verificationError,
              }),
            };
          },
        }),
      };
    },
    rpc: async name => {
      history.push(name);
      return { data: serverGuardian, error: rpcError };
    },
  };
  return { client, history };
}

test('no login, anonymous, or fake user ID denies before private table reads', async () => {
  for (const user of [null, { id: '', is_anonymous: false }, { id: self, is_anonymous: true }]) {
    const x = fake({ user });
    assert.deepEqual(await verifyCurrentGuardian(x.client), { kind: 'visitor' });
    assert.equal(x.history.length, 0);
  }
  assert.equal(resolveEntryScreen({ kind: 'visitor' }, 'welcome'), 'welcome');
  assert.equal(resolveEntryScreen(null, 'login'), 'checking');
  assert.equal(resolveEntryScreen({ kind: 'visitor' }, 'signup'), 'signup');
});

test('guardian entry requires every independent server-owned condition', async () => {
  const scenarios = [
    { profile: { account_side: 'teen', onboarding_complete: true } },
    { profile: { account_side: 'parent', onboarding_complete: false } },
    { verification: { verification_state: 'PENDING_GUARDIAN' } },
    { serverGuardian: false },
    { profile: null }, { verification: null },
  ];
  for (const values of scenarios) {
    const x = fake(values);
    assert.deepEqual(await verifyCurrentGuardian(x.client), { kind: 'review', reason: 'not_verified' });
    assert.equal(resolveEntryScreen(await verifyCurrentGuardian(x.client), 'login'), 'review');
  }
});

test('RLS and transport errors never grant access', async () => {
  const err = new Error('RLS denied');
  for (const values of [{ profileError: err }, { verificationError: err }, { rpcError: err }, { identityError: err }]) {
    assert.notEqual((await verifyCurrentGuardian(fake(values).client)).kind, 'guardian');
  }
  const x = fake();
  x.client.auth.getUser = async () => { throw new Error('offline'); };
  assert.deepEqual(await verifyCurrentGuardian(x.client), { kind: 'review', reason: 'unavailable' });
});

test('only verified guardian gets application tabs, with owner-scoped lookups', async () => {
  const x = fake();
  const status = await verifyCurrentGuardian(x.client);
  assert.deepEqual(status, { kind: 'guardian', userId: self });
  assert.equal(resolveEntryScreen(status, 'welcome'), 'app');
  assert.deepEqual(x.history.filter(value => typeof value === 'string'), ['app_profiles', 'account_verification', 'is_verified_guardian']);
  assert.ok(x.history.filter(v => typeof v === 'object').every(v => v.column === 'user_id' && v.uid === self));
});

test('parent layout hides tabs unless verified, clears authority on signout', () => {
  const code = read('app/_layout.tsx');
  assert.match(code, /resolveEntryScreen\(decision, requested\) !== 'app'/);
  assert.match(code, /setDecision\(\{ kind: 'visitor' \}\)/);
  assert.match(code, /verifyCurrentGuardian\(client\)/);
  assert.match(code, /generation\.current/);
  assert.match(code, /subscription\?\.unsubscribe/);
  const source = read('src/features/auth/client.ts');
  assert.match(source, /persistSession:\s*false/);
  assert.match(source, /detectSessionInUrl:\s*false/);
  assert.match(source, /autoRefreshToken:\s*false/);
  assert.doesNotMatch(source, /service_role\s*=\s*['"]|sb_secret_[a-z0-9]/i);
});

test('separate public Cloudflare build stays welcome-only', () => {
  const build = read('../../scripts/build.mjs');
  assert.match(build, /PUBLIC_FRONT_DOOR_FILES/);
  const html = read('../../public/index.html');
  assert.doesNotMatch(html, /<script\b|data-topic=|reflection-input/);
});

test('verification review has an explicit setup handoff, never a local approval override', () => {
  const source = read('src/features/auth/ParentEntry.tsx');
  assert.match(source, /Complete Parent Setup/);
  assert.match(source, /https:\/\/app\.sekretbip\.net\/parent-setup/);
  assert.match(source, /onRefresh/);
  assert.doesNotMatch(source, /setDecision\(\{\s*kind:\s*['"]guardian['"]/);
});
