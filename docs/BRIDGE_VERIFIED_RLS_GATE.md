# Bridge backend permission boundary — additional guardian proof

Read-only production metadata inspection on 2026-10-22:
- RLS is enabled on bridge_share_requests, bridge_summaries, parent_links, account_verification and app_profiles.
- Both existing parent SELECT policies restrict to the named share recipient, status ready/viewed, unrevoked and unexpired share, and active parent link.
- Those SELECT policies do **not** directly call the server-owned `is_verified_guardian()` helper. Guardian identity therefore depends on the account client unless the RLS layer is strengthened.
- Parent-native `readConsentedBridgeSummary()` performs verified guardian checks and exact-share validation, and is not wired to BridgeView.

## Staging-only candidate

The file `security/bridge-parent-verified-read-proposed.sql` uses ALTER POLICY to add `is_verified_guardian()` to the two parent SELECT policies while retaining named recipient, active link, revocation and expiry conditions. Teen SELECT policies are left untouched. The older Bridge Signals policy is reviewed in `docs/BRIDGE_SIGNALS_POLICY_REVIEW.md`.

## Required real-account integration tests

1. Create isolated staging identities: Teen A, Teen B, approved Guardian A, approved Guardian B, and unverified parent U. Do not use production children or live family accounts.
2. Confirm verified Guardian A, when actively linked to Teen A, can SELECT **only one ready/consented Bridge summary** shared explicitly with A.
3. Confirm Guardian B and U cannot read A's share, including if they know the exact request ID.
4. Confirm Teen B's records cannot be accessed by A even with guessed UUIDs; teen-owner policies still permit the actual teen to see own authorized records.
5. Revoke individual request, expire it, unlink A, set link inactive, and remove A's guardian verification; each must yield zero parent rows immediately.
6. Check anon and stale signed-out sessions cannot read; reissued/expired JWT behavior remains bounded by server policy.
7. Check user_metadata role changes cannot bypass either policy; prevent service_role keys from client builds.
8. Run Supabase security advisors and verify exact policy SQL on staging; require separate, reviewed deployment authority and rollback before production.

### This continuation

Only the parent repository was changed. SQL in security/ is review material **not executed**, no auth identities were created, and no child-linked rows were read or copied. Existing live Parent Front Door remains welcome-only.
