import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Credential-free source. The publishable key is explicitly non-privileged;
// database RLS is mandatory. There is NO service-role key in the app.
let client: SupabaseClient | null = null;

export function getParentClient(): SupabaseClient | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !/^https:\/\//.test(url)) return null;
  if (client) return client;
  client = createClient(url, key, {
    auth: {
      // Preview: memory-only auth, no unreviewed token persistence on web or device.
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
  return client;
}
