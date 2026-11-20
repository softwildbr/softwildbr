/* SOFT WILD / 06 — catálogo, pesquisas e agentes.
   Sem API externa ou monitoramento automático; o conteúdo vem de data/content.json. */
(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const featuredNames=['Ana Lítica','Lia Layout','Beto Backend','Malu Multimodal','Léo Loop','Sônia Decibéis','Priscila Prioridade','Vivi Vitrine'];
const productArt={
  'Retrozim Launcher':['android','ANDROID · INTERFACE','▣','navy'],
  'Minamp':['audio','ÁUDIO · WIDGET','♫','teal'],
  'Suíte 98':['android','ANDROID · ECOSSISTEMA','▦','navy'],
  'Arquivos':['android','ANDROID · ARQUIVOS','▤','teal'],
  'Teclado':['android','ANDROID · INTERFACE','⌨','orange'],
  'Barra':['android','ANDROID · INTERFACE','≡','navy'],
  'Conexão (widget)':['android','ANDROID · WIDGET','⌁','teal'],
  'Gravador':['audio','ÁUDIO · ANDROID','◉','purple'],
  'Media 98':['audio','ÁUDIO / VÍDEO','▶','purple'],
  'Donki P2P':['android','ANDROID · REDE','⇅','orange'],
  'Entrada 98':['android','ANDROID · PERSONALIZAÇÃO','◫','navy'],
  'Central de Controle 98':['android','ANDROID · CONTROLES','⚙','teal'],
  'Galeria':['audio','MÍDIA · GALERIA','▧','purple'],
  'Controle físico-digital IR':['fisico','HARDWARE · CONTROLE','⌁','green'],
  'REVER (extensão de navegador)':['web','WEB · EXTENSÃO','▷','navy'],
  'Conversas improváveis':['social','COMUNIDADE · SOCIAL','♧','purple'],
  'Histórias antes de seguidores':['social','COMUNIDADE · SOCIAL','◌','orange'],
  'Ecossistemas para shopping centers':['pesquisa','PESQUISA · ESPAÇOS','⌘','teal'],
  'Objetos e cartões NFC':['fisico','HARDWARE · NFC','⬡','green'],
  'Kit colecionável de software + objetos':['fisico','MAKER · OBJETOS','◇','orange'],
  'Microsserviços para trabalho real':['web','WEB · SERVIÇOS','⌁','navy'],
  'Navegador de linguagem clássica':['web','WEB · NAVEGADOR','◎','purple'],
  'Ferramentas pessoais acessíveis e offline':['android','SOFTWARE · OFFLINE','✳','green']
};
const researchIcons=['⌘','▧','✳','⬡','♫','♧','◈','◌','↗','▤'];
const state={data:null,category:'todos',team:null,directoryOpen:false,legacyExpanded:false};
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const tracks={prototypes:'#track-prototypes',futures:'#track-futures',agents:'#track-agents',legacy:'#legacy-grid'};
const autoplayState=Object.fromEntries(Object.keys(tracks).map(name=>[name,{
  paused:prefersReducedMotion.matches,visible:false,hover:false,focus:false,touch:false
}]));

function classify(p){
  return productArt[p.name]||['pesquisa',p.stage==='concept'?'PESQUISA · CONCEITO':'LAB · EXPERIMENTO','✳','teal'];
}
function status(p){
  const s=normalize(p.status);
  if(s.includes('alfa')||s.includes('alpha'))return 'ALFA';
  if(s.includes('candidata')||s.includes('teste'))return 'EM TESTE';
  if(s.includes('prototipo')||s.includes('piloto'))return 'PROTÓTIPO';
  if(s.includes('pesquisa')||s.includes('planejamento')||s.includes('sem apk')||s.includes('estudo')||s.includes('conceito'))return 'EM ESTUDO';
  if(s.includes('desenvolvimento')||s.includes('integracao')||s.includes('implementacao'))return 'DESENVOLVIMENTO';
  return p.stage==='concept'?'CONCEITO':'EXPERIMENTO';
}
function productTile(p,index){
  const [key,category,icon,variant]=classify(p);
  const phase=status(p);
  return '<article class="experiment-card" aria-label="'+esc(p.name)+'">'+
    '<div class="card-top"><div class="card-icon variant-'+variant+'" aria-hidden="true">'+esc(icon)+'</div><span class="card-stage '+(p.stage==='concept'?'is-research':'')+'">'+esc(phase)+'</span></div>'+
    '<div class="card-bottom"><span class="card-category">'+esc(category)+'</span><h4>'+esc(p.name)+'</h4>'+
    '<p>'+esc(p.description)+'</p><button class="card-detail" type="button" data-product="'+index+'" aria-label="Ver informações de '+esc(p.name)+'">Ver detalhes <span aria-hidden="true">↗</span></button></div></article>';
}
function emptyMessage(text){
  return '<p class="loading-text" role="status">'+esc(text)+'</p>';
}
function wireProductDetails(root){
  $$('button[data-product]',root).forEach(b=>b.addEventListener('click',()=>{
    const p=state.data.products[Number(b.dataset.product)];
    if(!p)return;
    const [type,category]=classify(p);
    $('#detail-content').innerHTML='<span class="dialog-kicker">'+esc(category)+' · '+(p.stage==='concept'?'EM INVESTIGAÇÃO':'PORTFÓLIO EXPERIMENTAL')+'</span>'+
    '<h2 id="detail-title">'+esc(p.name)+'</h2>'+
    '<p>'+esc(p.description)+'</p>'+
    '<div class="dialog-data"><span>ESTÁGIO DOCUMENTADO</span>'+esc(p.status)+'</div>'+
    '<p class="dialog-note">Não representa lançamento, preço, estoque nem data prometida. Revisão do catálogo: '+esc(state.data.updated.split('-').reverse().join('/'))+'.</p>';
    const dialog=$('#detail-dialog');if(dialog?.showModal)dialog.showModal();
  }));
}
function renderProducts(){
  const d=state.data;
  const filtered=d.products.filter(p=>{
    const [type]=classify(p);
    return state.category==='todos'||type===state.category;
  });
  for(const [key,stage] of [['prototypes','prototype'],['futures','concept']]){
    const root=$(tracks[key]);
    const list=filtered.filter(p=>p.stage===stage);
    root.innerHTML=list.length?list.map(p=>productTile(p,d.products.indexOf(p))).join(''):emptyMessage('Nenhum item encontrado nesta categoria.');
    wireProductDetails(root);
    const count=$(key==='prototypes'?'#count-prototypes':'#count-futures');
    count.textContent=list.length;
    root.scrollLeft=0;
    updateTrack(key);
  }
  $('#catalog-notice').textContent='ⓘ Os estágios são documentais. Nenhum projeto é apresentado como lançado sem confirmação.';
}
function researchTile(f,i){
  return '<article class="research-card"><div class="research-top"><span class="research-icon" aria-hidden="true">'+esc(researchIcons[i%researchIcons.length])+'</span>'+
     '<h3>'+esc(f.name)+'</h3></div><span class="research-status">'+esc((f.status||'Em pesquisa').split(';')[0].slice(0,46))+'</span>'+
     '<p>'+esc(f.progress)+'</p><details><summary>Próximo marco</summary><p>'+esc(f.next)+'</p></details></article>';
}
function renderResearch(){
  const list=state.data.fronts;
  $('#research-grid').innerHTML=list.length?list.map((f)=>researchTile(f,state.data.fronts.indexOf(f))).join(''):emptyMessage('Nenhuma frente corresponde à busca.');
  const others=state.data.fronts.filter(f=>!normalize(f.name).includes('shopping')).slice(0,4);
  $('#progress-fronts').innerHTML=others.map(f=>'<article class="progress-row"><b>'+esc(f.name)+'</b><span>'+esc(f.status)+'</span></article>').join('');
}
function spritePosition(index){
  return (index%5)*25+'% '+Math.floor(index/5)*100+'%';
}
/* Retratos finais serão produzidos após a validação do layout.
   portrait_file mantém os SVGs de transição sem impedir nomes brasileiros definitivos. */
function agentImagePath(a){
  const file=String(a.portrait_file||'');
  return './assets/agents/'+(/^[a-z0-9-]+\.(?:svg|webp)$/.test(file)?(file.endsWith('.webp')?'cards/'+file:file):'placeholder.svg');
}
function portraitCard(person,index,archived=false){
  const file=String(person.portrait_file||'');
  const valid=archived?/^legacy\/[a-z0-9-]+\.webp$/:/^[a-z0-9-]+\.(svg|webp)$/;
  const path=valid.test(file)?(file.endsWith('.webp')?'cards/'+file:file):'placeholder.svg';
  const label=archived?'Agente descontinuado':'Agente de IA';
  const action=archived?'Ler a história':'Conhecer o trabalho';
  const attr=archived?'data-legacy':'data-agent';
  return `<article class="agent-card" aria-label="${label}: ${esc(person.name)}">
    <div class="agent-media">${archived?`<img class="portrait-backdrop" src="./assets/agents/${esc(path)}" alt="" aria-hidden="true" loading="lazy">`:""}<img class="agent-portrait" src="./assets/agents/${esc(path)}" alt="Retrato ilustrado de ${esc(person.name)}" width="928" height="1720" loading="lazy" decoding="async"></div>
    <div class="agent-caption"><h4>${esc(person.name)}</h4>
      <span class="agent-badge">${label}</span><div class="agent-role">${esc(person.role)}</div>
      <p class="agent-description">${esc(person.card_description||person.description)}</p>
      <button type="button" class="agent-detail" ${attr}="${index}" aria-label="${archived?'Ler a história de':'Ver a descrição completa de'} ${esc(person.name)}">${action} <span aria-hidden="true">→</span></button>
    </div></article>`;
}
function bindAgentDetails(root){
  $$('button[data-agent]',root).forEach(button=>button.addEventListener('click',()=>{
    const person=state.data.groups.flatMap(g=>g.agents)[Number(button.dataset.agent)];
    if(!person)return;
    $('#detail-content').innerHTML='<span class="dialog-kicker">COLABORADOR DIGITAL · AGENTE DE IA</span>'+
      '<h2 id="detail-title">'+esc(person.name)+'</h2>'+
      '<div class="dialog-data"><span>ÁREA DE ATUAÇÃO</span>'+esc(person.role)+'</div>'+
      '<p>'+esc(person.description)+'</p>'+
      '<p class="dialog-note">Este perfil descreve uma especialidade de agente de IA. A autonomia e a configuração operacional de cada agente são verificadas separadamente.</p>';
    const dialog=$('#detail-dialog');
    if(dialog?.showModal)dialog.showModal();
  }));
}
function renderAgents(){
  const all=state.data.groups.flatMap(g=>g.agents);
  const ordered=[...featuredNames.map(n=>all.find(a=>a.name===n)).filter(Boolean),...all.filter(a=>!featuredNames.includes(a.name))];
  const list=ordered;
  const root=$('#track-agents');
  root.innerHTML=list.length?list.map(person=>portraitCard(person,all.indexOf(person))).join(''):emptyMessage('Nenhum colaborador corresponde à busca.');
  bindAgentDetails(root);
  root.scrollLeft=0;updateTrack('agents');
  if(state.directoryOpen)renderDirectory();
}
function renderDirectory(){
  const groups=state.team==='todos'?state.data.groups:[state.data.groups[Number(state.team)]];
  const list=groups.flatMap(g=>g.agents);
  $('#directory-grid').innerHTML=list.length?list.map(a=>
    '<article class="directory-item">'+
    '<img class="directory-image" loading="lazy" width="80" height="80" alt="Retrato ilustrado de '+esc(a.name)+'" src="'+esc(agentImagePath(a))+'">'+
    '<div class="directory-copy"><strong>'+esc(a.name)+'</strong>'+
    '<small>'+esc(a.role)+' · AGENTE DE IA</small><p>'+esc(a.description)+'</p></div></article>'
  ).join(''):emptyMessage('Nenhum agente neste filtro.');
}
function renderLegacy(){
  const target=$('#legacy-grid');if(!target||!state.data)return;
  const all=state.data.legacy_agents||[];
  const list=all;
  target.innerHTML=list.length?list.map(person=>portraitCard(person,all.indexOf(person),true)).join(''):emptyMessage('Nenhum agente descontinuado corresponde à busca.');
  $$('button[data-legacy]',target).forEach(button=>button.addEventListener('click',()=>{
    const person=all[Number(button.dataset.legacy)];
    $('#detail-content').innerHTML='<span class="dialog-kicker">ARQUIVO DOS DESCONTINUADOS</span>'+
      '<h2 id="detail-title">'+esc(person.name)+'</h2><p>'+esc(person.role)+'</p>'+
      '<p>'+esc(person.description)+'</p><h3>Por que saiu</h3><p>'+esc(person.reason)+'</p>'+
      '<h3>Foi para um lugar melhor</h3><p>'+esc(person.destination)+'</p>';
    $('#detail-dialog').showModal();
  }));
   updateTrack('legacy');
 }
 function initLegacy(){ /* Memorial com navegação compartilhada. */ }
function initTeamDirectory(){
  const selector=$('#agent-area');
  state.team='todos';
  state.data.groups.forEach((g,i)=>{
    const option=document.createElement('option');option.value=String(i);option.textContent=g.name;selector.appendChild(option);
  });
  selector.addEventListener('change',()=>{state.team=selector.value;renderDirectory()});
  $('#show-directory').addEventListener('click',()=>{
    state.directoryOpen=!state.directoryOpen;
    $('#agent-directory').hidden=!state.directoryOpen;
    $('#show-directory').setAttribute('aria-expanded',String(state.directoryOpen));
    $('#show-directory').innerHTML=state.directoryOpen?'Recolher diretório <span aria-hidden="true">↑</span>':'Explorar o diretório completo <span aria-hidden="true">↓</span>';
    if(state.directoryOpen)renderDirectory();
  });
}
function updateTrack(which){
  const track=$(tracks[which]);if(!track)return;
  const cards=Array.from(track.querySelectorAll(which==='agents'?'.agent-card':(which==='legacy'?'.agent-card':'.experiment-card')));
  const total=cards.length;
  const progress=$('#progress-'+which);
  const fraction=track.scrollWidth>0?Math.min(1,(track.scrollLeft+track.clientWidth)/track.scrollWidth):1;
  if(progress)progress.style.width=Math.max(4,100*fraction)+'%';
  $$('button.slide-arrow[data-for="'+which+'"]').forEach(btn=>{
    btn.disabled=total===0||(btn.dataset.dir==="-1"?track.scrollLeft<3:track.scrollLeft>=track.scrollWidth-track.clientWidth-3);
  });
}
function activateCarousels(){
  Object.keys(tracks).forEach(which=>{
    const track=$(tracks[which]);let ticking=false;
    track.addEventListener('scroll',()=>{
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{updateTrack(which);ticking=false});
    },{passive:true});
    track.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
        event.preventDefault();scrollTrack(which,event.key==='ArrowRight'?1:-1);
      }
    });
  });
  $$('.slide-arrow').forEach(btn=>btn.addEventListener('click',()=>scrollTrack(btn.dataset.for,Number(btn.dataset.dir))));
  window.addEventListener('resize',()=>{Object.keys(tracks).forEach(updateTrack);},{passive:true});
}
function scrollTrack(which,dir){
  const track=$(tracks[which]);if(!track)return;
  const first=track.querySelector('.agent-card, .experiment-card');
  if(!first)return;
  const gap=parseFloat(getComputedStyle(track).gap||'0');
  const delta=first.getBoundingClientRect().width+gap;
  track.scrollBy({left:delta*dir,behavior:prefersReducedMotion.matches?'auto':'smooth'});
}
/* Autoplay: never overrides manual pause, focus, touch or reduced-motion preference.
   The timer does not advance tracks outside the viewport or in a hidden tab. */
