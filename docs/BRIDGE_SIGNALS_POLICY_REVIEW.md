# Security review: legacy Bridge Signals parent-read policy

**Status: isolated proposal in parent GitHub repo; NOT applied to production.**

Read-only Supabase pg_policies inspection on 2026-10-22 found:
- The existing bridge_signals SELECT policy named 'bridge_signals: linked parent read' is granted to PUBLIC and checks only parent_links.teen_user_id, parent_user_id and status='active'. It does not currently check bridge_signals.revoked_at, parent_links.is_active, or server guardian verification.
- The newer bridge_share_requests and bridge_summaries recipient-specific policies check link is_active plus revoked_at and expires_at on a request.
- A direct parent client could potentially read a revoked signal while an older link row remains status=active. This is a policy-level mismatch; source review alone does not prove an exploit was exercised.

## Candidate patch

`security/bridge-signals-parent-read-proposed.sql` updates only the parent SELECT policy on legacy bridge_signals. It uses TO authenticated, nonanonymous user, server-owned verified guardian predicate, revoked_at IS NULL and active parent link status/is_active. It intentionally does not modify teen owner rules, Bridge requests or source data.

## Release/test gates before running SQL

1. Confirm the exact Supabase project, current policy and any downstream use of bridge_signals.
2. In an isolated staging database, create two test guardians and two test teens, share and revoke a signal, unlink parent, test wrong-family IDs, anonymous users and pending guardian.
3. Assert the verified intended guardian can see only unrevoked teen-selected signals through an active link, while all other combinations yield zero rows. Verify existing teen owner access separately.
4. Review what the status of invite expires_at means for active links before adding expiry conditions; do not accidentally block valid established guardians.
5. Verify the migration is compatible with the current guardian verification onboarding; get required approval before changing a shared live database.
6. Use a separate reviewed migration from the canonical database owner, run security advisors, then verify policy and rollback. Do not apply this proposal directly from the parent mobile client.

## Important scope boundary

The current parent native preview does NOT query bridge_signals, requests, summaries, journals, voice, moods or teen feeds; all private Bridge UI is locked. This proposal is defense in depth for shared backend consistency. It is not evidence that private family sharing is ready for production.
