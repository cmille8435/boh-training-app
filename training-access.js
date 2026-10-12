/* Shared sign-in and access controls. Roles are read from Supabase, never chosen by users. */
const TrainingAccess=(()=>{
 let config,session=null,leader=false,ownName='',refreshing=null,recovery=false,sessionEpoch=0;
 const storageKey='haywood-training-session-v1';
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function remember(value){session=value;try{if(value)localStorage.setItem(storageKey,JSON.stringify(value));else localStorage.removeItem(storageKey);}catch{}}
 function active(){return !!session&&!!session.access_token;}
 function requireLeader(){if(!active()||!leader)throw new Error('This action is available to leaders only.');}
 function requireMember(name){if(!active())throw new Error('Please sign in.');if(!leader&&name!==ownName)throw new Error('You can view only your own progress.');}
 function redirect(){return location.origin+location.pathname;}
 async function auth(path,body,method='POST',token=''){
  const response=await fetch(config.url+'/auth/v1/'+path,{method,headers:{apikey:config.key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.msg||data.message||data.error_description||'Could not sign in. Please try again.');
  return data;
 }
 async function token(){
  if(!active())throw new Error('Please sign in.');
  if(session.expires_at&&session.expires_at<Date.now()/1000+60){
   if(!refreshing)refreshing=auth('token?grant_type=refresh_token',{refresh_token:session.refresh_token}).then(saveSession).catch(error=>{clear();showLogin(error.message);throw error;}).finally(()=>refreshing=null);
   await refreshing;
  }
  return session.access_token;
 }
 function saveSession(value){if(!value.access_token)throw new Error('Sign-in did not return a session.');remember({...value,expires_at:value.expires_at||Date.now()/1000+(value.expires_in||3600)});return value;}
 async function request(path,options={}){
  if((options.method||'GET').toUpperCase()!=='GET')requireLeader();
  const epoch=sessionEpoch;
  const accessToken=await token();
  const response=await fetch(config.url+'/rest/v1/'+path,{...options,headers:{...options.headers,apikey:config.key,Authorization:'Bearer '+accessToken,'Content-Type':'application/json'}});
  if(epoch!==sessionEpoch||!active())throw new Error('The signed-in account changed. Please try again.');
  if(!response.ok){if(response.status===401){clear();showLogin('Your session expired. Please sign in again.');}throw new Error(response.status===404?'The sign-in database setup has not been applied yet.':'Unable to save or load. Please try again. ('+response.status+')');}
  if(response.status===204)return null;const text=await response.text();if(epoch!==sessionEpoch||!active())throw new Error('The signed-in account changed. Please try again.');return text?JSON.parse(text):null;
 }
 function clear(){sessionEpoch++;remember(null);leader=false;ownName='';document.body.classList.remove('training-leader','training-signed-in');if(config)config.onSignOut();const bar=document.getElementById('trainingAccount');if(bar)bar.remove();}
 async function signOut(){const old=session;clear();showLogin();if(old)await auth('logout',null,'POST',old.access_token).catch(()=>{});}
 function showLogin(message=''){
  document.querySelector('nav').hidden=true;document.getElementById('homeBtn').hidden=true;
  const app=document.getElementById('app');
  app.innerHTML=`<h1>${config.scope.toUpperCase()} Training</h1><p class="sub">Sign in to your training account.</p><div class="card"><form id="trainingSignIn"><label class="field">Email<input name="email" type="email" autocomplete="email" required></label><label class="field">Password<input name="password" type="password" autocomplete="current-password" required minlength="8"></label><button class="ghost save-item" type="submit">Sign In</button><p id="authStatus" role="status">${escape(message)}</p><div class="edit-actions auth-actions"><button type="button" id="createTrainingAccount">Create Account</button><button type="button" id="resetTrainingPassword">Forgot Password</button></div></form></div>`;
  const form=document.getElementById('trainingSignIn');
  async function submit(mode){
   if(!form.elements.email.reportValidity())return;
   if(mode!=='recover'&&!form.elements.password.reportValidity())return;
   const email=form.elements.email.value.trim().toLowerCase(),password=form.elements.password.value,status=document.getElementById('authStatus');
   form.querySelectorAll('button').forEach(b=>b.disabled=true);status.textContent='Please wait…';
   try{
    if(mode==='recover'){await auth('recover?redirect_to='+encodeURIComponent(redirect()),{email});status.textContent='If your account exists, check your email for a password reset link.';}
    else if(mode==='signup'){const data=await auth('signup?redirect_to='+encodeURIComponent(redirect()),{email,password});if(data.access_token){saveSession(data);await enter();}else status.textContent='Check your email to confirm your account, then sign in. A leader must link your email to your training record.';}
    else{saveSession(await auth('token?grant_type=password',{email,password}));await enter();}
   }catch(error){status.textContent=error.message;}
   finally{form.querySelectorAll('button').forEach(b=>b.disabled=false);}
  }
  form.onsubmit=event=>{event.preventDefault();submit('signin');};
  document.getElementById('createTrainingAccount').onclick=()=>submit('signup');
  document.getElementById('resetTrainingPassword').onclick=()=>submit('recover');
 }
 async function enter(){
  const user=await auth('user',null,'GET',await token());session.user=user;remember(session);
  const rows=await request('rpc/training_my_access',{method:'GET'});
  const access=Array.isArray(rows)?rows.find(row=>row.app_scope===config.scope):null;
  leader=!!access?.is_leader;ownName=access?.team_member||'';
  document.body.classList.toggle('training-leader',leader);document.body.classList.add('training-signed-in');
  document.querySelector('nav').hidden=false;document.getElementById('homeBtn').hidden=false;
  document.querySelector('[data-nav="trainer"]').hidden=!leader;
  let bar=document.getElementById('trainingAccount');if(!bar){bar=document.createElement('div');bar.id='trainingAccount';bar.className='training-account';document.querySelector('header').after(bar);}
  bar.innerHTML=`<span>${escape(access?.display_name||user.email)} · ${leader?'Leader':'Team member'}</span><button class="ghost" type="button">Sign Out</button>`;bar.querySelector('button').onclick=signOut;
  await config.onReady({leader,ownName});
 }
 function manageMembers(){
  requireLeader();const app=document.getElementById('app');
  app.innerHTML='<h1>Team Members</h1><p class="sub">Link each person’s email to their existing training name. Only leaders can change these links.</p><div class="card"><form id="linkMemberForm"><label class="field">Training name<input name="team_member" required></label><label class="field">Sign-in email<input name="email" type="email" autocomplete="off" required></label><button class="ghost save-item">Save Team Member</button><p id="memberStatus" role="status"></p></form></div><div id="memberList"></div>';
  const form=document.getElementById('linkMemberForm');
  async function list(){
   const [links,records]=await Promise.all([request('training_app_members?app_scope=eq.'+config.scope+'&select=email,team_member&order=team_member.asc'),request('boh_training?select=team_member&team_member='+(config.scope==='foh'?'like.FOH::*':'not.like.FOH::*'))]);
   const names=[...new Set([...records.map(row=>row.team_member.replace(/^FOH::/,'')),...links.map(row=>row.team_member)])].sort();
   const box=document.getElementById('memberList');box.innerHTML='';
   for(const name of names){const link=links.find(row=>row.team_member===name),card=document.createElement('div');card.className='card';card.innerHTML=`<h2>${escape(name)}</h2><p class="small">${escape(link?.email||'Email not linked yet')}</p><div class="edit-actions"><button type="button" class="link-person">Link / Change Email</button><button type="button" class="delete-person">Delete Team Member</button></div>`;
    card.querySelector('.link-person').onclick=()=>{form.elements.team_member.value=name;form.elements.email.value=link?.email||'';form.elements.email.focus();};
    card.querySelector('.delete-person').onclick=async()=>{if(!confirm('Delete '+name+' and their '+config.scope.toUpperCase()+' training progress?'))return;try{await request('rpc/training_delete_member',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_name:name})});await config.onDeleted(name);await list();}catch(error){document.getElementById('memberStatus').textContent=error.message;}};
    box.appendChild(card);
   }
  }
  form.onsubmit=async event=>{event.preventDefault();const status=document.getElementById('memberStatus');status.textContent='Saving…';try{await request('rpc/training_link_member',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_name:form.elements.team_member.value.trim(),p_email:form.elements.email.value.trim().toLowerCase()})});status.textContent='Saved. This person can now sign in and view their own progress.';form.reset();await list();}catch(error){status.textContent=error.message;}};
  list().catch(error=>document.getElementById('memberStatus').textContent=error.message);
 }
 function showRecovery(){
  const app=document.getElementById('app');app.innerHTML='<h1>Set New Password</h1><div class="card"><form id="newPassword"><label class="field">New password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><button class="ghost save-item">Save Password</button><p id="passwordStatus" role="status"></p></form></div>';
  document.querySelector('nav').hidden=true;document.getElementById('homeBtn').hidden=true;
  const form=document.getElementById('newPassword');form.onsubmit=async event=>{event.preventDefault();try{await auth('user',{password:form.elements.password.value},'PUT',await token());recovery=false;await enter();}catch(error){document.getElementById('passwordStatus').textContent=error.message;}};
 }
 async function start(options){
  config=options;document.querySelector('nav').hidden=true;document.getElementById('homeBtn').hidden=true;
  try{
   const hash=new URLSearchParams(location.hash.slice(1));
   if(hash.has('access_token')){saveSession({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token'),expires_in:Number(hash.get('expires_in')||3600)});recovery=hash.get('type')==='recovery';history.replaceState(null,'',location.pathname+location.search);}
   else{try{session=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{session=null;}}
   if(hash.has('error_description')){history.replaceState(null,'',location.pathname+location.search);showLogin(hash.get('error_description'));return;}
   if(active()){if(recovery)showRecovery();else await enter();}else showLogin();
  }catch(error){clear();showLogin(error.message);}
 }
 window.addEventListener('storage',event=>{if(event.key===storageKey&&!event.newValue&&config){clear();showLogin('Signed out.');}});
 return {start,request,active,isLeader:()=>leader,ownName:()=>ownName,requireLeader,requireMember,manageMembers,signOut};
})();
