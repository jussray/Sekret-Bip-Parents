# Parent privacy & access contract

Public parent app must never be a mirror of the Teen Side. Only parent-role authenticated accounts linked through a verified consent-aware relationship may see specifically shared records. Raw teen private journals, voice notes, mood history, private conversations and unrelated Circle data are excluded by default.

Enforce authorization on each API request and in Supabase RLS, not only React navigation. Test missing/wrong role, unlinked, revoked, blocked, deleted, cross-account, offline, stale session, notification and device cache cases. Revocation and sign-out clear all local linked data. No service role key in clients, no copied teen data, and no private test data in public GitHub. Public promotional shell, if any, must expose no account state.

Any newly deployed parent portal is held at nonfunctional public landing until these checks pass.
