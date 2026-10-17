/* Offline, read-only demo adapter. Never reads sessions or contacts the training database. */
const TrainingAccess=(()=>{
 const savedLinks={"boh": [{"key": "content:13", "link_url": "https://www.pathway.cfahome.com/doc/d3bb5184-a3c3-4c6e-bc1c-70775786a1fa", "title": "How Truett Cathy Built a Good Name", "group": "welcome", "slug": "welcome"}, {"key": "station:food-safety:Completes the Food Safety Pathway training", "link_url": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01K88MCVKFB7YXX7KV3E02HMYZ", "title": "Food Safety Pathway has been completed", "group": "station", "slug": "food-safety"}, {"key": "station:food-safety:Explains the four food safety principles", "link_url": "https://youtu.be/J2_9aGuy9ZU?is=1o80QFv3V0hpAH7j", "title": "Explains the Food Safety Five principles", "group": "station", "slug": "food-safety"}, {"key": "content:24", "link_url": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01KVZFA8R09AGB9FZSF3FA7SKP", "title": "Time and Temperature", "group": "station", "slug": "primary"}, {"key": "station:machines:Properly use Henny Penny fryers", "link_url": "https://www.pathway.cfahome.com/doc/916caa8e-a2f3-452b-9b35-dd8b5c68ed6a", "title": "Properly use Henny Penny fryers and know how to properly filter lockout.", "group": "station", "slug": "machines"}, {"key": "content:620", "link_url": "https://www.pathway.cfahome.com/doc/7143428c-eccc-4e87-8b78-c1dca36cd287", "title": "Step by step for Cool down Process", "group": "station", "slug": "machines"}, {"key": "station:machines:Use AHA tracking", "link_url": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01M1H7DW7V4E9XMXE6YZBX6CWA", "title": "Use AHA tracking", "group": "station", "slug": "machines"}, {"key": "station:breading:Correct fileting", "link_url": "https://www.pathway.cfahome.com/doc/5a04498f-7042-47f9-8508-3b6998084bfd", "title": "Correct fileting", "group": "station", "slug": "breading"}, {"key": "station:breading:Bread filets and spicy filets", "link_url": "https://www.pathway.cfahome.com/doc/761ac446-ccb2-451f-bb4c-812a67d86915", "title": "Bread filets and spicy filets", "group": "station", "slug": "breading"}, {"key": "station:breading:Bread nuggets", "link_url": "https://www.pathway.cfahome.com/doc/ac4246a6-e46a-461a-b087-dc05c186ae40", "title": "Bread nuggets", "group": "station", "slug": "breading"}, {"key": "station:breading:Bread strips", "link_url": "https://www.pathway.cfahome.com/doc/cf73665b-eb6c-4478-9521-a52537ca2f29", "title": "Bread strips", "group": "station", "slug": "breading"}, {"key": "station:breading:Prepare milkwash", "link_url": "https://www.pathway.cfahome.com/doc/12e4cb06-727c-4d87-a53d-25b000ad3d3b", "title": "Prepare milkwash", "group": "station", "slug": "breading"}, {"key": "station:fries:Know step-by-step how to drop fries, shake, hit the timer, cook, bring up the fries, shake, and dump fries into the fry dispenser", "link_url": "https://www.pathway.cfahome.com/doc/9c63c61e-b550-4e21-9d2c-54464c25d0eb", "title": "Know step-by-step how to drop fries, shake, hit the timer, cook, bring up the fries, drain, shake, and dump fries into the fry dispenser", "group": "station", "slug": "fries"}, {"key": "closing:machines-close:Clean inside and outside of chicken Henny Pennys", "link_url": "https://www.pathway.cfahome.com/doc/a7fc28cf-f7a5-48d9-8357-c847cadfcdf2", "title": "Clean inside and outside of chicken Henny Pennys", "group": "closing", "slug": "machines-close"}, {"key": "closing:machines-close:Clean inside and outside of fry Henny Pennys", "link_url": "https://www.pathway.cfahome.com/doc/511d7f1c-caca-4987-9f51-ca6e2df0e5f1", "title": "Clean inside and outside of fry fryers.", "group": "closing", "slug": "machines-close"}, {"key": "closing:machines-close:Turn off, disassemble, and clean grill", "link_url": "https://www.pathway.cfahome.com/doc/8f3a5a2c-ae33-4f7c-bb18-d3da5291dd38", "title": "Turn off, disassemble, and clean grill", "group": "closing", "slug": "machines-close"}], "foh": [{"key": "foh:welcome:welcome:How Truett Cathy Built a Good Name", "link_url": "https://www.pathway.cfahome.com/doc/d3bb5184-a3c3-4c6e-bc1c-70775786a1fa", "title": "How Truett Cathy Built a Good Name", "group": "welcome", "slug": "welcome"}, {"key": "foh:station:food-safety:Food Safety Pathway has been completed", "link_url": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01K88MCVKFB7YXX7KV3E02HMYZ", "title": "Food Safety Pathway has been completed", "group": "station", "slug": "food-safety"}, {"key": "foh:station:food-safety:Explains the Food Safety Five principles", "link_url": "https://youtu.be/J2_9aGuy9ZU?is=1o80QFv3V0hpAH7j", "title": "Explains the Food Safety Five principles", "group": "station", "slug": "food-safety"}, {"key": "content:53", "link_url": "https://www.pathway.cfahome.com/doc/1e229018-193c-4e81-888e-a31e40034d1e", "title": "Language of Hospitality", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:54", "link_url": "https://www.pathway.cfahome.com/doc/0e1478a0-3f27-422b-abed-afcc591a8538", "title": "Proactive", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:55", "link_url": "https://www.pathway.cfahome.com/doc/5ff15ebb-c37d-4c4b-8a0b-26ea2d2f143c", "title": "Personal", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:56", "link_url": "https://www.pathway.cfahome.com/doc/f567a2b2-40e0-4241-8809-0f64831b397a", "title": "Generous", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:57", "link_url": "https://www.pathway.cfahome.com/doc/e9f36ee6-3a87-4880-a3ab-c3d8b08ace2e", "title": "Attentive and Friendly", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:58", "link_url": "https://www.pathway.cfahome.com/doc/8034c5ca-3c81-4eb9-832a-8433e59febfc", "title": "Welcoming Environment", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:59", "link_url": "https://www.pathway.cfahome.com/doc/abd2360e-6501-4abc-8a01-c8665d1791b5", "title": "Fast and Accurate", "group": "station", "slug": "winning-hearts-everyday"}, {"key": "content:60", "link_url": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01K5HKPQ90M7MFGZHYSSS647EZ", "title": "Heard Model", "group": "station", "slug": "winning-hearts-everyday"}]};
 const name='Sample Team Member';
 let scope='boh';
 const deny=()=>{throw new Error('This preview is read-only.');};
 function sampleProgress(){
  const result={};
  for(const [group,collection] of [['station',STATIONS],['closing',CLOSING]]){
   for(const [slug,page] of Object.entries(collection)){
    page.sections.forEach(([,items])=>items.forEach((item,i)=>{
     if(i%3===0)result[idFor(group,slug,item)]=true;
    }));
   }
  }
  return result;
 }
 async function request(path,options={}){
  if((options.method||'GET').toUpperCase()!=='GET')deny();
  const resource=path.split('?')[0];
  if(resource==='training_content'){
   const query=new URL(path,'https://demo.local/').searchParams;
   if(query.has('title'))return [];
   return savedLinks[scope].map((link,index)=>{
    const page=link.group==='welcome'?WELCOME:link.group==='station'?STATIONS[link.slug]:CLOSING[link.slug];
    const originals=page?.sections.flatMap(([,items])=>items)||[];
    const original=originals.find(item=>idFor(link.group,link.slug,item)===link.key)||originals.find(item=>item===link.title);
    const section=(scope==='foh'?'foh-':'')+link.group;
    if(original)return {id:'demo-link-'+index,section,category:link.slug,item_type:'category',title:META+'item:'+idFor(link.group,link.slug,original),description:JSON.stringify({title:link.title,link_url:link.link_url}),sort_order:-1};
    return {id:'demo-added-link-'+index,section,category:link.group==='closing'?'closing':link.slug,subsection:link.group==='closing'?link.slug+'::Pathway Training':'Pathway Training',item_type:'item',title:link.title,description:'',link_url:link.link_url,sort_order:index};
   });
  }
  if(resource==='boh_training')return [{team_member:name,progress:sampleProgress()}];
  throw new Error('Team records are unavailable in this preview.');
 }
 async function start(options){
  scope=options.scope;
  // Keep the Welcome preview consistent across both training apps.
  if(!WELCOME.sections.some(([title])=>title==='What makes Chick-fil-A Unique?')){
   WELCOME.sections.push(['What makes Chick-fil-A Unique?',['How Truett Cathy Built a Good Name']]);
  }
  document.body.classList.add('training-demo');
  document.querySelector('[data-nav="trainer"]').hidden=true;
  document.querySelector('[data-nav="progress"]').textContent='Sample Progress';
  document.querySelector('nav').hidden=false;
  document.getElementById('homeBtn').hidden=false;
  const bar=document.createElement('div');
  bar.className='training-account';
  bar.innerHTML='<span><b>View Demo</b> · Read-only preview with sample progress</span><a href="'+(options.scope==='foh'?'../demo.html':'foh/demo.html')+'">View '+(options.scope==='foh'?'BOH':'FOH')+' Demo</a>';
  document.querySelector('header').after(bar);
  await options.onReady({ownName:name,isLeader:false});
 }
 return {start,request,active:()=>true,isLeader:()=>false,canManageLeaders:()=>false,ownName:()=>name,requireLeader:deny,requireMember:n=>{if(n!==name)deny();},manageMembers:deny,signOut:deny};
})();