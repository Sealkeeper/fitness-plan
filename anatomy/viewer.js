import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'meshoptimizer';
import {GROUPS,PARTS,normalize,groupFor,structureName} from './muscles.js';
import {HEALTH_TOPICS,muscleHealthFor,healthHTML} from './health.js';

function loadAssets(){
 if(window.__ANATOMY_ASSETS__) return Promise.resolve(window.__ANATOMY_ASSETS__);
 try{
   const embedded=document.getElementById('anatomy-inline-assets');
   if(!embedded)throw new Error('页面内的模型数据缺失，请重新打开完整的训练计划 HTML。');
   const assets=JSON.parse(embedded.textContent);
   if(!assets.anatomy||!assets.skeleton||!Array.isArray(assets.mapping))throw new Error('页面内的模型数据不完整，请重新打开完整的训练计划 HTML。');
   window.__ANATOMY_ASSETS__=assets;
   return Promise.resolve(assets);
 }catch(error){return Promise.reject(error);}
}
// Keep exports self-contained, including any older page without embedded data.
window.prepareAnatomyExport=async()=>{
 const assets=await loadAssets();
 return '<script id="anatomy-inline-assets" type="application/json">'+JSON.stringify(assets).replace(/</g,'\\u003c')+'<\/script>\n';
};
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon={search:'⌕',rotate:'↻',focus:'◎',expand:'⛶',reset:'↺'};
function init(){
 const root=document.getElementById('anatomy-explorer');
 if(!root) return;
 root.innerHTML=`<div class="an-shell">
   <header class="an-heading"><div><div class="an-eyebrow">THE ANATOMY ATLAS / 肌肉探索</div><h2>看见肌肉，理解健康。</h2><p class="an-subtitle">从肌肉位置到健康作用，了解训练可能带来的益处与证据。</p></div><div class="an-badge"><strong>真实解剖 · 自由探索</strong><small>BodyParts3D × Z-Anatomy</small><span>360° INTERACTIVE ANATOMY</span></div></header>
   <div class="an-body">
     <aside class="an-browser" aria-label="选择肌肉"><div class="an-label">01 / 探索肌群</div><label class="an-search"><span aria-hidden="true">${icon.search}</span><input type="search" placeholder="肌肉 / 头痛 / 腰背 / 循环" aria-label="搜索肌肉或健康目标，支持中英文"></label><div class="an-tabs" role="group" aria-label="按身体部位筛选">${PARTS.map(p=>`<button type="button" data-part="${p}" aria-pressed="${p==='全部'}">${p}</button>`).join('')}</div><label class="an-health-filter">按健康目标<select aria-label="按健康目标筛选肌肉"><option value="all">全部健康目标</option>${HEALTH_TOPICS.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></label><div class="an-list" aria-label="肌肉列表"></div></aside>
     <div class="an-center"><div class="an-stage"><div class="an-viewport-tag">HUMAN / MUSCULAR SYSTEM<span class="an-view-name">前侧视图</span></div><canvas aria-label="可旋转的人体肌肉三维模型。拖动旋转，双指缩放，也可使用旁边的肌肉列表。" tabindex="0"></canvas><div class="an-labels"></div><div class="an-tools"><button type="button" data-tool="in" aria-label="放大模型" title="放大">＋</button><button type="button" data-tool="out" aria-label="缩小模型" title="缩小">−</button><button type="button" data-tool="labels" aria-label="显示肌肉标注" aria-pressed="true" title="显示 / 隐藏标注">标</button><button type="button" data-tool="reset" aria-label="重置全身视图" title="回到全身视图">${icon.reset}</button><button type="button" data-tool="fullscreen" aria-label="全屏探索" title="全屏探索">${icon.expand}</button></div><div class="an-loading" role="status"><div class="an-spinner"></div><span>准备真实人体模型…</span></div><div class="an-hint">拖动旋转 · 点击肌肉 · 双指缩放 / ＋ − 放大</div></div><div class="an-controls"><div class="an-view-buttons" role="group" aria-label="切换观察方向"><button type="button" data-view="front" aria-pressed="true">正面</button><button type="button" data-view="back" aria-pressed="false">背面</button><button type="button" data-view="side" aria-pressed="false">侧面</button></div><button type="button" class="an-auto" aria-pressed="false">${icon.rotate} 自动旋转</button></div></div>
     <aside class="an-detail" aria-label="肌肉详情"><div class="an-selected-badge">已选肌群 · 左右两侧</div><h3 class="an-muscle-name"></h3><p class="an-latin"></p><div class="an-tags"></div><dl class="an-detail-info"></dl><div class="an-health-detail"></div><button type="button" class="an-focus">${icon.focus} 近距离观察</button><div class="an-mode-label">观察层次</div><div class="an-modes" role="group" aria-label="肌肉显示模式"><button type="button" data-mode="surface" aria-pressed="true">完整</button><button type="button" data-mode="xray" aria-pressed="false">透视</button><button type="button" data-mode="isolate" aria-pressed="false">单独</button></div><div class="an-exercises"></div><div class="an-structure"></div></aside>
   </div>
   <div class="an-footer"><div class="an-legend"><span><i class="an-dot"></i>肌肉</span><span><i class="an-dot selected"></i>所选肌群</span><span><i class="an-dot bone"></i>骨骼 / 肌腱</span></div><span class="an-count">独立肌肉网格 · 解剖分层 · 360° 观察</span></div>
   <details class="an-sources"><summary>解剖依据与模型来源<span>开放数据，让结构有据可查</span></summary><p>三维网格：<a href="https://github.com/JohanBellander/BodyExplorer" target="_blank" rel="noopener noreferrer">BodyExplorer</a> 整理的 BodyParts3D 与 Z-Anatomy 模型。BodyParts3D © The Database Center for Life Science，<a href="https://creativecommons.org/licenses/by-sa/2.1/jp/" target="_blank" rel="noopener noreferrer">CC BY-SA 2.1 Japan</a>；Z-Anatomy / Gauthier Kervyn，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>。本项目对网格作简化、量化和压缩，衍生模型保留原许可。肌肉位置与基本功能参考 <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back" target="_blank" rel="noopener noreferrer">OpenStax · 头颈与背部</a>、<a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs" target="_blank" rel="noopener noreferrer">OpenStax · 上肢</a>、<a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax" target="_blank" rel="noopener noreferrer">腹壁</a>、<a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs" target="_blank" rel="noopener noreferrer">下肢</a>。动作关联沿用本页动作库。模型是一个参考个体，不表示每个人的体形；深层肌肉可切换「透视」或「单独」查看。</p></details>
   <dialog class="an-dialog"><button type="button" class="an-dialog-close" aria-label="关闭动作详情">×</button><h3></h3><div class="an-dialog-text"></div></dialog>
 </div>`;
 const $=selector=>root.querySelector(selector);
 const list=$('.an-list'),stage=$('.an-stage'),canvas=$('canvas'),labels=$('.an-labels'),loading=$('.an-loading');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let chosen=GROUPS[0],part='全部',healthTopic='all',query='',mode='surface',view='front',auto=false,showLabels=true;
 let renderer,scene,camera,controls,body,bones,meshes=[],ready=false,starting=false,visible=false,raf=0,tween=null,hovered=null,focused=false;
 let lastTime=0,frameCount=0,pointerDown=null,selectedMeshes=[],callouts=[],lastHover=0,renderDirty=true;
 const materials={},groupBoxes=new Map(),vector=new THREE.Vector3(),raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
 const deep=new Set(['pec-minor','rhomboid','multifidus','cuff','brachialis','oblique-inner','transverse','ql','glute-min','hip-flex','neck-deep','splenius']);
 function renderList(){
   const found=GROUPS.filter(g=>{
     const h=muscleHealthFor(g.name);
     const topicText=(h?.topics||[]).map(id=>HEALTH_TOPICS.find(t=>t.id===id)?.name||'').join(' ');
     return (part==='全部'||g.part===part)&&(healthTopic==='all'||h?.topics.includes(healthTopic))&&(!query||(g.name+' '+g.en+' '+g.loc+' '+g.keys.join(' ')+' '+topicText+' '+(h?.role||'')+' '+(h?.title||'')).toLowerCase().includes(query));
   });
   list.innerHTML=found.length?found.map(g=>`<button type="button" data-muscle="${g.id}" aria-pressed="${chosen.id===g.id}"><strong>${g.name}</strong><small>${g.en}</small></button>`).join(''):'<div class="an-empty">没有匹配结果，试试「头痛」「腰背」或清除筛选。</div>';
 }
 function exercisesFor(g){
   if(typeof MUSCLES==='undefined')return [];
   return Object.entries(MUSCLES).filter(([,m])=>g.keys.some(k=>typeof muscleList==='function'?muscleList(m.p||'').some(n=>{
     const canonical=typeof MUSCLE_ALIAS==='undefined'?n:(MUSCLE_ALIAS[n]||n);
     return canonical===k||canonical.startsWith(k+'（');
   }):String(m.p).includes(k))).map(([name])=>name).slice(0,4);
 }
 function renderDetail(hit){
   $('.an-selected-badge').textContent=chosen.id==='raw'?'已选解剖部件':'已选肌群 · 左右两侧';
   $('.an-muscle-name').textContent=chosen.name;
   $('.an-latin').textContent=chosen.en;
   $('.an-tags').innerHTML=`<span>${escapeHTML(chosen.part)}</span><span>${deep.has(chosen.id)?'深层结构':'肌肉 / 肌群'}</span>`;
   $('.an-health-detail').innerHTML=healthHTML(chosen.name);
   $('.an-detail-info').innerHTML=`<div class="an-detail-row"><dt>在身体哪里</dt><dd>${escapeHTML(chosen.loc)}</dd></div><div class="an-detail-row"><dt>如何参与发力</dt><dd>${escapeHTML(chosen.action)}</dd></div><div class="an-detail-row"><dt>观察笔记</dt><dd>${escapeHTML(chosen.note)}</dd></div>`;
   const exercises=exercisesFor(chosen);
   $('.an-exercises').innerHTML=`<div class="an-exercises-head">动作库 · 健身动作参考</div>`+(exercises.length?exercises.map(n=>`<button type="button" data-exercise="${escapeHTML(n)}">${escapeHTML(n)}<span aria-hidden="true">↗</span></button>`).join(''):'<div class="an-empty">现有动作库暂未收录对应的主要训练动作。</div>');
   const picked=hit?.userData.meta;
   $('.an-structure').textContent=picked?`点击部件：${structureName(picked.name)}${picked.fmaId?' · '+picked.fmaId:''} · ${picked.source==='z-anatomy'?'Z-Anatomy':'BodyParts3D'}`:ready?`${selectedMeshes.length} 个对应网格 · 包含左右侧及各分部`:'选择列表或直接点击模型查看';
 }
 function stopAuto(){auto=false;if(controls)controls.autoRotate=false;$('.an-auto').setAttribute('aria-pressed','false');$('.an-auto').textContent='↻ 自动旋转';}
 function recolor(){
   if(!ready)return;
   renderDirty=true;
   if(hovered){delete hovered.userData.previousMaterial;hovered=null;}
   selectedMeshes=meshes.filter(m=>chosen.pattern.test(m.userData.rawName));
   const selected=new Set(selectedMeshes);
   for(const mesh of meshes){
     const isSelected=selected.has(mesh);
     mesh.visible=mode!=='isolate'||isSelected;
     mesh.material=isSelected?materials.selected:mode==='xray'?materials.ghost:mesh.userData.tendon?materials.tendon:materials.muscle;
     mesh.renderOrder=isSelected?3:mode==='xray'?1:0;
   }
   bones.traverse(m=>{if(m.isMesh){m.material=mode==='surface'?materials.bone:materials.boneGhost;m.renderOrder=0;}});
   root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
   makeCallouts();
 }
 function select(id,hit,orient=true){
   const g=GROUPS.find(g=>g.id===id);if(!g)return;
   chosen=g;stopAuto();
   if(deep.has(g.id)&&mode==='surface')mode='xray';
   renderList();recolor();renderDetail(hit);
   if(orient&&ready){focused=false;setView(g.view);}
 }
 function readBox(group){
   if(group.id!=='raw'&&groupBoxes.has(group.id))return groupBoxes.get(group.id);
   const matches=meshes.filter(m=>group.pattern.test(m.userData.rawName));
   const box=new THREE.Box3();matches.forEach(m=>box.union(m.geometry.boundingBox));
   if(box.isEmpty())return null;if(group.id!=='raw')groupBoxes.set(group.id,box);return box;
 }
 function moveCamera(target,position){
   if(!ready)return;
   renderDirty=true;
   tween={started:performance.now(),fromTarget:controls.target.clone(),toTarget:target,fromPosition:camera.position.clone(),toPosition:position,duration:reduced?0:700};
   if(reduced){controls.target.copy(target);camera.position.copy(position);controls.update();tween=null;}
 }
 function setView(next){
   view=next;
   root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
   $('.an-view-name').textContent=({front:'前侧视图',back:'后侧视图',side:'侧面视图'})[view];
   if(!ready)return;
   const target=focused?controls.target.clone():new THREE.Vector3(0,.1,0);
   const distance=focused?camera.position.distanceTo(controls.target):fullDistance();
   const direction=view==='back'?new THREE.Vector3(-.035,.005,-1):view==='side'?new THREE.Vector3(1,0,.04):new THREE.Vector3(.025,.005,1);
   moveCamera(target,target.clone().add(direction.normalize().multiplyScalar(distance)));makeCallouts();
 }
 function fullDistance(){return Math.max(innerWidth<=660?50:46,22/Math.max(camera?.aspect||1,.3));}
 function focusSelected(){
   if(!ready)return;
   stopAuto();const box=readBox(chosen);if(!box)return;
   const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
   const distance=Math.max(7,Math.max(size.y,size.x/camera.aspect)*1.7,size.z*2.5);
   const direction=camera.position.clone().sub(controls.target).normalize();
   focused=true;moveCamera(center,center.clone().add(direction.multiplyScalar(distance)));
 }
 function makeCallouts(){
   renderDirty=true;
   labels.replaceChildren();callouts=[];if(!ready||!showLabels)return;
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('an-leaders');svg.setAttribute('aria-hidden','true');labels.append(svg);
   let ids=view==='back'?['traps','lat','triceps','glute-max','hamstrings','calf']:view==='side'?['deltoid-mid','serratus','glute-med','quads','soleus']:['deltoid-mid','chest','biceps','rectus','quads','tibialis'];
   if(mode==='isolate'||focused)ids=[chosen.id];else if(!ids.includes(chosen.id))ids=[chosen.id,...ids.slice(0,5)];
   ids.forEach((id,i)=>{
     const g=GROUPS.find(g=>g.id===id)||(id===chosen.id?chosen:null);if(!g)return;
     const all=meshes.filter(m=>g.pattern.test(m.userData.rawName));
     const side=view==='back'?(i%2===0?'right':'left'):(i%2===0?'left':'right');
     const matches=all.filter(m=>m.userData.rawName.includes(side));
     const box=new THREE.Box3();(matches.length?matches:all).forEach(m=>box.union(m.geometry.boundingBox));
     if(box.isEmpty())return;
     const point=box.getCenter(new THREE.Vector3());
     point.z=view==='back'?box.min.z:box.max.z;
     if(view==='side')point.x=box.max.x;
     const button=document.createElement('button');button.type='button';button.className='an-callout';button.dataset.muscle=id;button.textContent=g.name.replace(' · ',' ');button.setAttribute('aria-pressed',String(id===chosen.id));
     const line=document.createElementNS('http://www.w3.org/2000/svg','line'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','2');svg.append(line,dot);
     labels.append(button);callouts.push({point,button,line,dot,index:i});
   });
 }
 function updateCallouts(){
   const width=stage.clientWidth,height=stage.clientHeight;
   const angle=Math.atan2(camera.position.x-controls.target.x,camera.position.z-controls.target.z);
   const expected=view==='back'?Math.PI:view==='side'?(angle<0?-Math.PI/2:Math.PI/2):0;
   const angleDiff=Math.abs(Math.atan2(Math.sin(angle-expected),Math.cos(angle-expected)));
   const positions=[];
   for(const c of callouts){
     vector.copy(c.point).project(camera);
     const projectedX=(vector.x*.5+.5)*width,projectedY=(-vector.y*.5+.5)*height;
     const right=c.index%2===0;
     const hidden=vector.z>1||vector.z< -1||projectedY<60||projectedY>height-42||angleDiff>1.0;
     c.button.hidden=hidden;c.line.style.display=hidden?'none':'';c.dot.style.display=hidden?'none':'';
     if(!hidden)positions.push({c,right,projectedX,projectedY,y:projectedY});
   }
   for(const right of [true,false]){
     const side=positions.filter(p=>p.right===right).sort((a,b)=>a.y-b.y);let previous=55;
     for(const p of side){p.y=Math.max(p.y,previous+36);previous=p.y;}
     let end=height-55;for(const p of side.reverse()){p.y=Math.min(p.y,end);end=p.y-36;}
   }
   for(const p of positions){
     const {c,right,projectedX,projectedY,y}=p,labelX=right?width-65:65;
     c.button.style.left=labelX+'px';c.button.style.top=y+'px';
     c.line.setAttribute('x1',String(projectedX));c.line.setAttribute('y1',String(projectedY));c.line.setAttribute('x2',String(labelX+(right?-1:1)*(c.button.offsetWidth/2+5)));c.line.setAttribute('y2',String(y));
     c.dot.setAttribute('cx',String(projectedX));c.dot.setAttribute('cy',String(projectedY));
   }
 }
 function showRawMesh(mesh){
   const raw=mesh.userData.rawName;
   const g=groupFor(raw);
   if(g){select(g.id,mesh,false);return;}
   stopAuto();
   // Keep exact anatomical name for structures absent from the curated groups.
   // Do not invent functions or exercise associations for them.
   chosen={id:'raw',name:structureName(raw),en:raw,part:mesh.userData.tendon?'肌腱 / 结缔组织':'解剖部件',pattern:{test:n=>n===raw},loc:'查看模型高亮，了解此部件在参考人体中的三维位置。',action:'此部件的详细功能暂未收录。',note:'可使用「近距离观察」和「单独」查看结构，原始解剖名称与数据标识见下方。',keys:[]};
   recolor();renderList();renderDetail(mesh);
 }
 function hitAt(event){
   if(!ready)return null;
   const rect=canvas.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
   raycaster.setFromCamera(mouse,camera);
   return raycaster.intersectObjects(meshes.filter(m=>m.visible),false)[0]?.object||null;
 }
 function resize(){
   if(!renderer||!stage.clientWidth||!stage.clientHeight)return;
   const w=stage.clientWidth,h=stage.clientHeight;
   renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<600?1.25:1.75));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();renderDirty=true;
 }
 function loop(time){
   if(!visible||document.hidden){raf=0;return;}
   raf=requestAnimationFrame(loop);
   const delta=Math.min((time-lastTime)/1000,.1);
   if(time-lastTime<1000/30)return;lastTime=time;
   if(tween){
     const t=THREE.MathUtils.clamp((time-tween.started)/Math.max(tween.duration,1),0,1),ease=1-Math.pow(1-t,3);
     controls.target.lerpVectors(tween.fromTarget,tween.toTarget,ease);camera.position.lerpVectors(tween.fromPosition,tween.toPosition,ease);
     if(t>=1){tween=null;makeCallouts();}
   }
   const changed=controls.update(delta);
   if(renderDirty||changed||auto||tween){
     renderer.render(scene,camera);renderDirty=false;
     if(!tween&&frameCount++%6===0){
       const angle=Math.atan2(camera.position.x-controls.target.x,camera.position.z-controls.target.z);
       const facing=Math.abs(angle)>Math.PI*.7?'back':Math.abs(angle)<Math.PI*.3?'front':'side';
       if(facing!==view){view=facing;$('.an-view-name').textContent=({front:'前侧视图',back:'后侧视图',side:'侧面视图'})[view];root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));makeCallouts();}
     }
     updateCallouts();
   }
 }
 function resume(){if(ready&&visible&&!document.hidden&&!raf){lastTime=performance.now();raf=requestAnimationFrame(loop);}}
 function bufferFromBase64(value){const bin=atob(value);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return bytes.buffer;}
 function buildModels(anatomy,skeleton,mapping){
   body=new THREE.Group();bones=new THREE.Group();body.add(bones);
   anatomy.scene.updateMatrixWorld(true);skeleton.scene.updateMatrixWorld(true);
   const sourceBox=new THREE.Box3().setFromObject(anatomy.scene),center=sourceBox.getCenter(new THREE.Vector3()),scale=30/sourceBox.getSize(new THREE.Vector3()).z;
   const transform=new THREE.Matrix4().set(scale,0,0,-center.x*scale,0,0,scale,-center.z*scale,0,-scale,0,center.y*scale,0,0,0,1);
   const meta=new Map(mapping.map(m=>[normalize(m.name),m]));
   const material=(color,roughness,extra={})=>new THREE.MeshStandardMaterial({color,roughness,metalness:0,side:THREE.DoubleSide,...extra});
   materials.muscle=material('#a5625c',.55);
   materials.tendon=material('#d5cbb3',.7);
   materials.bone=material('#c8c1ae',.65);
   materials.selected=material('#78dcc0',.42,{emissive:new THREE.Color('#2d6554'),emissiveIntensity:.18});
   materials.hover=material('#e8b398',.45);
   materials.ghost=material('#759492',.7,{transparent:true,opacity:.1,depthWrite:false});
   materials.boneGhost=material('#aab6a9',.8,{transparent:true,opacity:.14,depthWrite:false});
   function transformedGeometry(child){
     const geometry=child.geometry.clone();
     // Quantized GLBs store normalized integer attributes. World-space transforms
     // must operate on floats; writing millimetres back into Int16 would wrap.
     for(const key of ['position','normal','tangent']){
       const attribute=geometry.getAttribute(key);if(!attribute)continue;
       const floats=new Float32Array(attribute.count*attribute.itemSize);
       for(let i=0;i<attribute.count;i++)for(let k=0;k<attribute.itemSize;k++)floats[i*attribute.itemSize+k]=attribute.getComponent(i,k);
       geometry.setAttribute(key,new THREE.BufferAttribute(floats,attribute.itemSize));
     }
     geometry.applyMatrix4(child.matrixWorld).applyMatrix4(transform);geometry.computeBoundingBox();geometry.computeBoundingSphere();
     return geometry;
   }
   anatomy.scene.traverse(child=>{
     if(!child.isMesh)return;
     const raw=normalize(child.name),entry=meta.get(raw)||{name:raw,source:'bp3d'};
     const geometry=transformedGeometry(child);
     const tendon=entry.isTendon||/tendon|ligament|retinaculum|fascia|membrane|cartilage|tendinous/.test(raw);
     const mesh=new THREE.Mesh(geometry,tendon?materials.tendon:materials.muscle);mesh.name=raw;mesh.userData={rawName:raw,meta:entry,tendon};
     meshes.push(mesh);body.add(mesh);child.geometry.dispose();
   });
   skeleton.scene.traverse(child=>{
     if(!child.isMesh)return;
     const geometry=transformedGeometry(child);bones.add(new THREE.Mesh(geometry,materials.bone));child.geometry.dispose();
   });
   scene.add(body);
   $('.an-count').textContent=`${meshes.length} 个解剖部件 · ${bones.children.length} 个骨骼网格`;
 }
 function addPlatform(){
   const textureCanvas=document.createElement('canvas');textureCanvas.width=128;textureCanvas.height=128;
   const context=textureCanvas.getContext('2d'),gradient=context.createRadialGradient(64,64,2,64,64,63);
   gradient.addColorStop(0,'rgba(0,8,9,.65)');gradient.addColorStop(.4,'rgba(0,8,9,.35)');gradient.addColorStop(1,'rgba(0,8,9,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(19,12),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(textureCanvas),transparent:true,depthWrite:false}));plane.rotation.x=-Math.PI/2;plane.position.y=-15.5;scene.add(plane);
   for(const radius of [6.7,7.2]){
     const ring=new THREE.Mesh(new THREE.RingGeometry(radius,radius+.018,100),new THREE.MeshBasicMaterial({color:'#6fae9a',transparent:true,opacity:.18,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-15.45;scene.add(ring);
   }
 }
 async function start(){
   if(ready||starting)return;starting=true;loading.hidden=false;
   loading.innerHTML='<div class="an-spinner"></div><span>载入肌肉与骨骼，准备解剖分层…</span>';
   try{
     if(!renderer){
       renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
       renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
       scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.1,180);camera.position.set(1,.1,46);
       controls=new OrbitControls(camera,canvas);controls.target.set(0,.1,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=5;controls.maxDistance=95;controls.autoRotateSpeed=.5;controls.enablePan=true;
       // Page scrolling remains available over the model; explicit buttons and
       // touch pinch handle zoom without swallowing ordinary scroll gestures.
       controls.listenToKeyEvents(canvas);
       canvas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)e.stopImmediatePropagation();},true);
       controls.addEventListener('start',()=>{tween=null;stopAuto();});
       controls.addEventListener('change',()=>{renderDirty=true;});
       scene.add(new THREE.HemisphereLight('#c2e7e7','#29392f',1.4));
       const key=new THREE.DirectionalLight('#fff1db',2.8);key.position.set(-12,18,23);scene.add(key);
       const fill=new THREE.DirectionalLight('#96cfc8',1.2);fill.position.set(12,2,16);scene.add(fill);
       const rim=new THREE.DirectionalLight('#acdbec',2.5);rim.position.set(2,14,-18);scene.add(rim);
       const lower=new THREE.DirectionalLight('#8cb5ba',.7);lower.position.set(-8,-10,-10);scene.add(lower);
       addPlatform();resize();
       new ResizeObserver(()=>{resize();if(!focused&&ready){setView(view);}}).observe(stage);
     }
     const assets=await loadAssets();
     await MeshoptDecoder.ready;
     loading.querySelector('span').textContent='解析独立肌肉网格…';
     const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
     const [anatomy,skeleton]=await Promise.all([loader.parseAsync(bufferFromBase64(assets.anatomy),''),loader.parseAsync(bufferFromBase64(assets.skeleton),'')]);
     buildModels(anatomy,skeleton,assets.mapping);ready=true;starting=false;loading.hidden=true;
     select(chosen.id,undefined,false);camera.position.set(1,.1,fullDistance());controls.update();resume();
   }catch(error){
     starting=false;loading.innerHTML=`<span>${escapeHTML(error.message||'浏览器暂时无法显示三维模型。')}</span><button type="button" data-retry>重新载入</button><span>肌肉列表与动作详情仍可使用。</span>`;
   }
 }
 function exerciseDialog(name){
   const dialog=$('.an-dialog');dialog.querySelector('h3').textContent=name;
   // Use the original action-detail card, which already escapes names and has
   // curated instructions. The dialog is outside the editable document.
   if(typeof exCardHTML==='function')dialog.querySelector('.an-dialog-text').innerHTML=exCardHTML(name);
   else dialog.querySelector('.an-dialog-text').textContent='请在上方动作库中查看此动作。';
   if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 }
 root.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return;
   if(button.dataset.muscle){select(button.dataset.muscle);return;}
   if(button.dataset.part){part=button.dataset.part;root.querySelectorAll('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===part)));renderList();return;}
   if(button.dataset.view){stopAuto();setView(button.dataset.view);return;}
   if(button.dataset.mode){mode=button.dataset.mode;recolor();return;}
   if(button.dataset.exercise){exerciseDialog(button.dataset.exercise);return;}
   if(button.hasAttribute('data-retry')){start();return;}
   if(button.classList.contains('an-focus')){focusSelected();return;}
   if(button.classList.contains('an-dialog-close')){$('.an-dialog').close();return;}
   if(button.classList.contains('an-auto')){if(!ready)return;auto=!auto;controls.autoRotate=auto;tween=null;button.setAttribute('aria-pressed',String(auto));button.textContent=auto?'Ⅱ 暂停旋转':'↻ 自动旋转';return;}
   const tool=button.dataset.tool;
   if(tool==='labels'){showLabels=!showLabels;button.setAttribute('aria-pressed',String(showLabels));makeCallouts();return;}
   if(tool==='fullscreen'){
     if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}else root.requestFullscreen?.().catch(()=>{});return;
   }
   if(!ready)return;
   if(tool==='reset'){stopAuto();focused=false;mode='surface';recolor();setView('front');}
   if(tool==='in'||tool==='out'){
     stopAuto();tween=null;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*(tool==='in'?.8:1.25),5,95));camera.position.copy(controls.target).add(offset);controls.update();renderDirty=true;
   }
 });
 $('.an-health-filter select').addEventListener('change',event=>{
   healthTopic=event.target.value;part='全部';query='';$('.an-search input').value='';
   root.querySelectorAll('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part==='全部')));
   renderList();const first=list.querySelector('[data-muscle]');if(first)select(first.dataset.muscle);
 });
 document.addEventListener('click',event=>{
   const button=event.target.closest('[data-health-muscle]');if(!button)return;
   const name=button.dataset.healthMuscle;
   const g=GROUPS.find(g=>g.name===name||g.keys.includes(name));
   if(g){part='全部';healthTopic='all';query='';$('.an-search input').value='';$('.an-health-filter select').value='all';root.querySelectorAll('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part==='全部')));select(g.id);root.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}
   else {const card=[...document.querySelectorAll('.mfi')].find(c=>c.querySelector('.mfnm')?.textContent===name);if(card)card.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}
 });
 $('.an-search input').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderList();});
 $('.an-dialog').addEventListener('click',event=>{if(event.target===$('.an-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
 canvas.addEventListener('pointerdown',event=>{if(!pointerDown)pointerDown={x:event.clientX,y:event.clientY,id:event.pointerId,count:1};else pointerDown.count++;});
 canvas.addEventListener('pointerup',event=>{
   if(pointerDown?.id===event.pointerId&&pointerDown.count===1&&event.button===0&&Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)<5){const hit=hitAt(event);if(hit)showRawMesh(hit);}
   pointerDown=null;
 });
 canvas.addEventListener('pointercancel',()=>{pointerDown=null;});
 canvas.addEventListener('pointermove',event=>{
   if(!ready||pointerDown||event.pointerType==='touch'||performance.now()-lastHover<90)return;lastHover=performance.now();
   if(hovered&&hovered.userData.previousMaterial){hovered.material=hovered.userData.previousMaterial;delete hovered.userData.previousMaterial;}
   hovered=hitAt(event);canvas.style.cursor=hovered?'pointer':'grab';
   if(hovered&&hovered.material!==materials.selected&&mode==='surface'){hovered.userData.previousMaterial=hovered.material;hovered.material=materials.hover;}
   renderDirty=true;
 });
 canvas.addEventListener('pointerleave',()=>{if(hovered?.userData.previousMaterial){hovered.material=hovered.userData.previousMaterial;delete hovered.userData.previousMaterial;}hovered=null;renderDirty=true;});
 canvas.addEventListener('keydown',event=>{
   if(!ready)return;
   if(['+','=','-','0'].includes(event.key)){event.preventDefault();root.querySelector(`[data-tool="${event.key==='0'?'reset':event.key==='-'?'out':'in'}"]`).click();}
 });
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();loading.hidden=false;loading.innerHTML='<span>三维显示已暂停，恢复后会继续。肌肉列表仍可使用。</span>';});
 canvas.addEventListener('webglcontextrestored',()=>{loading.hidden=true;resize();resume();});
 document.addEventListener('visibilitychange',resume);
 renderList();renderDetail();
 const observer=new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;if(visible){start();resume();}
 },{rootMargin:'160px'});observer.observe(root);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
