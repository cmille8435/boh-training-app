Backend activation completed October 13, 2026: owner configured privately, migration applied, sender deployed, and delivery scheduled each minute. Authorized sender request returned HTTP 200; unauthorized request returned HTTP 401. The owner must still enable phone alerts on her Home Screen app, and actual phone receipt remains to be confirmed.

The following steps document the setup for maintenance or recovery.

1. Apply `supabase/notifications.sql` after the existing access migrations. It does not alter training permissions or copy historical changes into notifications.
2. Generate VAPID keys with `web-push` and a random dispatch secret. Set Edge Function secrets `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (an administrator mailto address), and `PUSH_DISPATCH_SECRET`. Keep private keys and recipient addresses out of GitHub.
3. Privately insert one settings row containing Chelsea's verified existing sign-in email and the VAPID public key. This table has no client read/write grants. No other leader can configure a recipient, read her notifications, or subscribe a device.
4. Deploy the `training-push` Edge Function. It disables Supabase JWT verification for the scheduler and verifies its own private dispatch header. Never expose that header secret in app code.
5. Enable pg_cron and pg_net. Store the dispatch secret in Supabase Vault as `training_push_dispatch`. Schedule the following SQL every minute, substituting the existing project reference for PROJECT_REF. Do not insert a service-role key into cron SQL.

```sql
select net.http_post(
 url := 'https://PROJECT_REF.supabase.co/functions/v1/training-push',
 headers := jsonb_build_object('Content-Type','application/json',
   'x-training-dispatch',(select decrypted_secret from vault.decrypted_secrets where name='training_push_dispatch' limit 1)),
 body := '{}'::jsonb
);
```

6. Merge/deploy the app changes. Sign in as Chelsea. The private bell shows both apps' access requests/reviews, team links/removals, training record/progress changes, content/photo changes, and leader changes. Other accounts see no bell; RLS and RPC checks also deny access.
7. On Chelsea's iPhone, open a Home Screen copy of the app, open Notifications, and tap Enable Phone Alerts, then Allow. Either app uses the same shared service worker and subscription; a second registration does not duplicate a subscription. Delivery runs about once per minute, with bounded retries. Training details remain inside the authenticated app, off the lock screen. Device subscriptions persist across app sign-out until Chelsea turns phone alerts off on that device.
8. Validate a real FOH and BOH change, a closed-app phone delivery, both bells, read-state sync, and a non-owner account denied subscription and read access. Do not claim phone delivery verified until Chelsea confirms her device received a test alert.

Validation: `npm test --prefix tests` and `node tests/notifications.cjs`. The latter tests owner isolation, unverified-user denial, both app event capture, no-op suppression, shared read state, forbidden subscriptions, and private worker leasing. Live activation/device delivery require administrator access.
