import { getParentClient } from '../auth/client.ts';
import type {
  ParentCommunityFeedRow,
  ParentCommunityPost,
  ParentCommunityReactionCounts,
  ParentCommunityReactionKey,
} from './types.ts';
import {
  EMPTY_REACTIONS,
  mapParentCommunityFeedRow,
  normalizeReactionCounts,
} from './mapping.ts';

export class ParentCommunityUnavailableError extends Error {
  constructor() {
    super('Parent Circle V2 is not activated on the server yet.');
    this.name = 'ParentCommunityUnavailableError';
  }
}

async function requirePermanentParentClient() {
  const client = getParentClient();
  if (!client) throw new ParentCommunityUnavailableError();

  const identity = await client.auth.getUser();
  const user = identity.data?.user;
  if (identity.error || !user || user.is_anonymous === true || !user.id) {
    throw new Error('A signed-in permanent parent account is required.');
  }
  return client;
}

function isMissingRpc(error: unknown): boolean {
  const value = error && typeof error === 'object' ? error as { code?: unknown; message?: unknown } : {};
  const code = String(value.code ?? '');
  const message = String(value.message ?? '').toLowerCase();
  return code === 'PGRST202'
    || code === '42883'
    || message.includes('could not find the function')
    || message.includes('does not exist');
}

function rpcError(error: unknown): never {
  if (isMissingRpc(error)) throw new ParentCommunityUnavailableError();
  throw error instanceof Error ? error : new Error('Parent Circle request failed.');
}

export async function loadParentCommunityFeed(limit = 50): Promise<ParentCommunityPost[]> {
  const client = await requirePermanentParentClient();
  const { data, error } = await client.rpc('get_parent_community_feed', { p_limit: limit });
  if (error) rpcError(error);
  return ((data ?? []) as ParentCommunityFeedRow[]).map(mapParentCommunityFeedRow);
}

export async function createParentCommunityPost(text: string, circleTag?: string): Promise<ParentCommunityPost> {
  const value = text.trim();
  if (!value) throw new Error('Parent Circle posts cannot be empty.');

  const client = await requirePermanentParentClient();
  const { data, error } = await client.rpc('create_parent_community_post', {
    p_text: value,
    p_circle_tag: circleTag?.trim() || null,
  });
  if (error) rpcError(error);

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') throw new Error('Parent Circle did not return the saved post.');
  return mapParentCommunityFeedRow(row as ParentCommunityFeedRow);
}

export async function reactToParentCommunityPost(
  postId: string,
  reaction: ParentCommunityReactionKey,
): Promise<ParentCommunityReactionCounts> {
  const client = await requirePermanentParentClient();
  const { data, error } = await client.rpc('react_to_parent_community_post', {
    p_post_id: postId,
    p_reaction: reaction,
  });
  if (error) rpcError(error);
  return normalizeReactionCounts(data ?? EMPTY_REACTIONS);
}

export async function replyToParentCommunityPost(postId: string, body: string): Promise<number> {
  const value = body.trim();
  if (!value) throw new Error('Quiet replies cannot be empty.');

  const client = await requirePermanentParentClient();
  const { data, error } = await client.rpc('reply_to_parent_community_post', {
    p_post_id: postId,
    p_body: value,
  });
  if (error) rpcError(error);
  const count = Number(data ?? 0);
  if (!Number.isFinite(count)) throw new Error('Parent Circle returned an invalid reply count.');
  return count;
}

export async function reportParentCommunityPost(postId: string, reason?: string): Promise<void> {
  const client = await requirePermanentParentClient();
  const { data, error } = await client.rpc('report_parent_community_post', {
    p_post_id: postId,
    p_reason: reason?.trim() || null,
  });
  if (error) rpcError(error);
  if (data !== true) throw new Error('Parent Circle did not confirm the report.');
}
