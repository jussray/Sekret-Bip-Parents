// Explicit staging-only, read-only RLS integration smoke test.
// Never run with real family accounts or a production Supabase project.
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

const cfg = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error('Missing required staging-only variable: ' + name);
  return value;
};
const url = cfg('BIP_STAGE_SUPABASE_URL');
const publishableKey = cfg('BIP_STAGE_PUBLISHABLE_KEY');
const ref = cfg('BIP_STAGE_PROJECT_REF');
const production = 'tbsevonvegdnlyjgplmm';
const host = new URL(url);
if (process.env.BIP_ALLOW_STAGE_RLS_SMOKE !== 'I_ACCEPT_READ_ONLY_STAGING_TESTS') {
  throw new Error('Staging-only test opt-in is required');
}
if (!/^[a-z0-9]{20}$/i.test(ref) || ref === production ||
    host.protocol !== 'https:' || host.hostname !== ref + '.supabase.co') {
  throw new Error('Refusing any non-staging Supabase project or URL');
}
if (!/^sb_publishable_/.test(publishableKey)) {
  throw new Error('Use a staging publishable key; secret and service_role keys are forbidden');
}
const ids = {
  aReady: cfg('BIP_STAGE_SHARE_A_READY'),
  bReady: cfg('BIP_STAGE_SHARE_B_READY'),
  aRevoked: cfg('BIP_STAGE_SHARE_A_REVOKED'),
  aExpired: cfg('BIP_STAGE_SHARE_A_EXPIRED'),
  aUnlinked: cfg('BIP_STAGE_SHARE_A_UNLINKED'),
};
const idFormat = /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
assert.ok(Object.values(ids).every(id => idFormat.test(id)), 'Only staging UUIDs may be supplied');
assert.equal(new Set(Object.values(ids)).size, Object.values(ids).length);

const opts = { auth: { persistSession: false, detectSessionInUrl: false, autoRefreshToken: false } };
const clients = [];
async function login(role) {
  const email = cfg('BIP_STAGE_' + role + '_EMAIL');
  const password = cfg('BIP_STAGE_' + role + '_PASSWORD');
  const client = createClient(url, publishableKey, opts);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user?.id || data.user.is_anonymous) throw Error('Staging test authentication failed for ' + role);
  clients.push(client);
  return client;
}
async function visible(client, table, column, id) {
  const result = await client.from(table)
    .select('id', { head: true, count: 'exact' })
    .eq(column, id);
  if (result.error) throw Error('Staging query failed: ' + table);
  return result.count;
}
async function assertVisibility(client, requestId, expected, description) {
  const requests = await visible(client, 'bridge_share_requests', 'id', requestId);
  const summaries = await visible(client, 'bridge_summaries', 'request_id', requestId);
  assert.equal(requests, expected, description + ' request');
  assert.equal(summaries, expected, description + ' summary');
}

try {
  const anon = createClient(url, publishableKey, opts);
  const [a, b, unverified] = await Promise.all([login('GUARDIAN_A'), login('GUARDIAN_B'), login('UNVERIFIED')]);
  for (const [role, client, expected] of [
    ['Guardian A', a, true],
    ['Guardian B', b, true],
    ['Unverified', unverified, false],
  ]) {
    const result = await client.rpc('is_verified_guardian');
    assert.equal(result.error, null, role + ' guardian RPC must be available');
    assert.equal(result.data, expected, role + ' account must have correct backend verification');
  }

  await assertVisibility(anon, ids.aReady, 0, 'Anonymous cannot read approved share');
  await assertVisibility(a, ids.aReady, 1, 'Guardian A may read exact A-approved summary');
  await assertVisibility(a, ids.bReady, 0, 'Guardian A cannot read B family');
  await assertVisibility(b, ids.bReady, 1, 'Guardian B may read exact B-approved summary');
  await assertVisibility(b, ids.aReady, 0, 'Guardian B cannot read A family');
  await assertVisibility(unverified, ids.aReady, 0, 'Unverified account cannot read A share');
  await assertVisibility(a, ids.aRevoked, 0, 'Revoked share blocked');
  await assertVisibility(a, ids.aExpired, 0, 'Expired share blocked');
  await assertVisibility(a, ids.aUnlinked, 0, 'Inactive parent link blocked');
  const sources = await visible(a, 'bridge_share_sources', 'request_id', ids.aReady);
  assert.equal(sources, 0, 'Guardian cannot enumerate selected raw teen sources');

  console.log('PASS: staging-only Bridge SELECT RLS cases, no content exported or written');
} finally {
  await Promise.allSettled(clients.map(client => client.auth.signOut()));
}
