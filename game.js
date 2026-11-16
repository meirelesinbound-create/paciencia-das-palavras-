(()=>{'use strict';const APP_BASE=new URL('.',document.currentScript.src);const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],KEY='crPaciênciaV2',OLD=['crCoins','crUnlocked','crPhase','crGame','crSound','crTheme'];let cfg,levels=[],pendingLoss=false,phase=1,coins=Number(localStorage.crCoins)||0,unlocked=Number(localStorage.crUnlocked)||1,activeAct='Todos',state=null,selected=null,history=[],sound=localStorage.crSound!=='false',vibration=true,extraMoves=0,miniUsed=false,extraAttempt=false,toastTimer,lastScreen='home';const store={version:2,coins,unlocked,phase,completed:{},stars:{},settings:{sound,vibration,theme:localStorage.crTheme||'dark'},stats:{streak:0,lastDaily:'',dailyDone:''},state:null,screen:'home'};function save(){store.screen=lastScreen;store.coins=coins;store.unlocked=unlocked;store.phase=phase;store.state=state;localStorage.setItem(KEY,JSON.stringify(store));$('#coinCount').textContent=coins;$('#gameCoins').textContent=coins;$('#sceneCoins').textContent=coins}function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&d.version<=2){Object.assign(store,d);coins=Number(d.coins)||0;unlocked=Number(d.unlocked)||1;phase=Number(d.phase)||1;store.completed=d.completed||{};store.stars=d.stars||{};store.stats=d.stats||store.stats;store.settings={...store.settings,...d.settings};state=d.state||null;lastScreen=['home','game','scenes','settings'].includes(d.screen)?d.screen:'home';extraMoves=Number(state?.extra)||0;extraAttempt=extraMoves>0;miniUsed=extraAttempt}}catch{}if(!localStorage.getItem(KEY)){if(localStorage.crCoins){coins=Number(localStorage.crCoins)||0;unlocked=Number(localStorage.crUnlocked)||1;phase=Number(localStorage.crPhase)||1}try{state=JSON.parse(localStorage.crGame||'null')}catch{state=null}save()}$('#coinCount').textContent=coins;$('#gameCoins').textContent=coins;$('#sceneCoins').textContent=coins;document.body.classList.toggle('light-theme',store.settings.theme==='light');document.body.classList.toggle('high-contrast',store.settings.theme==='contrast')}function show(id){const target=document.getElementById(id);if(!target||!target.classList.contains('screen'))return;$$('.screen').forEach(x=>{const active=x===target;x.classList.toggle('active',active);x.hidden=!active});const header=$('#homeHeader');header.hidden=id!=='home';header.style.display=id==='home'?'flex':'none';if(id==='settings')renderStats();lastScreen=id;save();window.scrollTo(0,0)}function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1900)}function vibrate(ms=18){if(vibration&&navigator.vibrate)navigator.vibrate(ms)}function beep(freq=620){if(!sound)return;try{const c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.07);o.onended=()=>c.close()}catch{}}function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}function clone(x){return JSON.parse(JSON.stringify(x))}function top(c){return c[c.length-1]}function snap(){history.push(clone(state));if(history.length>100)history.shift()}function fresh(p){
 const hidden=Math.max(1,Math.min(4,Number(p.hiddenCategories)||1));
 const order=shuffle(p.categories.map((_,i)=>i));
 const visible=order.slice(0,5-hidden),buried=order.slice(5-hidden);
 const columnOrder=shuffle([0,1,2,3,4]);
 const pools=p.categories.map((c,i)=>c.words.map((w,j)=>({id:'w'+i+'-'+j,type:'word',cat:i,text:w,face:false})));
 const incoming=Array.from({length:5},()=>[]),used=new Set(),nextWord=Array(5).fill(0);
 const addBlockers=(from,to,count=1)=>{
  for(let n=0;n<count;n++){
   const card=pools[from][nextWord[from]++];
   if(!card)throw Error('Distribuição inválida: faltam respostas para bloquear uma categoria.');
   incoming[to].push(card);used.add(card.id);
  }
 };
 if(hidden===1){addBlockers(visible[0],buried[0]);addBlockers(visible[2],buried[0]);}
 else if(hidden===2){addBlockers(visible[0],buried[0]);addBlockers(visible[1],buried[0]);addBlockers(visible[2],buried[1]);addBlockers(buried[0],buried[1]);}
 else if(hidden===3){addBlockers(visible[0],buried[0]);addBlockers(visible[1],buried[1]);addBlockers(buried[0],buried[2]);addBlockers(buried[1],buried[2]);}
 else{
  addBlockers(visible[0],buried[0]);addBlockers(visible[0],buried[1]);
  const depth=p.id>=31?2:1;
  addBlockers(buried[0],buried[2],depth);addBlockers(buried[1],buried[3],depth);
 }
 // Distribui respostas de categorias ocultas sob algumas categorias visíveis.
 // Assim, os cinco montes têm profundidade e cartas de temas diferentes,
 // sem revelar uma resposta antes que sua categoria possa ser descoberta.
 const crossUnderVisible=Array.from({length:5},()=>[]);
 for(let pos=0;pos<visible.length&&buried.length;pos++){
  for(let offset=0;offset<buried.length;offset++){
   const ci=buried[(pos+offset)%buried.length];
   if(nextWord[ci]<pools[ci].length){
    const card=pools[ci][nextWord[ci]++];
    crossUnderVisible[pos].push({...card,face:false});used.add(card.id);
    break;
   }
  }
 }
 const underCategory=Array.from({length:5},(_,ci)=>{
  const available=pools[ci].length-nextWord[ci];
  const count=Math.min(available,available>1?(Math.random()<.5?1:2):available);
  const cards=shuffle(pools[ci].slice(nextWord[ci],nextWord[ci]+count));
  cards.forEach(card=>used.add(card.id));
  return cards.map(card=>({...card,face:false}));
 });
 const cols=Array.from({length:5},()=>[]);
 visible.forEach((ci,pos)=>{
  cols[columnOrder[pos]]=[
   ...underCategory[ci],
   ...crossUnderVisible[pos],
   {id:'c'+ci,type:'cat',cat:ci,name:p.categories[ci].name,face:true}
  ];
 });
 buried.forEach((ci,pos)=>{
  const stack=[
   ...underCategory[ci],
   {id:'c'+ci,type:'cat',cat:ci,name:p.categories[ci].name,face:false},
   ...incoming[ci].map(c=>({...c,face:false}))
  ];
  if(incoming[ci].length)stack[stack.length-1].face=true;
  cols[columnOrder[visible.length+pos]]=stack;
 });
 const stock=[];
 pools.forEach(group=>group.forEach(card=>{if(!used.has(card.id))stock.push({...card,face:false})}));
 const deal={cols,stock:shuffle(stock),waste:[],slots:Array(5).fill(null),moves:p.moves,done:[],won:false,extra:0};
 state={...clone(deal),initial:clone(deal)};
 selected=null;history=[];pendingLoss=false;miniUsed=false;extraMoves=0;extraAttempt=false;save();render();
}
function restartDeal(){
 if(!state?.initial){fresh(current());return}
 const deal=clone(state.initial);state={...deal,initial:clone(deal)};
 selected=null;history=[];pendingLoss=false;miniUsed=false;extraMoves=0;extraAttempt=false;save();render();
}
function current(){return levels.find(x=>x.id===phase)}function spend(){if(state.moves>0)state.moves--;else if(extraMoves>0){extraMoves--;state.extra=extraMoves}else{loseAttempt();return}pendingLoss=state.moves===0&&extraMoves===0&&state.done.length<current().categories.length}function loseAttempt(){state.moves=0;save();if(extraAttempt){showDialog('<div class="dialog-icon">0</div><h2>SEM JOGADAS</h2><p>As jogadas extras acabaram. A cena recomeça do zero.</p><button class="button button-primary" id="restartLost">RECOMEÇAR CENA</button>');$('#restartLost').onclick=()=>{closeDialog();restartDeal()};return}showDialog('<div class="dialog-icon">0</div><h2>CORTE!<br>SEM JOGADAS</h2><p>O roteiro travou. Vá para a sala de edição e ganhe jogadas extras no mini game.</p><button class="button button-primary" id="openMini">MINI GAME · SALA DE EDIÇÃO<small>Ganhe de +3 a +10 jogadas</small></button><button class="button button-secondary" id="restartLost">REINICIAR FASE</button>');$('#openMini').onclick=()=>{if(miniUsed){toast('Você já usou a Sala de Edição nesta tentativa.');return}window.startMiniGame()};$('#restartLost').onclick=()=>{closeDialog();restartDeal()}}function showDialog(html){$('#dialog').innerHTML=html;$('#overlay').classList.add('show');$('#overlay').setAttribute('aria-hidden','false')}function closeDialog(){$('#overlay').classList.remove('show');$('#overlay').setAttribute('aria-hidden','true')}function win(){if(state.won)return;state.won=true;const p=current(),ratio=state.moves/p.moves,stars=ratio>=.3?3:ratio>=.1?2:1;coins+=50;if(state.daily){const day=new Date().toISOString().slice(0,10);coins+=100;store.stats.dailyDone=day;}unlocked=Math.max(unlocked,phase+1);store.completed[phase]=true;store.stars[phase]=Math.max(store.stars[phase]||0,stars);if(state.daily){const today=new Date().toISOString().slice(0,10),yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);store.stats.streak=store.stats.lastDaily===yesterday?(store.stats.streak||0)+1:1;store.stats.bestStreak=Math.max(store.stats.bestStreak||0,store.stats.streak);store.stats.lastDaily=today;}save();beep(880);vibrate([30,40,80]);showDialog('<div class="edition-stamp">EDIÇÃO APROVADA</div><h2>ROTEIRO<br>APROVADO</h2><div class="stars">'+('★'.repeat(stars))+('☆'.repeat(3-stars))+'</div><p>Você concluiu a Cena '+phase+' com '+state.moves+' movimentos restantes.</p><div class="reward">+50 FICHAS</div><button class="button button-primary" id="nextScene">PRÓXIMA CENA</button><button class="button button-secondary" id="repeatScene">REPETIR</button><button class="button button-secondary" id="homeFromWin">MENU</button><button class="button button-secondary" id="shareResult">COMPARTILHAR RESULTADO</button>');$('#nextScene').onclick=()=>{closeDialog();start(Math.min(unlocked,40))};$('#repeatScene').onclick=()=>{closeDialog();start(phase,true)};$('#homeFromWin').onclick=()=>{closeDialog();show('home')};$('#shareResult').onclick=()=>share(stars)}async function share(stars){const text='🎬 Roteiro aprovado! Cena '+phase+' · '+('⭐'.repeat(stars))+' · '+state.moves+' movimentos restantes. Jogue Paciência do Roteirista!';if(navigator.share){try{await navigator.share({title:'Paciência do Roteirista',text,url:location.href})}catch{}}else if(navigator.clipboard){await navigator.clipboard.writeText(text);toast('Resultado copiado!')}}function valid(card,d){if(d.kind==='slot'){const slot=state.slots[d.i];return slot?card.type==='word'&&slot.cat===card.cat:card.type==='cat'&&!state.done.includes(card.cat)}if(d.kind==='category')return card.type==='word'&&state.slots[d.i]?.cat===card.cat;if(d.kind==='column'){const c=state.cols[d.i];return !c.length||(top(c).type==='word'&&top(c).cat===card.cat)}return false}function removeSelected(){const {from,index}=selected;if(from==='waste')return[state.waste.pop()];const col=state.cols[index],card=col.pop();if(col.length&&!top(col).face)top(col).face=true;return[card]}function move(dest){if(!selected)return;const card=selected.card;if(!valid(card,dest)){const el=$('.game-card.selected');if(el)el.classList.add('invalid');vibrate(35);selected=null;setTimeout(render,220);return}snap();const moved=removeSelected();if(dest.kind==='slot'){if(!state.slots[dest.i])state.slots[dest.i]=moved[0];else{const slot=state.slots[dest.i];slot.stack??=[];slot.stack.push(...moved)}}else if(dest.kind==='category'){const slot=state.slots[dest.i];slot.stack??=[];slot.stack.push(...moved)}else state.cols[dest.i].push(...moved.map(c=>({...c,face:true})));selected=null;spend();checkComplete();if(pendingLoss&&!state.won)loseAttempt();beep();vibrate();save();render()}function checkComplete(){state.slots.forEach((s,i)=>{if(!s)return;const expected=current().categories[s.cat].words.map(w=>w.toLocaleLowerCase('pt-BR')),cards=(s.stack||[]),received=cards.map(c=>String(c.text).toLocaleLowerCase('pt-BR'));const unique=new Set(received);const complete=unique.size===expected.length&&expected.every(word=>unique.has(word))&&received.length===expected.length;if(complete){state.done.push(s.cat);state.slots[i]=null;toast('CATEGORIA COMPLETA!');beep(990)}});if(state.done.length===current().categories.length)win()}function cardElement(c,from,index){
 const b=document.createElement('button');
 b.className='game-card '+(c.face?(c.type==='cat'?'category':'word'):'back');
 b.type='button';b.disabled=!c.face;
 b.setAttribute('aria-label',c.face?(c.type==='cat'?'Categoria '+c.name:c.text):'Carta virada para baixo');
 if(c.face){if(c.type==='cat')b.innerHTML=Icons.svg(current().categories[c.cat].icone)+'<span>'+c.name+'</span>';else b.textContent=c.text}
 if(selected?.card.id===c.id)b.classList.add('selected');
 let drag=null;
 b.addEventListener('click',()=>{
  if(Date.now()<(window.__suppressCardClick||0))return;
  if(!c.face)return;
  if(selected&&selected.card.id===c.id){selected=null;render();return}
  if(selected){if(c.type==='word'&&selected.card.type==='word'&&c.cat===selected.card.cat){move({kind:'column',i:index});return}}
  selected={card:c,from,index};render();
 });
 b.addEventListener('pointerdown',e=>{
  if(!c.face||e.button!==0)return;
  b.setPointerCapture?.(e.pointerId);
  const rect=b.getBoundingClientRect();
  drag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,started:false,ghost:null};
 });
 b.addEventListener('pointermove',e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
  if(!drag.started&&Math.abs(dx)+Math.abs(dy)>10){
   drag.started=true;
   drag.ghost=b.cloneNode(true);
   drag.ghost.classList.remove('selected','dragging');
   drag.ghost.classList.add('drag-ghost');
   drag.ghost.disabled=true;
   drag.ghost.setAttribute('aria-hidden','true');
   drag.ghost.style.left=drag.left+'px';drag.ghost.style.top=drag.top+'px';
   drag.ghost.style.width=drag.width+'px';drag.ghost.style.height=drag.height+'px';
   document.body.append(drag.ghost);
   b.classList.add('dragging');
   document.body.classList.add('dragging-card');
   document.querySelectorAll('[data-drop]').forEach(x=>x.classList.add('drop-ready'));
  }
  if(drag.started&&drag.ghost)drag.ghost.style.transform='translate3d('+dx+'px,'+dy+'px,0) rotate(2deg) scale(1.04)';
 });
 b.addEventListener('pointerup',e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  const currentDrag=drag;drag=null;
  if(!currentDrag.started)return;
  window.__suppressCardClick=Date.now()+450;
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop]');
  const dest=target?(()=>{const [kind,i]=target.dataset.drop.split(':');return{kind,i:Number(i)}})():null;
  const ghost=currentDrag.ghost;
  document.querySelectorAll('.drop-ready').forEach(x=>x.classList.remove('drop-ready'));
  document.body.classList.remove('dragging-card');
  if(ghost){
   if(dest){
    const rect=target.getBoundingClientRect(),dx=rect.left+rect.width/2-(currentDrag.left+currentDrag.width/2),dy=rect.top+rect.height/2-(currentDrag.top+currentDrag.height/2);
    ghost.style.transition='transform 170ms cubic-bezier(.2,.8,.2,1),opacity 170ms ease';
    ghost.style.transform='translate3d('+dx+'px,'+dy+'px,0) scale(.72)';
    ghost.style.opacity='.25';
   }else{
    ghost.style.transition='transform 170ms cubic-bezier(.2,.8,.2,1),opacity 170ms ease';
    ghost.style.transform='translate3d(0,0,0) scale(.96)';
    ghost.style.opacity='0';
   }
  }
  setTimeout(()=>{
   ghost?.remove();b.classList.remove('dragging');
   if(dest){selected={card:c,from,index};move(dest)}
   else{selected={card:c,from,index};render()}
  },175);
 });
 b.addEventListener('pointercancel',()=>{
  if(!drag)return;
  drag.ghost?.remove();drag=null;b.classList.remove('dragging');
  document.body.classList.remove('dragging-card');
  document.querySelectorAll('.drop-ready').forEach(x=>x.classList.remove('drop-ready'));
 });
 return b;
}
function render(){if(!state)return;$('#sceneTitle').textContent='CENA '+phase;$('#sceneAct').textContent='ATO '+Math.ceil(phase/10)+' · '+(current().packName||current().pack).toUpperCase();$('#moveCount').textContent=state.moves;$('#hintCost').textContent=cfg?.hintCost+' fichas';$('#stockCount').textContent=state.stock.length;$('#wastePile').innerHTML='';if(state.waste.length){const wc=state.waste.at(-1),wb=cardElement(wc,'waste',0);wb.classList.add('waste-card');wb.setAttribute('aria-label','Carta descartada: '+(wc.type==='cat'?wc.name:wc.text));$('#wastePile').append(wb)}$('#drawButton').disabled=!state.stock.length&&!state.waste.length;$('#categorySlots').innerHTML='';state.slots.forEach((s,i)=>{const d=document.createElement('button');d.className='category-slot';d.dataset.drop='slot:'+i;d.setAttribute('aria-label',s?'Categoria '+s.name:'Espaço de categoria livre');if(!s)d.innerHTML='<span class="free">LIVRE</span>';else{const cat=current().categories[s.cat];d.innerHTML='<span class="slot-label">'+Icons.svg(cat.icone)+'<span>'+s.name+'</span></span><span class="slot-progress">'+(s.stack||[]).length+'/'+cat.words.length+'</span>'}d.onclick=()=>{if(selected)move(s?{kind:'category',i}:{kind:'slot',i})};$('#categorySlots').append(d)});$('#tableau').innerHTML='';state.cols.forEach((col,i)=>{const d=document.createElement('div');d.className='column';d.dataset.drop='column:'+i;d.setAttribute('aria-label','Coluna '+(i+1));col.forEach((c,j)=>d.append(cardElement(c,'col',i)));d.onclick=e=>{if(e.target===d&&selected)move({kind:'column',i})};$('#tableau').append(d)});if(state.waste.length){const w=state.waste.at(-1);const stock=$('#drawButton');stock.classList.toggle('has-waste',!!w);stock.title='Comprar carta; descarte: '+w.text}else $('#drawButton').classList.remove('has-waste');$('#undoButton').disabled=!history.length;$('#playButton').querySelector('small').textContent='Continuar · Cena '+Math.min(phase,unlocked)}function draw(){if(!state.stock.length){if(state.waste.length){snap();state.stock=shuffle(state.waste.map(c=>({...c,face:false})));state.waste=[];spend();if(pendingLoss)loseAttempt();save();render()}else toast('Não há mais cartas no baralho.');return}snap();const c=state.stock.pop();c.face=true;state.waste.push(c);spend();if(pendingLoss)loseAttempt();save();render()}function undo(){if(!history.length)return;state=history.pop();selected=null;save();render()}function hint(){if(coins<(cfg?.hintCost||10)){toast('Fichas insuficientes.');return}let candidate=null;for(let i=0;i<state.cols.length&&!candidate;i++){const c=top(state.cols[i]);if(c?.type==='cat'&&state.slots.some(x=>!x))candidate={card:c,from:'col',index:i};if(c?.type==='word'&&state.slots.some(x=>x?.cat===c.cat))candidate={card:c,from:'col',index:i}}const w=state.waste.at(-1);if(!candidate&&w?.type==='word'&&state.slots.some(x=>x?.cat===w.cat))candidate={card:w,from:'waste',index:0};if(!candidate){toast('Nenhuma jogada evidente agora.');return}coins-=cfg.hintCost;selected=candidate;save();render();$('.game-card.selected')?.classList.add('hint');toast('Uma jogada possível está destacada.')}function start(n,forceNew=false){if(!levels.length)return;const target=Math.max(1,Math.min(40,n));if(!forceNew&&state&&!state.won&&target===phase){show('game');render();return}phase=target;extraMoves=0;extraAttempt=false;miniUsed=false;fresh(current());show('game');if(phase===1&&!localStorage.getItem('crTutorialSeen')){localStorage.setItem('crTutorialSeen','1');tutorial()}}function tutorial(){const steps=[['TOQUE OU ARRASTE','Selecione uma carta e leve até outra coluna compatível.'],['FORME UMA CATEGORIA','Reúna as palavras certas na etiqueta amarela.'],['USE O BARALHO','Compre cartas quando precisar revelar novas possibilidades.']];let i=0;const next=()=>{if(i>=steps.length){localStorage.setItem('crTutorialSeen','1');closeDialog();return}showDialog('<div class="edition-stamp">PRIMEIRO TAKE</div><h2>'+steps[i][0]+'</h2><p>'+steps[i][1]+'</p><button class="button button-primary" id="tutorialNext">'+(i===2?'COMEÇAR':'PRÓXIMO')+'</button><button class="button button-secondary" id="tutorialSkip">PULAR TUTORIAL</button>');$('#tutorialNext').onclick=()=>{i++;next()};$('#tutorialSkip').onclick=()=>{localStorage.setItem('crTutorialSeen','1');closeDialog()}};next()}function renderScenes(){const acts=['Todos','Iniciantes','Intermediárias','Avançadas','Especialistas'];$('#acts').innerHTML='';acts.forEach(a=>{const b=document.createElement('button');b.className='act-chip'+(a===activeAct?' active':'');b.textContent=a;b.onclick=()=>{activeAct=a;renderScenes()};$('#acts').append(b)});const list=levels.filter(p=>activeAct==='Todos'||(activeAct==='Iniciantes'?p.id<=5:activeAct==='Intermediárias'?p.id>=6&&p.id<=15:activeAct==='Avançadas'?p.id>=16&&p.id<=25:p.id>=26));$('#sceneList').innerHTML='';if(!levels.length){$('#sceneList').innerHTML='<p class="loading-scenes" role="status">As cenas estão sendo carregadas. Se a lista não aparecer, volte ao menu e tente novamente.</p>';return}list.forEach(p=>{const b=document.createElement('button');b.className='scene-node'+(p.id>unlocked?' locked':'')+(p.id===phase?' current':'');b.disabled=p.id>unlocked;b.innerHTML=p.id>unlocked?'<b class="lock-symbol">'+Icons.svg('lock')+'</b><small>TRANCADA</small>':'<b>'+p.id+'</b><small>'+(store.stars[p.id]?'★'.repeat(store.stars[p.id]):'☆ ☆ ☆')+'</small>';b.onclick=()=>start(p.id);$('#sceneList').append(b)})}function renderStats(){$('#statScenes').textContent=Object.keys(store.completed||{}).length;$('#statStreak').textContent=(store.stats.bestStreak||store.stats.streak||0)+' dias';$('#statCoins').textContent=coins}function daily(){const day=new Date().toISOString().slice(0,10);if(store.stats.dailyDone===day){toast('Desafio diário já concluído!');return}const n=(Math.abs([...day].reduce((a,c)=>a+c.charCodeAt(0),0))%40)+1;start(n);state.daily=true;save()}function initSettings(){$('#soundToggle').checked=store.settings.sound!==false;$('#vibrationToggle').checked=store.settings.vibration!==false;$('#themeSelect').value=store.settings.theme||'dark';$('#motionToggle').checked=matchMedia('(prefers-reduced-motion: reduce)').matches;$('#soundToggle').onchange=e=>{sound=e.target.checked;store.settings.sound=sound;save()};$('#vibrationToggle').onchange=e=>{vibration=e.target.checked;store.settings.vibration=vibration;save()};$('#themeSelect').onchange=e=>{store.settings.theme=e.target.value;document.body.classList.toggle('light-theme',e.target.value==='light');document.body.classList.toggle('high-contrast',e.target.value==='contrast');save()};$('#motionToggle').onchange=e=>document.body.classList.toggle('reduced-motion',e.target.checked)}function validateLevels(){const errors=[];levels.forEach(p=>{if(!p.id||!Array.isArray(p.categories)||p.categories.length<2||p.categories.length>5)errors.push('Estrutura da cena '+p.id);const words=p.categories.flatMap(c=>c.words);if(new Set(words.map(x=>x.toLocaleLowerCase('pt-BR'))).size!==words.length)errors.push('Palavras repetidas na cena '+p.id);if(new Set(p.categories.map(c=>c.name.toLocaleLowerCase('pt-BR'))).size!==p.categories.length)errors.push('Categorias repetidas na cena '+p.id);if(p.categories.some(c=>c.words.length<3||c.words.length>4))errors.push('Tamanho de categoria na cena '+p.id);if(p.categories.some(c=>!c.icone))errors.push('Ícone ausente na cena '+p.id);const total=words.length,hidden=Math.max(1,Math.min(4,Number(p.hiddenCategories)||1)),blockers=hidden===1?2:hidden===2?4:hidden===3?4:(p.id>=31?6:4),minimum=5+2*total-blockers;if(p.moves<minimum)errors.push('Movimentos insuficientes para uma rota válida na cena '+p.id)});if(errors.length)console.warn('Validação de cenas:',errors);return errors.length===0}window.validatePaciência=()=>{const ok=validateLevels();console.table(levels.map(p=>({cena:p.id,categorias:p.categories.length,palavras:p.categories.reduce((n,c)=>n+c.words.length,0),movimentos:p.moves,rotaGarantida:ok?'SIM':'REVISAR'})));return ok};async function fetchJson(path,timeoutMs=12000){
 const url=new URL(path,APP_BASE);
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const response=await fetch(url.href,{cache:'no-store',signal:controller.signal});
  if(!response.ok)throw Error('HTTP '+response.status+' em '+path);
  return await response.json();
 }catch(error){
  if(error.name==='AbortError')throw Error('Tempo esgotado ao carregar '+path);
  throw error;
 }finally{clearTimeout(timer)}
}
function renderSceneLoadState(message){
 const list=$('#sceneList');
 if(list)list.innerHTML='<p class="loading-scenes" role="status">'+message+'</p>';
}
async function loadLevels(){
 const play=$('#playButton');
 if(play)play.disabled=true;
 renderSceneLoadState('Carregando cenas…');
 const configPromise=fetchJson('config.json',8000).catch(error=>({error}));
 const sceneResults=[];
 for(let first=1;first<=40;first+=8){
  const batch=await Promise.all(Array.from({length:Math.min(8,41-first)},(_,offset)=>{
   const id=first+offset,path='levels/level-'+String(id).padStart(2,'0')+'.json';
   return fetchJson(path).then(data=>{
    if(!data||Number(data.id)!==id||!Array.isArray(data.categories))throw Error('Dados inválidos em '+path);
    return {id,data};
   }).catch(error=>({id,error}));
  }));
  sceneResults.push(...batch);
 }
 const configResult=await configPromise;
 levels=sceneResults.filter(x=>x.data).map(x=>x.data).sort((a,b)=>a.id-b.id);
 window.__allLevels=levels;
 if(configResult&&!configResult.error){cfg=configResult;window.__config=cfg}
 else{cfg={hintCost:10,miniGame:{seconds:45,rounds:10,rewards:[{max:4,moves:3},{max:7,moves:6},{max:10,moves:10}]}};window.__config=cfg;console.warn('Configuração não carregada; usando padrões.',configResult?.error)}
 const failed=sceneResults.filter(x=>x.error);
 if(levels.length){
  validateLevels();
  if(play)play.disabled=false;
  $('#dailyText').textContent='Uma nova cena espera por você';
  renderScenes();
  if(lastScreen==='game'&&state&&!state.won){show('game');render()}
  else if(lastScreen==='scenes'){show('scenes')}
  else if(lastScreen==='settings'){initSettings();show('settings')}
  else{show('home')}
  if(failed.length){
   console.error('Cenas que falharam:',failed.map(x=>({cena:x.id,erro:String(x.error)})));
   toast(levels.length+' de 40 cenas carregadas. '+failed.length+' precisam ser recarregadas.');
  }
 }else{
  console.error('Nenhuma cena foi carregada:',failed.map(x=>({cena:x.id,erro:String(x.error)})));
  renderSceneLoadState('Não foi possível carregar as cenas. Verifique a conexão e toque em Tentar novamente.');
  showDialog('<h2>FALHA AO CARREGAR</h2><p>Nenhuma cena chegou ao jogo. Você pode voltar ao menu ou tentar carregar novamente.</p><button class="button button-primary" id="retryLoad">TENTAR NOVAMENTE</button><button class="button button-secondary" id="loadHome">VOLTAR AO MENU</button>');
  $('#retryLoad').onclick=()=>{closeDialog();loadLevels()};
  $('#loadHome').onclick=()=>{closeDialog();show('home')};
 }
}
$('#playButton').onclick=()=>{closeDialog();if(!levels.length){toast('As cenas ainda estão carregando.');return}start(Math.min(phase,unlocked))};$('#scenesButton').onclick=()=>{closeDialog();renderScenes();show('scenes')};$('#settingsButton').onclick=()=>{closeDialog();initSettings();show('settings')};$('#homeMenu').onclick=()=>{showDialog('<h2>MENU</h2><button class="button button-primary" id="menuScenes">CENAS</button><button class="button button-secondary" id="menuSettings">CONFIGURAÇÕES</button><button class="button button-secondary" id="menuStats">ESTATÍSTICAS</button><button class="button button-secondary" id="menuClose">FECHAR</button>');$('#menuScenes').onclick=()=>{closeDialog();show('scenes');renderScenes()};$('#menuSettings').onclick=()=>{closeDialog();initSettings();show('settings')};$('#menuStats').onclick=()=>{closeDialog();initSettings();show('settings')};$('#menuClose').onclick=closeDialog};$('#dailyChallenge').onclick=daily;$('#pauseButton').onclick=()=>{
 showDialog('<h2>PAUSA</h2><button class="button button-primary" id="resumeGame">CONTINUAR</button><button class="button button-secondary" id="restartGame">REINICIAR FASE</button><button class="button button-secondary" id="pauseSettings">CONFIGURAÇÕES</button><button class="button button-secondary" id="leaveGame">SAIR</button>');
 $('#resumeGame').onclick=closeDialog;
 $('#restartGame').onclick=()=>{showDialog('<h2>RECOMEÇAR?</h2><p>Todo o progresso desta tentativa será perdido.</p><button class="button button-primary" id="confirmRestart">REINICIAR</button><button class="button button-secondary" id="cancelRestart">VOLTAR</button>');$('#confirmRestart').onclick=()=>{closeDialog();restartDeal()};$('#cancelRestart').onclick=()=>{closeDialog();$('#pauseButton').click()}};
 $('#pauseSettings').onclick=()=>{closeDialog();initSettings();show('settings')};
 $('#leaveGame').onclick=()=>{showDialog('<h2>SAIR DA CENA?</h2><p>Sua partida será salva neste aparelho.</p><button class="button button-primary" id="confirmLeave">SAIR</button><button class="button button-secondary" id="cancelLeave">CONTINUAR</button>');$('#confirmLeave').onclick=()=>{closeDialog();show('home')};$('#cancelLeave').onclick=()=>{closeDialog();$('#pauseButton').click()}};
};$('#drawButton').onclick=draw;$('#undoButton').onclick=undo;$('#hintButton').onclick=hint;$('#restartButton').onclick=()=>{showDialog('<h2>REINICIAR CENA?</h2><p>O progresso desta tentativa será perdido.</p><button class="button button-primary" id="yesRestart">REINICIAR</button><button class="button button-secondary" id="noRestart">CANCELAR</button>');$('#yesRestart').onclick=()=>{closeDialog();restartDeal()};$('#noRestart').onclick=closeDialog};$('#resetProgress').onclick=()=>{if(confirm('Apagar fichas, cenas e estatísticas deste aparelho?')){localStorage.removeItem(KEY);coins=0;unlocked=1;phase=1;state=null;store.completed={};store.stars={};save();show('home')}};document.querySelectorAll('[data-screen]').forEach(b=>{b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeDialog();show(b.dataset.screen);if(b.dataset.screen==='scenes')renderScenes()})});window.Game={getState:()=>state,getLevel:current,showDialog,closeDialog,toast,save,show,finishMini:(moves,score)=>{extraMoves=moves;state.extra=moves;state.moves=Math.max(0,state.moves);miniUsed=true;extraAttempt=true;save();closeDialog();show('game');render();toast('+'+moves+' jogadas extras!')},resetAfterExtras:()=>{toast('Sem jogadas. A cena recomeça.');setTimeout(()=>start(phase),900)}};load();initSettings();loadLevels();})();