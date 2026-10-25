import assert from 'node:assert/strict';
import test from 'node:test';

// Node >= 22.6 type-stripping imports the TS module directly (erasable
// syntax only). In-repo, this test belongs with the repo's node --test
// contract tests, mirroring Sekret-Bip's provider-integration-contract.
import { invokeParentsMuse, parentsMuseState } from '../worker/provider-runtime.ts';

const KEY = 'TEST-KEY-NOT-A-REAL-SECRET';
const ENV = { MODEL_API_KEY: KEY, PARENTS_MUSE_MODEL: 'muse-spark-1.3' };

function mockFetch(handler) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    return handler(url, init);
  };
  impl.calls = calls;
  return impl;
}

const okFetch = () => mockFetch(async () => new Response(JSON.stringify({
  id: 'resp_123', status: 'completed', output_text: 'bounded answer',
}), { status: 200, headers: { 'content-type': 'application/json' } }));

test('state: INTEGRATED only with key AND explicit allow-listed model (no default)', () => {
  assert.equal(parentsMuseState({}).state, 'ABSENT');
  assert.equal(parentsMuseState({ MODEL_API_KEY: KEY }).state, 'ABSENT');
  assert.equal(parentsMuseState({ MODEL_API_KEY: KEY, PARENTS_MUSE_MODEL: 'muse-spark-2.0' }).state, 'ABSENT');
  const state = parentsMuseState(ENV);
  assert.equal(state.state, 'INTEGRATED');
  assert.equal(state.userContentForwarding, false);
  assert.equal(state.authority, 'none');
});

test('user and parent sources are rejected before any network call', async () => {
  for (const source of ['user', 'parent', 'teen', 'documents']) {
    const fetchImpl = okFetch();
    await assert.rejects(
      () => invokeParentsMuse(ENV, { prompt: 'hi', source }, fetchImpl),
      /user_content_not_authorized/,
    );
    assert.equal(fetchImpl.calls.length, 0);
  }
});

test('non-standard sensitivity (including crisis) is rejected before any network call', async () => {
  for (const sensitivity of ['crisis', 'restricted', 'sensitive']) {
    const fetchImpl = okFetch();
    await assert.rejects(
      () => invokeParentsMuse(ENV, { prompt: 'hi', sensitivity }, fetchImpl),
      /sensitive_context_not_authorized/,
    );
    assert.equal(fetchImpl.calls.length, 0);
  }
});

test('bounded success returns provider:meta evidence; key never serialized', async () => {
  const fetchImpl = okFetch();
  const result = await invokeParentsMuse(ENV, { prompt: 'summarize founder notes', source: 'founder' }, fetchImpl);
  assert.equal(result.state, 'INTEGRATED');
  assert.equal(result.evidenceRef, 'provider:meta:resp_123');
  assert.equal(result.authority, 'none');
  assert.equal(result.userContentForwarding, false);
  const sent = JSON.parse(fetchImpl.calls[0].init.body);
  assert.deepEqual(sent, { model: 'muse-spark-1.3', input: 'summarize founder notes', store: false, max_output_tokens: 2000 });
  assert.equal(JSON.stringify(sent).includes(KEY), false);
  assert.equal(JSON.stringify(result).includes(KEY), false);
});
