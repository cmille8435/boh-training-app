// Quality Photos reference supplied by the restaurant: October 2024.
// Breakfast and cookie references are intentionally excluded.
const QUALITY_PHOTOS = {
  701:["Position the lid supports","ice-bath-setup-1.jpeg"],
  702:["Install the supply holder","ice-bath-setup-2.jpeg"],
  703:["Fill a container with water","ice-bath-setup-3.jpeg"],
  704:["Prepare containers of ice","ice-bath-setup-4.jpeg"],
  705:["Add ice to the table","ice-bath-setup-5.jpeg"],
  706:["Mix the ice bath","ice-bath-setup-6.jpeg"],
  707:["Install the pan support frame","ice-bath-setup-7.jpeg"],
  708:["Place the pans in the table","ice-bath-setup-8.jpeg"],
  709:["Install the pan divider","ice-bath-setup-9.jpeg"],
  710:["Position the remaining pan","ice-bath-setup-10.jpeg"],
  711:["Open the seasoned coater bag","ice-bath-setup-11.gif"],
  712:["Add milk and egg wash","ice-bath-setup-12.jpeg"],
  713:["Load chicken into the pan","ice-bath-setup-13.jpeg"],
  714:["Arrange chicken in the pan","ice-bath-setup-14.jpeg"],
  715:["Completed breading table setup","ice-bath-setup-15.jpeg"],
  601:["Filet roller components","filet-roller-prepare-1.jpeg"],
  602:["Roller gear detail","filet-roller-prepare-2.gif"],
  603:["Roller side detail","filet-roller-prepare-3.gif"],
  604:["Roller handle","filet-roller-prepare-4.gif"],
  605:["Assembled roller with pans","filet-roller-prepare-5.jpeg"],
  606:["Prepared roller station","filet-roller-prepare-6.jpeg"],
  501:["Preparation equipment","grilled-prepare-1.jpeg"],
  502:["Prepare grilled filets","grilled-prepare-2.jpeg"],
  503:["Prepare the marinade","grilled-prepare-3.jpeg"],
  504:["Add marinade to chicken","grilled-prepare-4.jpeg"],
  505:["Mix chicken and marinade","grilled-prepare-5.gif"],
  401:['Grilled filet placement — Garland Grill 1.0 and 2.0','grilled-filets-loading.jpeg'],
  402:['Loading grilled nuggets','grilled-nuggets-loading.jpeg'],
  301:["Transfer strips to milk and egg wash","breading-strips-step-1.jpg"],
  302:["Coat and separate strips in milk and egg wash","breading-strips-step-2.jpg"],
  303:["Drain strips","breading-strips-step-3.jpg"],
  304:["Transfer strips to seasoned coater","breading-strips-step-4.jpg"],
  305:["Coat strips with seasoned coater","breading-strips-step-5.jpg"],
  306:["Transfer breaded strips to the wire basket","breading-strips-step-6.jpg"],
  307:["Gently remove excess coater","breading-strips-step-7.jpg"],
  308:["Place the transfer pan on the fryer shelf","breading-strips-step-8.jpg"],
  309:["Position strips on basket shelves","breading-strips-step-9.jpg"],
  310:["Place smaller batches on middle shelves","breading-strips-step-10.jpg"],
  311:["Lower the basket cover","breading-strips-step-11.jpg"],
  201:["Measure nuggets with the scoop","breading-nuggets-step-1.jpg"],
  202:["Separate and check nuggets","breading-nuggets-step-2.jpg"],
  203:["Coat nuggets with milk and egg wash","breading-nuggets-step-3.jpg"],
  204:["Drain excess milk and egg wash","breading-nuggets-step-4.jpg"],
  205:["Transfer nuggets to seasoned coater","breading-nuggets-step-5.jpg"],
  206:["Cover and coat nuggets","breading-nuggets-step-6.jpg"],
  207:["Transfer nuggets to the wire basket","breading-nuggets-step-7.jpg"],
  208:["Gently remove excess coater","breading-nuggets-step-8.jpg"],
  209:["Place transfer pan on the fryer shelf","breading-nuggets-step-9.jpg"],
  210:["Pour breaded nuggets into the nugget basket","breading-nuggets-step-10.jpg"],
  101:["Open coater bag from the top seal","breading-filets-step-1.jpg"],
  102:["Coat filets with milk and egg wash","breading-filets-step-2.jpg"],
  103:["Gently drain excess milk and egg wash","breading-filets-step-3.jpg"],
  104:["Bread filets in coater","breading-filets-step-4.jpg"],
  105:["Place breaded filets in transfer pan","breading-filets-step-5.jpg"],
  106:["Rub excess coater back into the pan","breading-filets-step-6.jpg"],
  107:["Regular filet placement in the fryer basket","breading-filets-step-7.jpg"],
  108:["Lower the regular filet basket cover","breading-filets-step-8.jpg"],
  4:['Filet coater color','page-04.jpg'],5:['Filet coater consistency','page-05.jpg'],6:['Minimum filet bun coverage','page-06.jpg'],7:['Filet coater coverage','page-07.jpg'],
  8:['Spicy filet coater color','page-08.jpg'],9:['Spicy filet coater consistency','page-09.jpg'],10:['Minimum spicy filet bun coverage','page-10.jpg'],
  11:['Grilled filet maximum carbon','grilled-filet-carbon.jpg'],12:['Grilled filet color','page-12.jpg'],13:['Minimum grilled filet bun coverage','page-13.jpg'],
  14:['White bun buttering','page-14.jpg'],15:['White bun crown toasting','page-15.jpg'],16:['White bun heel toasting','page-16.jpg'],
  17:['Multigrain brioche crown toasting','page-17.jpg'],18:['Multigrain brioche heel toasting','page-18.jpg'],19:['White and multigrain brioche bun size','page-19.jpg'],
  20:['Nugget color and coater coverage','page-20.jpg'],21:['Grilled nugget color','page-21.jpg'],22:['Grilled nugget maximum carbon','page-22.jpg'],
  23:['Chick-n-Strips color and coater coverage','page-23.jpg'],24:['Spicy Chick-n-Strips color and coater coverage','page-24.jpg'],25:['Cool Wrap size','page-25.jpg'],
  26:['Lettuce and packaging','page-26.jpg'],27:['Tomato color range','page-27.jpg'],28:['Tomato size and thickness','page-28.jpg'],29:['Unacceptable tomatoes: holes, tears and missing gel','page-29.jpg'],30:['Tomato inner core stem','page-30.jpg'],
  31:['Small fries package fill — target','small-fries-fill.jpg'],32:['Waffle fry color','page-32.jpg'],33:['Mac & cheese package fill','page-33.jpg'],
  34:['Medium fries package fill — target','medium-fries-fill.jpg'],35:['Large fries package fill — target','large-fries-fill.jpg']
};
const QUALITY_REGULAR=[4,5,6,7,14,15,16,19],QUALITY_SPICY=[8,9,10,7,14,15,16,19],QUALITY_GRILLED=[11,12,13,17,18,19,26,27,28,29,30],QUALITY_VEGETABLES=[26,27,28,29,30],QUALITY_FRIES=[31,34,35,32];
const QUALITY_ITEM_PHOTOS={
 'station:primary:Regular CFA Sandwich':QUALITY_REGULAR,
 'station:primary:Spicy CFA Sandwich':QUALITY_SPICY,
 'station:primary:CFA Deluxe':[...QUALITY_REGULAR,...QUALITY_VEGETABLES],
 'station:primary:Spicy Deluxe':[...QUALITY_SPICY,...QUALITY_VEGETABLES],
 'station:primary:Grilled Sandwich':QUALITY_GRILLED,
 'station:primary:Grilled Club':QUALITY_GRILLED,
 'station:secondary:Nuggets':[20], 'station:secondary:Strips':[23,24], 'station:secondary:Mac & Cheese':[33], 'station:secondary:Grilled Nuggets':[21,22],
 'station:breading:Bread filets and spicy filets':[4,5,7,8,9], 'station:breading:Bread nuggets':[20], 'station:breading:Bread strips':[23,24],
 'station:breading:Load grilled chicken properly':[11,12,21,22],
 'station:machines:Properly use Garland grill':[11,12,21,22],
 'station:fries:Prepare waffle fries for orders':QUALITY_FRIES,
 'station:rsa-assessment:Regular Chicken Sandwich':QUALITY_REGULAR,
 'station:rsa-assessment:Grilled Chicken Sandwich':QUALITY_GRILLED,
 'station:rsa-assessment:8-Count Regular Nuggets':[20], 'station:rsa-assessment:5-Count Grilled Nuggets':[21,22], 'station:rsa-assessment:Waffle Fries':QUALITY_FRIES
};
function qualityPhotoIds(item){
 if(item.key.startsWith('station:breading:'))return [];
 if(item.key.startsWith('station:fries:')&&item.key!=='station:fries:Prepare waffle fries for orders')return [];
 if(QUALITY_ITEM_PHOTOS[item.key])return QUALITY_ITEM_PHOTOS[item.key];
 const title=String(item.original||item.title||'').toLowerCase();
 if(/breakfast|cookie|biscuit|hash brown|chick.n.minis/.test(title))return [];
 if(/cool wrap|coolwrap/.test(title))return [25];
 if(/tomato/.test(title))return [27,28,29,30];
 if(/lettuce/.test(title))return [26];
 if(/bun|toast/.test(title))return /multigrain|brioche/.test(title)?[17,18,19]:[14,15,16,19];
 if(/mac.*cheese/.test(title))return [33];
 if(/grilled nugget/.test(title))return [21,22];
 if(/nugget/.test(title))return [20];
 if(/strip/.test(title))return /spicy/.test(title)?[24]:[23,24];
 if(/grilled.*sandwich|grilled club|grilled filet/.test(title))return QUALITY_GRILLED;
 if(/sandwich|deluxe|filet/.test(title))return /spicy/.test(title)?QUALITY_SPICY:QUALITY_REGULAR;
 if(/fries|waffle fry/.test(title))return QUALITY_FRIES;
 return [];
}
function qualityGalleryHtml(ids,title='Quality photos',galleryKey='gallery:'+title){
 ids=ids.filter(id=>!meta('photo-hidden:'+galleryKey+':'+id).hidden);
 const savedOrder=meta('photo-order:'+galleryKey).ids;
 if(Array.isArray(savedOrder))ids=[...savedOrder.filter(id=>ids.includes(id)),...ids.filter(id=>!savedOrder.includes(id))];
 if(!ids.length)return '';
 return `<details class="quality-photos"><summary>${esc(title)} (${ids.length})</summary><div class="quality-photo-grid">${ids.map((id,index)=>{const [caption,file]=QUALITY_PHOTOS[id];return `<div class="quality-photo-entry"><button type="button" class="quality-photo-thumbnail" onclick="openQualityPhoto(${arg(ids)},${index})" aria-label="Enlarge ${esc(caption)}"><img src="assets/quality/${file}" alt="${esc(caption)}" loading="lazy" width="120" height="120"><span>${esc(caption)}</span></button><div style="display:flex;gap:6px"><button type="button" class="ghost" data-quality-order style="flex:1;font-size:13px" onclick="run(()=>moveQualityPhoto(${arg(galleryKey)},${arg(ids)},${index},-1))" ${index===0?'disabled':''}>↑ Move Up</button><button type="button" class="ghost" data-quality-order style="flex:1;font-size:13px" onclick="run(()=>moveQualityPhoto(${arg(galleryKey)},${arg(ids)},${index},1))" ${index===ids.length-1?'disabled':''}>↓ Move Down</button></div><button type="button" class="ghost" onclick="run(()=>deleteTrainingPhoto(${arg(galleryKey)},${id}))" aria-label="Delete ${esc(caption)}">Delete photo</button></div>`;}).join('')}</div></details>`;
}
function qualityPhotosHtml(item){
 const gallery=(ids,title)=>qualityGalleryHtml(ids,title,item.key);
 if(/^set\s*up ice bath breading table$/i.test(item.title||'')||/^set\s*up ice bath breading table$/i.test(item.original||''))return gallery([701,702,703,704,705,706,707,708,709,710,711,712,713,714,715],'Ice bath breading table setup — step photos');
 if(/filet roller.*prepar.*use/i.test(item.title||item.original||''))return gallery([601,602,603,604,605,606],'Filet roller preparation — photos');
 if(item.key==='station:breading:Marinate and prepare grilled filets/nuggets')return gallery([501,502,503,504,505],'Marinate and prepare grilled filets/nuggets — photos');
 if(item.key==='station:breading:Load grilled chicken properly')return gallery([401,402],'Load grilled filets and grilled nuggets — photos').replace(/<p class="small quality-source">[\s\S]*?<\/p>/,'');
 if(item.key==='station:breading:Bread strips')return gallery([301,302,303,304,305,306,307,308,309,310,311],'Breading strips — step photos').replace(/<p class="small quality-source">[\s\S]*?<\/p>/,'');
 if(item.key==='station:breading:Bread nuggets')return gallery([201,202,203,204,205,206,207,208,209,210],'Breading nuggets — step photos').replace(/<p class="small quality-source">[\s\S]*?<\/p>/,'');
 if(item.key==='station:breading:Bread filets and spicy filets')return gallery([101,102,103,104,105,106,107,108],'Regular filet breading — step photos').replace(/<p class="small quality-source">[\s\S]*?<\/p>/,'');
 return gallery(qualityPhotoIds(item));
}
function qualityCategoryHtml(group,slug){
 if(group!=='station')return '';
 const groups=slug==='primary'?[['Buns',[14,15,16,17,18,19]],['Lettuce, tomatoes & packaging',QUALITY_VEGETABLES],['Cool Wrap',[25]]]:[];
 return groups.length?`<section class="section quality-category"><h2>Ingredient & product quality references</h2>${groups.map(([title,ids])=>qualityGalleryHtml(ids,title)).join('')}</section>`:'';
}
let qualityDialogIds=[],qualityDialogIndex=0;
function openQualityPhoto(ids,index){
 stopSandwichBuild();qualityDialogIds=ids.filter(id=>QUALITY_PHOTOS[id]);if(!qualityDialogIds.length)return;
 qualityDialogIndex=Math.max(0,Math.min(index,qualityDialogIds.length-1));
 let dialog=document.getElementById('qualityPhotoDialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='qualityPhotoDialog';dialog.className='training-image-dialog quality-photo-dialog';document.body.appendChild(dialog);dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();stepQualityPhoto(-1);}if(event.key==='ArrowRight'){event.preventDefault();stepQualityPhoto(1);}});}
 renderQualityPhoto();if(!dialog.open)dialog.showModal();
}
function renderQualityPhoto(){
 const dialog=document.getElementById('qualityPhotoDialog'),[caption,file]=QUALITY_PHOTOS[qualityDialogIds[qualityDialogIndex]];
 dialog.innerHTML=`<div class="training-image-heading"><h2>${esc(caption)}</h2><button type="button" class="ghost" onclick="document.getElementById('qualityPhotoDialog').close()">Close</button></div><img src="assets/quality/${file}" alt="${esc(caption)}"><div class="quality-photo-navigation"><button type="button" class="ghost" onclick="stepQualityPhoto(-1)" ${qualityDialogIndex===0?'disabled':''}>Previous</button><span role="status" aria-live="polite">${qualityDialogIndex+1} of ${qualityDialogIds.length}</span><button type="button" class="ghost" onclick="stepQualityPhoto(1)" ${qualityDialogIndex===qualityDialogIds.length-1?'disabled':''}>Next</button></div>`;
}
function stepQualityPhoto(step){const next=qualityDialogIndex+step;if(next<0||next>=qualityDialogIds.length)return;qualityDialogIndex=next;renderQualityPhoto();}

async function deleteTrainingPhoto(galleryKey,id){
 const photo=QUALITY_PHOTOS[id];if(!photo)return;
 if(!confirm('Delete this photo from this training gallery for everyone?'))return;
 const [group,slug]=currentPage.group==='editor'?currentPage.selection.split('|'):[currentPage.group,currentPage.slug];
 await putMeta('photo-hidden:'+galleryKey+':'+id,{hidden:true},group,slug);
 const dialog=document.getElementById('qualityPhotoDialog');if(dialog?.open)dialog.close();
 await refreshPage();
}

let qualityPhotoOrderBusy=false;
async function moveQualityPhoto(galleryKey,ids,index,direction){
 if(qualityPhotoOrderBusy)return;
 const to=index+direction;
 if(to<0||to>=ids.length)return;
 const ordered=[...ids];[ordered[index],ordered[to]]=[ordered[to],ordered[index]];
 qualityPhotoOrderBusy=true;
 const controls=Array.from(document.querySelectorAll('[data-quality-order]')).map(button=>({button,disabled:button.disabled}));
 controls.forEach(({button})=>button.disabled=true);
 try{
  const [group,slug]=currentPage.group==='editor'?currentPage.selection.split('|'):[currentPage.group,currentPage.slug];
  await putMeta('photo-order:'+galleryKey,{ids:ordered},group,slug);
  await refreshPage();
 }finally{qualityPhotoOrderBusy=false;controls.forEach(({button,disabled})=>button.disabled=disabled);}
}
