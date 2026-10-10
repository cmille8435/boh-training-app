// Shared item photos use the existing training content service.
const UPLOADED_PHOTO_PREFIX='__boh_photo__:';
let uploadedPhotoRows=[];
function safePhotoSource(src){return /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=\s]+$/.test(src||'')?src:'';}
function uploadedPhoto(row){try{const p=JSON.parse(row.description||'{}');return safePhotoSource(p.src)?{...p,id:row.id,key:row.subsection}:null;}catch{return null;}}
async function loadUploadedPhotos(group,slug){
 const rows=await request('training_content?select=id,subsection,description&title=like.'+encodeURIComponent(UPLOADED_PHOTO_PREFIX+'*')+'&section=eq.'+encodeURIComponent(group)+'&category=eq.'+encodeURIComponent(slug)+'&order=sort_order.asc,id.asc');
 uploadedPhotoRows=rows.map(uploadedPhoto).filter(Boolean);
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
function photoEditorHtml(){return '<section class="photo-editor"><h2>Photos (optional)</h2><label class="ghost" style="position:relative;display:inline-block;overflow:hidden;cursor:pointer">Add Photos<input id="addPhotosButton" type="file" accept="image/*" multiple aria-label="Add Photos" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer" onchange="run(()=>prepareItemPhotos(this))"></label><p class="small">Choose photos from your phone, then tap Save Changes.</p><p id="photoStatus" class="small" role="status"></p><div id="photoEditor"></div></section>';}
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
  if(file.size>2*1024*1024)throw new Error('Choose a GIF smaller than 2 MB.');
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
 const status=document.getElementById('photoStatus');e.photosBusy=true;
 const save=document.getElementById('saveItemButton'),add=document.getElementById('addPhotosButton'),cancel=document.getElementById('cancelItemButton');save.disabled=add.disabled=cancel.disabled=true;
 const errors=[];
 try{
  for(let i=0;i<files.length;i++){status.textContent='Preparing photo '+(i+1)+' of '+files.length+'…';try{const p=await preparePhoto(files[i]);p.token=crypto.randomUUID();e.pendingPhotos.push(p);}catch(error){errors.push(error.message);}renderPhotoEditor();}
  status.textContent=errors.length?errors.join(' '):'Photos ready. Tap Save Changes to share them.';
 }finally{e.photosBusy=false;save.disabled=add.disabled=cancel.disabled=false;input.value='';}
}
async function savePendingItemPhotos(e,key){
 while(e.pendingPhotos?.length){
  const p=e.pendingPhotos[0];
  await request('training_content',{method:'POST',body:JSON.stringify({section:e.group,category:e.slug,subsection:key,title:UPLOADED_PHOTO_PREFIX+p.token,description:JSON.stringify({src:p.src,name:p.name}),item_type:'category',sort_order:Date.now()%2147483647})});
  e.pendingPhotos.shift();
 }
}
