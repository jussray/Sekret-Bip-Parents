export type ParentCommunityReactionKey =
  | 'beenThere'
  | 'solidarity'
  | 'reminder'
  | 'needed'
  | 'strength';

export type ParentCommunityReactionCounts = Record<ParentCommunityReactionKey, number>;

export type ParentCommunityPost = {
  id: string;
  text: string;
  createdAt: string;
  circleTag?: string;
  quietRepliesCount: number;
  reactions: ParentCommunityReactionCounts;
};

export type ParentCommunityFeedRow = {
  post_id: string;
  post_text: string;
  circle_tag: string | null;
  created_at: string;
  reaction_counts: Partial<Record<ParentCommunityReactionKey, unknown>> | null;
  quiet_reply_count: number | string | null;
};
