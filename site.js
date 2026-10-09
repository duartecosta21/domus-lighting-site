const nav=document.querySelector('.site-nav');
const menu=document.querySelector('.menu-toggle');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const activeMotion=new Set();
function animateElement(element,frames,options={}){
  if(!element||motionPreference.matches||!element.animate)return;
  const animation=element.animate(frames,{duration:550,easing:'cubic-bezier(.22,1,.36,1)',...options});
  activeMotion.add(animation);
  const cleanup=()=>activeMotion.delete(animation);
  animation.finished.then(cleanup,cleanup);
  return animation;
}
motionPreference.addEventListener('change',event=>{
  if(event.matches)activeMotion.forEach(animation=>animation.finish());
});
// Uma abertura arquitetônica; o conteúdo permanece visível sem JavaScript.
animateElement(document.querySelector('.hero-copy h1'),[
  {clipPath:'inset(0 0 100% 0)',transform:'translateY(18px)'},
  {clipPath:'inset(0 0 0 0)',transform:'translateY(0)'}
],{duration:850});
animateElement(document.querySelector('.hero-visual'),[
  {clipPath:'inset(0 0 0 100%)'},
  {clipPath:'inset(0 0 0 0)'}
],{duration:1100});
animateElement(document.querySelector('.hero-visual img'),[
  {transform:'scale(1.055)'},{transform:'scale(1)'}
],{duration:1400});
// Só as fotografias de destaque recebem uma revelação, uma vez por visita.
if('IntersectionObserver' in window){
  const photoObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      photoObserver.unobserve(entry.target);
      animateElement(entry.target,[
        {clipPath:'inset(0 0 16% 0)',transform:'translateY(22px)'},
        {clipPath:'inset(0 0 0 0)',transform:'translateY(0)'}
      ],{duration:900});
    });
  },{threshold:.18});
  document.querySelectorAll('.showroom-photo,.architect-invite img,.scope-photo').forEach(photo=>photoObserver.observe(photo));
}
// A expansão acompanha a resposta e mantém o comportamento nativo do teclado.
document.querySelectorAll('.solution-list details,.faq-list details').forEach(details=>{
  const summary=details.querySelector('summary');
  let expansion;
  let desiredOpen=details.open;
  summary.addEventListener('click',event=>{
    if(motionPreference.matches||!details.animate){desiredOpen=!details.open;return;}
    event.preventDefault();
    const from=details.getBoundingClientRect().height;
    expansion?.cancel();
    desiredOpen=!desiredOpen;
    details.open=true;
    const to=desiredOpen?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
    details.style.overflow='hidden';
    expansion=animateElement(details,[{height:`${from}px`},{height:`${to}px`}],{duration:300});
    expansion.onfinish=()=>{details.open=desiredOpen;details.style.overflow='';expansion=null;};
  });
});
// Preparação local de medição. Nenhuma tag externa, cookie ou envio de dados.
function recordInteraction(event,properties={}){
  const entry={event,page:document.body.dataset.page,...properties};
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(entry);
  document.dispatchEvent(new CustomEvent('domus:interaction',{detail:entry}));
}
document.querySelectorAll('[data-contact-intent]').forEach(link=>{
  link.addEventListener('click',()=>recordInteraction('contact_click',{
    channel:'whatsapp',intent:link.dataset.contactIntent,
    placement:link.closest('header')?'header':link.closest('footer')?'footer':link.closest('.hero')?'hero':link.closest('#showroom')?'showroom':'content'
  }));
});
function closeMenu(){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);if(open)animateElement(nav,[{opacity:0,transform:'translateY(-12px)'},{opacity:1,transform:'translateY(0)'}],{duration:260});});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const scenes={morning:{description:'As persianas abrem. A luz acompanha o começo do dia. A casa desperta com você.',title:'Bom dia, casa.',detail:'Persianas e iluminação no ritmo da sua manhã.'},evening:{description:'A iluminação fica mais acolhedora e o som ambiente acompanha o encontro.',title:'A casa recebe.',detail:'Luz e som para aproveitar os ambientes juntos.'},night:{description:'As luzes se ajustam e as persianas fecham. Uma cena para desacelerar.',title:'Hora de desacelerar.',detail:'Iluminação e persianas para encerrar o dia.'}};
document.querySelectorAll('[data-scene]').forEach(button=>{button.addEventListener('click',()=>{if(button.getAttribute('aria-pressed')==='true')return;const key=button.dataset.scene;const scene=scenes[key];document.querySelectorAll('[data-scene]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));const hero=document.querySelector('.home-hero');hero.classList.remove('scene-morning','scene-evening','scene-night');hero.classList.add(`scene-${key}`);document.querySelector('#scene-description').textContent=scene.description;document.querySelector('#scene-title').textContent=scene.title;document.querySelector('#scene-detail').textContent=scene.detail;['#scene-description','.photo-caption'].forEach(selector=>{const element=document.querySelector(selector);element.getAnimations().forEach(animation=>animation.cancel());animateElement(element,[{opacity:.35,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450});});recordInteraction('scene_select',{scene:key});});});
const dialog=document.querySelector('.video-dialog');
const player=dialog?.querySelector('video');
document.querySelectorAll('[data-video]').forEach(button=>{button.addEventListener('click',()=>{document.querySelector('#video-title').textContent=button.dataset.title;player.src=button.dataset.video;const source=dialog.querySelector('.dialog-source');source.href=button.dataset.source;dialog.showModal();animateElement(dialog,[{opacity:0,transform:'translateY(18px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:300});player.play().catch(()=>{});recordInteraction('video_open',{video:button.dataset.video.split('/').pop().replace('.mp4','')});});});
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();});
