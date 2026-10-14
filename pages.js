// Each navigation item has its own document. Native browser history remains available.
const pageShell=document.querySelector('.page-shell');
const nextPage=document.querySelector('.next-page');
const nextLink=document.querySelector('.next-page-link');
const motionReduced=matchMedia('(prefers-reduced-motion: reduce)');
// Preserve old shared section links after splitting the original long page.
if(document.body.dataset.page==='hero'){
 const legacy={work:'work.html',platform:'platform.html',sentiment:'sentiment.html',agent:'agent.html',tapper:'tapper.html',clearleaf:'clearleaf.html',about:'about.html',contact:'about.html#contact'};
 const destination=legacy[location.hash.slice(1)];if(destination)location.replace(destination);
}
let pendingNavigation,leavingTimer,pull=0,releaseTimer,lastInput=0,touch=null;
const pullValue=window.Motion?.motionValue(0);
function atBottom(){return window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-3;}
function blocked(target){return document.querySelector('dialog[open]')||document.querySelector('.mobile-nav.open')||target.closest('input,textarea,select,[contenteditable=true]');}
function paint(value){
 pageShell.style.transform=motionReduced.matches?'':`translateY(${-value}px)`;
}
pullValue?.on('change',paint);
function feedback(move=true){
 const progress=Math.min(1,pull/260);
 const displacement=pull*96*.55/(96+.55*Math.abs(pull));
 if(move){if(pullValue){pullValue.stop();pullValue.set(displacement);}else paint(displacement);}
 pageShell.classList.toggle('pulling',pull>0);
 nextPage.classList.toggle('is-ready',progress>=1);
 nextPage.querySelector('.pull-arrow').style.transform=motionReduced.matches?'':`translateY(${progress*8}px)`;
 nextPage.querySelector('.pull-status').textContent=progress>=1?'松开查看':pull>0?'继续下拉':'向下滑动';
}
function resetPull(){
 clearTimeout(releaseTimer);pull=0;
 if(nextPage)feedback(false);
 if(pullValue&&!motionReduced.matches)Motion.animate(pullValue,0,{type:'spring',duration:.4,bounce:0});else paint(0);
 pageShell.classList.remove('pulling');
}
function cancelNavigation(){clearTimeout(leavingTimer);pendingNavigation=null;pageShell.classList.remove('leaving');resetPull();}
function navigate(href,instant=false){
 clearTimeout(leavingTimer);pendingNavigation=href;
 if(instant||motionReduced.matches){location.assign(href);return;}
 pageShell.classList.add('leaving');
 leavingTimer=setTimeout(()=>location.assign(pendingNavigation),200);
}
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href]');
 if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
 const href=link.getAttribute('href');
 if(!/^(index|work|platform|sentiment|agent|tapper|clearleaf|about)\.html(?:#.*)?$/.test(href))return;
 event.preventDefault();navigate(href,event.detail===0);
});
if(nextLink){
 window.addEventListener('wheel',event=>{
  if(blocked(event.target)||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  if(event.deltaY<0){if(pendingNavigation)cancelNavigation();else resetPull();return;}
  if(!atBottom()){resetPull();lastInput=performance.now();return;}
  event.preventDefault();
  if(pendingNavigation)return;
  // An arriving scroll must settle at the edge before a new gesture starts the pull.
  const now=performance.now();if(!pull&&now-lastInput<180){lastInput=now;return;}
  lastInput=now;clearTimeout(releaseTimer);
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  pull=Math.min(400,pull+Math.min(delta,110));feedback();
  releaseTimer=setTimeout(()=>{if(pull>=260)navigate(nextLink.href);else resetPull();},150);
 },{passive:false});
 window.addEventListener('touchstart',event=>{
  if(event.touches.length!==1||blocked(event.target)){touch=null;return;}
  const t=event.touches[0];touch={x:t.clientX,y:t.clientY,bottom:atBottom(),active:false};
 },{passive:true});
 window.addEventListener('touchmove',event=>{
  if(!touch||event.touches.length!==1)return;
  const t=event.touches[0],delta=touch.y-t.clientY;
  if(!touch.bottom||Math.abs(t.clientX-touch.x)>Math.abs(delta)||delta<10){if(touch.active){event.preventDefault();pull=0;feedback();}return;}
  event.preventDefault();touch.active=true;pull=Math.max(0,Math.min(400,delta-10));feedback();
 },{passive:false});
 window.addEventListener('touchend',()=>{if(touch?.active&&pull>=260)navigate(nextLink.href);else resetPull();touch=null;},{passive:true});
 window.addEventListener('touchcancel',()=>{touch=null;resetPull();},{passive:true});
 window.addEventListener('scroll',()=>{if(!atBottom()&&pull>0)resetPull();},{passive:true});
}
window.addEventListener('pageshow',()=>{cancelNavigation();});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&pendingNavigation)cancelNavigation();});
motionReduced.addEventListener('change',resetPull);
