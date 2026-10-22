# Sauce Guard — source preservation contract

**Purpose:** Protect the original Se’kret Bip Parent Side screens, app prototype, feature code, export manifests and historical documentation while development continues in separate active directories.

Sauce Guard combines the gstack guard workflow's strict edit scope with an executable integrity check against the approved parent repo baseline. It does **not** access user accounts, expose teen data, or approve releases.

## What is protected

- The manifest `guard/source-lock.json` records the baseline Git blob hashes of **133 original files**.
- Frozen folders: `legacy/`, `preserved/`, `upstream-parent/`, `parent-app/exported/`, five original `parent-app/src/features/<feature>/` directories, and historical `components/`.
- Standalone original root `app.js` and `screens` are included.
- The 46-file original export manifest points to source `jussray/Sekret-Bip` at commit `015ac2d39bf5230530996880ea3cfa4f4707077b`.

## What is checked

`scripts/source-guard.mjs` verifies every pinned blob's actual file bytes using Git blob SHA-1, rejects missing source and unexpected files in frozen folders, confirms the export-manifest source and SHA entries, and confirms preserved Room, Bridge, Pages, Circle and Approvals copies still match their originals.

```bash
npm run guard:source
npm run check
```

`.github/workflows/source-guard.yml` runs on every pull request (no changed-path restriction) and pushes to main. Negative tests prove detection of tampering, missing files, malformed paths, duplicate manifest rows, and pinned-source conflicts.

## Allowed changes

New implementations belong in `public/`, `parent-app/native/`, or adapters and docs. The locked source is evidence, **not** a substitute for the separate runtime.

If changing archived source is truly required: record the exact old/new blob and upstream ref, preserve the old version, obtain explicit owner review, and update the manifest intentionally in a dedicated change. Never regenerate lock hashes as an automatic repair.

**Release gate:** Source preservation, CI, server-side privacy authorization and Cloudflare production proof are independent checks. Passing this guard alone unlocks nothing.
