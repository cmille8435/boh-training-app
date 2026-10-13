/* Shared sign-in and access controls. Roles are read from Supabase, never chosen by users. */
const TrainingAccess=(()=>{
 let config,session=null,leader=false,accessAdmin=false,ownName='',refreshing=null,recovery=false,sessionEpoch=0;
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
  if((options.method||'GET').toUpperCase()!=='GET'&&!(path==='rpc/training_request_access'&&(options.method||'').toUpperCase()==='POST'))requireLeader();
  const epoch=sessionEpoch;
  const accessToken=await token();
  const response=await fetch(config.url+'/rest/v1/'+path,{...options,headers:{...options.headers,apikey:config.key,Authorization:'Bearer '+accessToken,'Content-Type':'application/json'}});
  if(epoch!==sessionEpoch||!active())throw new Error('The signed-in account changed. Please try again.');
  if(!response.ok){if(response.status===401){clear();showLogin('Your session expired. Please sign in again.');}throw new Error(response.status===404?'The sign-in database setup has not been applied yet.':'Unable to save or load. Please try again. ('+response.status+')');}
  if(response.status===204)return null;const text=await response.text();if(epoch!==sessionEpoch||!active())throw new Error('The signed-in account changed. Please try again.');return text?JSON.parse(text):null;
 }
 function clear(){sessionEpoch++;remember(null);leader=false;accessAdmin=false;ownName='';document.body.classList.remove('training-leader','training-signed-in');if(config)config.onSignOut();const bar=document.getElementById('trainingAccount');if(bar)bar.remove();}
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
    else if(mode==='signup'){const data=await auth('signup?redirect_to='+encodeURIComponent(redirect()),{email,password});if(data.access_token){saveSession(data);await enter();}else status.textContent='Check your email to confirm your account, then sign in to request training access.';}
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
  leader=!!access?.is_leader;ownName=access?.team_member||'';accessAdmin=leader&&await request('rpc/training_can_manage_leaders?p_scope='+config.scope)===true;
  const ownLeader=leader?await request('training_app_leaders?app_scope=eq.'+config.scope+'&email=eq.'+encodeURIComponent(user.email.toLowerCase())+'&select=job_title'):[];
  const accountLabel=leader?(ownLeader[0]?.job_title||'Leader'):ownName?'Team member':'Awaiting access';
  config.onSignOut();
  document.body.classList.toggle('training-leader',leader);document.body.classList.add('training-signed-in');
  document.querySelector('nav').hidden=false;document.getElementById('homeBtn').hidden=false;
  document.querySelector('[data-nav="trainer"]').hidden=!leader;
  let bar=document.getElementById('trainingAccount');if(!bar){bar=document.createElement('div');bar.id='trainingAccount';bar.className='training-account';document.querySelector('header').after(bar);}
  bar.innerHTML=`<span>${escape(access?.display_name||user.email)} · ${escape(accountLabel)}</span><div><button class="ghost request-access" type="button">Request Access</button><button class="ghost sign-out" type="button">Sign Out</button></div>`;bar.querySelector('.sign-out').onclick=signOut;bar.querySelector('.request-access').onclick=()=>showAccessRequest().catch(error=>alert(error.message));
  if(!leader&&!ownName){await showAccessRequest();return;}
  await config.onReady({leader,ownName});
 }
 async function showAccessRequest(){
  document.querySelector('nav').hidden=true;document.getElementById('homeBtn').hidden=true;
  const [access,requests]=await Promise.all([request('rpc/training_my_access'),request('training_access_requests?select=app_scope,status&email=eq.'+encodeURIComponent(session.user.email.toLowerCase()))]);
  const available=['boh','foh'].filter(scope=>!access.some(row=>row.app_scope===scope&&(row.is_leader||row.team_member)));
  const app=document.getElementById('app');
  app.innerHTML=`<h1>Request Training Access</h1><p class="sub">Enter your name and choose your training app. A leader will approve your access and connect your progress.</p><div class="card">${requests.map(row=>`<p>${row.app_scope.toUpperCase()}: <b>${row.status==='pending'?'Waiting for leader approval':row.status==='approved'?'Approved':'Declined — contact a leader or request again'}</b></p>`).join('')}${available.length?`<form id="accessRequestForm"><label class="field">Your full name<input name="full_name" maxlength="120" autocomplete="name" required></label><label class="field">Training access<select name="scopes">${available.map(scope=>`<option value="${scope}" ${scope===config.scope?'selected':''}>${scope.toUpperCase()}</option>`).join('')}${available.length===2?'<option value="both">Both BOH and FOH</option>':''}</select></label><button class="ghost save-item" type="submit">Request Access</button><p id="accessRequestStatus" role="status"></p></form>`:'<p>Your training access is approved.</p>'}<button class="ghost" id="checkApproval" type="button">Check Approval / Open Training</button><p id="approvalStatus" role="status"></p></div>`;
  const form=document.getElementById('accessRequestForm');
  if(form)form.onsubmit=async event=>{event.preventDefault();const status=document.getElementById('accessRequestStatus'),button=form.querySelector('button');button.disabled=true;try{await request('rpc/training_request_access',{method:'POST',body:JSON.stringify({p_scopes:form.elements.scopes.value==='both'?['boh','foh']:[form.elements.scopes.value],p_name:form.elements.full_name.value.trim()})});await showAccessRequest();}catch(error){status.textContent=error.message;button.disabled=false;}};
  document.getElementById('checkApproval').onclick=async()=>{try{await enter();}catch(error){document.getElementById('approvalStatus').textContent=error.message;}};
 }
 async function manageMembers(){
  requireLeader();const app=document.getElementById('app');
  app.innerHTML='<h1>Team Members</h1><p class="sub">Approve access requests or manage existing team members.</p><section class="card"><h2>Access Requests</h2><button class="ghost" id="refreshAccessRequests" type="button">Refresh Requests</button><p id="requestReviewStatus" role="status"></p><div id="accessRequests"></div></section><details class="card"><summary>Add or link a team member manually</summary><form id="linkMemberForm"><label class="field">Training name<input name="team_member" required></label><label class="field">Sign-in email<input name="email" type="email" autocomplete="off" required></label><button class="ghost save-item">Save Team Member</button><p id="memberStatus" role="status"></p></form></details><div id="memberList"></div>';
  const form=document.getElementById('linkMemberForm');
  const canViewLeaderStatus=await request('rpc/training_can_view_leader_status?p_scope='+config.scope);
  if(canViewLeaderStatus){
  const leaderBox=document.createElement('section');leaderBox.className='card';
  leaderBox.innerHTML='<h2>Leaders</h2><p class="small">Account confirmed means their email is verified. It does not mean they are currently signed in.</p><button class="ghost" id="refreshLeaderAccounts" type="button">Refresh Leader Accounts</button><p id="leaderAccountStatus" role="status"></p><div id="leaderAccountList"></div>';
  document.getElementById('accessRequests').parentElement.after(leaderBox);
  async function loadLeaders(){
   const status=document.getElementById('leaderAccountStatus');status.textContent='Loading…';
   try{const [rows,titles]=await Promise.all([request('rpc/training_leader_account_status?p_scope='+config.scope),request('training_app_leaders?app_scope=eq.'+config.scope+'&select=email,job_title')]);
    document.getElementById('leaderAccountList').innerHTML=rows.map(row=>`<div class="card"><h3>${escape(row.display_name)}</h3><p>${escape(titles.find(person=>person.email===row.email)?.job_title||'Leader')}</p><p class="small">${escape(row.email)}</p><p><b>${escape({confirmed:'Account confirmed',awaiting_confirmation:'Email awaiting confirmation',not_signed_up:'Not signed up'}[row.account_status]||'Status unavailable')}</b></p></div>`).join('');status.textContent=rows.length?'':'No leaders assigned to this app.';
   }catch(error){status.textContent=error.message;}
  }
  document.getElementById('refreshLeaderAccounts').onclick=loadLeaders;loadLeaders();
  }
  async function list(){
   const [links,records]=await Promise.all([request('training_app_members?app_scope=eq.'+config.scope+'&select=email,team_member&order=team_member.asc'),request('boh_training?select=team_member&team_member='+(config.scope==='foh'?'like.FOH::*':'not.like.FOH::*'))]);
   const names=[...new Set([...records.map(row=>row.team_member.replace(/^FOH::/,'')),...links.map(row=>row.team_member)])].sort();
   const pending=await request('training_access_requests?app_scope=eq.'+config.scope+'&status=eq.pending&select=email,requested_name&order=requested_at.asc');
   const requestBox=document.getElementById('accessRequests');requestBox.innerHTML=pending.length?'':'<p>No requests waiting for approval.</p>';
   for(const row of pending){
    const card=document.createElement('div');card.className='card';
    card.innerHTML=`<h3>${escape(row.requested_name)}</h3><p>${escape(row.email)} · ${config.scope.toUpperCase()}</p><label class="field">Link to training record<select class="record-choice"><option value="">Choose an existing name</option>${names.map(name=>`<option value="${escape(name)}">${escape(name)}</option>`).join('')}<option value="__new__">Create a new training record</option></select></label><label class="field new-record" hidden>New training name<input maxlength="120" value="${escape(row.requested_name)}"></label><div class="edit-actions"><button class="approve-request" type="button">Approve</button><button class="decline-request" type="button">Decline</button></div>`;
    const choice=card.querySelector('select');if(names.includes(row.requested_name))choice.value=row.requested_name;
    choice.onchange=()=>{card.querySelector('.new-record').hidden=choice.value!=='__new__';};
    async function review(approve){const status=document.getElementById('requestReviewStatus');const name=choice.value==='__new__'?card.querySelector('input').value.trim():choice.value;
     if(approve&&!name){status.textContent='Choose a training record before approving.';return;}
     if(!confirm(approve?'Approve '+row.requested_name+' ('+row.email+') for '+config.scope.toUpperCase()+' and link to '+name+'?':'Decline '+row.requested_name+'’s '+config.scope.toUpperCase()+' access request?'))return;
     card.querySelectorAll('button').forEach(button=>button.disabled=true);
     try{await request('rpc/training_review_access',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_email:row.email,p_approve:approve,p_name:approve?name:null})});status.textContent=approve?'Approved. They can tap Check Approval or refresh their app.':'Request declined.';await list();}catch(error){status.textContent=error.message;card.querySelectorAll('button').forEach(button=>button.disabled=false);}
    }
    card.querySelector('.approve-request').onclick=()=>review(true);card.querySelector('.decline-request').onclick=()=>review(false);requestBox.appendChild(card);
   }
   const box=document.getElementById('memberList');box.innerHTML='';
   for(const name of names){const link=links.find(row=>row.team_member===name),card=document.createElement('div');card.className='card';card.innerHTML=`<h2>${escape(name)}</h2><p class="small">${escape(link?.email||'Email not linked yet')}</p><div class="edit-actions"><button type="button" class="link-person">Link / Change Email</button><button type="button" class="delete-person">Delete Team Member</button>${accessAdmin?'<button type="button" class="promote-person">Give Leader Access</button>':''}</div>`;
    card.querySelector('.link-person').onclick=()=>{form.closest('details').open=true;form.elements.team_member.value=name;form.elements.email.value=link?.email||'';form.elements.email.focus();};
    card.querySelector('.delete-person').onclick=async()=>{if(!confirm('Delete '+name+' and their '+config.scope.toUpperCase()+' training progress?'))return;try{await request('rpc/training_delete_member',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_name:name})});await config.onDeleted(name);await list();}catch(error){document.getElementById('memberStatus').textContent=error.message;}};
    if(accessAdmin)card.querySelector('.promote-person').onclick=async()=>{
     const status=document.getElementById('memberStatus');
     if(!link){status.textContent='Link this person’s email first, then give leader access.';return;}
     if(!confirm('Give '+name+' leader access to '+config.scope.toUpperCase()+'? They will be able to edit training and view everyone’s progress in this app.'))return;
     try{await request('rpc/training_grant_leader',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_name:name,p_email:link.email})});status.textContent='Leader access granted. Ask this person to refresh their app.';}catch(error){status.textContent=error.message;}
    };
    box.appendChild(card);
   }
  }
  form.onsubmit=async event=>{event.preventDefault();const status=document.getElementById('memberStatus');status.textContent='Saving…';try{await request('rpc/training_link_member',{method:'POST',body:JSON.stringify({p_scope:config.scope,p_name:form.elements.team_member.value.trim(),p_email:form.elements.email.value.trim().toLowerCase()})});status.textContent='Saved. This person can now sign in and view their own progress.';form.reset();await list();}catch(error){status.textContent=error.message;}};
  const reload=()=>list().catch(error=>document.getElementById('requestReviewStatus').textContent=error.message);
  document.getElementById('refreshAccessRequests').onclick=reload;reload();
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
 return {start,request,active,isLeader:()=>leader,canManageLeaders:()=>accessAdmin,ownName:()=>ownName,requireLeader,requireMember,manageMembers,signOut};
})();
