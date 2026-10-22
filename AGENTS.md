# Active repo role — Se’kret Bip Parents (founder decision 2026-10-22)

This repository is now the **canonical parent-side Se’kret Bip product repository**. This explicit owner decision supersedes the legacy `do-not-use` designation below. Keep all older files and their history intact; use `public/` as the independently deployed parent site. `jussray/Sekret-Bip` remains the separate canonical teen product. Read `PARENT_PORTAL.md` before implementation.

Guardrails: no client-side-only guardian role gates; no family data without verified identity, consent, RLS, and revocation; do not access private teen journaling; preserve all legacy code. New work must be reviewable and tested. Do not merge or deploy unverified child-data features or silently alter other hostnames. The original instructions follow as historical provenance and are **not** an active instruction to treat this owner-approved parent repository as abandoned.

---

## Superseded historic instructions (preserved verbatim)

# Agent Instructions for Do-not-use legacy archive

Before nontrivial work, read `.agents/skills/do-not-use-archive/SKILL.md` and use its 5W1H operating contract as active reasoning.

Every task must establish who, what, where, when, why, and how before implementation; inspect repository truth for missing answers and ask only when an unknown materially changes the safe action or authority.

Preserve existing work. Do not delete, deploy, publish, merge, expose data, change access, or perform destructive operations unless the request clearly authorizes that exact action and repository boundary.

Repository role: An explicitly non-canonical legacy Se'kret Bip snapshot whose default operating mode is read-only preservation.

Apply the skill's non-negotiable boundaries, verification rules, and truthful output format.

## Sauce Guard (source preservation)

Run `npm run guard:source` before and after edits. `guard/source-lock.json` pins source snapshots; never auto-regenerate its hashes, delete archived parent screens, or move teen data into public features. Modify only active public/native feature code or reviewed adapters; consult `docs/SAUCE_GUARD.md` and the updated `README.md`. Guard failures are blockers for review, not permissions to overwrite files.
