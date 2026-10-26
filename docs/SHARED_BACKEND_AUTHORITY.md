# Shared Bip backend authority

This repository owns the **Se’kret Bip Parent product experience**, not a separate backend.

## Canonical ownership

- Shared Supabase schema, migrations, RLS, auth authority, and cross-product RPC contracts are owned by **`jussray/Sekret-Bip`**.
- This parent repository owns parent-specific UI, navigation, auth presentation, parent-only product logic, release checks, and its standalone app/runtime.
- Parent code consumes the shared Main Bip backend through documented contracts.
- When Main Bip contains reusable parent code, it may be exported here with immutable provenance and then adapted for the standalone parent experience.

## What must not happen here

Do not create an active `supabase/migrations/` lane in this repo or under `parent-app/native/`.
Do not apply SQL copied inside `parent-app/exports/**/source/` from this repository.
Those SQL files are source/provenance witnesses only.

If a shared backend change is needed:

1. repair and prove it in `jussray/Sekret-Bip`;
2. merge it there under Main Bip’s exact-head/release gates;
3. apply production database changes only under a separate mutation approval;
4. consume the resulting RPC/schema contract from the parent runtime.

## Parent Circle V2

The parent app calls the shared Parent Community RPC surface. It must fail closed when that backend contract is unavailable and must never fall back to raw Circle tables or a parent-specific shadow database.
