function render(){
  g.imageSmoothingEnabled=false; g.clearRect(0,0,W,VH);
  if(mode==='title'||mode==='levels') drawTitle();
  else if(mode==='play'||mode==='winning'||mode==='done'||mode==='intro'){ if(world.horiz) drawIsland(); else drawPlay(); if(mode==='intro'&&intro) drawIntro(); }
  else if(mode==='cutscene') drawStory();
  else if(mode==='worldwin') drawWorldWin();
  else if(mode==='win') drawParty();
}

/* ---------- menus ---------- */
var $=function(id){ return document.getElementById(id); };
var toastTimer=null, lastCap='';
var DIFFNOTE=['Easy: if you fall, a bubble floats you back to where you were.','Normal: if you fall, a bubble takes you back to your last checkpoint.','Harder: fewer checkpoints, faster critters, and clouds that puff away.'];
function toast(big,small,ms){ var t=$('toast'); t.textContent=big; if(small){ var s=document.createElement('small'); s.textContent=small; t.appendChild(s); } t.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.hidden=true; },ms||1500); }
function setCaption(c){ if(c!==lastCap){ lastCap=c; $('caption').textContent=c; } }
function syncDiff(){
  document.querySelectorAll('[data-diff]').forEach(function(b){ var d=+b.getAttribute('data-diff'); b.setAttribute('aria-pressed',d===diff?'true':'false'); if(d===2) b.hidden=!save.hardUnlocked; });
  document.querySelectorAll('[data-diffnote]').forEach(function(n){ n.textContent=DIFFNOTE[diff]; });
}
document.querySelectorAll('[data-diff]').forEach(function(b){ b.addEventListener('click',function(){ diff=+b.getAttribute('data-diff'); save.diff=diff; persist(); syncDiff(); audio(); SFX.ding(); }); });

var lvButtons=[];
function firstOpenIn(ei){ for(var t=0;t<5;t++){ var i=ei*5+t; if(!save.done[i]&&i<=save.reached) return i; } return ei*5<=save.reached?ei*5:-1; }
(function buildLevelGrid(){
  var grid=$('lvgrid');
  ENVS.forEach(function(E,ei){
    var card=document.createElement('div'); card.className='env notch';
    var c=themeThumb(E.key).canvas(); c.setAttribute('aria-hidden','true');
    c.addEventListener('click',function(){ var i=TEST?ei*5:firstOpenIn(ei); if(i<0){ SFX.bump(); return; } counts={pearls:0,gems:0,stars:0}; startLevel(i); });
    var nm=document.createElement('span'); nm.className='nm'; nm.textContent=E.name;
    var row=document.createElement('div'); row.className='dots';
    for(var t=0;t<5;t++) (function(i,t){
      var b=document.createElement('button'); b.type='button'; b.className='lvb'; b.textContent=String(t+1);
      b.addEventListener('click',function(){ if(b.getAttribute('aria-disabled')==='true'){ SFX.bump(); return; } counts={pearls:0,gems:0,stars:0}; startLevel(i); });
      row.appendChild(b); lvButtons.push({b:b,i:i});
    })(ei*5+t,t);
    card.appendChild(c); card.appendChild(nm); card.appendChild(row); grid.appendChild(card);
  });
})();
function syncLevels(){
  lvButtons.forEach(function(o){
    var open=o.i<=save.reached||TEST, done=!!save.done[o.i];
    o.b.setAttribute('aria-disabled',open?'false':'true');
    o.b.classList.toggle('done',done); o.b.classList.toggle('next',open&&!done&&o.i===save.reached);
    o.b.setAttribute('aria-label','Level '+(o.i+1)+', '+LEVELS[o.i].name+(done?', done':open?'':', locked'));
  });
}

