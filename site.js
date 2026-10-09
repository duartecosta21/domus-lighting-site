const nav=document.querySelector('.site-nav');
const menu=document.querySelector('.menu-toggle');
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
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const scenes={morning:{description:'As persianas abrem. A luz acompanha o começo do dia. A casa desperta com você.',title:'Bom dia, casa.',detail:'Persianas e iluminação no ritmo da sua manhã.'},evening:{description:'A iluminação fica mais acolhedora e o som ambiente acompanha o encontro.',title:'A casa recebe.',detail:'Luz e som para aproveitar os ambientes juntos.'},night:{description:'As luzes se ajustam e as persianas fecham. Uma cena para desacelerar.',title:'Hora de desacelerar.',detail:'Iluminação e persianas para encerrar o dia.'}};
document.querySelectorAll('[data-scene]').forEach(button=>{button.addEventListener('click',()=>{const key=button.dataset.scene;const scene=scenes[key];document.querySelectorAll('[data-scene]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));const hero=document.querySelector('.home-hero');hero.classList.remove('scene-morning','scene-evening','scene-night');hero.classList.add(`scene-${key}`);document.querySelector('#scene-description').textContent=scene.description;document.querySelector('#scene-title').textContent=scene.title;document.querySelector('#scene-detail').textContent=scene.detail;recordInteraction('scene_select',{scene:key});});});
const dialog=document.querySelector('.video-dialog');
const player=dialog?.querySelector('video');
document.querySelectorAll('[data-video]').forEach(button=>{button.addEventListener('click',()=>{document.querySelector('#video-title').textContent=button.dataset.title;player.src=button.dataset.video;const source=dialog.querySelector('.dialog-source');source.href=button.dataset.source;dialog.showModal();player.play().catch(()=>{});recordInteraction('video_open',{video:button.dataset.video.split('/').pop().replace('.mp4','')});});});
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();});
