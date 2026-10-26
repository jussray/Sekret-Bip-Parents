import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mapParentCommunityFeedRow } from '../src/features/circle/repository.ts';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');

test('Parent Circle client uses only the redacted V2 RPC surface', () => {
  const repository = read('src/features/circle/repository.ts');
  for (const rpc of [
    'get_parent_community_feed',
    'create_parent_community_post',
    'react_to_parent_community_post',
    'reply_to_parent_community_post',
    'report_parent_community_post',
  ]) assert.match(repository, new RegExp("rpc\\('" + rpc + "'"));

  assert.doesNotMatch(repository, /\.from\(['"](?:posts|circles|post_comments|post_reactions)['"]\)/);
  assert.doesNotMatch(repository, /author_user_id/);
  assert.doesNotMatch(repository, /service_role|sb_secret_/i);
});

test('Parent Circle maps only the minimized community contract', () => {
  const row = mapParentCommunityFeedRow({
    post_id: 'post-1',
    post_text: 'Trying again today.',
    circle_tag: 'repair',
    created_at: '2026-10-26T00:00:00.000Z',
    reaction_counts: { beenThere: 3, solidarity: 2 },
    quiet_reply_count: '4',
  });
  assert.deepEqual(row, {
    id: 'post-1',
    text: 'Trying again today.',
    createdAt: '2026-10-26T00:00:00.000Z',
    circleTag: 'repair',
    quietRepliesCount: 4,
    reactions: { beenThere: 3, solidarity: 2, reminder: 0, needed: 0, strength: 0 },
  });
  assert.equal('authorUserId' in row, false);
});

test('Parent Circle UI has no production seed posts and does not require a teen link', () => {
  const view = read('src/features/circle/CircleView.tsx');
  assert.doesNotMatch(view, /SEED_POSTS|fake post|preview post/i);
  assert.doesNotMatch(view, /PrivateGate|teen-link|isLinked/);
  assert.match(view, /guardian-only community/i);
  assert.match(view, /No teen posts, journals, messages, or private child data/i);
  assert.match(view, /not activated on the server yet/i);
});

test('missing Parent Community backend fails closed instead of falling back to raw tables', () => {
  const repository = read('src/features/circle/repository.ts');
  assert.match(repository, /ParentCommunityUnavailableError/);
  assert.match(repository, /PGRST202/);
  assert.match(repository, /42883/);
  assert.doesNotMatch(repository, /fallback.*from\(/i);
});
