const app=document.getElementById('app');
const key='boh-training-progress-v1';
let progress=JSON.parse(localStorage.getItem(key)||'{}');
let trainee=localStorage.getItem('boh-trainee')||'';

function save(){localStorage.setItem(key,JSON.stringify(progress));}
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
 </div>`;
}

function welcome(){
 app.innerHTML=`<h1>Welcome & Restaurant Tour</h1><p class="sub">Complete these basics before station training.</p>
 <div class="section"><h2>Welcome</h2>
 ${['Clock In','Restaurant Tour'].map(x=>check('welcome','welcome',x)).join('')}</div>
 <p class="note">This prototype keeps the welcome section intentionally short. Add your restaurant-specific tour details when you are ready.</p>`;
}

function check(group,slug,item){
 let id=idFor(group,slug,item), checked=progress[id]?'checked':'';
 return `<label class="checkrow"><input type="checkbox" ${checked} onchange="toggle('${encodeURIComponent(id)}',this.checked)"><span>${item}</span></label>`;
}

function toggle(encoded,val){progress[decodeURIComponent(encoded)]=val;save();}

function station(slug){
 let s=STATIONS[slug];
 app.innerHTML=`<h1>${s.title}</h1><p class="sub">Quick-read training guide. Check an item when it has been demonstrated.</p>
 ${s.sections.map(([title,items])=>`<div class="section"><h2>${title}</h2>${items.map(x=>check('station',slug,x)).join('')}</div>`).join('')}`;
}

function closingMenu(){
 app.innerHTML=`<h1>Closing</h1><p class="sub">Choose a closing area.</p><div class="menu">
 ${Object.entries(CLOSING).map(([k,v])=>`<button onclick="closingPage('${k}')">${v.title.replace('Closing ','')}</button>`).join('')}</div>`;
}

function closingPage(slug){
 let s=CLOSING[slug];
 app.innerHTML=`<h1>${s.title}</h1><p class="sub">Quick-read closing guide.</p>
 ${s.sections.map(([title,items])=>`<div class="section"><h2>${title}</h2>${items.map(x=>check('closing',slug,x)).join('')}</div>`).join('')}`;
}

function progressView(){
 let blocks=[];
 for (const [k,v] of Object.entries(STATIONS)){let [n,t,p]=pctFor('station',k,v);blocks.push(prog(v.title,n,t,p));}
 for (const [k,v] of Object.entries(CLOSING)){let [n,t,p]=pctFor('closing',k,v);blocks.push(prog(v.title,n,t,p));}
 app.innerHTML=`<h1>My Progress</h1><p class="sub">${trainee?`Team member: <b>${trainee}</b>`:'Progress is saved on this device.'}</p>${blocks.join('')}`;
}

function prog(title,n,t,p){return `<div class="card"><h2>${title}</h2><div class="progressbar"><span style="width:${p}%"></span></div><div class="small">${n} of ${t} complete · ${p}%</div></div>`;}

function trainer(){
 app.innerHTML=`<h1>Trainer View</h1><p class="sub">Enter the team member name, then use the same station checklists to record progress on this device.</p>
 <input class="trainer-name" value="${trainee.replaceAll('"','&quot;')}" placeholder="Team member name" oninput="setTrainee(this.value)">
 <div class="menu">${Object.entries(STATIONS).map(([k,v])=>`<button onclick="station('${k}')">${v.title}</button>`).join('')}
 <button onclick="closingMenu()">Closing</button><button onclick="progressView()">View Progress</button></div>
 <p class="note"><b>Prototype note:</b> progress currently saves only on this phone/browser. Shared progress across multiple trainers will require a connected database in the next version.</p>`;
}

function setTrainee(v){trainee=v;localStorage.setItem('boh-trainee',v);}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>({learn:home,progress:progressView,trainer}[b.dataset.nav])());
document.getElementById('homeBtn').onclick=home;
home();