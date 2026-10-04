const app=document.getElementById('app');
const key='boh-training-progress-v1';
let progress={};
let trainee='';
let trainingContent=[];
async function loadTrainingContent(){const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};const r=await fetch(`${SUPABASE_URL}/rest/v1/training_content?select=*&order=sort_order.asc`,{headers:h});trainingContent=await r.json();}
async function addTrainingItem(item){const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};const r=await fetch(`${SUPABASE_URL}/rest/v1/training_content`,{method:'POST',headers:h,body:JSON.stringify(item)});if(!r.ok)throw new Error(await r.text());await loadTrainingContent();}
async function addTeamMember(name){name=name.trim();if(!name)return;const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};const q=encodeURIComponent(name);const r=await fetch(`${SUPABASE_URL}/rest/v1/boh_training?team_member=eq.${q}&select=id`,{headers:h});const rows=await r.json();if(rows.length)return;await fetch(`${SUPABASE_URL}/rest/v1/boh_training`,{method:'POST',headers:h,body:JSON.stringify({team_member:name,progress:{}})});}

async function save(){if(!trainee)return;const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};const q=encodeURIComponent(trainee);const r=await fetch(`${SUPABASE_URL}/rest/v1/boh_training?team_member=eq.${q}&select=id`,{headers:h});const rows=await r.json();if(rows.length){await fetch(`${SUPABASE_URL}/rest/v1/boh_training?id=eq.${rows[0].id}`,{method:'PATCH',headers:h,body:JSON.stringify({progress})});}else{await fetch(`${SUPABASE_URL}/rest/v1/boh_training`,{method:'POST',headers:h,body:JSON.stringify({team_member:trainee,progress})});}}
function allItems(obj){return obj.sections.flatMap(s=>s[1]);}
function idFor(group,slug,item){return `${group}:${slug}:${item}`;}
function pctFor(group,slug,obj){let items=allItems(obj);let n=items.filter(x=>progress[idFor(group,slug,x)]).length;return [n,items.length,items.length?Math.round(n/items.length*100):0];}

function home(){
 app.innerHTML=`<h1>BOH Training</h1><p class="sub">Simple training reference and progress tracker.</p>
 <div class="menu">
 <button class="primary" onclick="welcome()">Welcome & Restaurant Tour</button>
 ${Object.entries(STATIONS).map(([k,v])=>`<button onclick="station('${k}')">${v.title}</button>`).join('')}
 <button onclick="closingMenu()">Closing</button>
 <button onclick="progressView()">My Progress</button>
 <button onclick="addTeamMember(prompt('Enter team member name'))">Add Team Member</button>
 <button onclick="allProgress()">All Progress</button>
 <button onclick="editTraining()">Edit Training</button>
 
 </div>`;
}
function esc(s){
 return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

async function editTraining(){
 await loadTrainingContent();

 const cats=[
  ['welcome','welcome','Welcome'],
  ['station','primary','Primary'],
  ['station','secondary','Secondary'],
  ['station','machines','Machines'],
  ['station','breading','Breading'],
  ['station','fries','Fries'],
  ['closing','closing','Closing']
 ];

 app.innerHTML=`<h1>Edit Training</h1>
 <p class="sub">Choose a category, then add, edit, or delete training items and links.</p>
 <select id="editCategory" class="trainer-name" onchange="renderEditCategory()">
 ${cats.map(c=>`<option value="${c[0]}|${c[1]}">${c[2]}</option>`).join('')}
 </select>
 <div id="editItems"></div>`;

 renderEditCategory();
}

function renderEditCategory(){
 const [section,category]=document.getElementById('editCategory').value.split('|');
 const items=trainingContent.filter(x=>x.section===section&&x.category===category&&x.item_type!=='category');

 document.getElementById('editItems').innerHTML=`
 <button onclick="addCategoryItem('${section}','${category}')">Add New Item</button>
 ${items.length ? items.map(x=>`
  <div class="card">
   <h2>${esc(x.title)}</h2>
   ${x.description?`<p>${esc(x.description)}</p>`:''}
   ${x.link_url?`<p>Link attached</p>`:''}
   <button onclick="editCategoryItem(${x.id})">Edit</button>
   <button onclick="deleteCategoryItem(${x.id})">Delete</button>
  </div>`).join('') : '<p class="note">No added items yet.</p>'}`;
}

async function addCategoryItem(section,category){
 const title=prompt('Training item title');
 if(!title)return;
 const description=prompt('Instructions or description')||'';
 const link=prompt('Link (optional)')||'';

 await addTrainingItem({
  section,
  category,
  title:title.trim(),
  description:description.trim(),
  link_url:link.trim(),
  item_type:link.trim()?'link':'item',
  sort_order:999
 });

 await editTraining();
}
async function addSubsectionItem(section,category,subsection){
 const title=prompt('Training item title');
 if(!title)return;

 const description=prompt('Instructions or description')||'';
 const link=prompt('Link (optional)')||'';

 await addTrainingItem({
  section,
  category,
  subsection,
  title:title.trim(),
  description:description.trim(),
  link_url:link.trim(),
  item_type:link.trim()?'link':'item',
  sort_order:999
 });

 await station(category);
}
async function editCategoryItem(id){
 const item=trainingContent.find(x=>x.id===id);
 if(!item)return;

 const title=prompt('Title',item.title||'');
 if(title===null)return;

 const description=prompt('Instructions or description',item.description||'');
 if(description===null)return;

 const link=prompt('Link (optional)',item.link_url||'');
 if(link===null)return;

 const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};

 await fetch(`${SUPABASE_URL}/rest/v1/training_content?id=eq.${id}`,{
  method:'PATCH',
  headers:h,
  body:JSON.stringify({
   title:title.trim(),
   description:description.trim(),
   link_url:link.trim(),
   item_type:link.trim()?'link':'item'
  })
 });

 await editTraining();
}

