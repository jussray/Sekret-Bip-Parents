# Verified Parent Entry Gate — independent Expo preview

The public parent hostnames remain welcome-only. No Expo runtime is deployed to their production Pages project.

## Authoritative access

All checks must succeed before any parent tabs render:
1. Supabase Auth getUser() returns a non-anonymous identity validated by the server.
2. The user's own app_profiles row has account_side=parent and onboarding_complete=true.
3. The user's own account_verification row is in VERIFIED_GUARDIAN state.
4. Server-side is_verified_guardian() returns exactly true.

No user_metadata, local parent-role switch, teen ID, URL query, cached claim or invite code can grant access. Any error, missing config, rejected RLS or missing record produces a locked screen.

## Flow

The parent-native entry opens with only a welcome view and Create Parent Account / Sign In buttons. Signup uses Supabase email/password and requests a parent account. It does not self-verify an adult. Existing Se’kret Bip onboarding and guardian review still apply before app access.
Sessions in this initial preview are memory-only and must be re-created on restart. Signout clears rendering authority immediately, and stale asynchronous responses are ignored.
Only the publishable Supabase URL and key may be configured; no service_role or server secret is used in the client.

## Bridge remains protected

Even after guardian verification, Bridge and Parent Circle remain locked. The backend has parent_links, bridge_share_requests and bridge_summaries with recipient, link, revocation and expiry checks. This commit makes no teen/child-content reads. Before enabling Bridge, test real cross-account RLS under two distinct test identities, revoked/expired grants, unlink and stale sessions, without any service-role key in a parent app.

## Proof required

Run native npm test, TypeScript typecheck, and Expo web export on the exact PR head. Unit tests validate anonymous/teen/rejected guardian cases, server errors, positive verified identity, and no app render before verification. Production email delivery and end-to-end RLS are not verified by these checks.

No production database changes, deployment, DNS changes, merge, or real-family data changes are in this slice.
