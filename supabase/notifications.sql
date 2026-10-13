-- Apply after access-migration.sql and access-requests.sql.
-- Configure the single recipient privately; no roster emails belong in this repo.
BEGIN;
CREATE TABLE IF NOT EXISTS public.training_notification_settings (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 owner_email text NOT NULL CHECK(owner_email=lower(owner_email)),
 vapid_public_key text NOT NULL
);
CREATE TABLE IF NOT EXISTS public.training_notifications (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 app_scope text NOT NULL CHECK(app_scope IN ('boh','foh')),
 message text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 read_at timestamptz
);
CREATE TABLE IF NOT EXISTS public.training_push_subscriptions (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 endpoint text NOT NULL UNIQUE,
 subscription jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.training_push_deliveries (
 notification_id bigint REFERENCES public.training_notifications ON DELETE CASCADE,
 subscription_id bigint REFERENCES public.training_push_subscriptions ON DELETE CASCADE,
 attempts integer NOT NULL DEFAULT 0,
 lease_until timestamptz,
 sent_at timestamptz,
 PRIMARY KEY(notification_id,subscription_id)
);
ALTER TABLE public.training_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_push_deliveries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.training_notification_settings,public.training_notifications,public.training_push_subscriptions,public.training_push_deliveries FROM anon,authenticated;
-- Administrator recipient/key changes invalidate devices enrolled under old settings.
CREATE OR REPLACE FUNCTION public.training_reset_push_devices() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF TG_OP='DELETE' OR OLD.owner_email IS DISTINCT FROM NEW.owner_email OR OLD.vapid_public_key IS DISTINCT FROM NEW.vapid_public_key THEN
  DELETE FROM public.training_push_subscriptions;
 END IF;
 RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS training_reset_push ON public.training_notification_settings;
CREATE TRIGGER training_reset_push AFTER UPDATE OR DELETE ON public.training_notification_settings
 FOR EACH ROW EXECUTE FUNCTION public.training_reset_push_devices();
REVOKE ALL ON FUNCTION public.training_reset_push_devices() FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.training_is_notification_owner() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM public.training_notification_settings WHERE owner_email=public.training_current_email())
 AND (public.training_is_leader('boh') OR public.training_is_leader('foh'))
$$;
GRANT SELECT ON public.training_notifications TO authenticated;
DROP POLICY IF EXISTS notification_owner_read ON public.training_notifications;
CREATE POLICY notification_owner_read ON public.training_notifications FOR SELECT TO authenticated
 USING(public.training_is_notification_owner() AND public.training_is_leader(app_scope));
CREATE OR REPLACE FUNCTION public.training_notification_config() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT CASE WHEN public.training_is_notification_owner() THEN
 (SELECT jsonb_build_object('owner',true,'publicKey',vapid_public_key) FROM public.training_notification_settings)
 ELSE jsonb_build_object('owner',false) END
$$;
CREATE OR REPLACE FUNCTION public.training_mark_notifications_read(p_ids bigint[]) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF NOT public.training_is_notification_owner() THEN RAISE EXCEPTION 'Private notifications'; END IF;
 UPDATE public.training_notifications SET read_at=now() WHERE id=ANY(p_ids) AND read_at IS NULL AND public.training_is_leader(app_scope);
