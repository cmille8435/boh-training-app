const fs=require('fs'),assert=require('assert/strict');
const {PGlite}=require('@electric-sql/pglite');
const {JSDOM}=require('jsdom');
const root=require('path').resolve(__dirname,'..')+'/';
async function databaseTests(){
 const db=new PGlite();
 await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
 CREATE TABLE auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 GRANT USAGE ON SCHEMA auth TO authenticated,anon;
 CREATE TABLE public.boh_training(id serial primary key,team_member text,progress jsonb);
 CREATE TABLE public.training_content(id serial primary key,section text,title text);
 ALTER TABLE public.boh_training ENABLE ROW LEVEL SECURITY;
 CREATE POLICY old_anon_policy ON public.boh_training FOR ALL TO anon USING(true) WITH CHECK(true);`);
 await db.exec(fs.readFileSync(root+'supabase/access-migration.sql','utf8'));
 await db.exec(fs.readFileSync(root+'supabase/access-requests.sql','utf8'));
 await db.exec(fs.readFileSync(root+'supabase/access-requests.sql','utf8'));
 // Migration is rerunnable and retains its original policy backup.
 await db.exec(fs.readFileSync(root+'supabase/access-migration.sql','utf8'));
 await db.exec(`INSERT INTO auth.users VALUES
 ('00000000-0000-0000-0000-000000000001','leader@test.com',now()),
 ('00000000-0000-0000-0000-000000000002','member@test.com',now()),
 ('00000000-0000-0000-0000-000000000003','other@test.com',now()),
 ('00000000-0000-0000-0000-000000000004','unverified@test.com',null),
 ('00000000-0000-0000-0000-000000000005','fohleader@test.com',now()),
 ('00000000-0000-0000-0000-000000000006','fresh@test.com',now());
 INSERT INTO training_app_leaders VALUES ('leader@test.com','boh','Leader'),('unverified@test.com','boh','Unverified'),('fohleader@test.com','foh','FOH Leader');
 INSERT INTO training_app_access_admins VALUES ('leader@test.com','boh');
 INSERT INTO training_app_members VALUES ('member@test.com','boh','Member'),('other@test.com','boh','Other');
 INSERT INTO boh_training(team_member,progress) VALUES ('Member','{}'),('Other','{}'),('FOH::Member','{}');
 INSERT INTO training_content(section,title) VALUES ('station','BOH'),('foh-station','FOH');`);
 async function as(id,sql){await db.exec('RESET ROLE;');await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('SET ROLE authenticated;');return db.query(sql);}
 const id=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
 assert.deepEqual((await as(id(2),'SELECT team_member FROM boh_training ORDER BY team_member')).rows,[{team_member:'Member'}]);
 assert.equal((await as(id(2),"UPDATE boh_training SET progress='{}' RETURNING id")).rows.length,0);
 await assert.rejects(()=>as(id(2),"INSERT INTO training_app_leaders VALUES ('member@test.com','boh','Fake')"));
 await assert.rejects(()=>as(id(2),"SELECT training_link_member('boh','Other','member@test.com')"));
 await assert.rejects(()=>as(id(2),"INSERT INTO training_content(section,title) VALUES ('station','Tampered')"));
 assert.equal((await as(id(1),'SELECT * FROM boh_training')).rows.length,2);
 assert.equal((await as(id(1),'SELECT * FROM training_content')).rows.length,1);
 await assert.rejects(()=>as(id(1),"INSERT INTO boh_training(team_member,progress) VALUES ('FOH::Unauthorized','{}')"));
 await assert.rejects(()=>as(id(1),"UPDATE boh_training SET team_member='FOH::Changed' WHERE team_member='Member'"));
 await assert.rejects(()=>as(id(1),"SELECT training_delete_member('foh','Member')"));
 assert.equal((await as(id(4),'SELECT * FROM boh_training')).rows.length,0);
 assert.equal((await as(id(5),'SELECT * FROM boh_training')).rows.length,1);
 await assert.rejects(()=>as(id(2),"SELECT training_grant_leader('boh','Member','member@test.com')"));
 await assert.rejects(()=>as(id(5),"SELECT training_grant_leader('foh','New Leader','newleader@test.com')"));
 await assert.rejects(()=>as(id(1),"SELECT training_grant_leader('foh','New Leader','newleader@test.com')"));
 await as(id(1),"SELECT training_grant_leader('boh','Other','other@test.com')");
 assert.equal((await as(id(3),"SELECT training_is_leader('boh') AS yes,training_can_manage_leaders('boh') AS admin")).rows[0].yes,true);
 assert.equal((await as(id(3),"SELECT training_can_manage_leaders('boh') AS admin")).rows[0].admin,false);
 await db.exec("RESET ROLE;DELETE FROM training_app_leaders WHERE email='other@test.com';");
 await as(id(1),"SELECT training_link_member('boh','New','new@test.com')");
 await as(id(1),"SELECT training_delete_member('boh','Other')");
 assert.equal((await as(id(3),'SELECT * FROM boh_training')).rows.length,0);
 await as(id(3),"SELECT training_request_access(ARRAY['boh','foh'],'Other')");
 assert.equal((await as(id(3),'SELECT * FROM training_access_requests')).rows.length,2);
 assert.equal((await as(id(2),'SELECT * FROM training_access_requests')).rows.length,0);
 await assert.rejects(()=>as(id(4),"SELECT training_request_access(ARRAY['boh'],'Unverified')"));
 await assert.rejects(()=>as(id(3),"SELECT training_review_access('boh','other@test.com',true,'Member')"));
 await assert.rejects(()=>as(id(1),"SELECT training_review_access('foh','other@test.com',true,'Other')"));
 await assert.rejects(()=>as(id(1),"SELECT training_review_access('boh','other@test.com',true,'Member')"));
 await assert.rejects(()=>as(id(3),"INSERT INTO training_access_requests(email,app_scope,requested_name,status) VALUES('other@test.com','boh','Other','approved')"));
 await assert.rejects(()=>as(id(3),"SELECT training_request_access(ARRAY['admin'],'Other')"));
 await as(id(5),"SELECT training_review_access('foh','other@test.com',false,NULL)");
 await as(id(1),"SELECT training_review_access('boh','other@test.com',true,'Other')");
 assert.deepEqual((await as(id(3),'SELECT team_member FROM boh_training')).rows,[{team_member:'Other'}]);
 assert.equal((await as(id(3),"SELECT training_is_leader('boh') yes")).rows[0].yes,false);
 assert.equal((await as(id(3),"SELECT status FROM training_access_requests WHERE app_scope='boh'")).rows[0].status,'approved');
 await assert.rejects(()=>as(id(1),"SELECT training_review_access('boh','other@test.com',true,'Other')"));
 await db.exec("RESET ROLE;INSERT INTO boh_training(team_member,progress) VALUES('Existing','{\"trained\":true}');");
 await as(id(6),"SELECT training_request_access(ARRAY['boh'],'Existing')");
 await as(id(1),"SELECT training_review_access('boh','fresh@test.com',true,'Existing')");
 assert.deepEqual((await as(id(6),'SELECT progress FROM boh_training')).rows,[{progress:{trained:true}}]);
 await as(id(2),"SELECT training_request_access(ARRAY['foh'],'Member')");
 await as(id(5),"SELECT training_review_access('foh','member@test.com',true,'Member')");
 assert.deepEqual((await as(id(2),"SELECT progress FROM boh_training WHERE team_member='FOH::Member'")).rows,[{progress:{}}]);
 await db.exec('RESET ROLE;SET ROLE anon;');await assert.rejects(()=>db.query('SELECT * FROM boh_training'));
 await db.exec('RESET ROLE;');assert.equal((await db.query("SELECT * FROM training_access_policy_backup WHERE policyname='old_anon_policy'")).rows.length,1);
 await db.close();console.log('Database: own-progress isolation, scope separation, leader edits/deletes, no self-promotion, anonymous denial, unverified denial, migration rerun PASS');
}
async function appTests(){
 for(const scope of ['boh','foh'])for(const mode of ['pending','member','leader']){
  const leader=mode==='leader',linked=mode!=='pending';
  const html=fs.readFileSync(root+(scope==='boh'?'index.html':'foh/index.html'),'utf8');
  const dom=new JSDOM(html,{url:'https://cmille8435.github.io/boh-training-app/'+(scope==='foh'?'foh/':''),runScripts:'dangerously',pretendToBeVisual:true}),w=dom.window,requests=[];
  w.alert=()=>{};w.confirm=()=>false;
  w.localStorage.setItem('haywood-training-session-v1',JSON.stringify({access_token:'verified-session',refresh_token:'refresh',expires_at:Date.now()/1000+3600}));
  w.fetch=async(url,options={})=>{
   requests.push({url,options});let data=[];
   if(url.includes('/auth/v1/user'))data={id:'user-id',email:'verified@test.com'};
   else if(url.includes('rpc/training_my_access'))data=[{app_scope:scope,is_leader:leader,display_name:linked?'Member':null,team_member:linked?'Member':null}];
   else if(url.includes('rpc/training_can_manage_leaders'))data=leader;
   else if(url.includes('training_access_requests'))data=leader?[{email:'requester@test.com',requested_name:'Member'}]:[];
   else if(url.includes('/boh_training'))data=[{id:1,team_member:scope==='foh'?'FOH::Member':'Member',progress:{}}];
   return {ok:true,status:200,json:async()=>data,text:async()=>JSON.stringify(data)};
  };
  for(const file of ['training-access.js',scope==='boh'?'data-v13.js':'foh/data.js',...(scope==='boh'?['quality-photos.js']:[]),scope==='boh'?'item-photos.js':'foh/item-photos.js',scope==='boh'?'app-v13.js':'foh/app.js']){const script=w.document.createElement('script');script.textContent=fs.readFileSync(root+file,'utf8');w.document.body.appendChild(script);}
  await new Promise(r=>setTimeout(r,25));
  assert.equal(w.document.body.classList.contains('training-leader'),leader);
  const text=w.document.getElementById('app').textContent;
  assert.equal(text.includes('All Progress'),leader);assert.equal(text.includes('Team Members'),leader);
  assert.equal(w.document.querySelector('[data-nav="trainer"]').hidden,!leader);
  if(mode==='pending'){
   assert.ok(text.includes('Request Training Access'));assert.equal(w.document.querySelector('nav').hidden,true);
   assert.ok(!requests.some(r=>r.url.includes('/boh_training')||r.url.includes('/training_content')));
   const form=w.document.getElementById('accessRequestForm');form.elements.full_name.value='Member';form.elements.scopes.value='both';form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,15));
   const submitted=requests.find(r=>r.url.includes('rpc/training_request_access'));assert.deepEqual(JSON.parse(submitted.options.body),{p_scopes:['boh','foh'],p_name:'Member'});
   await assert.rejects(()=>w.eval('TrainingAccess.request("rpc/training_review_access",{method:"POST",body:"{}"})'));
  }else if(!leader){
   assert.throws(()=>w.eval('TrainingAccess.requireLeader()'));
   assert.throws(()=>w.eval('TrainingAccess.requireMember("Other")'));
   await w.eval('progressView()');assert.ok(w.document.getElementById('app').textContent.includes('Member'));
   await w.eval('station(Object.keys(STATIONS)[0])');
   assert.ok([...w.document.querySelectorAll('.training-item .checkrow input')].every(input=>input.disabled));
   const edit=w.document.querySelector('.edit-actions');if(edit)assert.equal(w.getComputedStyle(edit).display,'none');
   await assert.rejects(()=>w.eval('TrainingAccess.request("training_content",{method:"POST",body:"{}"})'));
  }else{await w.eval('allProgress()');assert.ok(w.document.getElementById('app').textContent.includes('All Progress'));await w.eval('TrainingAccess.manageMembers()');await new Promise(r=>setTimeout(r,15));assert.ok(w.document.querySelector('.promote-person'));assert.ok(w.document.querySelector('.approve-request'));w.confirm=()=>true;w.document.querySelector('.approve-request').click();await new Promise(r=>setTimeout(r,15));const reviewed=requests.find(r=>r.url.includes('rpc/training_review_access'));assert.deepEqual(JSON.parse(reviewed.options.body),{p_scope:scope,p_email:'requester@test.com',p_approve:true,p_name:'Member'});}
  assert.ok(requests.filter(r=>r.url.includes('/rest/v1/')).every(r=>r.options.headers.Authorization==='Bearer verified-session'));
  await w.eval('TrainingAccess.signOut()');assert.equal(w.document.querySelector('nav').hidden,true);assert.equal(w.eval('trainee'), '');assert.equal(w.eval('Object.keys(progress).length'),0);
  dom.window.close();console.log(scope.toUpperCase()+': '+mode+' UI and session isolation PASS');
 }
}
(async()=>{await databaseTests();await appTests();})().catch(error=>{console.error(error);process.exit(1);});
