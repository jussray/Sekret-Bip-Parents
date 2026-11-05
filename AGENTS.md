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

## Reds rule — implant on sight (standing law, installed 2026-10-26)

Any error or red that surfaces in this repository — CI/Actions failure,
failing test, broken build, runtime defect — is diagnosed and fixed in the
same flow it is seen, with the smallest reversible change, landed through
this repo's normal gate and verified green on the exact head. A seen red is
never parked as a report. Never merge over a blocked mandatory gate or a
red exact head. A credential- or founder-gated red gets a full diagnosis
plus the one unblocking action named — never silence, never a faked fix.
Full charter: `.github/agents/reds-implant.agent.md`.

## Mandatory portfolio visual rule — One Cohesive Cinematic Composition (founder directive 2026-11-04)

All coding, design, QA, research-to-design, and delegated agents working on **any authorized app, website, page, or screen** must produce **one cohesive cinematic composition** per experience, not a collage of unrelated UI sections. Use a clear focal hierarchy, intentional atmospheric depth, consistent typography/lighting/spacing/assets, continuous navigation and transitions, and a primary user action. Carry the same art direction across the product's real auth, onboarding, dashboard, settings, empty/error/loading, mobile, and commerce states as applicable.

**Preserve each product's own brand, audience, characters, palette, privacy, and business functionality.** This is a universal craft/continuity rule, **not** a mandate to make all Juss & Co. projects look identical. Inspect the actual route/component/token source before editing; reuse existing design systems. Preserve keyboard/focus behavior, readable contrast, semantic structure, responsive and reduced-motion states, optimized media, and safe fallbacks. Never sacrifice real usability or truth for atmosphere.

A proposed scene or agent document is not a shipped screen. Every changed route needs actual rendered desktop/mobile visual review and relevant behavior/accessibility checks on the exact candidate head before claiming implementation verified. Record source, screenshots, tests, gaps, rollback and next gate. Never infer merge, production deployment, publication, permissions or customer outcomes from this rule. Stronger local founder authorization/security/privacy rules always take precedence.

Canonical long-form source: `jussray/founder-control-room/skills/cinematic-composition/SKILL.md` (initially staged on a separate branch; do not assume it has been merged into main). The summary here remains self-contained until the canonical source becomes authorized and available.
