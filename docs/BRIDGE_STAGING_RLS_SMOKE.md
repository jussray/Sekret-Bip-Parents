# Read-only Bridge RLS integration harness

Run `npm run test:rls:staging` from parent-app/native **only after** a separate, disposable Supabase staging project has been prepared and explicit account and sharing fixtures seeded there by an authorized test administrator.

Safety: the harness refuses the production Se’kret Bip Supabase project (`tbsevonvegdnlyjgplmm`), refuses service-role/secret keys, requires a staging hostname matching its project ref, requires an exact opt-in phrase, performs only SELECT/head+count queries and guardian-verification RPC, and signs out sessions afterward. **It does not write, seed, delete, or view private summary contents**.

Required environment configuration (set securely, never commit credentials):

- `BIP_ALLOW_STAGE_RLS_SMOKE=I_ACCEPT_READ_ONLY_STAGING_TESTS`
- `BIP_STAGE_PROJECT_REF`, `BIP_STAGE_SUPABASE_URL=https://<ref>.supabase.co`, `BIP_STAGE_PUBLISHABLE_KEY=sb_publishable_...`
- `BIP_STAGE_GUARDIAN_A_EMAIL` and `_PASSWORD`; same for `GUARDIAN_B` and `UNVERIFIED`
- `BIP_STAGE_SHARE_A_READY`, `BIP_STAGE_SHARE_B_READY`, `BIP_STAGE_SHARE_A_REVOKED`, `BIP_STAGE_SHARE_A_EXPIRED`, `BIP_STAGE_SHARE_A_UNLINKED` (five distinct staging UUIDs)

Fixture expectations: Guardian A and B are verified and actively linked only to their respective staging teens. The Unverified account may be signed in but must **not** pass the guardian RPC. A and B have one distinct ready summary each. Revoked, expired and unlinked fixture shares are inaccessible. Raw teen sources must never appear in parent SELECT results.

Stages: first apply the separately reviewed parent-read policy tightening proposals to staging only; then run this script. Ensure negative tests fail with the old unverified parent policy, and pass after correction. Test teen-owner paths separately in the teen repo. No production SQL, no live test families and no automatic deployment are authorized by this harness.

CI does not run this staging harness automatically because the prerequisites (separate controlled accounts and approved environment) are not configured. Unit tests cannot substitute for a real RLS test.
