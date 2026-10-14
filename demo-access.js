/* Offline, read-only demo adapter. Never reads sessions or contacts the training database. */
const TrainingAccess=(()=>{
 const name='Sample Team Member';
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
  if(resource==='training_content')return [];
  if(resource==='boh_training')return [{team_member:name,progress:sampleProgress()}];
  throw new Error('Team records are unavailable in this preview.');
 }
 async function start(options){
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