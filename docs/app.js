/* Soft Wild public site — no framework, no analytics, no private API. */
'use strict';
(function(){
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  let DATA=null,currentFilter='all',expandedProjects=false;
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=(str)=>String(str).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const hash=(str)=>Array.from(String(str)).reduce((h,c)=>(h*31+c.charCodeAt(0))|0,7)>>>0;
  const pick=(arr,n)=>arr[Math.abs(n)%arr.length];
  const pad=(i)=>String(i+1).padStart(2,'0');
  const toast=(message)=>{const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)};
  function reveal(){
    const nodes=$$('.reveal:not(.observed)');
    if(!('IntersectionObserver' in window)){nodes.forEach(e=>e.classList.add('is-visible'));return}
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    nodes.forEach(e=>{e.classList.add('observed');io.observe(e)});
  }

  function projectSymbol(item,index){
    const n=item.name.toLowerCase(), common='stroke="#153342" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"';
    let shapes='';
    if(n.includes('retrozim')) shapes='<rect x="16" y="17" width="68" height="55" rx="9" fill="#F8FAF1" '+common+'/><rect x="23" y="25" width="54" height="39" rx="2" fill="#86BFFF" '+common+'/><path d="M36 77h28M46 72v5M54 72v5" fill="none" '+common+'/><circle cx="42" cy="43" r="3" fill="#163240"/><circle cx="59" cy="43" r="3" fill="#163240"/><path d="M40 51q10 11 20 0" fill="none" '+common+'/>';
    else if(n.includes('minamp')||n.includes('media'))shapes='<rect x="15" y="16" width="70" height="65" rx="7" fill="#F1F7EC" '+common+'/><rect x="23" y="25" width="54" height="26" rx="3" fill="#BDEEDA" '+common+'/><path d="M30 45v-7M39 45V31M48 45v-9M57 45V28M66 45V34" stroke="#167C7F" stroke-width="4" stroke-linecap="round"/><circle cx="33" cy="64" r="7" fill="#FFFAEF" '+common+'/><circle cx="69" cy="64" r="7" fill="#FFFAEF" '+common+'/>';
    else if(n.includes('rever'))shapes='<rect x="16" y="21" width="68" height="56" rx="10" fill="#F7FAF3" '+common+'/><path d="M42 34v30l25-15z" fill="#05AEB2" '+common+'/><path d="M26 21v-9h16v9" fill="none" '+common+'/>';
    else if(n.includes('suíte')||n.includes('central'))shapes='<rect x="17" y="16" width="66" height="67" rx="8" fill="#FCFDF5" '+common+'/><path d="M17 37h66M49 16v67" '+common+' fill="none"/><rect x="27" y="24" width="14" height="7" rx="2" fill="#05ADB4"/><rect x="58" y="47" width="16" height="16" rx="3" fill="#A6D6FA"/>';
    else if(n.includes('donki')||n.includes('p2p'))shapes='<rect x="17" y="16" width="66" height="67" rx="8" fill="#F9FCF6" '+common+'/><path d="M32 39h35l-9-9m9 9-9 9M68 60H33l9 9m-9-9 9-9" fill="none" '+common+'/><circle cx="31" cy="39" r="3" fill="#05ADB4"/><circle cx="69" cy="60" r="3" fill="#05ADB4"/>';
    else if(n.includes('arquivos')||n.includes('galeria'))shapes='<path d="M14 33h31l8 8h33v35H14z" fill="#EAF7EE" '+common+'/><path d="M14 33V22h29l8 10" fill="none" '+common+'/><rect x="24" y="50" width="50" height="15" rx="4" fill="#A5E2E0"/>';
    else if(n.includes('shopping'))shapes='<rect x="20" y="23" width="60" height="58" rx="4" fill="#EEF8F0" '+common+'/><path d="M16 36h68l-8-16H24z" fill="#A8E0DF" '+common+'/><path d="M28 80V48h44v32M45 48v32" fill="none" '+common+'/><path d="M18 38q7 14 14 0 7 14 14 0 7 14 14 0 7 14 14 0" fill="none" '+common+'/>';
    else if(n.includes('rede')||n.includes('conversas')||n.includes('histórias'))shapes='<path d="M16 23h55q12 0 12 12v28q0 12-12 12H47L30 87V75H26q-10 0-10-12z" fill="#FCFDF5" '+common+'/><circle cx="37" cy="48" r="4" fill="#05ADB4"/><circle cx="51" cy="48" r="4" fill="#05ADB4"/><circle cx="65" cy="48" r="4" fill="#05ADB4"/>';
    else if(n.includes('nfc')||n.includes('ir')||n.includes('objeto')||n.includes('hardware'))shapes='<rect x="22" y="14" width="56" height="72" rx="9" fill="#FDFCF2" '+common+'/><path d="M38 47q12-18 24 0M43 53q7-10 14 0" fill="none" '+common+'/><circle cx="50" cy="63" r="4" fill="#05ADB4"/>';
    else shapes='<path d="M50 11 84 31v38L50 89 16 69V31z" fill="#F9FCF5" '+common+'/><path d="M16 31l34 20 34-20M50 51v38" fill="none" '+common+'/><circle cx="50" cy="51" r="7" fill="#05B2B7"/>';
    return '<svg viewBox="0 0 100 100" role="img" aria-label="Ilustração simbólica para '+esc(item.name)+'">'+shapes+'</svg>';
  }

  function portraitSvg(person,index){
    // Drawn portrait components with deliberately varied face shapes, hairstyles, accessories and poses.
    const h=hash(person.name),female=person.gender==='F';
    const skins=['#F3C39B','#D5A17E','#8F583F','#E5AD8A','#643C32','#C98B67','#F5D1AE','#AC6A4B'];
    const hairColors=['#17252E','#3B2828','#6D493B','#9E492C','#CA8750','#211D29','#3B382F'];
    const shirts=['#1F4C55','#9D5641','#5F665D','#374A73','#B97163','#2B434A','#B18B43','#655B71'];
    const bg=['#DFF1ED','#F3E6E0','#E1EDF9','#EEE4F5','#E5E9DA','#F3E9D9','#DDEEDC','#E0E4F0'];
    const skin=pick(skins,h),hair=pick(hairColors,h>>3),shirt=pick(shirts,h>>6),back=pick(bg,h>>9);
    const variant=(h>>4)%8,glass=(h%4===0)||person.name.includes('Milan')||person.name.includes('Ada')||person.name.includes('Nora');
    const beard=!female&&((h>>10)%3===0),freckles=(h>>12)%4===0;
    const tilt=((h>>3)%9)-4,fx=160+((h>>13)%13)-6,fy=117+((h>>15)%9)-4;
    let hairBack='',hairFront='';
    if(variant===0){ // rounded afro / curls
      const cs=[[118,84],[137,58],[162,50],[188,58],[209,79],[110,108],[215,105],[125,137],[204,131]];
      hairBack=cs.map((xy,i)=>'<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="'+(25+(i%3)*3)+'" fill="'+hair+'"/>').join('');
      hairFront='<path d="M112 95Q111 58 144 64Q161 43 181 60Q210 61 212 96Q183 85 160 89Q141 83 112 95" fill="'+hair+'"/>';
    }else if(variant===1){ // bob
      hairBack='<path d="M101 80Q103 31 156 30Q211 31 221 89L226 189Q196 204 186 168L123 165Q104 205 94 181z" fill="'+hair+'"/>';
      hairFront='<path d="M100 108Q95 48 158 45Q218 49 220 108Q183 90 159 88Q131 101 100 108" fill="'+hair+'"/><path d="M132 47Q143 84 122 115" fill="none" stroke="'+hair+'" stroke-width="21" stroke-linecap="round"/>';
    }else if(variant===2){ // cropped / spikes
      hairFront='<path d="M102 101Q92 65 118 63L105 48 136 56 146 39 163 52 177 38 192 55 217 53 207 75 218 100Q180 86 151 87Q127 87 102 101" fill="'+hair+'"/>';
    }else if(variant===3){ // long waves
      hairBack='<path d="M102 83Q106 28 159 29Q214 28 222 91Q235 164 217 229L195 230 195 153 119 154 124 233 95 225Q89 147 102 83" fill="'+hair+'"/>';
      hairFront='<path d="M101 105Q95 64 136 52Q181 40 216 75Q196 65 180 86Q155 75 131 95z" fill="'+hair+'"/>';
    }else if(variant===4){ // side swoop with fade
      hairFront='<path d="M99 106Q94 60 148 48Q182 35 210 76Q191 80 171 70Q146 98 99 106" fill="'+hair+'"/><path d="M106 99Q102 128 116 145" stroke="'+hair+'" stroke-width="10" stroke-linecap="round"/>';
    }else if(variant===5){ // bun
      hairBack='<circle cx="208" cy="54" r="32" fill="'+hair+'"/><path d="M104 85Q107 40 157 39Q213 39 219 112L205 159Q195 134 185 111H122Q117 142 109 160z" fill="'+hair+'"/>';
      hairFront='<path d="M104 100Q112 56 158 49Q187 45 213 84Q188 80 170 66Q150 97 104 100" fill="'+hair+'"/>';
    }else if(variant===6){ // shaved
      hairFront='<path d="M101 100Q98 49 160 46Q210 45 220 103Q185 76 159 79Q136 76 101 100" fill="'+hair+'"/>';
    }else{ // messy waves
      hairBack='<path d="M101 91Q98 38 145 39Q175 22 199 46Q224 59 218 113L204 140 121 136z" fill="'+hair+'"/>';
      hairFront='<path d="M104 103Q107 58 132 65Q152 35 175 59Q192 47 211 84Q174 84 157 87Q136 84 104 103" fill="'+hair+'"/>';
    }
    const bgAccent=pick(['#B7E0D6','#D7C2DA','#B7CDE0','#F3D4B8','#C8D7C1'],h>>17);
    const mouth=female?'<path d="M150 170Q161 176 171 169" fill="none" stroke="#884C4A" stroke-width="3" stroke-linecap="round"/>':'<path d="M150 170Q162 172 173 169" fill="none" stroke="#7A4540" stroke-width="3" stroke-linecap="round"/>';
    const beardPart=beard?'<path d="M131 158Q129 204 160 207Q192 205 192 162Q179 177 161 177Q146 176 131 158" fill="'+hair+'" opacity=".9"/><path d="M144 163Q160 171 177 162" stroke="'+hair+'" stroke-width="6" stroke-linecap="round" fill="none"/>':'';
    const specs=glass?'<g fill="none" stroke="#293941" stroke-width="4"><rect x="119" y="122" width="37" height="28" rx="'+(variant%2?12:7)+'"/><rect x="166" y="122" width="37" height="28" rx="'+(variant%2?12:7)+'"/><path d="M156 129Q161 126 166 129M110 132h9M203 132h9"/></g>':'';
    const dots=freckles?'<g fill="#B56E56" opacity=".6"><circle cx="131" cy="152" r="1.6"/><circle cx="137" cy="156" r="1.5"/><circle cx="184" cy="152" r="1.5"/><circle cx="190" cy="155" r="1.5"/></g>':'';
    const accessory=female&&((h>>19)%3===0)?'<circle cx="113" cy="155" r="7" fill="none" stroke="#E2B761" stroke-width="3"/><circle cx="211" cy="155" r="7" fill="none" stroke="#E2B761" stroke-width="3"/>':'';
    const headphone=person.name.includes('Ryan')||person.name.includes('Atlas')?'<path d="M106 142V112Q106 67 161 67Q215 67 215 112V144" fill="none" stroke="#142D39" stroke-width="11"/><rect x="97" y="133" width="19" height="42" rx="8" fill="#213F47"/><rect x="205" y="133" width="19" height="42" rx="8" fill="#213F47"/>':'';
    const brow='<path d="M123 121Q136 114 149 121M173 121Q187 114 199 121" fill="none" stroke="'+hair+'" stroke-width="5" stroke-linecap="round"/>';
    const eyes='<path d="M129 140Q136 136 144 140M180 140Q187 136 194 140" fill="none" stroke="#26313A" stroke-width="4" stroke-linecap="round"/>';
    const name=esc(person.name);
    return '<svg viewBox="0 0 320 270" role="img" aria-label="Retrato ilustrado de '+name+', personagem de agente de IA" xmlns="http://www.w3.org/2000/svg">'+
      '<rect width="320" height="270" fill="'+back+'"/>'+
      '<circle cx="259" cy="56" r="95" fill="'+bgAccent+'" opacity=".8"/>'+
      '<path d="M-20 245Q80 187 169 224Q244 180 340 250V300H-20z" fill="#FFFFFF" opacity=".3"/>'+
      '<g transform="rotate('+tilt+' '+fx+' '+fy+')">'+
      '<path d="M54 292Q60 220 117 218L138 206H182L206 218Q255 213 271 292" fill="'+shirt+'" stroke="#203C45" stroke-width="4"/>'+
      '<path d="M135 212L159 239L187 211" fill="none" stroke="#FAF6E9" stroke-width="7"/>'+
      '<path d="M145 194L143 228Q161 240 181 228L179 193" fill="'+skin+'" stroke="#8A6257" stroke-width="2"/>'+
      hairBack+
      '<ellipse cx="115" cy="143" rx="13" ry="18" fill="'+skin+'"/><ellipse cx="207" cy="143" rx="13" ry="18" fill="'+skin+'"/>'+
      '<path d="M111 96Q111 65 155 62Q199 62 207 104L203 155Q192 192 160 197Q127 190 117 163z" fill="'+skin+'" stroke="#9A6354" stroke-width="2"/>'+
      '<path d="M120 153Q126 167 138 170" fill="none" stroke="#F8E0BE" stroke-width="8" opacity=".55"/>'+
      '<path d="M184 112Q198 123 199 140" fill="none" stroke="#744D43" stroke-width="2" opacity=".35"/>'+
      hairFront+brow+eyes+dots+
      '<path d="M160 140l-6 15q7 5 14 0" fill="none" stroke="#B47C65" stroke-width="2.2" stroke-linecap="round"/>'+
      beardPart+mouth+specs+accessory+headphone+
      '</g><path d="M8 260H80" stroke="#28464A" stroke-width="1" opacity=".3"/><path d="M240 15h60" stroke="#28464A" stroke-width="1" opacity=".25"/></svg>';
  }

  function renderResearch(){
    const root=$('#research-grid');
    root.innerHTML=DATA.fronts.map((r,i)=>'<article class="research-card reveal">'+
      '<div class="research-upper"><span class="research-index">'+pad(i)+' / PESQUISA</span><span class="research-status">'+esc(r.status.split(';')[0].slice(0,34))+'</span></div>'+
      '<h3>'+esc(r.name)+'</h3><p>'+esc(r.progress)+'</p>'+
      '<button class="research-toggle" type="button" aria-expanded="false" aria-controls="research-more-'+i+'">Próximo marco <span aria-hidden="true">↗</span></button>'+
      '<div class="research-more" id="research-more-'+i+'" hidden><strong>Próxima etapa:</strong> '+esc(r.next)+'</div></article>').join('');
    $$('.research-toggle',root).forEach(btn=>btn.addEventListener('click',()=>{
      const el=document.getElementById(btn.getAttribute('aria-controls'));const active=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!active));el.hidden=active;
      btn.innerHTML=active?'Próximo marco <span aria-hidden="true">↗</span>':'Fechar detalhes <span aria-hidden="true">↑</span>';
    }));
  }
  function renderProjects(){
    const items=DATA.products.filter(x=>currentFilter==='all'||x.stage===currentFilter);
    const subset=expandedProjects?items:items.slice(0,6);
    $('#project-grid').innerHTML=subset.map((p,i)=>{
      const originalIndex=DATA.products.indexOf(p);
      return '<article class="project-card reveal">'+
        '<div class="project-visual visual-'+String.fromCharCode(97+originalIndex%8)+'">'+
        '<span class="project-index">SW / '+pad(originalIndex)+'</span><div class="project-artifact">'+projectSymbol(p,originalIndex)+'</div>'+
        '<span class="project-upper-tag">'+(p.stage==='prototype'?'BUILD':'EXPLORE')+'</span></div>'+
        '<div class="project-body"><span class="project-label">'+(p.stage==='prototype'?'Em construção':'Em investigação')+'</span>'+
        '<h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p>'+
        '<div class="project-bottom"><span class="project-phase">'+esc(p.status.split(';')[0].slice(0,48))+'</span>'+
        '<button class="project-detail" type="button" data-product="'+originalIndex+'" aria-label="Ver detalhes de '+esc(p.name)+'">Detalhes ↗</button></div></div></article>';
    }).join('');
    const more=$('#show-projects');more.hidden=items.length<=6;more.innerHTML=expandedProjects?'Mostrar menos <span aria-hidden="true">↑</span>':'Explorar mais projetos <span aria-hidden="true">↓</span>';
    $$('[data-product]',$('#project-grid')).forEach(btn=>btn.addEventListener('click',()=>showProduct(DATA.products[Number(btn.dataset.product)])));
    reveal();
  }
  function showProduct(p){
    const dialog=$('#detail-dialog');
    $('#dialog-content').innerHTML='<div class="dialog-kicker">'+(p.stage==='prototype'?'PRODUTO / PROTÓTIPO':'IDEIA / PESQUISA')+'</div>'+
      '<h2 id="dialog-title">'+esc(p.name)+'</h2><p>'+esc(p.description)+'</p>'+
      '<div class="dialog-status"><strong>Estado registrado em 18/11/2026:</strong><br>'+esc(p.status)+'</div>'+
      '<div class="dialog-footer">Este portfólio documenta experimentos em andamento; não é uma oferta comercial nem um cronograma de lançamento.</div>';
    dialog.showModal();document.body.classList.add('dialog-open');
  }
  function renderProgress(){
    const fronts=DATA.fronts.filter(x=>!x.name.toLowerCase().includes('shopping')).slice(0,6);
    $('#progress-list').innerHTML=fronts.map(f=>'<article class="progress-item"><div><h4>'+esc(f.name)+'</h4><p>'+esc(f.status)+'</p></div><span aria-hidden="true">↗</span></article>').join('');
    const date=DATA.updated.split('-').reverse().join('.');
    $('#updated').textContent=date;
  }
  const featured=['Adrian Wolf','Iris Wren','Theo Lynx','Luna Fox','Milan Falcon','Atlas Orca','Eva Mink','Talia Swan'];
  function renderAgents(){
    const all=DATA.groups.flatMap(g=>g.agents);
    $('#agents-grid').innerHTML=featured.map((name,i)=>{
      const a=all.find(x=>x.name===name)||all[i];
      const index=all.indexOf(a);
      return '<article class="agent-card reveal"><div class="agent-portrait">'+portraitSvg(a,index)+'</div>'+
      '<div class="agent-body"><h3 class="agent-name">'+esc(a.name)+'</h3><div class="agent-role">'+esc(a.role)+'</div>'+
      '<p class="agent-desc">'+esc(a.description)+'</p><span class="agent-tag">AGENTE DE IA</span></div></article>';
    }).join('');
    const filter=$('#team-filter');filter.innerHTML='<option value="all">Todos os núcleos</option>'+DATA.groups.map((g,i)=>'<option value="'+i+'">'+esc(g.name)+'</option>').join('');
    renderDirectory('all');reveal();
  }
  function renderDirectory(selection){
    const groups=selection==='all'?DATA.groups:[DATA.groups[Number(selection)]];
    const directory=$('#team-directory');
    directory.innerHTML=groups.map(g=>{
      return g.agents.map(a=>{
        const index=DATA.groups.flatMap(z=>z.agents).indexOf(a);
        return '<article class="directory-card"><div class="directory-avatar">'+portraitSvg(a,index)+'</div><div>'+
        '<h3>'+esc(a.name)+'</h3><div class="role">'+esc(a.role)+'</div><p>'+esc(a.description)+'</p>'+
        '<small>AGENTE DE IA · '+esc(g.name)+'</small></div></article>';
      }).join('');
    }).join('');
  }
  function installEvents(){
    $('#menu-toggle')?.addEventListener('click',()=>{}); // future-safe
    const toggle=$('.menu-toggle'),nav=$('#nav-links');
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
    $$('#nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu')}));
    $$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
      currentFilter=btn.dataset.filter;expandedProjects=false;
      $$('.filter').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
      renderProjects();
    }));
    $('#show-projects').addEventListener('click',()=>{expandedProjects=!expandedProjects;renderProjects()});
    $('#show-team').addEventListener('click',()=>{$('#team-dialog').showModal();document.body.classList.add('dialog-open')});
    $('#team-filter').addEventListener('change',(e)=>renderDirectory(e.target.value));
    $('#dialog-close').addEventListener('click',()=>{$('#detail-dialog').close();document.body.classList.remove('dialog-open')});
    $('#team-dialog-close').addEventListener('click',()=>{$('#team-dialog').close();document.body.classList.remove('dialog-open')});
    $$('dialog').forEach(d=>{
      d.addEventListener('close',()=>{document.body.classList.remove('dialog-open')});
      d.addEventListener('click',e=>{if(e.target===d){d.close();document.body.classList.remove('dialog-open')}});
    });
    let ticking=false;
    addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{
      const h=document.documentElement;const progress=h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight);
      $('#reading-progress').style.width=Math.min(100,Math.max(0,progress*100))+'%';
      ticking=false;
    })},{passive:true});
    $('#year').textContent=new Date().getFullYear();
  }
  async function load(){
    installEvents();reveal();
    try{
      const response=await fetch('./data/content.json',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      DATA=await response.json();
      if(!Array.isArray(DATA.products)||!Array.isArray(DATA.groups)||!Array.isArray(DATA.fronts))throw new Error('Estrutura de dados inválida');
      $('#count-all').textContent=DATA.products.length;
      $('#count-prototype').textContent=DATA.products.filter(x=>x.stage==='prototype').length;
      $('#count-concept').textContent=DATA.products.filter(x=>x.stage==='concept').length;
      renderResearch();renderProjects();renderProgress();renderAgents();
    }catch(error){
      ['research-grid','project-grid','agents-grid'].forEach(id=>{
        document.getElementById(id).innerHTML='<p class="empty-state">Não foi possível carregar esta seção. Os dados ficam no arquivo público <code>data/content.json</code> e podem ser consultados pelo GitHub.</p>';
      });
      $('#progress-list').textContent='Informações temporariamente indisponíveis.';
      toast('Dados editoriais indisponíveis nesta visualização.');
      console.error('Soft Wild:',error);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();