// Shared item photos use the existing training content service.
const UPLOADED_PHOTO_PREFIX='__boh_photo__:';
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
async function loadUploadedPhotos(group,slug){
 const scope='&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*')+'&section=eq.'+encodeURIComponent(group)+'&category=eq.'+encodeURIComponent(slug);
 const metadata=await readUploadedPhotoRows('training_content?select=id,subsection'+scope+'&order=sort_order.asc,id.asc');
 if(!Array.isArray(metadata))throw new Error('Photos could not be loaded. Please reopen this section.');
 const photos=[];
 // Fetch at most two photo records at once, avoiding a single large JSON response.
 for(let i=0;i<metadata.length;i+=2){
  const batch=await Promise.all(metadata.slice(i,i+2).map(async row=>{
   const rows=await readUploadedPhotoRows('training_content?select=id,subsection,description&id=eq.'+encodeURIComponent(row.id)+scope);
   return rows?.[0]?uploadedPhoto(rows[0]):null;
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
 const p=uploadedPhotoRows.find(p=>p.id===id);if(!p)return;stopSandwichBuild();
 let dialog=document.getElementById('uploadedPhotoDialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='uploadedPhotoDialog';dialog.className='training-image-dialog';document.body.appendChild(dialog);dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
 dialog.innerHTML='<div class="training-image-heading"><h2>'+esc(p.name||'Photo')+'</h2><button type="button" class="ghost" onclick="document.getElementById(\'uploadedPhotoDialog\').close()">Close</button></div><img src="'+esc(p.src)+'" alt="'+esc(p.name||'Training photo')+'">';if(!dialog.open)dialog.showModal();
}
async function deleteUploadedPhoto(id){
 if(!confirm('Delete this photo for everyone?'))return;
 await request('training_content?id=eq.'+encodeURIComponent(id)+'&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*'),{method:'DELETE'});
 uploadedPhotoRows=uploadedPhotoRows.filter(p=>p.id!==id);
 const dialog=document.getElementById('uploadedPhotoDialog');if(dialog?.open)dialog.close();
 if(editing&&document.getElementById('photoEditor'))renderPhotoEditor();else await refreshPage();
}
function photoEditorHtml(){return '<section class="photo-editor"><h2>Photos (optional)</h2><input id="addPhotosButton" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple aria-label="Add Photos" style="display:block;position:static;opacity:1;visibility:visible;width:100%;height:auto;min-height:48px;padding:12px 0;font-size:16px;pointer-events:auto" onchange="prepareItemPhotos(this).catch(report)"><p class="small">Choose photos from your phone, then tap Save Changes.</p><p id="photoStatus" class="small" role="status"></p><div id="photoEditor"></div></section>';}
function renderPhotoEditor(){
 const target=document.getElementById('photoEditor');if(!target||!editing)return;
 const saved=uploadedPhotoRows.filter(p=>p.key===editing.key);
 target.innerHTML='<div class="quality-photo-grid">'+saved.map(p=>'<div class="quality-photo-entry"><img class="photo-editor-preview" src="'+esc(p.src)+'" alt="'+esc(p.name||'Photo')+'"><button type="button" class="ghost" onclick="run(()=>deleteUploadedPhoto('+arg(p.id)+'))">Delete photo</button></div>').join('')+(editing.pendingPhotos||[]).map((p,i)=>'<div class="quality-photo-entry"><img class="photo-editor-preview" src="'+esc(p.src)+'" alt="'+esc(p.name)+'"><span class="small">Ready to save</span><button type="button" class="ghost" onclick="removePendingPhoto('+i+')">Remove</button></div>').join('')+'</div>';
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
async function savePendingItemPhotos(e,key){
 while(e.pendingPhotos?.length){
  const p=e.pendingPhotos[0];
  try{
  await request('training_content',{method:'POST',body:JSON.stringify({section:e.group,category:e.slug,subsection:key,title:UPLOADED_PHOTO_PREFIX+p.token,description:JSON.stringify({src:p.src,name:p.name}),item_type:'category',sort_order:Date.now()%2147483647})});
  }catch(error){throw new Error('Could not save '+(p.name||'this photo')+'. '+error.message+' Tap Save Changes to retry the remaining photos.');}
  e.pendingPhotos.shift();
 }
}
