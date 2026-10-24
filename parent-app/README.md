# Parent Side export

This is a **byte-identical source snapshot** from `jussray/Sekret-Bip` at `015ac2d39bf5230530996880ea3cfa4f4707077b`, not a standalone build.

- `exported/app/(parent)/`: parent Expo Router routes.
- `exported/src/parent/`: parent-owned feature modules, navigation, route map.
- `exported/screens/Parent*.tsx`: five parent-facing screens.
- `exported/src/services/parentEntryState.ts`: parent entry verification.
- `exported/src/bridge/types.ts`: shared Bridge interface.
- `EXPORT_MANIFEST.json`: 46 files and original blob IDs.
- Original legacy root files are preserved, not deleted.

**Why not runnable:** the exported files have unresolved dependencies on shared `@/` imports, auth, Supabase, hooks, assets, Expo modules, and API services. There is no independently verified parent-only runtime or migration-safe data bridge. `parent-app/package.json` contains only an export integrity check, not an app manifest.

## Required implementation sequence
1. Add a standalone Parent Expo Router app and a minimal audited shared contract.
2. Enforce authenticated parent role, explicit linked relationship, intentional teen shares and revocation in API + RLS.
3. Validate cache clear/unlink, notification privacy, direct URL bypass, IDOR and cross-account checks.
4. Test exact-build TypeScript, browser, device, server RLS, and real parent/teen journeys.
5. Build and register separate Cloudflare Pages deployment and only then assign the parent hostname. See `LIVE_DOMAIN.md`.
6. Verify HTTP/TLS, redirect behavior, deployment SHA and rollback plan.

Run `npm test` inside this directory (Node 18+) to verify source integrity. Passing does **not** mean auth/build/deploy pass.
