-- Only leaders can view signup status for leaders in their assigned app.
BEGIN;
CREATE OR REPLACE FUNCTION public.training_leader_account_status(p_scope text)
RETURNS TABLE(display_name text,email text,account_status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF p_scope IS NULL OR p_scope NOT IN ('boh','foh') OR NOT public.training_is_leader(p_scope) THEN
  RAISE EXCEPTION 'Leader access required for this app';
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
