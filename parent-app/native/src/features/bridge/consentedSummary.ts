import type { SupabaseClient } from '@supabase/supabase-js';
import { verifyCurrentGuardian } from '../auth/guardianEvidence.ts';

// Read only exactly the teen-selected, generated parent-safe summary. Never fetch
// raw journals, voice notes, companion messages, original sources or private posts.
export type ParentSafeBridgeSummary = Readonly<{
  themes: readonly string[];
  conversationStarters: readonly string[];
  limitations: string;
}>;
export type BridgeReadResult =
  | Readonly<{ kind: 'locked' }>
  | Readonly<{ kind: 'shared'; summary: ParentSafeBridgeSummary }>;

type ShareGrant = {
  id: string;
  teen_user_id: string;
  parent_user_id: string;
  status: string;
  revoked_at: string | null;
  expires_at: string | null;
};
type Link = {
  status: string;
  is_active: boolean;
  expires_at: string | null;
};

// This ID is supplied by a recipient-facing notification or selected share.
// We NEVER use the ID as authority to fetch an unshared item.
const UUID = /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
function activeGrant(grant: ShareGrant | null | undefined, userId: string, shareId: string, now: number): grant is ShareGrant {
  return !!grant && grant.id === shareId
    && grant.parent_user_id === userId && UUID.test(grant.teen_user_id)
    && (grant.status === 'ready' || grant.status === 'viewed')
    && grant.revoked_at === null
    && (grant.expires_at === null || (Number.isFinite(Date.parse(grant.expires_at)) && Date.parse(grant.expires_at) > now));
}
function activeLink(link: Link | null | undefined, now: number): boolean {
  return !!link && link.status === 'active' && link.is_active === true
    && (link.expires_at === null || (Number.isFinite(Date.parse(link.expires_at)) && Date.parse(link.expires_at) > now));
}
function safeSummary(row: unknown): ParentSafeBridgeSummary | null {
  if (!row || typeof row !== 'object') return null;
  const values = row as Record<string, unknown>;
  if (!Array.isArray(values.themes) || !Array.isArray(values.conversation_starters)) return null;
  if (typeof values.limitations !== 'string') return null;
  if (values.themes.length > 20 || values.conversation_starters.length > 20) return null;
  if (!values.themes.every(x => typeof x === 'string' && x.length <= 500)) return null;
  if (!values.conversation_starters.every(x => typeof x === 'string' && x.length <= 1500)) return null;
  if (values.limitations.length > 2500) return null;
  return Object.freeze({
    themes: Object.freeze([...values.themes]) as readonly string[],
    conversationStarters: Object.freeze([...values.conversation_starters]) as readonly string[],
    limitations: values.limitations,
  });
}

export async function readConsentedBridgeSummary(
  client: SupabaseClient,
  shareId: string,
  now: () => number = Date.now,
): Promise<BridgeReadResult> {
  const locked: BridgeReadResult = { kind: 'locked' };
  if (!UUID.test(shareId)) return locked;

  try {
    const identity = await verifyCurrentGuardian(client);
    if (identity.kind !== 'guardian') return locked;
    const userId = identity.userId;
    const when = now();

    // First check the named recipient's teen-created, ready-to-view share.
    const grantResult = await client.from('bridge_share_requests')
      .select('id,teen_user_id,parent_user_id,status,revoked_at,expires_at')
      .eq('id', shareId)
      .eq('parent_user_id', userId)
      .maybeSingle();
    if (grantResult.error || !activeGrant(grantResult.data as ShareGrant | null, userId, shareId, when)) return locked;
    const grant = grantResult.data as ShareGrant;

    // A currently active teen-parent relationship is required in addition to
    // the *specific* item grant. Possession of the share ID proves nothing.
    const linkResult = await client.from('parent_links')
      .select('status,is_active,expires_at')
      .eq('teen_user_id', grant.teen_user_id)
      .eq('parent_user_id', userId)
      .eq('status', 'active')
      .eq('is_active', true)
      .maybeSingle();
    if (linkResult.error || !activeLink(linkResult.data as Link | null, now())) return locked;

    const result = await client.from('bridge_summaries')
      .select('themes,conversation_starters,limitations')
      .eq('request_id', shareId)
      .maybeSingle();
    if (result.error || !result.data) return locked;
    const summary = safeSummary(result.data);
    if (!summary) return locked;

    // Refuse an in-flight result whose grant was revoked/expired while loading.
    // Supabase's own RLS must enforce the same checks at query time. A
    // post-read recheck is defense-in-depth, not a substitute for RLS.
    const again = await client.from('bridge_share_requests')
      .select('id,teen_user_id,parent_user_id,status,revoked_at,expires_at')
      .eq('id', shareId)
      .eq('parent_user_id', userId)
      .maybeSingle();
    if (again.error || !activeGrant(again.data as ShareGrant | null, userId, shareId, now())) return locked;
    const lastGrant = again.data as ShareGrant;
    if (lastGrant.teen_user_id !== grant.teen_user_id) return locked;

    const finalLink = await client.from('parent_links')
      .select('status,is_active,expires_at')
      .eq('teen_user_id', grant.teen_user_id)
      .eq('parent_user_id', userId)
      .eq('status', 'active')
      .eq('is_active', true)
      .maybeSingle();
    if (finalLink.error || !activeLink(finalLink.data as Link | null, now())) return locked;

    // A stale or replaced sign-in must not return content to a later account.
    const lastIdentity = await verifyCurrentGuardian(client);
    if (lastIdentity.kind !== 'guardian' || lastIdentity.userId !== userId) return locked;
    return { kind: 'shared', summary };
  } catch {
    return locked;
  }
}