async function deleteCategoryItem(id){
 if(!confirm('Delete this training item?'))return;

 const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};

 await fetch(`${SUPABASE_URL}/rest/v1/training_content?id=eq.${id}`,{
  method:'DELETE',
  headers:h
 });

 await editTraining();
}
 
 const added=trainingContent.filter(
  x=>x.section==='welcome' &&
  x.category==='welcome' &&
  x.item_type!=='category'
 );

 app.innerHTML=`<h1>Welcome & Restaurant Tour</h1>
 <p class="sub">Complete these basics before station training.</p>

 ${added.length?`
  <div class="section">
   <h2>Start Here</h2>
   ${added.map(x=>`
    <div class="card">
     <h2>${esc(x.title)}</h2>
     ${x.description?`<p>${esc(x.description)}</p>`:''}
     ${x.link_url?`<a href="${esc(x.link_url)}" target="_blank" rel="noopener">Open Link</a>`:''}
    </div>
   `).join('')}
  </div>
 `:''}

 <div class="section"><h2>Welcome</h2>
 ${['Clock In','Restaurant Tour'].map(x=>check('welcome','welcome',x)).join('')}
 </div>`;
}
async function welcome(){
 await loadTrainingContent();

 const added=trainingContent.filter(
  x=>x.section==='welcome' &&
  x.category==='welcome' &&
  x.item_type!=='category'
 );

 app.innerHTML=`<h1>Welcome & Restaurant Tour</h1>
 <p class="sub">Complete these basics before station training.</p>

 ${added.length?`
  <div class="section">
   <h2>Start Here</h2>
   ${added.map(x=>`
    <div class="card">
     <h2>${esc(x.title)}</h2>
     ${x.description?`<p>${esc(x.description)}</p>`:''}
     ${x.link_url?`<a href="${esc(x.link_url)}" target="_blank" rel="noopener">Open Link</a>`:''}
    </div>
   `).join('')}
  </div>
 `:''}

 <div class="section">
  <h2>Welcome</h2>
  ${['Clock In','Restaurant Tour'].map(x=>check('welcome','welcome',x)).join('')}
 </div>`;
}

async function station(slug){
 let s=STATIONS[slug];
 await loadTrainingContent();

 app.innerHTML=`<h1>${s.title}</h1>
 <p class="sub">Quick-read training guide. Check an item when it has been demonstrated.</p>

 ${s.sections.map(([title,items])=>{
   const added=trainingContent.filter(
    x=>x.section==='station' &&
    x.category===slug &&
    x.subsection===title &&
    x.item_type!=='category'
   );

   return `<div class="section">
    <h2>${title}</h2>

    ${items.map(x=>check('station',slug,x)).join('')}

    ${added.map(x=>`
     <div class="card">
      <h2>${esc(x.title)}</h2>
      ${x.description?`<p>${esc(x.description)}</p>`:''}
      ${x.link_url?`<a href="${esc(x.link_url)}" target="_blank" rel="noopener">Open Link</a>`:''}
     </div>
    `).join('')}

    <button onclick="addSubsectionItem('station','${slug}','${title.replaceAll("'","\\'")}')">Add Item</button>
   </div>`;
 }).join('')}`;
}

function closingMenu(){
 app.innerHTML=`<h1>Closing</h1>
 <p class="sub">Choose a closing area.</p>
 <div class="menu">
 ${Object.entries(CLOSING).map(([k,v])=>`<button onclick="closingPage('${k}')">${v.title.replace('Closing ','')}</button>`).join('')}
 </div>`;
}