function setMode(m){
  mode=m;
  $('title').hidden=m!=='title';
  $('levels').hidden=m!=='levels';
  $('done').hidden=m!=='done';
  $('wdone').hidden=true;
  $('win').hidden=true;
  $('caption').hidden=m!=='cutscene'; $('skip').hidden=m!=='cutscene';
  $('btnHome').hidden=m==='title';
  $('btnPad').hidden=m!=='play';
  document.body.classList.toggle('playing',m==='play');
  if(m!=='play') $('toast').hidden=true;
  if(m==='title'||m==='levels'){ syncDiff(); syncLevels(); }
  if(m==='done'){
    var i=world.idx, nxt=LEVELS[i+1], n=world.kind==='sea'?lvl.pearls:world.kind==='isle'?lvl.stars:lvl.gems, word=world.kind==='sea'?(n===1?' pearl':' pearls'):world.kind==='isle'?(n===1?' star':' stars'):(n===1?' rainbow gem':' rainbow gems');
    $('doneTitle').textContent=LEVELS[i].name+' complete!';
    $('doneSub').textContent='Level '+(i+1)+' of '+LEVELS.length+'. You found '+n+word+'.'+(nxt?' Next up: '+nxt.name+'.':'');
    $('doneNext').textContent='Next level';
  }
  if(m==='worldwin'){
    var wi=LEVELS[world.idx].env, earned=0; for(var q=0;q<ENVS.length;q++) if(save.done[q*5+4]) earned++;
    $('wdoneTitle').textContent=ENVS[wi].name+' complete!';
    $('wdoneSub').textContent='World '+(wi+1)+' of '+ENVS.length+'. You have '+earned+(earned===1?' world star':' world stars')+'.';
    $('wdNext').textContent=world.surface!=null?'Up to the surface!':LEVELS[world.idx].rescue?'Free the unicorn!':'Next world';
    startWorldWin();
  }
  if(m==='win'){
    winT=0; startParty();
    save.hardUnlocked=true; if(hard) save.crown=true; persist();
    $('winTitle').textContent=hard?'You won the harder level!':'You won the whole entire game!';
    var st=counts.stars||0; $('winSub').textContent='You found '+counts.pearls+(counts.pearls===1?' pearl, ':' pearls, ')+st+(st===1?' star':' stars')+' and '+counts.gems+(counts.gems===1?' rainbow gem':' rainbow gems')+' on the way.';
    $('winCrown').hidden=!hard;
    $('winHard').textContent=hard?'Play the harder level again':'Play the harder level';
  }
  if(m==='play'&&document.activeElement&&document.activeElement.blur) document.activeElement.blur();
  keys.left=keys.right=keys.jump=false; jumpBuf=0; releasePad();
  if(fit.clientWidth) resize();
}
$('play').addEventListener('click',function(){ counts={pearls:0,gems:0,stars:0}; var all=save.done[LEVELS.length-1]; startLevel(all?0:save.reached); });
$('pick').addEventListener('click',function(){ audio(); setMode('levels'); });
$('lvBack').addEventListener('click',function(){ setMode('title'); });
$('doneNext').addEventListener('click',function(){ startLevel(world.idx+1); });
$('doneMap').addEventListener('click',function(){ setMode('levels'); });
$('wdNext').addEventListener('click',function(){ if(world.surface!=null) startStory('island',world.idx+1); else if(LEVELS[world.idx].rescue) startStory('rescue',world.idx+1); else startLevel(world.idx+1); });
$('wdMap').addEventListener('click',function(){ setMode('levels'); });
$('winHard').addEventListener('click',function(){ diff=2; save.diff=2; persist(); counts={pearls:0,gems:0,stars:0}; startLevel(0); });
$('winAgain').addEventListener('click',function(){ counts={pearls:0,gems:0,stars:0}; startLevel(0); });
$('btnHome').addEventListener('click',function(){ setMode('title'); });
$('btnSound').setAttribute('aria-pressed',muted?'false':'true');
$('btnSound').addEventListener('click',function(){ muted=!muted; this.setAttribute('aria-pressed',muted?'false':'true'); try{ localStorage.setItem('mfuwg-muted',muted?'1':'0'); }catch(e){} audio(); if(!muted) SFX.ding(); });
function syncPad(){ document.body.classList.toggle('pad-on',!!save.pad); $('btnPad').setAttribute('aria-pressed',save.pad?'true':'false'); $('btnPad').setAttribute('aria-label',save.pad?'Hide arrow buttons':'Show arrow buttons'); resize(); }
$('btnPad').addEventListener('click',function(){ save.pad=!save.pad; persist(); syncPad(); });

