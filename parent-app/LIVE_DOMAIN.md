# Parent live domain and Cloudflare handoff (2026-10-22)

**Desired public host:** `https://parent.sekretbip.net`.

## Verified Cloudflare readback (configuration, not production proof)
- Active zone `sekretbip.net`.
- DNS contains proxied CNAME `parent.sekretbip.net` pointing to `parent` (not a proven reachable parent Pages target).
- Existing Pages project `sekret-bip`: source GitHub repo `Sekret-Bip`, production branch `main`, attached domains `sekretbip.net` and `app.sekretbip.net` plus other site aliases; parent hostname is **not** attached to it.
- `sekret-backend` owns `api.sekretbip.net`. Keep client API single-home and respect API authorization.
- No separately configured Parent Pages project was listed in account readback.

## Intended release topology
`parent.sekretbip.net` -> dedicated `sekret-bip-parents` Pages project -> independently built **Parent Side** app -> `api.sekretbip.net` (server-side role + link + consent + RLS).

This topology is a *target*, not currently live.

## Gates before changing DNS/provider mapping
- Independent secure Parent app build and exact commit, no teen screens or private imports.
- External API/RLS authorization, unlink/revocation, caches and role-bound journeys tested.
- Create dedicated Cloudflare Pages project connected to `jussray/Sekret-Bip-Parents`, configure build artifacts and production branch.
- Verify Pages-owned preview on exact commit then add `parent.sekretbip.net` custom domain.
- Only after verification repair/replace existing CNAME with Cloudflare-provided target; verify HTTPS, origin, redirects and routing.
- Preserve old DNS value and deployment state for rollback; do not repoint the teen project or bypass security to make the hostname appear live.

**Current decision:** do not flip DNS to any untested app or pretend the current CNAME is production readiness.
