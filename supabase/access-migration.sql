-- Run as the Supabase project administrator BEFORE deploying sign-in code.
-- Preserves training rows and snapshots existing policies for recovery.
-- Authentication: enable Email provider, Confirm Email, and configure SMTP.
-- Add BOTH app URLs to Authentication > URL Configuration > Redirect URLs.
BEGIN;
CREATE TABLE IF NOT EXISTS public.training_app_leaders (
 email text NOT NULL CHECK(email=lower(email)),
 app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 display_name text NOT NULL,
 PRIMARY KEY(email,app_scope)
);
CREATE TABLE IF NOT EXISTS public.training_app_access_admins (
 email text NOT NULL CHECK(email=lower(email)),
 app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 PRIMARY KEY(email,app_scope)
);
ALTER TABLE public.training_app_access_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.training_app_access_admins FROM anon,authenticated;
CREATE TABLE IF NOT EXISTS public.training_app_members (
 email text NOT NULL CHECK(email=lower(email)),
 app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 team_member text NOT NULL CHECK(length(trim(team_member))>0 AND team_member NOT LIKE 'FOH::%'),
 PRIMARY KEY(email,app_scope), UNIQUE(app_scope,team_member)
);
ALTER TABLE public.training_app_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_app_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.training_app_leaders,public.training_app_members FROM anon,authenticated;
GRANT SELECT ON public.training_app_leaders,public.training_app_members TO authenticated;