function setupAutoplay(){
  const observer=('IntersectionObserver' in window)
    ?new IntersectionObserver(entries=>entries.forEach(entry=>{
       const name=entry.target.dataset.track;
       if(autoplayState[name])autoplayState[name].visible=entry.isIntersecting;
     }),{threshold:.12}):null;
  for(const name of Object.keys(tracks)){
    const track=$(tracks[name]);const s=autoplayState[name];
    track.dataset.track=name;
    s.visible=observer?false:true;
    if(observer)observer.observe(track);
    const pauseButton=$('button.autoplay-toggle[data-auto="'+name+'"]');
    const label=name==='agents'?'colaboradores':(name==='legacy'?'ex-agentes':(name==='prototypes'?'produtos':'ideias futuras'));
    const refresh=()=>{
      if(!pauseButton)return;
      pauseButton.textContent=s.paused?'▶':'Ⅱ';
      pauseButton.setAttribute('aria-pressed',String(s.paused));
      pauseButton.setAttribute('aria-label',(s.paused?'Iniciar':'Pausar')+' autoplay de '+label);
      pauseButton.title=(s.paused?'Reproduzir':'Pausar')+' carrossel de '+label;
    };
    refresh();
    pauseButton?.addEventListener('click',()=>{s.paused=!s.paused;refresh()});
    track.addEventListener('pointerenter',()=>{s.hover=true});
    track.addEventListener('pointerleave',()=>{s.hover=false});
    track.addEventListener('focusin',()=>{s.focus=true});
    track.addEventListener('focusout',ev=>{if(!track.contains(ev.relatedTarget))s.focus=false});
    track.addEventListener('touchstart',()=>{s.touch=true},{passive:true});
    track.addEventListener('touchend',()=>{s.touch=false},{passive:true});
    track.addEventListener('touchcancel',()=>{s.touch=false},{passive:true});
    const interval=(name==='agents'||name==='legacy')?4300:5000;
    setInterval(()=>{
      if(!state.data||document.hidden||!s.visible||s.paused||s.hover||s.focus||s.touch)return;
      if($('#detail-dialog')?.open)return;
      const cards=track.querySelectorAll(name==='agents'?'.agent-card':(name==='legacy'?'.agent-card':'.experiment-card'));
      if(cards.length<2||track.scrollWidth<=track.clientWidth+4)return;
      const gap=parseFloat(getComputedStyle(track).gap||'0');
      const delta=cards[0].getBoundingClientRect().width+gap;
      const atEnd=track.scrollLeft>=track.scrollWidth-track.clientWidth-4;
      if(atEnd)track.scrollTo({left:0,behavior:'auto'});
      else track.scrollBy({left:delta,behavior:'smooth'});
    },interval);
  }
  prefersReducedMotion.addEventListener?.('change',ev=>{
    if(ev.matches){
      for(const name of Object.keys(tracks)){
        autoplayState[name].paused=true;
        const button=$('button.autoplay-toggle[data-auto="'+name+'"]');
        if(button){button.textContent='▶';button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Iniciar autoplay de '+name);}
      }
    }
  });
}
function wireNavigation(){
  const menu=$('#menu-toggle'),nav=$('#main-nav');
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  });
  $$('#main-nav a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');
  }));
  const indexLinks=$$('.side-sections a');
  const indexedSections=indexLinks.map(link=>$(link.hash));
  function updateIndex(){
    const anchorOffset=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
    const sectionMargin=parseFloat(getComputedStyle($('#explorar')).scrollMarginTop)||0;
    const top=Math.max($('.topbar').getBoundingClientRect().bottom+24,anchorOffset+sectionMargin+2);
    let current=0;
    indexedSections.forEach((section,i)=>{
      if(section && section.getBoundingClientRect().top<=top)current=i;
    });
    indexLinks.forEach((link,i)=>{
      link.classList.toggle('side-active',i===current);
      if(i===current)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  let indexFrame=0;
  window.addEventListener('scroll',()=>{
    if(indexFrame)return;
    indexFrame=requestAnimationFrame(()=>{updateIndex();indexFrame=0;});
  },{passive:true});
  updateIndex();
  $$('.category').forEach(b=>b.addEventListener('click',()=>{
    state.category=b.dataset.category;
    $$('.category').forEach(x=>{
      const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));
    });
    if(state.data)renderProducts();
  }));
  const dlg=$('#detail-dialog');
  $('#close-dialog').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
}
function setupPoweredStrip(){
  const strip=$('.powered-strip');
  const toggle=$('#powered-toggle');
  if(!strip||!toggle)return;
  for(const image of strip.querySelectorAll('.powered-item-wordmark img')){
    const name=image.previousElementSibling;
    function showLogo(){
      image.hidden=false;
      image.alt=name.textContent;
      name.hidden=true;
    }
    if(image.complete && image.naturalWidth)showLogo();
    else image.addEventListener('load',showLogo,{once:true});
  }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const apply=()=>{
    strip.classList.toggle('is-paused',paused);
    toggle.textContent=paused?'▶':'Ⅱ';
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Iniciar movimento da faixa de marcas':'Pausar movimento da faixa de marcas');
    toggle.title=paused?'Reproduzir a faixa':'Pausar a faixa';
  };
  apply();
  toggle.addEventListener('click',()=>{paused=!paused;apply()});
  document.addEventListener('visibilitychange',()=>strip.classList.toggle('is-tab-hidden',document.hidden));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)strip.classList.toggle('is-out-of-view',!entry.isIntersecting);
    },{threshold:.05});
    observer.observe(strip);
  }
  reduced.addEventListener?.('change',event=>{if(event.matches){paused=true;apply()}});
}

