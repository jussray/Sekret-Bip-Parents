# Se’kret Bip — independent parent native preview

This is a separate Expo Router and React Native app with a dedicated parent bundle ID. It does not import from the teen app or the preserved, non-buildable parent archive.

## Local commands (Node 22+)

- npm install
- npm test
- npm run typecheck
- npm run build:web
- npm run start

## Available

- Room: scrapbook-inspired dark scene and private in-memory mood check-in.
- Pages: an unsaved reflection draft with explicit clearing.
- Coach: general conversation kits; no inferred information about children.
- Bridge and Parent Circle: locked, with no external data requests.
- Thin route adapters in app/; feature domain logic and views in src/features/.

## Preserved sources

The five complex original parent features remain untouched under ../exported/screens/, ../src/features/, and ../../upstream-parent/. This preview is an incremental, separately buildable foundation, not a silent replacement of the full parent app or its inherited service/asset dependencies.

## Remaining release gates

Guardian authentication and verified roles, teen-link invitations, item-specific recipient grants, RLS negative tests, unlink/revocation, safety review for Parent Circle, accessible device/browser journeys, and exact production release verification. No secrets or production family data belong in this repository or its preview. Do not deploy this preview over the existing live Parent Portal.

## Guardian login gate (native preview)

Native app tabs no longer mount for visitors. Signup and sign-in use the existing Se’kret Bip Supabase Auth backend when the publishable URL and key are configured; this is separate from the welcome-only public parent domain. A signed-in guardian must pass current server-owned profile verification, VERIFIED_GUARDIAN state and guardian RPC. New accounts cannot self-approve. Sessions are memory-only; sign-out removes tab access immediately. Bridge and Circle remain locked pending item-specific consent checks. See docs/PARENT_AUTH_GATE.md at the repository root.


## Parent Circle V2 integration — 2026-10-26

The Circle tab is now wired to the reviewed redacted Parent Community V2 RPC contract exported from `jussray/Sekret-Bip#1189`.

Production database status at integration time: the five V2 Parent Community RPCs were **not present**. The app therefore fails closed with a server-not-activated notice and does not fall back to raw tables, legacy parent history, fake production posts, or teen data.

The five RPCs belong to the **canonical Main Bip backend** in `jussray/Sekret-Bip`. This runtime consumes that contract; it does not own or apply a second copy of the schema.

Activating shared SQL remains a separate founder-approved database change executed from the canonical Main Bip backend workflow.

## Parent registration rollout (draft integration)

The native preview checks the canonical Se’kret Bip Supabase table `public.parent_form_feature_gates` for `name='parent_registration'` and `enabled=true` immediately before attempting a new preview signup. A missing migration, unavailable server, or malformed response blocks the **preview's signup form**; existing sign-in remains available.

This is a **UI rollout control, not a Supabase Auth admission policy**. Do not claim that direct Auth API requests are blocked by this flag. Existing permanent-account, server-owned verified-guardian, link/recipient consent, and RLS checks stay authoritative. The canonical migration and activation/rollback runbook belong to `jussray/Sekret-Bip`, in `docs/PARENT_FORM_FEATURE_GATES.md`; this repository must not apply a duplicate schema.
