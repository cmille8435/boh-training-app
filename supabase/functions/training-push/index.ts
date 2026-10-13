import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

// Called by a private scheduled job, never directly by app users.
Deno.serve(async request=>{
 const secret=Deno.env.get('PUSH_DISPATCH_SECRET');
 if(request.method!=='POST'||!secret||request.headers.get('x-training-dispatch')!==secret)return new Response('Unauthorized',{status:401});
 const publicKey=Deno.env.get('VAPID_PUBLIC_KEY'),privateKey=Deno.env.get('VAPID_PRIVATE_KEY'),subject=Deno.env.get('VAPID_SUBJECT');
 if(!publicKey||!privateKey||!subject)return new Response('Delivery is not configured',{status:503});
 webpush.setVapidDetails(subject,publicKey,privateKey);
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const {data,error}=await db.rpc('training_claim_push');
 if(error)return new Response('Could not claim deliveries',{status:500});
 let sent=0,failed=0;
 for(const delivery of data||[]){
  try{
   const endpoint=new URL(delivery.subscription.endpoint);
   if(endpoint.protocol!=='https:'||!(/^(web\.push\.apple\.com|fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+\.notify\.windows\.com)$/).test(endpoint.hostname)||endpoint.port||endpoint.username||endpoint.password)throw new Error('Invalid endpoint');
   await webpush.sendNotification(delivery.subscription,JSON.stringify({id:delivery.notification_id,scope:delivery.app_scope}),{TTL:3600,timeout:10000});
   const result=await db.from('training_push_deliveries').update({sent_at:new Date().toISOString(),lease_until:null}).eq('notification_id',delivery.notification_id).eq('subscription_id',delivery.subscription_id);
   if(result.error)failed++;else sent++;
  }catch(error){
   failed++;
   if((error as {statusCode?:number}).statusCode===404||(error as {statusCode?:number}).statusCode===410)await db.from('training_push_subscriptions').delete().eq('id',delivery.subscription_id);
   // Do not log endpoint, subscription keys, recipient, or team member data.
  }
 }
 return Response.json({sent,failed});
});
