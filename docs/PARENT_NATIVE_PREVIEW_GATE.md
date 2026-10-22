# Parent native runtime verification gate

Target: parent-app/native/ inside jussray/Sekret-Bip-Parents.

Authority: User directed continuing parent feature extraction and independent parent app readiness. Protected teen data and active web-domain routing are outside this stage. The existing https://parent.sekretbip.net Pages project remains on its current production branch.

## Source and packaging

- Expo SDK 56 compatible direct dependencies and native app IDs follow inspected source jussray/Sekret-Bip at 015ac2d39bf5230530996880ea3cfa4f4707077b.
- app/ consists of thin route adapters; reusable presentation and domain feature code is under src/features/.
- parent-app/exported/ and parent-app/src/features/ remain preserved, not imported or rewritten by this new runtime.
- No Supabase identity keys, service-role permissions, real teen identities, journals, or production family data.
- Locked Bridge/Circle must be unlocked only after real server-side proof of a named active relationship and item-level grant.

## Verification required

1. Node 22: npm test for forged guardians, feature behavior, archived-import bans, screen separation.
2. npm run typecheck for Expo JSX dependency integrity.
3. npm run build:web with dist/index.html proof.
4. Parent features remain locked until SQL RLS cross-account, revocation, and session-expiry tests exist; do not simulate auth by accepting client flags.
5. CI results must match exact PR head SHA; old green checks are historical.

Current status: implementation pending exact-head CI proof; not production-ready. No Cloudflare production branch or DNS change authorized by this phase.
