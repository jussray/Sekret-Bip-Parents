-- PROPOSED SECURITY FIX ONLY: NOT APPLIED TO SHARED PRODUCTION DATABASE.
-- Confirm tenant schema, run negative RLS tests under separate guardian/teen test
-- users, capture rollback and explicit review before any migration is applied.
BEGIN;

DROP POLICY IF EXISTS "bridge_signals: linked parent read" ON public.bridge_signals;

CREATE POLICY bridge_signals_parent_select_consent_v2
ON public.bridge_signals
FOR SELECT
TO authenticated
USING (
  public.is_non_anonymous_user()
  AND public.is_verified_guardian()
  AND revoked_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.parent_links AS pl
    WHERE pl.teen_user_id = bridge_signals.teen_user_id
      AND pl.parent_user_id = (SELECT auth.uid())
      AND pl.status = 'active'
      AND pl.is_active = true
  )
);

COMMIT;
