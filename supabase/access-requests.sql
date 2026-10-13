-- Verified members request access; scoped leaders approve against training records.
BEGIN;
CREATE TABLE IF NOT EXISTS public.training_access_requests (
 email text NOT NULL,
 app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 requested_name text NOT NULL CHECK(length(trim(requested_name)) BETWEEN 1 AND 120),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','declined')),
 requested_at timestamptz NOT NULL DEFAULT now(),
 reviewed_at timestamptz,
 PRIMARY KEY(email,app_scope)
);
ALTER TABLE public.training_access_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.training_access_requests FROM anon,authenticated;
GRANT SELECT ON public.training_access_requests TO authenticated;
DROP POLICY IF EXISTS access_requests_read ON public.training_access_requests;
CREATE POLICY access_requests_read ON public.training_access_requests FOR SELECT TO authenticated
 USING(email=public.training_current_email() OR public.training_is_leader(app_scope));
CREATE OR REPLACE FUNCTION public.training_request_access(p_scopes text[],p_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE current_email text; scope text;
BEGIN
 current_email=public.training_current_email();
 IF current_email IS NULL THEN RAISE EXCEPTION 'Confirm your email before requesting access'; END IF;
 p_name=trim(p_name);
 IF p_name IS NULL OR length(p_name) NOT BETWEEN 1 AND 120 OR p_scopes IS NULL OR cardinality(p_scopes) NOT BETWEEN 1 AND 2 OR EXISTS(SELECT 1 FROM unnest(p_scopes) s WHERE s IS NULL OR s NOT IN ('boh','foh')) THEN RAISE EXCEPTION 'Enter your name and select BOH, FOH, or both'; END IF;
 FOREACH scope IN ARRAY p_scopes LOOP
  IF NOT public.training_has_access(scope) THEN
   INSERT INTO public.training_access_requests(email,app_scope,requested_name) VALUES(current_email,scope,p_name)
   ON CONFLICT(email,app_scope) DO UPDATE SET requested_name=excluded.requested_name,status='pending',requested_at=now(),reviewed_at=NULL
   WHERE training_access_requests.status<>'pending';
  END IF;
 END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.training_review_access(p_scope text,p_email text,p_approve boolean,p_name text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE pending public.training_access_requests;
BEGIN
 IF p_scope IS NULL OR p_scope NOT IN ('boh','foh') OR NOT public.training_is_leader(p_scope) THEN RAISE EXCEPTION 'Leader access required for this app'; END IF;
 p_email=lower(trim(p_email));
 SELECT * INTO pending FROM public.training_access_requests WHERE email=p_email AND app_scope=p_scope FOR UPDATE;
 IF NOT FOUND OR pending.status<>'pending' THEN RAISE EXCEPTION 'This request is no longer pending'; END IF;
 IF p_approve IS NULL THEN RAISE EXCEPTION 'Choose Approve or Decline'; END IF;
 IF p_approve THEN
  IF p_name IS NULL OR trim(p_name)='' THEN RAISE EXCEPTION 'Choose an existing training name or enter a new name'; END IF;
  -- Never replace another member's link via approval.
  IF EXISTS(SELECT 1 FROM public.training_app_members WHERE app_scope=p_scope AND team_member=trim(p_name) AND email<>p_email) THEN RAISE EXCEPTION 'That training record is already linked to another email'; END IF;
  IF EXISTS(SELECT 1 FROM public.training_app_members WHERE app_scope=p_scope AND email=p_email AND team_member<>trim(p_name)) THEN RAISE EXCEPTION 'This email is already linked to a different training record'; END IF;
  INSERT INTO public.training_app_members(email,app_scope,team_member) VALUES(p_email,p_scope,trim(p_name))
   ON CONFLICT(email,app_scope) DO NOTHING;
  -- Unique scope/name constraint also protects simultaneous approvals.
  IF NOT EXISTS(SELECT 1 FROM public.boh_training WHERE team_member=CASE WHEN p_scope='foh' THEN 'FOH::'||trim(p_name) ELSE trim(p_name) END) THEN
   INSERT INTO public.boh_training(team_member,progress) VALUES(CASE WHEN p_scope='foh' THEN 'FOH::'||trim(p_name) ELSE trim(p_name) END,'{}'::jsonb);
  END IF;
 END IF;
 UPDATE public.training_access_requests SET status=CASE WHEN p_approve THEN 'approved' ELSE 'declined' END,reviewed_at=now() WHERE email=p_email AND app_scope=p_scope;
END $$;
REVOKE ALL ON FUNCTION public.training_request_access(text[],text),public.training_review_access(text,text,boolean,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_request_access(text[],text),public.training_review_access(text,text,boolean,text) TO authenticated;
COMMIT;
