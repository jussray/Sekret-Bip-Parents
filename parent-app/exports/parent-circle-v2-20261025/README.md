# Parent Circle V2 source export

This directory is the exact reviewed **Parent Circle V2** source slice exported from `jussray/Sekret-Bip` PR #1189 at immutable head `b1e80d2840d5a73df1291b11029a31620c009633`.

## Why it lives here
`jussray/Sekret-Bip-Parents` is the dedicated Se’kret Bip parent-side repository. Parent Circle is a parent-only surface, so future implementation and review belong here rather than in the teen app repository.

## Included
- parent Circle feed and post-detail routes;
- `ParentCircleScreen`;
- the redacted Parent Community RPC repository adapter;
- the ParentCirclePost type source witness;
- the two Parent Community V2 SQL migrations;
- the focused source contract tests from PR #1189.

## Hard boundaries
This is a **source export**, not a production cutover.

- Do **not** apply the SQL migrations from this bundle to production without a separate exact approval.
- Do **not** deploy this bundle.
- Do **not** treat the copied `src/types/index.ts` as a parent-runtime dependency; it is included only to preserve the exact PR source witness.
- No account data, teen content, secrets, environment files, service-role keys, or production database exports are included.
- The public parent front door remains separate from authenticated Parent Window functionality.

Run the root repository tests to verify every exported file still matches its original Git blob SHA.


## Shared backend authority

The SQL files under this export are **source/provenance evidence only**. They are not an active parent-repo migration lane and must not be applied from this repository.

Canonical Supabase schema/RLS/RPC ownership remains in `jussray/Sekret-Bip`; the standalone parent runtime consumes that shared contract.
