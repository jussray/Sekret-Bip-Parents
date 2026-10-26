# Se’kret Bip — Parent Side

**Dedicated parent-side repository** for Se’kret Bip. Its intended custom domain is **https://parent.sekretbip.net**.

This repo supersedes its old legacy-archive designation **for new parent-only development** while retaining the original source under `legacy/` and keeping `app.js`, `screens`, and old guidance unchanged for historical reference.

## What's here

- `site/`: a small standalone, no-account, privacy-first parent entry site with Room, Coach prompts, unsaved Pages, and privacy explanations for Bridge and Parent Circle.
- `upstream-parent/`: source-only export of parent routes, parent-specific UI, onboarding, and consent contracts from `jussray/Sekret-Bip` (not independently buildable yet).
- `PARENT_APP_ROLE.md`: repository purpose and boundaries.
- `docs/PARENT_EXPORT_MANIFEST.md`: export provenance, scope and limitations.
- `legacy/`: preserved original instructions and README; older code still at repo root.

## Local verification

Requires Node.js 20+ with no additional dependencies:

```sh
npm test
npm run build:pages
```

For visual inspection run any local static server pointed at `site/` (e.g. `python3 -m http.server --directory site 8080`). No account credentials are collected by the entry site.

## Cloudflare Pages contract

- Project (planned): `sekret-bip-parents`.
- Build command: `npm run build:pages`.
- Build output directory: `site`.
- Custom domain: `parent.sekretbip.net` after deployment verification.

## Privacy and completion gates

**Not yet the full authenticated Parent Window.** Parent identity, teen invitation verification, item-level consent, server-side RLS, signed media handling, Parent Circle moderation and revocation must be wired to authorized backend services before those routes unlock. Never ship mock linked-family data as real data. Linking is not permission to read private teen content.

## Source ownership

The parent product/runtime is owned here. **The canonical shared backend remains `jussray/Sekret-Bip`**: Supabase schema, migrations, RLS, auth authority, and cross-product RPCs are repaired and proven there first. This repo consumes those contracts and must not create a shadow backend or active migration lane.

Source exported from Main Bip may be preserved here with provenance and adapted into parent-specific UI/runtime code. Exported SQL remains evidence only. See `docs/SHARED_BACKEND_AUTHORITY.md`.
