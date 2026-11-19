/* Soft Wild — página editorial GitHub Pages. Sem serviços externos, cookies ou tracking. */
(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const source='./data/content.json';
const people=['Adrian Wolf','Theo Lynx','Milan Falcon','Ethan Bear','Atlas Orca','Dylan Tiger','Luna Fox','Iris Wren','Maya Stoat','Talia Swan'];
const featuredProjects=['Retrozim Launcher','Minamp','Suíte 98','REVER (extensão de navegador)','Conversas improváveis','Ecossistemas para shopping centers'];
const iconMap=['▣','♫','▱','▷','♧','◇'];
const shortCopy={
'Retrozim Launcher':'Launcher Android com personalidade de desktop clássico, widgets e novas formas de organização.',
'Minamp':'Controle musical em aplicativo e widget, com interface de inspiração clássica.',
'Suíte 98':'Ecossistema de ferramentas Android com linguagem visual clássica.',
'REVER (extensão de navegador)':'Guardar momentos de vídeo e reencontrar seu contexto.',
'Conversas improváveis':'Conversas espontâneas entre desconhecidos, com novas formas de conexão.',
'Ecossistemas para shopping centers':'Pesquisa de serviços e experiências para visitantes, lojas e operação.'
};
const phaseLabel={
'Retrozim Launcher':'Em teste','Minamp':'Alfa','Suíte 98':'Em desenvolvimento',
'REVER (extensão de navegador)':'Em estudo','Conversas improváveis':'Conceito',
'Ecossistemas para shopping centers':'Pesquisa'
};
let dataset=null;
function photoPosition(i){const col=i%5,row=Math.floor(i/5);return `${col*25}% ${row*100}%`;}
function portrait(name){const i=people.indexOf(name);if(i<0)return `<span class="portrait placeholder" aria-hidden="true"></span>`;
return `<span class="portrait" role="img" aria-label="Retrato ilustrado do agente de IA ${escapeHTML(name)}" style="background-position:${photoPosition(i)}"></span>`;}
function cardPerson(p){return `<article class="teammate">${portrait(p.name)}<h3>${escapeHTML(p.name)}</h3><p class="role">${escapeHTML(p.role)}</p><span class="pill cyan">Agente de IA</span></article>`;}
function cardProject(p,i){const label=phaseLabel[p.name]||(p.stage==='concept'?'Em estudo':'Em desenvolvimento');
return `<article class="product"><span class="product-icon" aria-hidden="true">${iconMap[i%iconMap.length]}</span><div class="product-copy"><div class="product-title-row"><h3>${escapeHTML(p.name)}</h3><span class="pill ${p.stage==='concept'?'studying':'cyan'}">${escapeHTML(label)}</span></div><p>${escapeHTML(shortCopy[p.name]||p.description)}</p></div></article>`;}
function renderAll(data){
const allPeople=data.groups.flatMap(g=>g.agents),allProducts=data.products;
$('#team-featured').innerHTML=people.map(name=>allPeople.find(a=>a.name===name)).filter(Boolean).map(cardPerson).join('');
$('#product-featured').innerHTML=featuredProjects.map(name=>allProducts.find(p=>p.name===name)).filter(Boolean).map(cardProject).join('');
const teamSelect=$('#team-select');data.groups.forEach((g,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=g.name;teamSelect.appendChild(opt)});
const showTeam=()=>{let group=teamSelect.value;const relevant=group==='all'?allPeople:data.groups[Number(group)].agents;$('#team-directory').innerHTML=relevant.map(a=>`<article class="directory-card"><h3>${escapeHTML(a.name)}</h3><p class="directory-role">${escapeHTML(a.role)} · Agente de IA</p><p>${escapeHTML(a.description)}</p></article>`).join('')};
teamSelect.addEventListener('change',showTeam);showTeam();
const projectSelect=$('#product-select');const showProjects=()=>{$('#all-products').innerHTML=allProducts.filter(p=>projectSelect.value==='all'||p.stage===projectSelect.value).map(p=>`<article class="directory-product"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description)}</p><small>${escapeHTML(p.status)}</small></article>`).join('')};
projectSelect.addEventListener('change',showProjects);showProjects();
$('#research-list').innerHTML=data.fronts.map((f,i)=>`<article class="research-entry"><h3>${String(i+1).padStart(2,'0')} · ${escapeHTML(f.name)}</h3><p><strong>Etapa:</strong> ${escapeHTML(f.status)}</p><p><strong>Avanço:</strong> ${escapeHTML(f.progress)}</p><p><strong>Próximo marco:</strong> ${escapeHTML(f.next)}</p></article>`).join('');
$('#progress-list').innerHTML=data.fronts.map(f=>`<article class="research-entry"><h3>${escapeHTML(f.name)}</h3><p><strong>Estado:</strong> ${escapeHTML(f.status)}</p><p>${escapeHTML(f.progress)}</p><p><strong>Próxima etapa:</strong> ${escapeHTML(f.next)}</p></article>`).join('');
}
async function init(){
try{
const response=await fetch(source,{cache:'no-store'});if(!response.ok)throw new Error('Dados indisponíveis: '+response.status);
const data=await response.json();if(!data||!Array.isArray(data.groups)||!Array.isArray(data.products)||!Array.isArray(data.fronts))throw new Error('Formato inválido');
dataset=data;renderAll(data);
}catch(err){console.error('Soft Wild:',err);for(const id of ['team-featured','product-featured','team-directory','all-products','research-list','progress-list']){const el=document.getElementById(id);if(el)el.innerHTML='<p>Os detalhes desta seção não puderam ser carregados. Consulte a página do GitHub para a documentação pública.</p>';}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
