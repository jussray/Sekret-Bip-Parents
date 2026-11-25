import type { SupabaseClient } from '@supabase/supabase-js';

// Rollout visibility only. This does NOT authorize a guardian, a parent/teen link,
// access to teen data, or a direct Supabase Auth signup request.
export async function isParentRegistrationOpen(client: SupabaseClient): Promise<boolean> {
  try {
    const { data, error } = await client
      .from('parent_form_feature_gates')
      .select('enabled')
      .eq('name', 'parent_registration')
      .maybeSingle();
    return !error && data?.enabled === true;
  } catch {
    // Missing migration, network failure, or malformed data must never open registration.
    return false;
  }
}
