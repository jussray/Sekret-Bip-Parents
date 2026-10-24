# Parent live-domain delivery contract

Intended production hostname: `parent.sekretbip.net` under the existing `sekretbip.net` Cloudflare zone.

Observed on 2026-10-22: the DNS CNAME for `parent.sekretbip.net` points to `parent` (not to a verified parent application); the existing Pages project `sekret-bip` serves other hostnames and is **not** a substitute for a parent deployment. Do not change existing teen-app, API, or other records.

Preferred deployment:
1. Cloudflare Pages project **sekret-bip-parents**, GitHub source repository `jussray/Sekret-Bip-Parents`, reviewed production branch, Node >=20, build command `npm run build`, output `dist`.
2. Verify dependency-free `npm ci`, `npm test`, and `npm run build` on exact Git SHA. Check the Pages deployment URL with real HTTP tests before pointing the custom hostname.
3. Add `parent.sekretbip.net` as a custom domain to this dedicated Pages project. Apply **only** the parent hostname DNS CNAME to the verified Pages target; the platform may reconcile it automatically.
4. Verify certificate, HTTP 200, title/copy, security headers, working buttons, and a forbidden attempt to access any child-specific information. Confirm production deployment commit matches the tested SHA.
5. If health or privacy checks fail, **do not** switch traffic; if a switch already occurred, roll back just the parent hostname/domain binding to the last verified target, leaving all other records untouched.

The site deliberately has no server-side child information. Parent account linking must remain disabled until the backend authorization contract in `PARENT_PORTAL.md` is implemented and tested.