CREATE OR REPLACE FUNCTION public.training_current_email() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT lower(email) FROM auth.users WHERE id=auth.uid() AND email_confirmed_at IS NOT NULL $$;
CREATE OR REPLACE FUNCTION public.training_is_leader(p_scope text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT EXISTS(SELECT 1 FROM public.training_app_leaders WHERE email=public.training_current_email() AND app_scope=p_scope) $$;
CREATE OR REPLACE FUNCTION public.training_can_read_progress(p_name text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT public.training_is_leader(CASE WHEN p_name LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END)
 OR EXISTS(SELECT 1 FROM public.training_app_members m WHERE m.email=public.training_current_email()
 AND m.app_scope=CASE WHEN p_name LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END
 AND m.team_member=CASE WHEN p_name LIKE 'FOH::%' THEN substring(p_name FROM 6) ELSE p_name END) $$;
CREATE OR REPLACE FUNCTION public.training_has_access(p_scope text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT public.training_is_leader(p_scope) OR EXISTS(SELECT 1 FROM public.training_app_members WHERE email=public.training_current_email() AND app_scope=p_scope) $$;
CREATE OR REPLACE FUNCTION public.training_can_manage_leaders(p_scope text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT public.training_is_leader(p_scope) AND EXISTS(SELECT 1 FROM public.training_app_access_admins WHERE email=public.training_current_email() AND app_scope=p_scope) $$;
CREATE OR REPLACE FUNCTION public.training_grant_leader(p_scope text,p_name text,p_email text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF p_scope NOT IN ('boh','foh') OR NOT public.training_can_manage_leaders(p_scope) THEN RAISE EXCEPTION 'Only designated access administrators can grant leader access'; END IF;
 p_name=trim(p_name);p_email=lower(trim(p_email));
 IF p_name IS NULL OR p_name='' OR p_email IS NULL OR p_email NOT LIKE '%_@_%._%' THEN RAISE EXCEPTION 'Enter a valid name and email'; END IF;
 INSERT INTO public.training_app_leaders(email,app_scope,display_name) VALUES(p_email,p_scope,p_name)
 ON CONFLICT(email,app_scope) DO UPDATE SET display_name=excluded.display_name;
END $$;
REVOKE ALL ON FUNCTION public.training_can_manage_leaders(text),public.training_grant_leader(text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_can_manage_leaders(text),public.training_grant_leader(text,text,text) TO authenticated;
CREATE OR REPLACE FUNCTION public.training_my_access()
RETURNS TABLE(app_scope text,is_leader boolean,display_name text,team_member text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT scope,public.training_is_leader(scope),coalesce(l.display_name,m.team_member),m.team_member
 FROM (VALUES ('boh'::text),('foh'::text)) AS apps(scope)
 LEFT JOIN public.training_app_leaders l ON l.app_scope=scope AND l.email=public.training_current_email()
 LEFT JOIN public.training_app_members m ON m.app_scope=scope AND m.email=public.training_current_email() $$;

CREATE TABLE IF NOT EXISTS public.training_access_policy_backup (
 schemaname text,tablename text,policyname text,roles name[],cmd text,qual text,with_check text,
 PRIMARY KEY(schemaname,tablename,policyname)
);
REVOKE ALL ON public.training_access_policy_backup FROM anon,authenticated;
INSERT INTO public.training_access_policy_backup
SELECT schemaname,tablename,policyname,roles,cmd,qual,with_check FROM pg_policies
WHERE schemaname='public' AND tablename IN ('boh_training','training_content') ON CONFLICT DO NOTHING;
DO $$ DECLARE policy record; BEGIN
 FOR policy IN SELECT schemaname,tablename,policyname FROM pg_policies
 WHERE schemaname='public' AND tablename IN ('boh_training','training_content','training_app_leaders','training_app_members') LOOP
 EXECUTE format('DROP POLICY %I ON %I.%I',policy.policyname,policy.schemaname,policy.tablename);
 END LOOP;
END $$;
CREATE POLICY leader_reads_own_role ON public.training_app_leaders FOR SELECT TO authenticated
USING(email=public.training_current_email() OR public.training_can_manage_leaders(app_scope));
CREATE POLICY member_links_visible ON public.training_app_members FOR SELECT TO authenticated
USING(email=public.training_current_email() OR public.training_is_leader(app_scope));

ALTER TABLE public.boh_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_content ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.boh_training,public.training_content FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.boh_training,public.training_content TO authenticated;
CREATE POLICY progress_read ON public.boh_training FOR SELECT TO authenticated
USING(public.training_can_read_progress(team_member));
CREATE POLICY progress_insert ON public.boh_training FOR INSERT TO authenticated
WITH CHECK(public.training_is_leader(CASE WHEN team_member LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY progress_update ON public.boh_training FOR UPDATE TO authenticated
USING(public.training_is_leader(CASE WHEN team_member LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END))
WITH CHECK(public.training_is_leader(CASE WHEN team_member LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY progress_delete ON public.boh_training FOR DELETE TO authenticated
USING(public.training_is_leader(CASE WHEN team_member LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY content_read ON public.training_content FOR SELECT TO authenticated
USING(public.training_has_access(CASE WHEN section LIKE 'foh-%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY content_insert ON public.training_content FOR INSERT TO authenticated
WITH CHECK(public.training_is_leader(CASE WHEN section LIKE 'foh-%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY content_update ON public.training_content FOR UPDATE TO authenticated
USING(public.training_is_leader(CASE WHEN section LIKE 'foh-%' THEN 'foh' ELSE 'boh' END))
WITH CHECK(public.training_is_leader(CASE WHEN section LIKE 'foh-%' THEN 'foh' ELSE 'boh' END));
CREATE POLICY content_delete ON public.training_content FOR DELETE TO authenticated
USING(public.training_is_leader(CASE WHEN section LIKE 'foh-%' THEN 'foh' ELSE 'boh' END));

CREATE OR REPLACE FUNCTION public.training_link_member(p_scope text,p_name text,p_email text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE record_name text; BEGIN
 IF p_scope NOT IN ('boh','foh') OR NOT public.training_is_leader(p_scope) THEN RAISE EXCEPTION 'Leader access required'; END IF;
 p_name=trim(p_name);p_email=lower(trim(p_email));
 IF p_name IS NULL OR p_name='' OR p_name LIKE 'FOH::%' OR p_email IS NULL OR p_email NOT LIKE '%_@_%._%' THEN RAISE EXCEPTION 'Enter a valid name and email'; END IF;
 IF EXISTS(SELECT 1 FROM public.training_app_members WHERE app_scope=p_scope AND email=p_email AND team_member<>p_name) THEN RAISE EXCEPTION 'That email is already linked to another team member'; END IF;
 record_name=CASE WHEN p_scope='foh' THEN 'FOH::'||p_name ELSE p_name END;
 IF NOT EXISTS(SELECT 1 FROM public.boh_training WHERE team_member=record_name) THEN
 INSERT INTO public.boh_training(team_member,progress) VALUES(record_name,'{}'::jsonb); END IF;
 DELETE FROM public.training_app_members WHERE app_scope=p_scope AND team_member=p_name AND email<>p_email;
 INSERT INTO public.training_app_members(email,app_scope,team_member) VALUES(p_email,p_scope,p_name)
 ON CONFLICT(email,app_scope) DO UPDATE SET team_member=excluded.team_member;
END $$;
CREATE OR REPLACE FUNCTION public.training_delete_member(p_scope text,p_name text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF p_scope NOT IN ('boh','foh') OR NOT public.training_is_leader(p_scope) THEN RAISE EXCEPTION 'Leader access required'; END IF;
 DELETE FROM public.boh_training WHERE team_member=CASE WHEN p_scope='foh' THEN 'FOH::'||p_name ELSE p_name END;
 DELETE FROM public.training_app_members WHERE app_scope=p_scope AND team_member=p_name;
END $$;
REVOKE ALL ON FUNCTION public.training_current_email(),public.training_is_leader(text),public.training_can_read_progress(text),public.training_has_access(text),public.training_my_access(),public.training_link_member(text,text,text),public.training_delete_member(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.training_current_email(),public.training_is_leader(text),public.training_can_read_progress(text),public.training_has_access(text),public.training_my_access(),public.training_link_member(text,text,text),public.training_delete_member(text,text) TO authenticated;
-- Grant only the sequences owned by these two existing tables, if needed.
DO $$ DECLARE seq text; BEGIN
 FOR seq IN SELECT pg_get_serial_sequence('public.'||t.name,'id') FROM (VALUES ('boh_training'),('training_content')) AS t(name) LOOP
 IF seq IS NOT NULL THEN EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated',seq); END IF;
 END LOOP;
END $$;
COMMIT;
-- Insert the approved leader roster using the private setup file.
-- Never publish personal email addresses in this public GitHub repository.
