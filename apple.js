const $ = (selector,root=document)=>root.querySelector(selector);
const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const screens=[
 {src:'assets/hero.png',name:'工作台 · 市场全貌',alt:'工作台：市场总览、题材中心与连板天梯',description:'把行情、题材、连板与舆情收在同屏，让信息成为可用的判断。'},
 {src:'assets/ladder.png',name:'连板天梯 · 高度与强度',alt:'连板天梯，分组呈现股票与资金指标',description:'按连板高度分组，同屏比较封单强度、封成比、主力净额与新高等级。'},
 {src:'assets/dragon.png',name:'龙虎榜 · 资金结构',alt:'龙虎榜，主力买入和卖出双表并列',description:'买入与卖出双表并列，用统一口径呈现营业部实力与资金结构。'},
 {src:'assets/sentiment.png',name:'舆情总览 · 声量与情绪',alt:'舆情总览，情绪温度计和市场趋势',description:'区分报道量与 3 日滚动净情绪，让声量与情绪分化各自可读。'},
 {src:'assets/scoring.png',name:'打分系统 · 综合筛选',alt:'综合评分与资金流筛选的标的池',description:'呈现综合评分与资金流双前 3% 标的池，区分评分与利好率。'}
];
let galleryIndex=0, galleryVersion=0;
async function selectGallery(index,instant=false){
 if(index===galleryIndex)return;
 galleryIndex=index;const version=++galleryVersion,screen=screens[index];
 $$('[data-gallery]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.gallery)===index)));
 $('#gallery-window-label').textContent=screen.name;
 $('#gallery-description').textContent=screen.description;
 $('.gallery-expand').dataset.view=String(index);
 const layer=$('#gallery-next');layer.src=screen.src;
 await layer.decode().catch(()=>{});if(version!==galleryVersion)return;
 layer.style.transition=instant||reduced.matches?'none':'';layer.style.opacity='1';
 setTimeout(()=>{if(version!==galleryVersion)return;$('#gallery-main').src=screen.src;$('#gallery-main').alt=screen.alt;layer.style.transition='none';layer.style.opacity='0';},instant||reduced.matches?0:200);
}
const perspectives=[
 ['市场在关注什么？','从去重报道量、已研判覆盖率、情感构成与市场趋势理解全貌，区分信息声量与情绪变化。',['市场情绪与 3 日滚动净情绪','热门股票、媒体来源与最新报道','区间筛选与明确的数据口径']],
 ['影响，落在哪些行业？','以独立行业研判连接事件与行业，查看行业报道量、情绪构成和相关内容，而不是将整篇文章情感直接套给行业。',['行业排行与行业情感构成','行业相关报道与来源','对象关联与影响理由']],
 ['这条信息，如何影响个股？','从逐股研判进入股票详情，结合相关性、样本量与原始报道检查判断依据。',['逐股情感与正向候选','热词、来源与报道占比','样本提示、真实区间与原文追溯']]
];
function selectPerspective(index){
 const row=perspectives[index];$$('[data-perspective]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.perspective)===index)));
 $('#perspective-title').textContent=row[0];$('#perspective-description').textContent=row[1];
 $('#perspective-features').replaceChildren(...row[2].map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
}
const pipelineData=[
 ['只读接入，独立存储。','获取上游原始内容，保留来源、时间与原文，将分析所需特征写入本地数据库。上游读取与本地分析结果写入分离。'],
 ['让转载与重复内容回到统一口径。','聚合统计依据规范化标题、内容哈希和时间分组整理报道，保留关键词、实体、股票与行业关联，减少重复内容对声量的放大。'],
 ['把视频，变成可分析的文本。','审核金融相关性，通过后提取音轨并转写；保留来源，将原记录升级为视频内容。任务队列支持失败重试与中断恢复。'],
 ['一篇内容，分别理解不同对象。','形成文章情感与理由，再对股票和行业研判具体影响。符合条件的短文复用联合结果，其余内容按独立链路处理。'],
 ['以接口供给，让分析进入工作流。','结果存入本地 PostgreSQL，通过只读 API 供给市场概览、行业统计、个股详情及下游工具。前端使用缓存与快照版本保持持续阅读。']
];
function selectPipeline(index){
 $$('[data-pipeline]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pipeline)===index)));
 $('#pipeline-title').textContent=pipelineData[index][0];$('#pipeline-description').textContent=pipelineData[index][1];
}
const steps=[
 ['先理解任务，再选择工具。','Router 与工具选择器使用本地规则，按任务选择工具，不额外增加一次模型调用。','Python Harness'],
 ['只带上当前任务需要的信息。','按需挂载工具，结合 Memory、Skills 与上下文压缩，保留执行任务需要的上下文。','Python Harness'],
 ['远程推理，本地组织。','通过模型 API 推理并选择下一步工具调用；手机运行 Harness 与执行环境，不在本地部署大模型。','模型 API'],
 ['让工具在设备上执行。','调用本地工具与开源 iOS MCP 服务，连接文件、屏幕识别、语义点击与应用控制能力。','工具执行层'],
 ['出错，也要有下一步。','MCP 不可用时回退到内置工具；修复工具漏挂、旧路径误用与协议文本泄漏，避免整条链路中断。','Harness + 工具执行层']
];
function selectStep(index){
 const row=steps[index];$$('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===index)));
 $('#step-title').textContent=row[0];$('#step-description').textContent=row[1];$('#step-layer').textContent=`对应层：${row[2]}`;
 $$('.stack-layer').forEach(layer=>layer.classList.remove('highlight'));
 const layers=$$('.stack-layer');layers[index<2?1:index===2?2:3]?.classList.add('highlight');
}
const track=$('.cards-track');
function updateCarousel(){
 if(!track)return;
 const max=track.scrollWidth-track.clientWidth;
 $('[data-carousel="prev"]').disabled=track.scrollLeft<4;
 $('[data-carousel="next"]').disabled=track.scrollLeft>=max-4;
}
track?.addEventListener('scroll',updateCarousel,{passive:true});window.addEventListener('resize',updateCarousel);updateCarousel();
const menuButton=$('.menu-toggle'),menu=$('#mobile-nav');let menuOpen=false;
function toggleMenu(open,restore=false){
 menuOpen=open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'关闭导航菜单':'打开导航菜单');menu.classList.toggle('open',open);menu.inert=!open;$('#main').inert=open;
 document.body.style.overflow=open?'hidden':$$('dialog[open]').length?'hidden':'';
 // Keep the disclosure trigger focused; Tab enters the now-visible links.
 if(!open&&restore)menuButton.focus();
}
menuButton.addEventListener('click',()=>toggleMenu(!menuOpen));
$$('a',menu).forEach(link=>link.addEventListener('click',()=>toggleMenu(false,true)));
matchMedia('(min-width:601px)').addEventListener('change',event=>{if(event.matches&&menuOpen)toggleMenu(false);});
const caseDialog=$('dialog.case-dialog'),imageDialog=$('.image-dialog');
const dialogTriggers=new WeakMap(),closingTimers=new WeakMap();
function openDialog(dialog,trigger,instant){
 clearTimeout(closingTimers.get(dialog));dialogTriggers.set(dialog,trigger);dialog.classList.toggle('instant',instant||reduced.matches);
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;void dialog.offsetWidth;dialog.classList.add('visible');document.body.style.overflow='hidden';
}
function closeDialog(dialog,instant=false){
 clearTimeout(closingTimers.get(dialog));dialog.classList.remove('visible');
 if(instant||reduced.matches){dialog.close();return;}
 closingTimers.set(dialog,setTimeout(()=>dialog.close(),250));
}
[caseDialog,imageDialog].forEach(dialog=>{
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog,true);});
 dialog.addEventListener('close',()=>{document.body.style.overflow=$$('dialog[open]').length||menuOpen?'hidden':'';dialogTriggers.get(dialog)?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);});
});
function initializeDetails(root){
 $$('.case-details',root).forEach((details,index)=>{
  const summary=$('summary',details),panel=document.createElement('div');panel.className='detail-panel';while(summary.nextSibling)panel.append(summary.nextSibling);details.append(panel);panel.id=`open-case-detail-${index}`;summary.setAttribute('role','button');summary.setAttribute('aria-controls',panel.id);summary.setAttribute('aria-expanded',String(details.open));let desired=details.open,timer;
  summary.addEventListener('click',event=>{event.preventDefault();clearTimeout(timer);desired=!desired;summary.setAttribute('aria-expanded',String(desired));if(event.detail===0||reduced.matches){details.open=desired;panel.style.height='';panel.style.opacity='';return;}const height=details.open?panel.getBoundingClientRect().height:0;details.open=true;panel.style.height=`${height}px`;panel.style.opacity=desired?'0':'1';void panel.offsetHeight;panel.style.height=desired?`${panel.scrollHeight}px`:'0px';panel.style.opacity=desired?'1':'0';timer=setTimeout(()=>{details.open=desired;panel.style.height='';panel.style.opacity='';},200);});
 });
}
function openCase(index,trigger,instant){
 const body=$('#case-body');body.replaceChildren($(`#case-${index}`).content.cloneNode(true));
 // Prefix template IDs so live controls and chart descriptions stay unique.
 const ids=new Map();$$('[id]',body).forEach(node=>{const previous=node.id;node.id=`modal-${previous}`;ids.set(previous,node.id);});
 $$('[aria-labelledby],[aria-describedby],[for]',body).forEach(node=>{['aria-labelledby','aria-describedby','for'].forEach(attr=>{if(node.hasAttribute(attr))node.setAttribute(attr,node.getAttribute(attr).split(' ').map(id=>ids.get(id)||id).join(' '));});});
 $$('.image-button',body).forEach(button=>{const index=screens.findIndex(s=>s.src===button.dataset.image);button.dataset.view=String(Math.max(0,index));});
 initializeDetails(body);$('#case-dialog-name').textContent=['量化投研平台 · 完整案例','金融舆情系统 · 完整案例','iOS 端侧 AI Agent · 完整案例'][index];
 openDialog(caseDialog,trigger,instant);
}
if($('.case-detail-page'))initializeDetails($('.case-detail-page'));
let imageIndex=0;
function showImage(index){
 imageIndex=(index+screens.length)%screens.length;const screen=screens[imageIndex];$('#image-full').src=screen.src;$('#image-full').alt=screen.alt;$('#image-title').textContent=screen.name;$('#image-count').textContent=`${imageIndex+1} / ${screens.length}`;$('#image-description').textContent=screen.description;$('.image-canvas').scrollTop=0;$('.image-canvas').scrollLeft=0;
}
function openImage(index,trigger,instant){
 $('.image-canvas').classList.remove('zoomed');$('.image-fit').setAttribute('aria-pressed','false');$('.image-fit').textContent='放大原图';showImage(index);openDialog(imageDialog,trigger,instant);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-case'))openCase(Number(button.dataset.case),button,event.detail===0);
 if(button.hasAttribute('data-gallery'))selectGallery(Number(button.dataset.gallery),event.detail===0);
 if(button.hasAttribute('data-perspective'))selectPerspective(Number(button.dataset.perspective));
 if(button.hasAttribute('data-pipeline'))selectPipeline(Number(button.dataset.pipeline));
 if(button.hasAttribute('data-view'))openImage(Number(button.dataset.view),button,event.detail===0);
 if(button.hasAttribute('data-carousel'))track.scrollBy({left:(button.dataset.carousel==='next'?1:-1)*($('.project-card').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:reduced.matches||event.detail===0?'instant':'smooth'});
 if(button.hasAttribute('data-step'))selectStep(Number(button.dataset.step));
 if(button.hasAttribute('data-close'))closeDialog(button.dataset.close==='case'?caseDialog:imageDialog,event.detail===0);
 if(button.hasAttribute('data-image-nav'))showImage(imageIndex+(button.dataset.imageNav==='next'?1:-1));
 if(button.classList.contains('image-fit')){const zoom=$('.image-canvas').classList.toggle('zoomed');button.setAttribute('aria-pressed',String(zoom));button.textContent=zoom?'适合窗口':'放大原图';}
 if(button.hasAttribute('data-screen')){
  const index={hero:0,ladder:1,dragon:2}[button.dataset.screen],figure=button.closest('figure'),imageButton=$('.image-button',figure);$$('[data-screen]',figure).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('img',imageButton).src=screens[index].src;$('img',imageButton).alt=screens[index].alt;imageButton.dataset.view=String(index);const caption=$('figcaption',figure);caption.lastElementChild.textContent=screens[index].description;
 }
});
document.addEventListener('keydown',event=>{
 if(imageDialog.open&&event.key==='ArrowRight'){event.preventDefault();showImage(imageIndex+1);}
 if(imageDialog.open&&event.key==='ArrowLeft'){event.preventDefault();showImage(imageIndex-1);}
 if(menuOpen&&event.key==='Escape'){event.preventDefault();toggleMenu(false,true);}
 if(menuOpen&&event.key==='Tab'){const elements=[menuButton,...$$('a',menu)],first=elements[0],last=elements.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
document.addEventListener('pointerdown',event=>{const target=event.target.closest('button,a.button');if(target&&!target.disabled)target.classList.add('is-pressed');});
['pointerup','pointercancel','blur'].forEach(name=>window.addEventListener(name,()=>$$('.is-pressed').forEach(el=>el.classList.remove('is-pressed'))));
document.addEventListener('pointerout',event=>{const target=event.target.closest('.is-pressed');if(target&&!target.contains(event.relatedTarget))target.classList.remove('is-pressed');});
$('.copy-email')?.addEventListener('click',async event=>{
 const button=event.currentTarget,status=$('.copy-status');button.disabled=true;button.textContent='正在复制…';
 try{await navigator.clipboard.writeText('415045878@qq.com');button.textContent='已复制';status.textContent='邮箱已复制，期待与你交流。';}
 catch{button.textContent='复制邮箱';status.textContent='请直接复制：415045878@qq.com';}
 finally{button.disabled=false;}
});