END $$;
CREATE OR REPLACE FUNCTION public.training_subscribe_push(p_subscription jsonb) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE push_endpoint text; BEGIN
 IF NOT public.training_is_notification_owner() THEN RAISE EXCEPTION 'Private notifications'; END IF;
 push_endpoint=p_subscription->>'endpoint';
 IF push_endpoint IS NULL OR length(push_endpoint)>4096 OR push_endpoint !~ '^https://(web\.push\.apple\.com|fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+\.notify\.windows\.com)/' OR
 coalesce(length(p_subscription#>>'{keys,p256dh}'),0) NOT BETWEEN 80 AND 100 OR coalesce(length(p_subscription#>>'{keys,auth}'),0) NOT BETWEEN 20 AND 30 THEN RAISE EXCEPTION 'Invalid push subscription'; END IF;
 INSERT INTO public.training_push_subscriptions(endpoint,subscription) VALUES(push_endpoint,p_subscription)
 ON CONFLICT(endpoint) DO UPDATE SET subscription=excluded.subscription;
END $$;
CREATE OR REPLACE FUNCTION public.training_unsubscribe_push(p_endpoint text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
 IF NOT public.training_is_notification_owner() THEN RAISE EXCEPTION 'Private notifications'; END IF;
 DELETE FROM public.training_push_subscriptions WHERE endpoint=p_endpoint;
END $$;
-- Database triggers catch changes from either app and avoid notifications on no-op saves.
CREATE OR REPLACE FUNCTION public.training_capture_notification() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE item jsonb; scope text; label text; event_id bigint;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.training_notification_settings) THEN RETURN NULL; END IF;
 IF TG_OP='UPDATE' AND to_jsonb(OLD)=to_jsonb(NEW) THEN RETURN NULL; END IF;
 item=CASE WHEN TG_OP='DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
 IF TG_TABLE_NAME='boh_training' THEN
  IF TG_OP='UPDATE' AND OLD.progress IS NOT DISTINCT FROM NEW.progress AND OLD.team_member IS NOT DISTINCT FROM NEW.team_member THEN RETURN NULL; END IF;
  scope=CASE WHEN item->>'team_member' LIKE 'FOH::%' THEN 'foh' ELSE 'boh' END;
  label=regexp_replace(item->>'team_member','^FOH::','')||CASE TG_OP WHEN 'INSERT' THEN ' — new training record' WHEN 'DELETE' THEN ' — training record deleted' ELSE ' — training progress updated' END;
 ELSIF TG_TABLE_NAME='training_content' THEN
  -- Ignore timestamp-only content saves. Never copy photo data into notifications.
  IF TG_OP='UPDATE' AND (to_jsonb(OLD)-'updated_at')=(to_jsonb(NEW)-'updated_at') THEN RETURN NULL; END IF;
  scope=CASE WHEN item->>'section' LIKE 'foh-%' THEN 'foh' ELSE 'boh' END;
  label=CASE WHEN item->>'title' LIKE '__%photo__:%' THEN 'Training photos' ELSE 'Training content' END||CASE TG_OP WHEN 'INSERT' THEN ' added' WHEN 'DELETE' THEN ' deleted' ELSE ' updated' END;
 ELSE
  scope=item->>'app_scope';
  IF TG_TABLE_NAME='training_access_requests' THEN
   label=item->>'requested_name'||CASE WHEN item->>'status'='pending' THEN ' — access requested' ELSE ' — access request '||(item->>'status') END;
  ELSIF TG_TABLE_NAME='training_app_members' THEN
   label=item->>'team_member'||CASE TG_OP WHEN 'INSERT' THEN ' — team member linked' WHEN 'DELETE' THEN ' — team member removed' ELSE ' — team member link updated' END;
  ELSE
   label=item->>'display_name'||CASE TG_OP WHEN 'INSERT' THEN ' — leader added' WHEN 'DELETE' THEN ' — leader removed' ELSE ' — leader details updated' END;
  END IF;
 END IF;
 INSERT INTO public.training_notifications(app_scope,message) VALUES(scope,left(label,240)) RETURNING id INTO event_id;
 INSERT INTO public.training_push_deliveries(notification_id,subscription_id)
 SELECT event_id,id FROM public.training_push_subscriptions;
 RETURN NULL;
END $$;
DO $$ DECLARE tab text; BEGIN
 FOREACH tab IN ARRAY ARRAY['boh_training','training_content','training_access_requests','training_app_members','training_app_leaders'] LOOP
 EXECUTE format('DROP TRIGGER IF EXISTS training_notify ON public.%I',tab);
 EXECUTE format('CREATE TRIGGER training_notify AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.training_capture_notification()',tab);
 END LOOP;
END $$;
-- Worker leases deliveries atomically; retries are bounded. Existing unread bell events remain.
CREATE OR REPLACE FUNCTION public.training_claim_push() RETURNS TABLE(notification_id bigint,subscription_id bigint,subscription jsonb,app_scope text)
LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 WITH picked AS (
 SELECT d.notification_id,d.subscription_id FROM public.training_push_deliveries d
 JOIN public.training_notifications n ON n.id=d.notification_id
 WHERE d.sent_at IS NULL AND d.attempts<5 AND (d.lease_until IS NULL OR d.lease_until<now())
 AND n.created_at>now()-interval '24 hours'
 AND EXISTS(SELECT 1 FROM public.training_notification_settings c JOIN public.training_app_leaders l ON l.email=c.owner_email AND l.app_scope=n.app_scope)
 ORDER BY d.notification_id LIMIT 10 FOR UPDATE OF d SKIP LOCKED
 ), claimed AS (
 UPDATE public.training_push_deliveries d SET attempts=d.attempts+1,lease_until=now()+interval '2 minutes'
 FROM picked p WHERE d.notification_id=p.notification_id AND d.subscription_id=p.subscription_id RETURNING d.*
 ) SELECT d.notification_id,d.subscription_id,s.subscription,n.app_scope FROM claimed d
 JOIN public.training_notifications n ON n.id=d.notification_id JOIN public.training_push_subscriptions s ON s.id=d.subscription_id
$$;
REVOKE ALL ON FUNCTION public.training_is_notification_owner(),public.training_notification_config(),public.training_mark_notifications_read(bigint[]),public.training_subscribe_push(jsonb),public.training_unsubscribe_push(text),public.training_capture_notification(),public.training_claim_push() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.training_is_notification_owner(),public.training_notification_config(),public.training_mark_notifications_read(bigint[]),public.training_subscribe_push(jsonb),public.training_unsubscribe_push(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.training_claim_push() TO service_role;
GRANT SELECT,UPDATE,DELETE ON public.training_push_deliveries,public.training_push_subscriptions TO service_role;
COMMIT;
