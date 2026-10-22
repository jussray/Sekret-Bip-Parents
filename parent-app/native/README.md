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
