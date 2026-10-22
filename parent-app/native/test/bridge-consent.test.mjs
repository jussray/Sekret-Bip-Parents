import test from 'node:test';
import assert from 'node:assert/strict';
import { readConsentedBridgeSummary } from '../src/features/bridge/consentedSummary.ts';

const parentId = '33333333-3333-4333-8333-333333333333';
const teenId = '22222222-2222-4222-8222-222222222222';
const shareId = '11111111-1111-4111-8111-111111111111';

function fixtures(overrides = {}) {
  const grant = {
    id: shareId,
    teen_user_id: teenId,
    parent_user_id: parentId,
    status: 'ready',
    revoked_at: null,
    expires_at: '2099-10-25T00:00:00Z',
    ...overrides.grant,
  };
  const linked = { status: 'active', is_active: true, expires_at: null, ...overrides.link };
  const summary = {
    themes: ['Ask before offering advice'],
    conversation_starters: ['Would you like me to listen?'],
    limitations: 'This is not a complete picture of the teen.',
    raw_journal: 'THIS MUST NEVER REACH PARENT',
    ...overrides.summary,
  };
  const queries = [];
  const userIds = overrides.users || [parentId, parentId, parentId];
  let getUserCount = 0;
  let grantReads = 0;
  let linkReads = 0;
  const client = {
    auth: {
      getUser: async () => ({ data: { user: { id: userIds[Math.min(getUserCount++, userIds.length - 1)], is_anonymous: false } }, error: overrides.authError || null }),
    },
    rpc: async rpc => ({ data: overrides.verified === false ? false : true, error: null }),
    from: table => ({
      select(columns) {
        const conditions = [];
        const query = {
          eq(column, value) { conditions.push([column, value]); return query; },
          async maybeSingle() {
            queries.push({ table, columns, conditions });
            if (overrides.deniedTable === table) return { data: null, error: { message: 'RLS denied' } };
            if (table === 'app_profiles') return { data: { account_side: 'parent', onboarding_complete: true }, error: null };
            if (table === 'account_verification') return { data: { verification_state: 'VERIFIED_GUARDIAN' }, error: null };
            if (table === 'bridge_share_requests') {
              grantReads++;
              return { data: grantReads > 1 ? (overrides.recheckedGrant ?? grant) : grant, error: null };
            }
            if (table === 'parent_links') {
              linkReads++;
              return { data: linkReads > 1 ? (overrides.recheckedLink ?? linked) : linked, error: null };
            }
            if (table === 'bridge_summaries') return { data: summary, error: null };
            throw Error('Unexpected sensitive table ' + table);
          },
        };
        return query;
      },
    }),
  };
  return { client, queries };
}

test('invalid share IDs are denied before any network or profile access', async () => {
  const x = fixtures();
  for (const share of ['', 'not-a-uuid', 'some-other-user', '../../bridge']) {
    assert.deepEqual(await readConsentedBridgeSummary(x.client, share), { kind: 'locked' });
  }
  assert.equal(x.queries.length, 0);
});

test('only preapproved summary fields are returned for exact named recipient', async () => {
  const x = fixtures();
  const result = await readConsentedBridgeSummary(x.client, shareId);
  assert.deepEqual(result, {
    kind: 'shared',
    summary: {
      themes: ['Ask before offering advice'],
      conversationStarters: ['Would you like me to listen?'],
      limitations: 'This is not a complete picture of the teen.',
    },
  });
  assert.equal(Object.isFrozen(result.summary), true);
  const touched = x.queries.map(q => q.table);
  assert.deepEqual(touched, [
    'app_profiles','account_verification',
    'bridge_share_requests', 'parent_links', 'bridge_summaries',
    'bridge_share_requests','parent_links',
    'app_profiles','account_verification',
  ]);
  assert.ok(!touched.some(t => ['journal_entries', 'voice_notes', 'bridge_share_sources', 'circle_posts'].includes(t)));
  for (const q of x.queries.filter(q => ['bridge_share_requests','parent_links'].includes(q.table))) {
    assert.ok(q.conditions.some(([c,v]) => c === 'parent_user_id' && v === parentId));
  }
  assert.equal(x.queries.find(q => q.table === 'bridge_summaries').columns, 'themes,conversation_starters,limitations');
});

test('wrong parent, missing relationship, revoked and expired grants all deny access', async () => {
  const blocked = [
    { grant: { parent_user_id: teenId } },
    { grant: { status: 'pending' } },
    { grant: { revoked_at: '2026-10-21T00:00:00Z' } },
    { grant: { expires_at: '2026-10-21T00:00:00Z' } },
    { grant: { expires_at: 'invalid-date' } },
    { link: { status: 'pending' } },
    { link: { is_active: false } },
    { link: { expires_at: '2026-10-21T00:00:00Z' } },
    { link: { expires_at: 'invalid-date' } },
    { verified: false },
    { deniedTable: 'bridge_summaries' },
    { summary: { conversation_starters: null } },
  ];
  for (const values of blocked) {
    const x = fixtures(values);
    assert.deepEqual(await readConsentedBridgeSummary(x.client, shareId), { kind: 'locked' }, JSON.stringify(values));
  }
});

test('mid-read revocation, unlink and sign-in switch suppress loaded summary', async () => {
  const cases = [
    { recheckedGrant: { id: shareId, teen_user_id: teenId, parent_user_id: parentId, status: 'ready', revoked_at: '2026-10-22T12:00:01Z', expires_at: null } },
    { recheckedLink: { status: 'active', is_active: false, expires_at: null } },
    { users: [parentId, teenId] },
  ];
  for (const value of cases) {
    assert.deepEqual(await readConsentedBridgeSummary(fixtures(value).client, shareId), { kind: 'locked' });
  }
});

test('untrusted summary shapes cannot leak unexpected records', async () => {
  for (const value of [
    { themes: ['x'.repeat(501)], conversation_starters: [], limitations: '' },
    { themes: [], conversation_starters: ['x'.repeat(1501)], limitations: '' },
    { themes: Array(21).fill('x'), conversation_starters: [], limitations: '' },
    { themes: [], conversation_starters: [], limitations: null },
  ]) {
    assert.deepEqual(await readConsentedBridgeSummary(fixtures({ summary: value }).client, shareId), { kind: 'locked' });
  }
});

test('system clock is not caller-controlled in the exposed Bridge API', () => {
  // Changing a client-supplied timestamp must not be an authorization control.
  const source = readFileSync(new URL('../src/features/bridge/consentedSummary.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /now:\s*\(\)\s*=>\s*number/);
  assert.match(source, /Date\.now\(\)/);
});
