# Parent feature extraction boundary — 2026-10-22

## Ownership and preservation

- **Live parent portal source**: `public/index.html` remains the presentation-only screen. CSS/layout and every visible copy string are unchanged by this extraction.
- **Composition**: `public/app.js` contains only calls to mount independent features.
- **Independent interactive modules**: `public/features/conversation-kits.js` and `public/features/parent-reflections.js` hold their own state/behavior and use small screen adapters.
- **Original source**: `preserved/live-portal-20261022/` stores the byte-identical pre-refactor HTML and JS. `preserved/alternate-parent-entry/` retains the other portal draft.
- **Parent mobile-source export**: `parent-app/exported/` retains the verified pinned upstream exports and `upstream-parent/` retains the broader source-only snapshot. **Neither was refactored**, rewritten, merged into the public build, or made runnable by copying.

## Invariants

1. Conversation kits keep all four topics, text, order, cycle behavior, active selection, and user-initiated copy.
2. Parent Reflections remain ephemeral, not uploaded or persisted; clear action empties the draft.
3. Parent Bridge and child-linked data remain unavailable until server-side identity, named recipient, item-specific consent, revocation, and RLS checks pass.
4. No teen accounts, journals, voice, mood, Circle data, or secrets appear in a public artifact.
5. `scripts/build.mjs` copies `public/` into `dist/`, including `public/features/`. `_headers` permits local ES modules with the existing self-origin CSP.

## Later parent-native extraction

The archived Expo parent screens are **not independent working features**. Their `@/` imports still depend on original teen-app context. Before activating native parent navigation: implement a separate parent-native runtime, extract each feature into `parent-app/src/features/<feature>/`, add a thin screen adapter, then run auth/RLS negative cases, TypeScript and device checks. Do not rewrite the pinned archived screens just to make imports pass.

## Release gate

This review branch is not production. Do not point Cloudflare's production branch at it until GitHub Actions passes on the exact head, source-scope review is complete, and HTTPS/browser behavior is checked. Roll back by retaining `feat/parent-portal-live-domain-20261022` as the production source and the archived original portal files.

## Native-screen adapter extraction

A separate additive source-only pass copied five pinned original parent-screen implementations verbatim into `parent-app/src/features/{room,bridge,pages,circle,approvals}/` and created matching **thin** adapters in `parent-app/src/screens/`. The original `parent-app/exported/screens` and `upstream-parent/screens` remain intact. The names are preserved and a Node test compares the feature copies byte-for-byte with immutable source blob IDs.

**This is a preservation-oriented structural extraction, not a completed, compiling React Native application.** Every feature still has unresolved upstream asset/`@/` service dependencies; account and consent authorization remain blocked until proven independently. The public Cloudflare portal never bundles these parent-native files.