function setupMore(id,step,singular,plural){
  const list=document.getElementById(id);
  const button=document.querySelector('button[aria-controls="'+id+'"]');
  const items=Array.from(list.children);
  let shown=step;
  function update(){
    items.forEach((item,i)=>{item.hidden=i>=shown;});
    const next=Math.min(step,items.length-shown);
    button.hidden=next<=0;
    if(next>0)button.textContent='Ver mais '+next+' '+(next===1?singular:plural);
  }
  update();
  button.addEventListener('click',()=>{
    const first=items[shown];
    shown+=step;
    update();
    first.tabIndex=-1;
    first.focus();
  });
}

async function start(){
  setupMore('future-signals',5,'sinal','sinais');
  wireNavigation();
  document.documentElement.classList.add('nav-ready');
  activateCarousels();setupAutoplay();setupPoweredStrip();
  try{
    const res=await fetch('./data/content.json',{cache:'no-store'});
    if(!res.ok)throw Error('Falha de acesso ao catálogo: HTTP '+res.status);
    const d=await res.json();
    if(!Array.isArray(d.products)||!Array.isArray(d.fronts)||!Array.isArray(d.groups))throw Error('Estrutura inválida');
    state.data=d;
    $('#date-reviewed').textContent=String(d.updated||'2026-11-18').split('-').reverse().join('/');
  }catch(err){
    setupMore('research-grid',3,'pesquisa','pesquisas');
    console.error('Soft Wild: catálogo interativo indisponível',err);
    return;
  }
  for(const render of [initTeamDirectory,renderProducts,renderResearch,renderAgents,renderLegacy]){
    try {render();}
    catch(err){console.error('Soft Wild: '+render.name,err);}
  }
  setupMore('research-grid',3,'pesquisa','pesquisas');
  document.documentElement.classList.add('catalog-ready');
  const view=$('#catalog-view');
  view.hidden=false;
  view.addEventListener('click',()=>{
    const expanded=$('#explorar').classList.toggle('catalog-list');
    view.setAttribute('aria-pressed',String(expanded));
    view.textContent=expanded?'Ver em carrossel':'Ver todos em lista';
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();