-- Staging-only hardening proposal. DO NOT RUN AGAINST PRODUCTION BY DEFAULT.
-- This only strengthens the existing PARENT SELECT policies; teen owner
-- SELECT policies and all insert/update/revocation flows are unchanged.
-- Requires separate verified and unverified guardian staging identities,
-- cross-family/revoked/expired share negative tests, owner approval and rollback.
BEGIN;

ALTER POLICY bridge_share_requests_parent_select
ON public.bridge_share_requests
TO authenticated
USING (
  public.is_non_anonymous_user()
  AND public.is_verified_guardian()
  AND parent_user_id = (SELECT auth.uid())
  AND status IN ('ready', 'viewed')
  AND revoked_at IS NULL
  AND (expires_at IS NULL OR expires_at > now())
  AND EXISTS (
    SELECT 1 FROM public.parent_links AS pl
    WHERE pl.teen_user_id = bridge_share_requests.teen_user_id
      AND pl.parent_user_id = (SELECT auth.uid())
      AND pl.status = 'active'
      AND pl.is_active = true
  )
);

ALTER POLICY bridge_summaries_parent_select
ON public.bridge_summaries
TO authenticated
USING (
  public.is_non_anonymous_user()
  AND public.is_verified_guardian()
  AND EXISTS (
    SELECT 1 FROM public.bridge_share_requests AS r
    JOIN public.parent_links AS pl
      ON pl.teen_user_id = r.teen_user_id
     AND pl.parent_user_id = r.parent_user_id
    WHERE r.id = bridge_summaries.request_id
      AND r.parent_user_id = (SELECT auth.uid())
      AND r.status IN ('ready', 'viewed')
      AND r.revoked_at IS NULL
      AND (r.expires_at IS NULL OR r.expires_at > now())
      AND pl.status = 'active'
      AND pl.is_active = true
  )
);

COMMIT;
