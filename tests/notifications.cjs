const fs=require('fs'),assert=require('assert/strict');
const {PGlite}=require('@electric-sql/pglite');
const {JSDOM}=require('jsdom');
const root=require('path').resolve(__dirname,'..')+'/';
async function main(){
 const db=new PGlite();
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 GRANT USAGE ON SCHEMA auth TO anon,authenticated;
 CREATE TABLE boh_training(id serial PRIMARY KEY,team_member text,progress jsonb);
 CREATE TABLE training_content(id serial PRIMARY KEY,section text,title text,description text);`);
 for(const name of ['access-migration','access-requests','notifications','notifications'])await db.exec(fs.readFileSync(root+'supabase/'+name+'.sql','utf8'));
 const id=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
 await db.exec(`INSERT INTO auth.users VALUES('${id(1)}','owner@test.com',now()),('${id(2)}','leader@test.com',now()),('${id(3)}','member@test.com',now()),('${id(4)}','unverified@test.com',null);
 INSERT INTO training_app_leaders VALUES('owner@test.com','boh','Owner'),('owner@test.com','foh','Owner'),('leader@test.com','boh','Leader'),('unverified@test.com','boh','Unverified');
 INSERT INTO training_app_members VALUES('member@test.com','boh','Member');
 INSERT INTO training_notification_settings(owner_email,vapid_public_key) VALUES('owner@test.com','public-key');`);
 async function as(n,sql){await db.exec('RESET ROLE');await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id(n)]);await db.exec('SET ROLE authenticated');return (await db.query(sql)).rows;}
 assert.equal((await as(1,'SELECT training_notification_config() AS config'))[0].config.owner,true);
 assert.equal((await as(2,'SELECT training_notification_config() AS config'))[0].config.owner,false);
 await assert.rejects(()=>as(2,"UPDATE training_notification_settings SET owner_email='leader@test.com'"));
 await as(2,`INSERT INTO boh_training(team_member,progress) VALUES('Member','{}')`);
 await as(1,`INSERT INTO boh_training(team_member,progress) VALUES('FOH::Member','{}')`);
 await as(2,`UPDATE boh_training SET progress='{"station:item":true}' WHERE team_member='Member'`);
 await as(1,`INSERT INTO training_content(section,title,description) VALUES('foh-station','__foh_photo__:1','PRIVATE IMAGE BYTES')`);
 await as(3,"SELECT training_request_access(ARRAY['boh','foh'],'Member')");
 const events=await as(1,'SELECT * FROM training_notifications ORDER BY id');
 assert.equal(events.length,5); // BOH already linked, only FOH request is inserted.
 assert.ok(events.some(e=>e.app_scope==='foh'));
 assert.ok(events.some(e=>e.message.includes('progress updated')));
 assert.ok(events.every(e=>!e.message.includes('PRIVATE IMAGE BYTES')));
 await as(2,`UPDATE boh_training SET progress='{"station:item":true}' WHERE team_member='Member'`);
 assert.equal((await as(1,'SELECT * FROM training_notifications')).length,5);
 for(const n of [2,3,4]){
  assert.equal((await as(n,'SELECT * FROM training_notifications')).length,0);
  await assert.rejects(()=>as(n,'SELECT training_mark_notifications_read(ARRAY[1]::bigint[])'));
  await assert.rejects(()=>as(n,`SELECT training_subscribe_push('{}')`));
  await assert.rejects(()=>as(n,'SELECT * FROM training_claim_push()'));
 }
 await as(1,'SELECT training_mark_notifications_read(ARRAY[1]::bigint[])');
 assert.ok((await as(1,'SELECT read_at FROM training_notifications WHERE id=1'))[0].read_at);
 const subscription={endpoint:'https://web.push.apple.com/example',keys:{p256dh:'A'.repeat(87),auth:'B'.repeat(22)}};
 await as(1,`SELECT training_subscribe_push('${JSON.stringify(subscription)}')`);
 await as(1,`SELECT training_subscribe_push('${JSON.stringify(subscription)}')`);
 await assert.rejects(()=>as(1,`SELECT training_subscribe_push('${JSON.stringify({...subscription,endpoint:'https://attacker.example/push'})}')`));
 await as(2,`UPDATE boh_training SET progress='{"station:item":false}' WHERE team_member='Member'`);
 await db.exec('RESET ROLE; SET ROLE service_role');
 assert.equal((await db.query('SELECT * FROM training_claim_push()')).rows.length,1);
 assert.equal((await db.query('SELECT * FROM training_claim_push()')).rows.length,0);
 await as(1,`SELECT training_unsubscribe_push('${subscription.endpoint}')`);
 await db.exec('RESET ROLE');assert.equal((await db.query('SELECT * FROM training_push_subscriptions')).rows.length,0);
 await db.exec('SET ROLE anon');await assert.rejects(()=>db.query('SELECT * FROM training_notifications'));
 await db.close();
 for(const scope of ['boh','foh']){
  const dom=new JSDOM('<script src="https://example.test/training-notifications.js"></script><div id="trainingAccount"></div>',{runScripts:'outside-only',url:'https://example.test/'+(scope==='foh'?'foh/':'')});
  Object.defineProperty(dom.window.document,'currentScript',{value:dom.window.document.querySelector('script')});
  dom.window.eval(fs.readFileSync(root+'training-notifications.js','utf8'));
  await dom.window.TrainingNotifications.start({request:async()=>({owner:false})});
  assert.equal(dom.window.document.getElementById('trainingNotificationsButton'),null);
  await dom.window.TrainingNotifications.start({request:async path=>path.startsWith('rpc/')?{owner:true,publicKey:'key'}:[{id:1}]});
  assert.ok(dom.window.document.getElementById('trainingNotificationsButton'));
  dom.window.TrainingNotifications.stop();
  assert.equal(dom.window.document.getElementById('trainingNotificationsButton'),null);
  dom.window.close();
 }
 console.log('PASS: private notifications, both scopes, no-op saves, read state, subscription isolation, delivery leases, both UI roles');
}
main().catch(error=>{console.error(error);process.exit(1);});
