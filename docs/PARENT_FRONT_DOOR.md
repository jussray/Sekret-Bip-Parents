# Parent front door — enforced public entry

Before verified account access, both parent.sekretbip.net and parents.sekretbip.net must serve **only a welcome screen, Create Parent Account, and Sign In**. Private Room, Pages, Coach, Bridge and Circle must not be visible or packaged on the public site.

The signup and login actions open the existing Se’kret Bip parent account routes at app.sekretbip.net/signup?side=parent and app.sekretbip.net/login?side=parent. This does not mean the standalone parent domain has completed identity integration.

The public Pages build now allowlists index.html, styles.css, an inert app.js, 404.html and _headers only. The original parent app's modular features remain preserved at public/features/ in the repository but are **excluded from deployment**. Original pre-correction portal sources are stored in preserved/live-portal-20261022/ and historical-parent-portal-20261022/. Nothing private unlocks until server-side guardian authorization, recipient-specific teen grants and revocation checks pass.

CI must validate exact build output. No future public release may reinstate app screens before authentication.
