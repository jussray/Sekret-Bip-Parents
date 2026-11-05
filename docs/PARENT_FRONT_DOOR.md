# Se’kret Bip Parent Front Door — public-entry contract

The public parent hostname **must only show a welcome page with Create Parent Account and Sign In links**. Do not render or initialize Parent Room, Pages, Coach, Bridge, Circle, private records, journal editors or prompt kits before account access.

The existing user-approved full parent features and original public portal were not removed: exact prior public blobs are saved in \`historical-parent-portal-20261022/\` on this production branch. A broader pinned parent source export remains in the separate draft PR #6.

## Account links

- Create Parent Account: https://app.sekretbip.net/signup?side=parent
- Sign In: https://app.sekretbip.net/login?side=parent

These go to **existing shared Se’kret Bip parent-side account routes** at the teen-app host, verified from the canonical Expo Router source. They do not mean the standalone parent host already has authentication. Server-side guardian verification and recipient-specific teen consent are still required before any private parent feature unlocks.

## Rules

- Public \`public/index.html\` is presentation and navigation links only.
- \`public/app.js\` is an inert placeholder; no JavaScript app state is initialized.
- Public \`public/styles.css\` is for the front-door page only.
- Protect this behavior with \`npm run check\`. No public account data, registration form, cookies, tracking, or submissions.
- Preserve all earlier app sources; never silently delete or replace their historical blobs.
- On a future authenticated parent app, grant routes **only** after verified session, guardian role and child-controlled item-specific authorization; hiding feature buttons is not sufficient.
