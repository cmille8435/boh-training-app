// Shared item photos use the existing training content service.
const UPLOADED_PHOTO_PREFIX='__foh_photo__:';
let uploadedPhotoRows=[];
function safePhotoSource(src){return /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=\s]+$/.test(src||'')?src:'';}
function uploadedPhoto(row){try{const p=JSON.parse(row.description||'{}');return safePhotoSource(p.src)?{...p,id:row.id,key:row.subsection}:null;}catch{return null;}}
async function readUploadedPhotoRows(path){
 for(let attempt=0;attempt<3;attempt++){
  try{return await request(path);}catch(error){
   if(attempt===2||!/(500|502|503|504)/.test(error.message||''))throw error;
   await new Promise(resolve=>setTimeout(resolve,400*(attempt+1)));
  }
 }
}
async function resolveUploadedPhoto(row){
 const direct=uploadedPhoto(row);if(direct)return direct;
 let p;try{p=JSON.parse(row.description||'{}');}catch{return null;}
 if(!Array.isArray(p.chunkTitles)||!p.chunkTitles.length||p.chunkTitles.length>64||!p.chunkTitles.every(t=>typeof t==='string'&&t.startsWith(UPLOADED_PHOTO_PREFIX+'chunk:')))return null;
 const parts=[];
 for(const title of p.chunkTitles){
  const rows=await readUploadedPhotoRows('training_content?select=description&title=eq.'+encodeURIComponent(title)+'&subsection=eq.'+encodeURIComponent(row.subsection)+'&limit=1');
  if(!rows?.[0])throw new Error('A saved photo could not be loaded. Please reopen this section.');
  const chunk=JSON.parse(rows[0].description||'{}');
  if(typeof chunk.part!=='string')throw new Error('A saved photo is incomplete.');
  parts.push(chunk.part);
 }
 const src=parts.join('');
 return safePhotoSource(src)?{...p,src,id:row.id,key:row.subsection}:null;
}
async function loadUploadedPhotos(group,slug){
 const scope='&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*')+'&title=not.like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'chunk:*')+'&section=eq.'+encodeURIComponent(group)+'&category=eq.'+encodeURIComponent(slug);
 const metadata=await readUploadedPhotoRows('training_content?select=id,subsection'+scope+'&order=sort_order.asc,id.asc');
 if(!Array.isArray(metadata))throw new Error('Photos could not be loaded. Please reopen this section.');
 const photos=[];
 // Fetch at most two photo records at once, avoiding a single large JSON response.
 for(let i=0;i<metadata.length;i+=2){
  const batch=await Promise.all(metadata.slice(i,i+2).map(async row=>{
   const rows=await readUploadedPhotoRows('training_content?select=id,subsection,description&id=eq.'+encodeURIComponent(row.id)+scope);
   return rows?.[0]?await resolveUploadedPhoto(rows[0]):null;
  }));
  photos.push(...batch.filter(Boolean));
 }
 uploadedPhotoRows=photos;
}
function uploadedPhotosHtml(item){
 const photos=uploadedPhotoRows.filter(p=>p.key===item.key);if(!photos.length)return '';
 return '<details class="quality-photos"><summary>Added photos ('+photos.length+')</summary><div class="quality-photo-grid">'+photos.map(p=>'<div class="quality-photo-entry"><button type="button" class="quality-photo-thumbnail" onclick="openUploadedPhoto('+arg(p.id)+')" aria-label="Enlarge '+esc(p.name||'photo')+'"><img src="'+esc(p.src)+'" alt="'+esc(p.name||item.title)+'" loading="lazy"><span>'+esc(p.name||'Photo')+'</span></button><button type="button" class="ghost" onclick="run(()=>deleteUploadedPhoto('+arg(p.id)+'))">Delete photo</button></div>').join('')+'</div></details>';
}
function openUploadedPhoto(id){
 const p=uploadedPhotoRows.find(p=>p.id===id);if(!p)return;if(typeof stopSandwichBuild==='function')stopSandwichBuild();
 let dialog=document.getElementById('uploadedPhotoDialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='uploadedPhotoDialog';dialog.className='training-image-dialog';document.body.appendChild(dialog);dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
 dialog.innerHTML='<div class="training-image-heading"><h2>'+esc(p.name||'Photo')+'</h2><button type="button" class="ghost" onclick="document.getElementById(\'uploadedPhotoDialog\').close()">Close</button></div><img src="'+esc(p.src)+'" alt="'+esc(p.name||'Training photo')+'">';if(!dialog.open)dialog.showModal();
}
async function deleteUploadedPhoto(id){
 if(!confirm('Delete this photo for everyone?'))return;
 const saved=uploadedPhotoRows.find(p=>p.id===id);

 await request('training_content?id=eq.'+encodeURIComponent(id)+'&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*'),{method:'DELETE'});
 if(saved?.chunkTitles?.length){
  const titles='('+saved.chunkTitles.map(t=>JSON.stringify(t)).join(',')+')';
  await request('training_content?title=in.'+encodeURIComponent(titles)+'&subsection=eq.'+encodeURIComponent(saved.key),{method:'DELETE'});
 }
 uploadedPhotoRows=uploadedPhotoRows.filter(p=>p.id!==id);
 const dialog=document.getElementById('uploadedPhotoDialog');if(dialog?.open)dialog.close();
 if(editing&&document.getElementById('photoEditor'))renderPhotoEditor();else await refreshPage();
}
function photoEditorHtml(){return '<section class="photo-editor"><h2>Photos (optional)</h2><input id="addPhotosButton" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple aria-label="Add Photos" style="display:block;position:static;opacity:1;visibility:visible;width:100%;height:auto;min-height:48px;padding:12px 0;font-size:16px;pointer-events:auto" onchange="prepareItemPhotos(this).catch(report)"><p class="small">Choose photos, use Move Up or Move Down to arrange them, then tap Save Changes.</p><p id="photoStatus" class="small" role="status"></p><div id="photoEditor"></div></section>';}
function orderedEditorPhotos(){
 if(!editing)return [];
 const saved=uploadedPhotoRows.filter(p=>p.key===editing.key).map(p=>({orderKey:'saved:'+p.id,kind:'saved',photo:p}));
 const pending=(editing.pendingPhotos||[]).map((p,index)=>({orderKey:'pending:'+p.token,kind:'pending',photo:p,index}));
 const entries=[...saved,...pending],byKey=new Map(entries.map(p=>[p.orderKey,p]));
 const order=(editing.photoOrder||[]).filter(key=>byKey.has(key));
 for(const entry of entries)if(!order.includes(entry.orderKey))order.push(entry.orderKey);
 editing.photoOrder=order;
 return order.map(key=>byKey.get(key));
}
function moveEditorPhoto(index,direction){
 if(!editing||editing.photosBusy)return;
 const photos=orderedEditorPhotos(),to=index+direction;
 if(index<0||index>=photos.length||to<0||to>=photos.length)return;
 const order=editing.photoOrder;
 [order[index],order[to]]=[order[to],order[index]];
 editing.photoOrderChanged=true;
 renderPhotoEditor();
 const status=document.getElementById('photoStatus');
 if(status)status.textContent='Photo order updated. Tap Save Changes to share it.';
}
function renderPhotoEditor(){
 const target=document.getElementById('photoEditor');if(!target||!editing)return;
 const photos=orderedEditorPhotos();
 target.innerHTML='<div class="quality-photo-grid">'+photos.map((entry,i)=>{
  const p=entry.photo,busy=editing.photosBusy;
  const remove=entry.kind==='saved'?'<button type="button" class="ghost" '+(busy?'disabled':'')+' onclick="run(()=>deleteUploadedPhoto('+arg(p.id)+'))">Delete photo</button>':'<button type="button" class="ghost" '+(busy?'disabled':'')+' onclick="removePendingPhoto('+entry.index+')">Remove</button>';
  return '<div class="quality-photo-entry"><img class="photo-editor-preview" src="'+esc(p.src)+'" alt="'+esc(p.name||'Photo')+'"><span class="small">Photo '+(i+1)+(entry.kind==='pending'?' — Ready to save':'')+'</span><div style="display:flex;gap:6px"><button type="button" class="ghost" style="flex:1;font-size:13px" '+(busy||i===0?'disabled':'')+' onclick="moveEditorPhoto('+i+',-1)">↑ Move Up</button><button type="button" class="ghost" style="flex:1;font-size:13px" '+(busy||i===photos.length-1?'disabled':'')+' onclick="moveEditorPhoto('+i+',1)">↓ Move Down</button></div>'+remove+'</div>';
 }).join('')+'</div>';
}
async function saveEditorPhotoOrder(e,key){
 if(!e.photoOrderChanged)return;
 const ids=(e.photoOrder||[]).filter(value=>value.startsWith('saved:')).map(value=>value.slice(6));
 const status=document.getElementById('editorStatus');if(status)status.textContent='Saving photo order…';
 for(let i=0;i<ids.length;i++){
  await request('training_content?id=eq.'+encodeURIComponent(ids[i])+'&subsection=eq.'+encodeURIComponent(key)+'&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*'),{method:'PATCH',body:JSON.stringify({sort_order:i+1})});
 }
 e.photoOrderChanged=false;
}

