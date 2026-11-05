# Parent Source Export Manifest

- Source owner: `jussray/Sekret-Bip`
- Source ref at transfer: `main` (read on 2026-10-22; immutable commit pin still to be verified)
- Target: `jussray/Sekret-Bip-Parents`, branch `feat/parent-side-export-20261022`
- Exported source path prefix: `upstream-parent/`
- Source includes parent routes, parent-only features, screens, onboarding, parent consent contracts, and shared utility imports. These are **not standalone runnable** without their original dependencies.
- No environment files, account content, database exports, tokens, or privileged server keys copied.
- `site/` is a separate **public, standalone entry page**, not an authenticated Parent Window.
- Bridge, Parent Circle, teen shares, AI memory, account data, and messages are not accessible from `site/`; this fail-closed scope is intentional.
- Intended domain: `parent.sekretbip.net`; Cloudflare deploy and custom hostname verification are separate checks.
- No claim that the imported snapshot compiles independently or that the parent authenticated app is complete.


## Parent Circle V2 export — 2026-10-26

- Source: `jussray/Sekret-Bip` PR #1189
- Exact source head: `b1e80d2840d5a73df1291b11029a31620c009633`
- Target bundle: `parent-app/exports/parent-circle-v2-20261025/`
- Scope: 9 reviewed Parent Circle V2 source files, including two SQL migration files preserved as source-only evidence.
- Integrity: `tests/parent-circle-v2-export.test.mjs` verifies each exported file against its original Git blob SHA.
- The earlier 46-file `parent-app/exported/` snapshot remains unchanged and historically pinned.
- No production Supabase migration application, deployment, secrets, account data, or teen route export is authorized by this transfer.
