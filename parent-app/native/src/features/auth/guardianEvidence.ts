import type { SupabaseClient } from '@supabase/supabase-js';

export type GuardianDecision =
  | { kind: 'visitor' }
  | { kind: 'review'; reason: 'not_verified' | 'unavailable' }
  | { kind: 'guardian'; userId: string };

// Always use authenticated server results, never user_metadata, a route parameter,
// a stored parent ID, local role switches or mutable JWT profile claims.
export async function verifyCurrentGuardian(
  client: SupabaseClient,
): Promise<GuardianDecision> {
  try {
    const identity = await client.auth.getUser();
    const user = identity.data?.user;
    if (identity.error || !user || user.is_anonymous === true || !user.id) {
      return { kind: 'visitor' };
    }
    const [profile, verification, guardian] = await Promise.all([
      client.from('app_profiles')
        .select('account_side,onboarding_complete')
        .eq('user_id', user.id).maybeSingle(),
      client.from('account_verification')
        .select('verification_state')
        .eq('user_id', user.id).maybeSingle(),
      client.rpc('is_verified_guardian'),
    ]);
    if (profile.error || verification.error || guardian.error) {
      return { kind: 'review', reason: 'unavailable' };
    }
    // Server-owned account verification and guardian RPC must BOTH agree.
    if (profile.data?.account_side !== 'parent'
      || profile.data?.onboarding_complete !== true
      || verification.data?.verification_state !== 'VERIFIED_GUARDIAN'
      || guardian.data !== true) {
      return { kind: 'review', reason: 'not_verified' };
    }
    return { kind: 'guardian', userId: user.id };
  } catch {
    return { kind: 'review', reason: 'unavailable' };
  }
}
