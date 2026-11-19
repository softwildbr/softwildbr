/* SOFT WILD / 06 — catálogo, pesquisas e agentes.
   Sem API externa ou monitoramento automático; o conteúdo vem de data/content.json. */
(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const pad=n=>String(n).padStart(2,'0');
const featuredNames=['Adrian Wolf','Theo Lynx','Milan Falcon','Ethan Bear','Atlas Orca','Dylan Tiger','Luna Fox','Iris Wren','Maya Stoat','Talia Swan'];
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
const state={data:null,category:'todos',query:'',team:null,directoryOpen:false};
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const tracks={prototypes:'#track-prototypes',futures:'#track-futures',agents:'#track-agents'};

function classify(p){
  return productArt[p.name]||['pesquisa',p.stage==='concept'?'PESQUISA · CONCEITO':'LAB · EXPERIMENTO','✳','teal'];
}
function status(p){
  const s=normalize(p.status);
  if(s.includes('alfa')||s.includes('alpha'))return 'ALFA';
  if(s.includes('candidata')||s.includes('teste'))return 'EM TESTE';
  if(s.includes('protótipo')||s.includes('piloto'))return 'PROTÓTIPO';
  if(s.includes('pesquisa')||s.includes('planejamento')||s.includes('sem apk')||s.includes('estudo')||s.includes('conceito'))return 'EM ESTUDO';
  if(s.includes('desenvolvimento')||s.includes('integração')||s.includes('implementação'))return 'DESENVOLVIMENTO';
  return p.stage==='concept'?'CONCEITO':'EXPERIMENTO';
}
function matches(terms,query){
  return !query||normalize(terms.join(' ')).includes(query);
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
    '<p class="dialog-note">Não representa lançamento, preço, estoque nem data prometida. Revisão do catálogo: 18/11/2026.</p>';
    const dialog=$('#detail-dialog');if(dialog?.showModal)dialog.showModal();
  }));
}
function renderProducts(){
  const d=state.data;
  const filtered=d.products.filter(p=>{
    const [type,cat]=classify(p);
    return (state.category==='todos'||type===state.category)&&matches([p.name,p.description,p.status,cat],state.query);
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
  $('#catalog-notice').textContent=state.query?
    'Resultados filtrados por “'+state.query+'”. Os estágios permanecem documentais, sem disponibilidade comercial presumida.':
    'ⓘ Os estágios são documentais. Nenhum projeto é apresentado como lançado sem confirmação.';
}
function researchTile(f,i){
  return '<article class="research-card"><div class="research-top"><span class="research-icon" aria-hidden="true">'+esc(researchIcons[i%researchIcons.length])+'</span>'+
     '<h3>'+esc(f.name)+'</h3></div><span class="research-status">'+esc((f.status||'Em pesquisa').split(';')[0].slice(0,46))+'</span>'+
     '<p>'+esc(f.progress)+'</p><details><summary>Próximo marco</summary><p>'+esc(f.next)+'</p></details></article>';
}
function renderResearch(){
  const list=state.data.fronts.filter(f=>matches([f.name,f.progress,f.status,f.next],state.query));
  $('#research-grid').innerHTML=list.length?list.map((f)=>researchTile(f,state.data.fronts.indexOf(f))).join(''):emptyMessage('Nenhuma frente corresponde à busca.');
  const others=state.data.fronts.filter(f=>!normalize(f.name).includes('shopping')).slice(0,4);
  $('#progress-fronts').innerHTML=others.map(f=>'<article class="progress-row"><b>'+esc(f.name)+'</b><span>'+esc(f.status)+'</span></article>').join('');
}
function spritePosition(index){
  return (index%5)*25+'% '+Math.floor(index/5)*100+'%';
}
function agentVisual(a){
  const index=featuredNames.indexOf(a.name);
  if(index>=0){
    return '<div class="agent-portrait is-illustrated" role="img" aria-label="Retrato editorial ilustrado do agente de IA '+esc(a.name)+'" style="background-position:'+spritePosition(index)+'"></div>';
  }
  const initials=a.name.split(' ').slice(0,2).map(x=>x.charAt(0)).join('');
  return '<div class="agent-portrait initials" aria-label="Monograma para o agente de IA '+esc(a.name)+'" role="img"><span class="agent-initials" aria-hidden="true">'+esc(initials)+'</span></div>';
}
function agentTile(a){
  return '<article class="agent-card">'+agentVisual(a)+
     '<div class="agent-caption"><h4>'+esc(a.name)+'</h4>'+
     '<div class="agent-role">'+esc(a.role)+'</div>'+
     '<p class="agent-description">'+esc(a.description)+'</p><span class="agent-badge">AGENTE DE IA</span></div></article>';
}
function renderAgents(){
  const all=state.data.groups.flatMap(g=>g.agents);
  const ordered=[...featuredNames.map(n=>all.find(a=>a.name===n)).filter(Boolean),...all.filter(a=>!featuredNames.includes(a.name))];
  const list=ordered.filter(a=>matches([a.name,a.role,a.description],state.query));
  const root=$('#track-agents');
  root.innerHTML=list.length?list.map(agentTile).join(''):emptyMessage('Nenhum agente corresponde à busca.');
  root.scrollLeft=0;updateTrack('agents');
  if(state.directoryOpen)renderDirectory();
}
function renderDirectory(){
  const groups=state.team==='todos'?state.data.groups:[state.data.groups[Number(state.team)]];
  const list=groups.flatMap(g=>g.agents).filter(a=>matches([a.name,a.role,a.description],state.query));
  $('#directory-grid').innerHTML=list.length?list.map(a=>{
    const initials=a.name.split(' ').slice(0,2).map(x=>x.charAt(0)).join('');
    return '<article class="directory-item"><div class="directory-image" aria-hidden="true">'+esc(initials)+'</div><div class="directory-copy"><strong>'+esc(a.name)+'</strong>'+
      '<small>'+esc(a.role)+' · AGENTE DE IA</small><p>'+esc(a.description)+'</p></div></article>';
  }).join(''):emptyMessage('Nenhum agente neste filtro.');
}
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
  const cards=Array.from(track.querySelectorAll(which==='agents'?'.agent-card':'.experiment-card'));
  const total=cards.length;
  const first=cards[0];
  const step=first?(first.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||'0')):1;
  const current=total?Math.min(total,Math.max(1,1+Math.round(track.scrollLeft/Math.max(1,step)))):0;
  const counter=$('#counter-'+which);if(counter)counter.textContent=pad(current)+' / '+pad(total);
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
  window.addEventListener('resize',()=>Object.keys(tracks).forEach(updateTrack),{passive:true});
}
function scrollTrack(which,dir){
  const track=$(tracks[which]);if(!track)return;
  const first=track.querySelector(which==='agents'?'.agent-card':'.experiment-card');
  if(!first)return;
  const gap=parseFloat(getComputedStyle(track).gap||'0');
  const delta=first.getBoundingClientRect().width+gap;
  track.scrollBy({left:delta*dir,behavior:prefersReducedMotion.matches?'auto':'smooth'});
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
  $$('.side-sections a').forEach(a=>a.addEventListener('click',()=>{
    $$('.side-sections a').forEach(x=>x.classList.toggle('side-active',x===a));
  }));
  const form=$('#site-search-form'),input=$('#site-search');
  form.addEventListener('submit',e=>{e.preventDefault();$('#explorar').scrollIntoView({behavior:prefersReducedMotion.matches?'auto':'smooth'})});
  form.addEventListener('click',()=>{if(window.matchMedia('(max-width:600px)').matches)input.focus()});
  input.addEventListener('input',()=>{
    state.query=normalize(input.value.trim());
    if(state.data){renderProducts();renderResearch();renderAgents();}
    $('#live-announcer').textContent=state.query?'Resultados atualizados para '+input.value:'Busca limpa.';
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();input.focus();input.select();
    }
    if(e.key==='Escape'&&document.activeElement===input){input.value='';input.dispatchEvent(new Event('input'));}
  });
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
async function start(){
  wireNavigation();activateCarousels();
  try{
    const res=await fetch('./data/content.json',{cache:'no-store'});
    if(!res.ok)throw Error('Falha de acesso ao catálogo: HTTP '+res.status);
    const d=await res.json();
    if(!Array.isArray(d.products)||!Array.isArray(d.fronts)||!Array.isArray(d.groups))throw Error('Estrutura inválida');
    state.data=d;
    $('#date-reviewed').textContent=String(d.updated||'2026-11-18').split('-').reverse().join('/');
    initTeamDirectory();renderProducts();renderResearch();renderAgents();
  }catch(err){
    console.error('Soft Wild: dados editoriais indisponíveis',err);
    for(const id of ['track-prototypes','track-futures','track-agents','research-grid','progress-fronts']){
      const target=document.getElementById(id);if(target)target.innerHTML=emptyMessage('Não foi possível carregar o catálogo. Consulte o repositório público no GitHub.');
    }
    $('#catalog-notice').textContent='O conteúdo estruturado está temporariamente indisponível.';
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();