/* taps on the game screen: jump to where you tapped, or skip the cartoon */
screenEl.addEventListener('pointerdown',function(e){
  audio();
  if(mode==='cutscene'&&cut>40){ cut=9999; return; }
  if(mode==='intro'&&intro&&intro.t>30){ endIntro(); return; }
  if(e.target!==cv) return;
  var rr0=cv.getBoundingClientRect(), gx=(e.clientX-rr0.left)*W/rr0.width, gy=(e.clientY-rr0.top)*VH/rr0.height;
  if(mode==='worldwin'){ worldWinTap(gx,gy); return; }
  if(mode==='win'){ partyTap(gx,gy); return; }
  if(mode!=='play') return;
  e.preventDefault();
  tapAt(gx+(world.camX||0),gy+world.cam);
});

/* keyboard */
var KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyZ:'jump',KeyX:'jump'};
window.addEventListener('keydown',function(e){
  audio();
  var k=KEYMAP[e.code];
  if(mode==='title'&&e.code==='Enter'&&document.activeElement===document.body){ e.preventDefault(); $('play').click(); return; }
  if(mode==='cutscene'&&(e.code==='Space'||e.code==='Enter')&&cut>40){ e.preventDefault(); cut=9999; return; }
  if(mode==='intro'&&intro&&intro.t>30&&(e.code==='Space'||e.code==='Enter')){ e.preventDefault(); endIntro(); return; }
  if(!k||mode!=='play') return;
  e.preventDefault();
  if(k==='jump'){ if(!keys.jump&&!e.repeat) jumpBuf=8; keys.jump=true; } else keys[k]=true;
});
window.addEventListener('keyup',function(e){ var k=KEYMAP[e.code]; if(k) keys[k]=false; });
window.addEventListener('blur',function(){ keys.left=keys.right=keys.jump=false; releasePad(); });

