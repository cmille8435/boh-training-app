/* Private alerts. The database verifies the single recipient for every operation. */
window.TrainingNotifications=(()=>{
 let api=null,settings=null,timer=null,epoch=0,loading=false;
 const scriptBase=new URL('.',document.currentScript.src);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function stop(){epoch++;clearInterval(timer);timer=null;settings=null;api=null;loading=false;document.getElementById('trainingNotificationsButton')?.remove();document.getElementById('trainingNotificationsPanel')?.remove();}
 async function refresh(){
  if(!api||!settings?.owner||loading||document.visibilityState==='hidden')return;
  const version=epoch;loading=true;
  try{const rows=await api.request('training_notifications?read_at=is.null&select=id&limit=100');if(version!==epoch)return;
   const button=document.getElementById('trainingNotificationsButton');if(button){button.textContent='🔔 '+(rows.length?rows.length+(rows.length===100?'+':''):'Notifications');button.setAttribute('aria-label',rows.length+' unread notifications');}
  }catch{/* A temporary network failure must not interrupt training. */}finally{if(version===epoch)loading=false;}
 }
 async function start(access){
  stop();api=access;const version=epoch;
  try{const config=await api.request('rpc/training_notification_config');if(version!==epoch||!config?.owner)return;settings=config;
   const bar=document.getElementById('trainingAccount');if(!bar)return;
   const button=document.createElement('button');button.id='trainingNotificationsButton';button.className='ghost';button.textContent='🔔 Notifications';button.onclick=show;bar.appendChild(button);
   await refresh();if(version===epoch)timer=setInterval(refresh,30000);
  }catch{/* Older backend deployments have no notifications yet. */}
 }
 async function show(){
  if(!settings?.owner)return;const version=epoch;
  document.getElementById('trainingNotificationsPanel')?.remove();
  const dialog=document.createElement('dialog');dialog.id='trainingNotificationsPanel';dialog.style.cssText='width:min(540px,calc(100% - 32px));max-height:85vh;border:1px solid #ddd;border-radius:16px;padding:20px;';
  dialog.innerHTML='<h2>Your Notifications</h2><p>Updates from both BOH and FOH.</p><button class="ghost" id="closeNotifications">Close</button><div class="edit-actions auth-actions"><button id="enableTrainingPush">Enable Phone Alerts</button><button id="disableTrainingPush">Turn Off Phone Alerts</button><button id="markTrainingAlertsRead">Mark These Read</button></div><p id="trainingAlertStatus" role="status"></p><div id="trainingAlertList">Loading…</div>';
  document.body.appendChild(dialog);dialog.showModal();dialog.querySelector('#closeNotifications').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  const status=dialog.querySelector('#trainingAlertStatus');
  dialog.querySelector('#enableTrainingPush').onclick=async()=>{
   const button=dialog.querySelector('#enableTrainingPush');button.disabled=true;
   try{await enablePush();if(version===epoch)status.textContent='Phone alerts are enabled on this device.';}catch(error){if(version===epoch)status.textContent=error.message;}finally{button.disabled=false;}
  };
  dialog.querySelector('#disableTrainingPush').onclick=async()=>{
   try{if(!('serviceWorker' in navigator))throw new Error('Phone alerts are unavailable on this device.');
    const registration=await navigator.serviceWorker.getRegistration(scriptBase.href);const subscription=await registration?.pushManager.getSubscription();
    if(subscription){await api.request('rpc/training_unsubscribe_push',{method:'POST',body:JSON.stringify({p_endpoint:subscription.endpoint})});await subscription.unsubscribe();}
    if(version===epoch)status.textContent='Phone alerts are off on this device.';
   }catch(error){if(version===epoch)status.textContent=error.message;}
  };
  try{const rows=await api.request('training_notifications?select=id,app_scope,message,created_at,read_at&order=id.desc&limit=100');if(version!==epoch)return;
   dialog.querySelector('#trainingAlertList').innerHTML=rows.length?rows.map(row=>`<article class="card"><b>${esc(row.app_scope.toUpperCase())}${row.read_at?'':' · New'}</b><p>${esc(row.message)}</p><small>${esc(new Date(row.created_at).toLocaleString())}</small></article>`).join(''):'<p>No notifications yet.</p>';
   dialog.querySelector('#markTrainingAlertsRead').onclick=async()=>{try{await api.request('rpc/training_mark_notifications_read',{method:'POST',body:JSON.stringify({p_ids:rows.filter(row=>!row.read_at).map(row=>row.id)})});if(version!==epoch)return;status.textContent='Marked read.';await refresh();await show();}catch(error){if(version===epoch)status.textContent=error.message;}};
  }catch(error){if(version===epoch)dialog.querySelector('#trainingAlertList').textContent=error.message;}
 }
 async function enablePush(){
  const version=epoch;
  if(!settings?.owner)throw new Error('Private notifications are unavailable.');
  if(!settings.publicKey)throw new Error('Phone alert delivery has not been configured yet.');
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))throw new Error('On iPhone, add this app to your Home Screen, then open it there to enable phone alerts.');
  // Request permission directly from the button gesture before awaiting worker registration.
  const permission=await Notification.requestPermission();
  if(permission!=='granted')throw new Error('Allow notifications in your device settings to receive phone alerts.');
  const registration=await navigator.serviceWorker.register(new URL('training-notification-sw.js',scriptBase).href,{scope:scriptBase.pathname});
  await navigator.serviceWorker.ready;
  if(version!==epoch)throw new Error('Please sign in again.');
  const raw=atob(settings.publicKey.replace(/-/g,'+').replace(/_/g,'/'));
  const applicationServerKey=Uint8Array.from(raw,c=>c.charCodeAt(0));
  const subscription=await registration.pushManager.getSubscription()||await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey});
  await api.request('rpc/training_subscribe_push',{method:'POST',body:JSON.stringify({p_subscription:subscription.toJSON()})});
 }
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
 return {start,stop};
})();
