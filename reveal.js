// Stagger once as each text/action group enters view. No animation blocks input.
(()=>{
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const groups=[...document.querySelectorAll('[data-reveal-group]')];
 const items=new Set();
 // Avoid nesting two entrances: a group container is structural; animate its own children.
 for(const group of groups){
  let order=0;
  for(const element of group.children){
   if(element.hasAttribute('data-reveal-group')||element.querySelector('[data-reveal-group]')){
    element.setAttribute('data-reveal-done','');continue;
   }
   element.style.setProperty('--reveal-delay',`${Math.min(order++,3)*60}ms`);
   items.add(element);
  }
 }
 let observer;
 const finish=element=>{
  element.setAttribute('data-reveal-done','');
  element.removeAttribute('data-reveal-state');
  element.style.removeProperty('--reveal-delay');
  observer?.unobserve(element);items.delete(element);
 };
 const finishAll=()=>{for(const element of [...items])finish(element);};
 if(reduced.matches||!('IntersectionObserver' in window)){
  finishAll();root.classList.remove('reveal-enabled');root.classList.add('reveal-ready');return;
 }
 observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const element=entry.target;
   if(element.hasAttribute('data-reveal-state')||element.hasAttribute('data-reveal-done'))continue;
   element.setAttribute('data-reveal-state','visible');observer.unobserve(element);
  }
 },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
 for(const element of items){
  element.addEventListener('animationend',event=>{if(event.target===element&&event.animationName==='fade-in-up')finish(element);});
  observer.observe(element);
 }
 // Keyboard focus never lands on an invisible action.
 document.addEventListener('focusin',event=>{for(const element of [...items])if(element.contains(event.target))finish(element);});
 reduced.addEventListener('change',event=>{if(event.matches)finishAll();});
 window.addEventListener('pageshow',event=>{if(event.persisted)finishAll();});
 root.classList.add('reveal-ready');
})();
