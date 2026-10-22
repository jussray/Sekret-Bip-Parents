# Se’kret Bip · Parent Side

**Connection without control.** The Parent Side helps adults reflect, communicate and support their teen without accessing what their teen has not chosen to share.

This is the dedicated parent repository for **Se’kret Bip** (also called **Bip**). The teen-side app remains [jussray/Sekret-Bip](https://github.com/jussray/Sekret-Bip).

**Live public portal:** https://parent.sekretbip.net  
**Review branch:** `feat/parent-modular-features-20261022` ([PR #6](https://github.com/jussray/Sekret-Bip-Parents/pull/6))  
**Cloudflare Pages project:** `sekret-bip-parents`

> [!IMPORTANT]
> The live public portal, modular portal candidate, and independent Expo preview are **distinct implementations**. The public portal is now **welcome-only before signup**. It shows Create Parent Account and Sign In. All app features remain preserved but are not served publicly; independent parent authentication is still being verified. The independent Expo preview is still under review. Parent Bridge and Parent Circle remain locked until guardian identity, teen-controlled sharing, server-side authorization, and revocation are tested.

## Current features

| Surface | What works | What is not yet enabled |
| --- | --- | --- |
| Live public portal | Parent Front Door, Create Parent Account and Sign In | App screens, guardian identity and private family data |
| Preserved modular web features | Conversation Kits and Parent Reflections remain in repository source | Excluded from public Pages build until authenticated integration |
| Independent Expo parent preview | Parent Room mood check-in, unsaved Parent Pages, Coach prompts and tabs | Authenticated Bridge, linked teen content, live Circle |
| Preserved full parent designs | Original Room, Pages, Bridge, Circle, Approvals and additional parent-specific screens | Not a self-contained runnable app |

## Repository map

| Location | Responsibility |
| --- | --- |
| `public/` | Public Pages site: screen layout, styles, reusable browser feature modules |
| `parent-app/native/` | Separate Expo SDK 56 / React Native / Expo Router parent preview |
| `parent-app/src/features/` | Preserved original Room, Bridge, Pages, Circle and Approvals feature source (**locked**) |
| `parent-app/src/screens/` | Thin re-export adapters for preserved native features |
| `parent-app/exported/` | 46 pinned byte-identical parent exports from the teen app (**locked**) |
| `upstream-parent/` | Broader source-only parent export (**locked**) |
| `preserved/` | Exact earlier web portal versions (**locked**) |
| `legacy/`, `app.js`, `screens`, `components/` | Original mixed teen/parent prototype and historical README (**locked**) |
| `guard/`, `scripts/source-guard.mjs` | Sauce Guard integrity manifest and verifier |
| `docs/` | Privacy, release, feature-boundary, architecture and source-protection contracts |

The old README's long React Native source excerpt is preserved in `legacy/README.pre-parent-export.md` and `legacy/README.pre-parent-repurpose.md`. Rewriting this entry point did not erase that original content.

## Quick start

Requires **Node.js 22+** for the independent preview workflows.

### Public web portal

```bash
npm ci --ignore-scripts
npm run guard:source
npm run check
```

The public Pages build allowlists only front-door HTML, CSS, inert JS, 404 and security headers. All modules in `public/features/` remain preserved in Git, but are **not packaged for public access**. See [Parent Front Door policy](docs/PARENT_FRONT_DOOR.md).

### Independent parent Expo preview

```bash
cd parent-app/native
npm install --no-audit --no-fund
npm test
npm run typecheck
npm run build:web
npm start
```

Its five app routes are thin adapters, while the new feature implementations live under `parent-app/native/src/features/`. It deliberately does **not** import legacy teen services, real family records, or the archived full parent screens.

## 🛡️ Sauce Guard — preserve the source

**Sauce Guard** protects **133 original Git blobs** with `guard/source-lock.json`, including the original app files, pinned export, Room/Bridge/Pages/Circle/Approvals copies, archived READMEs, and prior portal versions.

```bash
npm run guard:source
```

The verifier fails on missing or edited protected files, unexpected additions inside locked directories, a mismatched pinned 46-file export, or parent feature copies that differ from their originals. Independent GitHub Actions checks run for every pull request. **Do not regenerate the lock manifest during routine builds or auto-fix a failed guard.** Any legitimate source migration needs exact provenance, a protected copy, review, and tests.

Full policy: [docs/SAUCE_GUARD.md](docs/SAUCE_GUARD.md).

## Native guardian verification and Bridge review

The independently built parent-native preview now requires live Supabase authentication and server-owned `VERIFIED_GUARDIAN` state, completed parent onboarding, and the guardian-verification RPC **before any app tabs render**. It hides navigation on sign-out and background and re-verifies on resume. No production parent hostname is wired to this preview. See [Parent auth gate](docs/PARENT_AUTH_GATE.md).

A **nonapplied** security proposal for the older Bridge Signals parent-read policy is documented in [the Bridge legacy policy review](docs/BRIDGE_SIGNALS_POLICY_REVIEW.md). This is not a production database change or verification of actual child-data access.

## Privacy and safety

The parent experience may show only specific teen content intentionally shared with the named, currently authorized guardian. Parent account linkage does **not** authorize browsing private journals, unshared voice notes, Circle posts, mood history, companion memory, or safety notes.

Private features require verified guardian identity, server-side grants, item-level recipient checks on every read, expiration, revocation, rate limits, and negative cross-account/RLS tests. Client flags and hidden buttons are never authorization.

The Parent Side companion is for reflection and relationship repair, not surveillance, impersonation or inference of a teen's private thoughts.

## Live domain vs. development

| Responsibility | Authority |
| --- | --- |
| Parent website | https://parent.sekretbip.net |
| Cloudflare Pages project | `sekret-bip-parents` |
| Last confirmed public production branch | `feat/parent-portal-live-domain-20261022` |
| Current feature-development branch | `feat/parent-modular-features-20261022` |
| Parent source export baseline | `jussray/Sekret-Bip` commit `015ac2d39bf5230530996880ea3cfa4f4707077b` |
| Teen-side API and runtime | Owned by the separate Se’kret Bip repository and Cloudflare services |

Cloudflare's custom domain, TLS and page rendering were verified during setup, but fresh provider readback is required before claiming any future deployment. A green GitHub check is not proof of production release. **No automated merge, DNS change or deployment is authorized by this README.**

## Remaining product gates

1. Parent signup/login with server-verified guardian identity and role.
2. Teen-controlled invitations, explicit recipient-specific sharing and unlink/revocation.
3. Negative RLS/API tests for wrong parent, expired consent, direct-URL bypass, replay, and revoked content.
4. Moderation for Parent Circle, safe notifications, cache cleanup and full device/browser journeys.
5. Exact release provenance, Cloudflare build/domain verification, rollback and owner-reviewed deployment.

Until those gates pass, private Bridge/Circle and child-linked data remain locked.

## Documentation and provenance

- [PARENT_PORTAL.md](PARENT_PORTAL.md) — parent product and privacy rules
- [PARENT_APP_ROLE.md](PARENT_APP_ROLE.md) — repository boundaries
- [docs/SAUCE_GUARD.md](docs/SAUCE_GUARD.md) — source-protection policy
- [docs/PARENT_FEATURE_BOUNDARIES.md](docs/PARENT_FEATURE_BOUNDARIES.md) — screen/feature separation
- [docs/PARENT_NATIVE_PREVIEW_GATE.md](docs/PARENT_NATIVE_PREVIEW_GATE.md) — independent Expo preview tests and release gate
- [docs/PARENT_DOMAIN.md](docs/PARENT_DOMAIN.md) — DNS, routing and rollback
- [parent-app/README.md](parent-app/README.md) — pinned exports
- [parent-app/native/README.md](parent-app/native/README.md) — new native preview

The older archive designation is historical. The current owner-directed role is **the canonical dedicated parent-side repository**.