/* optional arrow buttons */
var padBtns={bL:'left',bR:'right',bJ:'jump'}, padPointers={};
function releasePad(){ padPointers={}; Object.keys(padBtns).forEach(function(id){ $(id).classList.remove('on'); }); }
Object.keys(padBtns).forEach(function(id){
  var el=$(id), k=padBtns[id];
  function down(e){ e.preventDefault(); audio(); try{ el.setPointerCapture(e.pointerId); }catch(_){} padPointers[e.pointerId]=k; el.classList.add('on'); if(k==='jump'&&!keys.jump) jumpBuf=8; keys[k]=true; }
  function up(e){ if(padPointers[e.pointerId]!==k) return; delete padPointers[e.pointerId]; var still=Object.keys(padPointers).some(function(p){ return padPointers[p]===k; }); if(!still){ keys[k]=false; el.classList.remove('on'); } }
  el.addEventListener('pointerdown',down); el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up); el.addEventListener('lostpointercapture',up);
  el.addEventListener('contextmenu',function(e){ e.preventDefault(); });
});
if(window.matchMedia&&matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');
window.addEventListener('touchstart',function(){ if(!document.body.classList.contains('touch')){ document.body.classList.add('touch'); resize(); } },{passive:true});

/* ---------- sizing ---------- */
function resize(){
  var fw=fit.clientWidth, fh=fit.clientHeight; if(!fw||!fh) return;
  var portrait=fh>fw*1.1, room=portrait&&save.pad?fh-170:fh;
  var horiz=world&&world.horiz&&(mode==='play'||mode==='intro'||mode==='winning'||mode==='done');
  var nv=Math.round(clamp(W*room/fw,180,portrait?(horiz?240:520):240));
  var s=Math.min(fw/W,room/nv), fl=Math.floor(s), sc=(fl>=2&&fl/s>.86)?fl:s;
  if(nv!==VH){ VH=nv; scn={}; if(world){ if(world.horiz&&pl) islandCams(world,true); else world.cam=clamp(world.cam,0,world.H-VH); } }
  cv.width=W; cv.height=VH; g.imageSmoothingEnabled=false; SC=sc;
  screenEl.style.width=Math.round(W*sc)+'px'; screenEl.style.height=Math.round(VH*sc)+'px'; screenEl.style.setProperty('--u',sc+'px');
  fit.classList.toggle('top',portrait&&!!save.pad);
  render();
}
window.addEventListener('resize',resize);

/* ---------- main loop ---------- */
var last=0, acc=0, STEP=1000/60;
function step(){
  tick++;
  if(mode==='play') updatePlay();
  else if(mode==='winning'||mode==='done'){ updateWorldThings(); winT++; if(winT%6===0) addParts(pl.x+(Math.random()*40-20),pl.y-30-Math.random()*20,6,['#fff3a6','#ff8fb8','#ffffff','#7fe0ff'],1.6,30); if(mode==='winning'&&winT>110) setMode(world.idx===LEVELS.length-1?'win':LEVELS[world.idx].tier===4?'worldwin':'done'); }
  else if(mode==='worldwin') updateWorldWin();
  else if(mode==='win'){ updateParty(); if(++winT===240) $('win').hidden=false; }
  else if(mode==='intro') updateIntro();
  else if(mode==='cutscene'){ cut++; if(cut>=story.len) startLevel(story.next); }
}
function frame(now){
  if(!last) last=now; acc+=Math.min(100,now-last); last=now;
  while(acc>=STEP){ step(); acc-=STEP; }
  render(); requestAnimationFrame(frame);
}

/* ---------- start (keeps your place if the page updates while you play) ---------- */
$('name').textContent=picks.name;
function boot(data){
  syncPad(); resize();
  data=data||{};
  if(typeof data.diff==='number') diff=data.diff;
  if(data.counts) counts=data.counts;
  if(data.mode==='play'&&typeof data.level==='number'&&LEVELS[data.level]) startLevel(data.level,data.cp);
  else if(data.mode==='win'){ hard=diff===2; world=buildWorld(LEVELS.length-1); setMode('win'); }
  else setMode('title');
  requestAnimationFrame(frame);
}
var hot=window.claude&&window.claude.hot;
try{ if(hot&&typeof hot.snapshot==='function') hot.snapshot(function(){ var lv=world?world.idx:null; if(mode==='cutscene'&&world) lv=world.idx+1; if((mode==='done'||mode==='worldwin')&&world) lv=world.idx+1; return {mode:(mode==='winning'&&world&&world.idx===LEVELS.length-1)||mode==='win'?'win':(mode==='play'||mode==='intro'||mode==='cutscene'||mode==='done'||mode==='worldwin'||mode==='winning')?'play':'title',level:lv,cp:mode==='play'&&world&&world.cp?world.cp.idx:null,diff:diff,counts:counts}; }); }catch(e){}
if(hot&&typeof hot.ready==='function') hot.ready(boot); else boot((hot&&hot.data)||{});

if(TEST) window.__game={get world(){return world;},get pl(){return pl;},get mode(){return mode;},get pending(){return pending;},keys:keys,jump:function(){ jumpBuf=8; },step:function(n){ for(var i=0;i<n;i++) step(); },startLevel:startLevel,setMode:setMode,render:render,tapAt:tapAt,buildWorld:buildWorld,setDiff:function(d){ diff=d; hard=d===2; },skipIntro:function(){ if(mode==='intro') endIntro(); },startStory:startStory,LEVELS:LEVELS,get tick(){return tick;}};
})();
</script>
