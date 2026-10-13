-- Title editing is reserved for the privately designated account-status owner.
BEGIN;
CREATE OR REPLACE FUNCTION public.training_set_leader_title(p_scope text,p_email text,p_title text,p_both boolean DEFAULT true)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF p_scope IS NULL OR p_scope NOT IN ('boh','foh') OR NOT public.training_can_view_leader_status(p_scope) THEN
  RAISE EXCEPTION 'Only the designated account owner can edit leader titles';
 END IF;
 p_email=lower(trim(p_email));p_title=trim(p_title);
 IF p_title IS NULL OR length(p_title) NOT BETWEEN 1 AND 80 OR p_both IS NULL THEN RAISE EXCEPTION 'Enter a job title of 1 to 80 characters'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.training_app_leaders WHERE email=p_email AND app_scope=p_scope) THEN RAISE EXCEPTION 'This leader is not assigned to this app'; END IF;
 IF p_both AND EXISTS(SELECT 1 FROM public.training_app_leaders l WHERE l.email=p_email AND NOT public.training_can_view_leader_status(l.app_scope)) THEN RAISE EXCEPTION 'You cannot edit titles in the other app'; END IF;
 UPDATE public.training_app_leaders SET job_title=p_title WHERE email=p_email AND (p_both OR app_scope=p_scope);
END $$;
REVOKE ALL ON FUNCTION public.training_set_leader_title(text,text,text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_set_leader_title(text,text,text,boolean) TO authenticated;
COMMIT;
