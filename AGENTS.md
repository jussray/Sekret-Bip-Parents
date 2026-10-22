# Se’kret Bip Parent Side — agent operating instructions

## Current founder decision
This repository is the dedicated **parent-side** implementation repository for Se’kret Bip. The former legacy snapshot classification is superseded for **new parent-only work** by the owner's explicit 2026-10-22 instruction. Original files and the former archive guidance remain preserved as historical source only. Read `PARENT_APP_ROLE.md` and `docs/PARENT_EXPORT_MANIFEST.md` first.

## Scope and authority
- Target repo: `jussray/Sekret-Bip-Parents`; teen app remains `jussray/Sekret-Bip`.
- Public-domain intent: `parent.sekretbip.net`; exact runtime state comes from Cloudflare and a production URL probe, not repository prose.
- Parent source snapshot under `upstream-parent/` is **reference source**, not a standalone runnable app.
- The independent `site/` builds an explicitly limited public parent entry site. Treat it as **not authenticated** and **not an authorized Parent Window**.
- Do not import unrelated teen routes, private journals, private voice, companion chat/memory, private statistics or real account data.
- No secrets, privileged tokens, RLS bypass, parent surveillance, link-by-presence access, or age-gate bypass.
- A parent link is not blanket teen-content authorization. Auth, RLS, recipient, item, and revocation checks are mandatory before any shared content is ever exposed.
- Preserve the historical legacy files and instructions. Do not delete, merge, deploy or change unrelated products without exact authorization; use verified deployment gates.

## Verification
- On changes to `site/`, run `npm test` and `npm run build:pages` (they require only Node.js built-ins).
- Check CI against the exact commit head and the actual Cloudflare Pages production deployment. Do not claim private features or child-linked data function based on a static page or HTTP 200.
- Use branch/commit provenance, source repo main revision, deployment target, and rollback plan for all cross-repo work.
