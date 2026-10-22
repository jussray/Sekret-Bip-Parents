# Parent Native Feature Preservation — SOURCE ONLY

This directory contains five verbatim, byte-identical copies of parent React Native screen implementations from `parent-app/exported/screens/` pinned to teen repository commit `015ac2d39bf5230530996880ea3cfa4f4707077b`.

- `room/ParentRoomFeature.tsx` — parent room and mood presence.
- `bridge/ParentBridgeFeature.tsx` — consent-limited Bridge parent reply/share presentation.
- `pages/ParentPagesFeature.tsx` — parent journaling/reflection screen.
- `circle/ParentCircleFeature.tsx` — parent community UI.
- `approvals/ParentApprovalsFeature.tsx` — parent approvals UI.

The new `../screens/` files are thin adapters exporting the same existing named components. Original snapshots are unchanged; no code or capability was deleted. The modules have **not** been adapted to a standalone Expo build. Their inherited relative imports and `@/` imports still reference upstream dependencies, and must be resolved with a separately verified parent-only runtime and auth/consent adapters before use. The public `public/` portal does not import or bundle these modules. Do not interpret export/integrity checks as an app build or production authorization check.

Never route private teen data into this tree without parent identity, teen recipient-specific grants, server-side RLS, and revocation tests. No fallback to client-side role flags or activity-based monitoring.