async function closingPage(slug){
 let s=CLOSING[slug];
 await loadTrainingContent();

 app.innerHTML=`<h1>${s.title}</h1>
 <p class="sub">Quick-read closing guide.</p>

 ${s.sections.map(([title,items])=>{
   const subsectionKey=`${slug}::${title}`;

   const added=trainingContent.filter(
    x=>x.section==='closing' &&
    x.category==='closing' &&
    x.subsection===subsectionKey &&
    x.item_type!=='category'
   );

   return `<div class="section">
    <h2>${title}</h2>

    ${items.map(x=>check('closing',slug,x)).join('')}

    ${added.map(x=>`
     <div class="card">
      <h2>${esc(x.title)}</h2>
      ${x.description?`<p>${esc(x.description)}</p>`:''}
      ${x.link_url?`<a href="${esc(x.link_url)}" target="_blank" rel="noopener">Open Link</a>`:''}
     </div>
    `).join('')}

    <button onclick="addClosingSubsectionItem('${slug}','${title.replaceAll("'","\\'")}')">Add Item</button>
   </div>`;
 }).join('')}`;
}

async function addClosingSubsectionItem(slug,subsection){
 const title=prompt('Training item title');
 if(!title)return;

 const description=prompt('Instructions or description')||'';
 const link=prompt('Link (optional)')||'';

 await addTrainingItem({
  section:'closing',
  category:'closing',
  subsection:`${slug}::${subsection}`,
  title:title.trim(),
  description:description.trim(),
  link_url:link.trim(),
  item_type:link.trim()?'link':'item',
  sort_order:999
 });

 await closingPage(slug);
}
function check(group,slug,item){
 let id=idFor(group,slug,item), checked=progress[id]?'checked':'';
 return `<label class="checkrow"><input type="checkbox" ${checked} onchange="toggle('${encodeURIComponent(id)}',this.checked)"><span>${item}</span></label>`;
}

function toggle(encoded,val){
 progress[decodeURIComponent(encoded)]=val;
 save();
}

function progressView(){
 let blocks=[];
 for(const [k,v] of Object.entries(STATIONS)){
  let [n,t,p]=pctFor('station',k,v);
  blocks.push(prog(v.title,n,t,p));
 }
 for(const [k,v] of Object.entries(CLOSING)){
  let [n,t,p]=pctFor('closing',k,v);
  blocks.push(prog(v.title,n,t,p));
 }
 app.innerHTML=`<h1>My Progress</h1><p>Team member: <b>${trainee || 'Not selected'}</b></p>${blocks.join('')}`;
}
async function allProgress(){const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};const r=await fetch(`${SUPABASE_URL}/rest/v1/boh_training?select=team_member,progress&order=team_member.asc`,{headers:h});const rows=await r.json();const people={};rows.forEach(x=>{if(!x.team_member)return;people[x.team_member]={...(people[x.team_member]||{}),...(x.progress||{})};});const ids=[];for(const[k,v]of Object.entries(STATIONS))allItems(v).forEach(item=>ids.push(idFor('station',k,item)));for(const[k,v]of Object.entries(CLOSING))allItems(v).forEach(item=>ids.push(idFor('closing',k,item)));app.innerHTML=`<h1>All Progress</h1><div class="menu">${Object.entries(people).map(([name,p])=>{const n=ids.filter(id=>p[id]).length;const pct=ids.length?Math.round(n/ids.length*100):0;return `<button onclick="setTrainee('${name.replaceAll("'","\\'")}').then(progressView)">${name} — ${pct}%</button>`;}).join('')}</div>`;}
function prog(title,n,t,p){return `<div class="card"><h2>${title}</h2><div class="progressbar"><span style="width:${p}%"></span></div><div class="small">${n} of ${t} complete · ${p}%</div></div>`;}
async function loadTeamMembers(){const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};const r=await fetch(`${SUPABASE_URL}/rest/v1/boh_training?select=team_member&order=team_member.asc`,{headers:h});const rows=await r.json();return [...new Set(rows.map(x=>x.team_member).filter(Boolean))];}
async function  trainer(){
const teamMembers=await loadTeamMembers(); 
 app.innerHTML=`<h1>Trainer View</h1><p class="sub">Enter the team member name, then use the same station checklists to record progress on this device.</p>
<select class="trainer-name" onchange="setTrainee(this.value)"><option value="">Select team member</option>${teamMembers.map(name=>`<option value="${name.replaceAll('"','&quot;')}" ${name===trainee?'selected':''}>${name}</option>`).join('')}</select>
 <div class="menu">${Object.entries(STATIONS).map(([k,v])=>`<button onclick="station('${k}')">${v.title}</button>`).join('')}
 <button onclick="closingMenu()">Closing</button><button onclick="progressView()">View Progress</button></div>
 <p class="note"><b>Prototype note:</b> progress currently saves only on this phone/browser. Shared progress across multiple trainers will require a connected database in the next version.</p>`;
}
async function loadRemote(){if(!trainee){progress={};return;}const h={'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY};const q=encodeURIComponent(trainee);const r=await fetch(`${SUPABASE_URL}/rest/v1/boh_training?team_member=eq.${q}&select=progress`,{headers:h});const rows=await r.json();progress=rows.length&&rows[0].progress?rows[0].progress:{};}
async function setTrainee(name){trainee=name.trim();await loadRemote();}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>({learn:home,progress:progressView,trainer}[b.dataset.nav])());
document.getElementById('homeBtn').onclick=home;
home();
