// No asset caching: training and access changes continue to load from the server.
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{};}catch{}
 const scope=data.scope==='foh'?'foh':'boh';
 // Keep team member names and progress details off the lock screen.
 event.waitUntil(self.registration.showNotification(scope.toUpperCase()+' Training',{
  body:'You have a new training app update. Open your private notifications to view it.',
  tag:'training-update-'+String(data.id||scope),
  data:{scope},
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=new URL(event.notification.data?.scope==='foh'?'foh/':'./',self.registration.scope).href;
 event.waitUntil((async()=>{
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  const client=windows.find(window=>window.url.startsWith(target));
  if(client)return client.focus();
  return self.clients.openWindow(target);
 })());
});
