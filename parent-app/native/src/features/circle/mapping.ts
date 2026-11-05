import type {
  ParentCommunityFeedRow,
  ParentCommunityPost,
  ParentCommunityReactionCounts,
  ParentCommunityReactionKey,
} from './types.ts';

export const EMPTY_REACTIONS: ParentCommunityReactionCounts = {
  beenThere: 0,
  solidarity: 0,
  reminder: 0,
  needed: 0,
  strength: 0,
};

function finiteCount(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function normalizeReactionCounts(value: unknown): ParentCommunityReactionCounts {
  const source = value && typeof value === 'object'
    ? value as Partial<Record<ParentCommunityReactionKey, unknown>>
    : {};
  return {
    beenThere: finiteCount(source.beenThere),
    solidarity: finiteCount(source.solidarity),
    reminder: finiteCount(source.reminder),
    needed: finiteCount(source.needed),
    strength: finiteCount(source.strength),
  };
}

export function mapParentCommunityFeedRow(row: ParentCommunityFeedRow): ParentCommunityPost {
  return {
    id: row.post_id,
    text: row.post_text,
    createdAt: row.created_at,
    circleTag: row.circle_tag ?? undefined,
    quietRepliesCount: finiteCount(row.quiet_reply_count),
    reactions: normalizeReactionCounts(row.reaction_counts),
  };
}