function removePendingPhoto(index){if(editing?.photosBusy)return;editing.pendingPhotos.splice(index,1);renderPhotoEditor();}
function readPhotoFile(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Could not read '+file.name+'. Try selecting it again.'));r.readAsDataURL(file);});}
async function preparePhoto(file){
 if(file.size>20*1024*1024)throw new Error(file.name+' is too large. Choose a smaller photo.');
 const raw=await readPhotoFile(file);
 if(file.type==='image/gif'){
  // Preserve animated GIFs up to the shared 20 MB upload limit.
  if(!safePhotoSource(raw))throw new Error('This GIF could not be read.');return {src:raw,name:file.name};
 }
 const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Could not open '+file.name+'. Choose a JPEG, PNG, or GIF version.'));img.src=raw;});
 const scale=Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
 const context=canvas.getContext('2d');if(!context)throw new Error('Unable to prepare this photo.');
 context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
 return {src:canvas.toDataURL('image/jpeg',.82),name:file.name};
}
async function prepareItemPhotos(input){
 const e=editing,files=Array.from(input.files||[]);if(!e||!files.length)return;
 const status=document.getElementById('photoStatus');e.photosBusy=true;status.textContent='Selected '+files.length+' photo(s). Preparing preview…';
 const save=document.getElementById('saveItemButton'),add=document.getElementById('addPhotosButton'),cancel=document.getElementById('cancelItemButton');save.disabled=add.disabled=cancel.disabled=true;
 const errors=[];
 try{
  for(let i=0;i<files.length;i++){status.textContent='Preparing photo '+(i+1)+' of '+files.length+'…';try{const p=await preparePhoto(files[i]);p.token=globalThis.crypto?.randomUUID?.()||('photo-'+Date.now()+'-'+Math.random().toString(36).slice(2));e.pendingPhotos.push(p);}catch(error){errors.push(error.message);}renderPhotoEditor();}
  status.textContent=errors.length?errors.join(' '):'Photos ready. Tap Save Changes to share them.';
  if(errors.length&&!e.pendingPhotos.length)alert(errors.join('\n'));
 }finally{e.photosBusy=false;save.disabled=add.disabled=cancel.disabled=false;input.value='';}
}
async function storePhotoRecord(body){
 const existing=await readUploadedPhotoRows('training_content?select=id&title=eq.'+encodeURIComponent(body.title)+'&section=eq.'+encodeURIComponent(body.section)+'&category=eq.'+encodeURIComponent(body.category)+'&subsection=eq.'+encodeURIComponent(body.subsection)+'&limit=1');
 if(existing?.length)return existing[0].id;
 const rows=await request('training_content?select=id',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
 if(!rows?.[0]?.id)throw new Error('The photo could not be confirmed as saved.');
 return rows[0].id;
}
async function savePendingItemPhotos(e,key){
 const chunkSize=512*1024;
 while(e.pendingPhotos?.length){
  const p=e.pendingPhotos[0];
  const base={section:e.group,category:e.slug,subsection:key,item_type:'category',sort_order:Date.now()%2147483647};
  try{
   let description;
   if(p.src.length>chunkSize){
    const chunkTitles=[];
    const total=Math.ceil(p.src.length/chunkSize);
    for(let offset=0,index=0;offset<p.src.length;offset+=chunkSize,index++){
     const title=UPLOADED_PHOTO_PREFIX+'chunk:'+p.token+':'+index;
     const status=document.getElementById('editorStatus');
     if(status)status.textContent='Saving '+p.name+' ('+(index+1)+'/'+total+')…';
     await storePhotoRecord({...base,title,description:JSON.stringify({part:p.src.slice(offset,offset+chunkSize)})});
     chunkTitles.push(title);
    }
    description=JSON.stringify({name:p.name,chunkTitles});
   }else description=JSON.stringify({src:p.src,name:p.name});
   const savedId=await storePhotoRecord({...base,title:UPLOADED_PHOTO_PREFIX+p.token,description});
   if(e.photoOrder)e.photoOrder=e.photoOrder.map(value=>value==='pending:'+p.token?'saved:'+savedId:value);
   if(!uploadedPhotoRows.some(photo=>photo.id===savedId))uploadedPhotoRows.push({...p,id:savedId,key});
  }catch(error){throw new Error('Could not save '+(p.name||'this photo')+'. '+error.message+' Tap Save Changes to retry the remaining photos.');}
  e.pendingPhotos.shift();
 }
 await saveEditorPhotoOrder(e,key);
}
