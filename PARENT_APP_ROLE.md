# Se’kret Bip — dedicated Parent Side repository

This repository is being repurposed by founder request on 2026-10-22 to own the **parent-side application** for Se’kret Bip. The teen app remains `jussray/Sekret-Bip`; parent-side code exported from that repository must retain source attribution and exact source SHA. Preserve the legacy files (`app.js`, `screens`, `README.md`, original archive skill) as historical material, not deployable code.

## Runtime authority
- Intended public parent portal: `https://parent.sekretbip.net`.
- Existing teen app: `https://app.sekretbip.net` (not owned by this repo).
- Shared API boundary: `https://api.sekretbip.net` (not owned by this repo).
- Production cutover requires a verified independent build, Cloudflare custom-domain attachment, and exact live response evidence. DNS existence is not deploy proof.

## Parent-only privacy invariant
- Parent linking **never** grants blanket teen-data access.
- Allow reads only for individually teen-shared items addressed to that parent, with active recipient authorization and server-side RLS.
- No raw journals, private voice notes, hidden mood logs, AI chats, Circle activity, inferred analytics or surveillance.
- No actual teen or parent data, tokens, account identifiers, or service-role keys in this repo.
- Protect authenticated routes and do not make privileged functions available by merely hiding buttons.
- Parent Se’kret and Coach support reflection and relationship repair; no impersonation or inference of private teen thoughts.
- Unlink/revocation stops future reads of revocable shares. Clear session-local caches on sign-out.

## Release boundaries
1. Export source-only parent files separately from independently deployable runtime code.
2. Preserve upstream parent screen code with attribution; do not copy unrelated teen app, secrets or production data.
3. Validate build, security, consent, accessibility, and sign-in before pointing the parent custom domain to production.
4. Keep a rollback record for Cloudflare Pages project and DNS. No unverified production cutover.

Status: **architecture/export in progress**, not a claim of production readiness.
