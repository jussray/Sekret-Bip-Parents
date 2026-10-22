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
