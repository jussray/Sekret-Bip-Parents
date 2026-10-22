# Se’kret Bip Parents — canonical parent-side repository

**Decision (2026-10-22):** The founder designated `jussray/Sekret-Bip-Parents` as the **parent-side product repository** for Se’kret Bip. This supersedes the older repository instruction calling it a do-not-use legacy archive, without erasing the preserved legacy snapshot or its history.

## Current deliverable

The new standalone web entry point is `public/index.html`. It is a responsive, accessible, parent-specific site with conversation kits and a **memory-only reflection editor**. Build with `npm ci && npm run check`, serve the `dist/` output using Cloudflare Pages. No external scripts, trackers, accounts, or calls are used in the public version.

**Critical limitations:** The public parent site does not authenticate guardians, connect family accounts, show child details, send messages, collect contact details, or display support alerts. These are **not** represented as working; Parent Bridge states that child-linked data is unavailable. This is intentional until the backend uses verified guardian identity, child-controlled grants, and server-side authorization with real negative tests.

## Relationship between repositories

- Parent app / parent UI: **this repository**, `jussray/Sekret-Bip-Parents`.
- Main Se’kret Bip / Bip teen experience: separate canonical teen-side repository; do not import private teen data or render teen journals in this repository.
- Domain for this parent app: `https://parent.sekretbip.net`.
- Existing teen app and backend have different hostnames; **do not** modify or replace them as part of parent deployment.

## Nonnegotiable parent/teen privacy contract

1. Parent identity must be verified through the auth provider; hiding a button, checking a client-side role, or knowing a child's ID is not authorization.
2. Teen chooses exactly what content to share with exactly which verified guardian. Nothing shares by default; support signals need their own defined scope, purpose, and safety review.
3. Revocation is enforced at the server or database on every read; no historical permissions or cached API responses may leak revoked data.
4. Parent accounts never receive private journal text, voice notes, private Circle posts, secret conversations, or unshared safety information.
5. Guardian links need consent records, expiration/revocation support, audit logs, rate limits, data minimization, and owner-scoped RLS; no broad SELECT policies.
6. Never use a Supabase `service_role`/secret key in public build output. Account roles must not be trusted from user-editable metadata.
7. No production family data in preview deployments, demo fixtures, test logs, or GitHub Actions.
8. Parental crisis or safety workflows require explicit product, legal, and safeguarding review; public copy must not imply monitoring of children.

## Legacy preservation

The existing `app.js`, `screens`, `components`, `README.md`, and older `.agents/skills/do-not-use-archive/SKILL.md` are preserved as historical material. They include mixed teen/parent React Native prototype code, not the new secure parent product. Do not deploy them as the parent entry point.

## Release gate

A green static build is necessary but not sufficient. Before child-linked features: auth provider wiring; guardian/teen link workflow; concrete table schema and RLS tests (unauthorized, wrong parent, expired/revoked, IDOR); consent UI; privacy/security review; deployed integration tests; and incident/rollback checks.

See `docs/PARENT_DOMAIN.md` for Cloudflare setup and rollback.

## Feature/screen extraction review branch (2026-10-22)

The working review branch `feat/parent-modular-features-20261022` preserves current production portal screens under `preserved/live-portal-20261022/`, extracts static feature logic to `public/features/`, and copies five pinned parent-native screen implementations into `parent-app/src/features/` behind thin `parent-app/src/screens/` adapters. `parent-app/exported/` retains the original pinned source. See `docs/PARENT_FEATURE_BOUNDARIES.md`. This branch is **review-only**, not the current Cloudflare Pages production source. Do not switch Pages production branch or import child-linked data until separately authorized and tested.
