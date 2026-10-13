-- Only explicitly designated viewers can inspect leader signup status.
BEGIN;
CREATE TABLE IF NOT EXISTS public.training_leader_status_viewers (
 email text NOT NULL, app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 PRIMARY KEY(email,app_scope)
);
ALTER TABLE public.training_leader_status_viewers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.training_leader_status_viewers FROM anon,authenticated;
CREATE OR REPLACE FUNCTION public.training_can_view_leader_status(p_scope text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.training_is_leader(p_scope) AND EXISTS(
 SELECT 1 FROM public.training_leader_status_viewers v
 WHERE v.email=public.training_current_email() AND v.app_scope=p_scope)
$$;
REVOKE ALL ON FUNCTION public.training_can_view_leader_status(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_can_view_leader_status(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.training_leader_account_status(p_scope text)
RETURNS TABLE(display_name text,email text,account_status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF p_scope IS NULL OR p_scope NOT IN ('boh','foh') OR NOT public.training_can_view_leader_status(p_scope) THEN
  RAISE EXCEPTION 'Account-status viewer access required for this app';
 END IF;
 RETURN QUERY
 SELECT l.display_name,l.email,
  CASE WHEN EXISTS(SELECT 1 FROM auth.users u WHERE lower(u.email)=l.email AND u.email_confirmed_at IS NOT NULL) THEN 'confirmed'
       WHEN EXISTS(SELECT 1 FROM auth.users u WHERE lower(u.email)=l.email) THEN 'awaiting_confirmation'
       ELSE 'not_signed_up' END
 FROM public.training_app_leaders l WHERE l.app_scope=p_scope
 ORDER BY l.display_name,l.email;
END $$;
REVOKE ALL ON FUNCTION public.training_leader_account_status(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_leader_account_status(text) TO authenticated;
COMMIT;
