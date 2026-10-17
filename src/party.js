
/* ---------- celebrations ----------
   The sunrise party is modeled on "Orange Party", the closing slide of Jeremy Wildfire's
   R/Pharma 2026 keynote, which is adapted from "Kākāpō Party" by Simon Willison
   (https://tools.simonwillison.net/kakapo-party, Apache License 2.0). The ideas carried over are
   the beat-synced crowd with choreography that changes every phrase, the lit dance floor,
   confetti that settles on the floor, popping balloons, the disco ball, beams and the banner.
   This code is written fresh for this game. */
var BPM=124, FPB=3600/BPM, BEATSEC=60/BPM;
var PARTY_COLS=['#ff3f7f','#ffd23f','#3fd0ff','#7dffb0','#ff8a2e','#b86bff','#ffffff','#ff7ae0'];
function shadeHex(h,k){ var v=rgb(h); return '#'+v.map(function(c){ return ('0'+Math.max(0,Math.min(255,Math.round(c*k))).toString(16)).slice(-2); }).join(''); }
function mixHex(a,b,k){ var A=rgb(a),B=rgb(b); return '#'+A.map(function(c,i){ return ('0'+Math.round(c+(B[i]-c)*k).toString(16)).slice(-2); }).join(''); }
function u32(h){ var v=rgb(h); return ((255<<24)|(v[2]<<16)|(v[1]<<8)|v[0])>>>0; }
var CONF_DARK=PARTY_COLS.map(function(c){ return shadeHex(c,.58); }), CONF_FLOOR=PARTY_COLS.map(function(c){ return shadeHex(c,.8); });

/* a chunky 5x7 pixel font for banners and shouts */
var F5={A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],B:["####.","#...#","#...#","####.","#...#","#...#","####."],C:[".####","#....","#....","#....","#....","#....",".####"],D:["####.","#...#","#...#","#...#","#...#","#...#","####."],E:["#####","#....","#....","####.","#....","#....","#####"],F:["#####","#....","#....","####.","#....","#....","#...."],G:[".####","#....","#....","#.###","#...#","#...#",".###."],H:["#...#","#...#","#...#","#####","#...#","#...#","#...#"],I:["#####","..#..","..#..","..#..","..#..","..#..","#####"],J:["..###","...#.","...#.","...#.","...#.","#..#.",".##.."],K:["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"],L:["#....","#....","#....","#....","#....","#....","#####"],M:["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"],N:["#...#","##..#","##..#","#.#.#","#..##","#..##","#...#"],O:[".###.","#...#","#...#","#...#","#...#","#...#",".###."],P:["####.","#...#","#...#","####.","#....","#....","#...."],Q:[".###.","#...#","#...#","#...#","#.#.#","#..#.",".##.#"],R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],S:[".####","#....","#....",".###.","....#","....#","####."],T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."],U:["#...#","#...#","#...#","#...#","#...#","#...#",".###."],V:["#...#","#...#","#...#","#...#","#...#",".#.#.","..#.."],W:["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"],X:["#...#","#...#",".#.#.","..#..",".#.#.","#...#","#...#"],Y:["#...#","#...#",".#.#.","..#..","..#..","..#..","..#.."],Z:["#####","....#","...#.","..#..",".#...","#....","#####"],'!':["..#..","..#..","..#..","..#..","..#..",".....","..#.."],' ':["...","...","...","...","...","...","..."],'0':[".###.","#...#","#..##","#.#.#","##..#","#...#",".###."],'1':["..#..",".##..","..#..","..#..","..#..","..#..",".###."]};
function text5W(s,sc){ var w=0; for(var i=0;i<s.length;i++){ var gl=F5[s[i]]||F5[' ']; w+=(gl[0].length+1)*sc; } return w-sc; }
function text5(gg,s,x,y,sc,col,shadow){
  for(var pass=shadow?0:1;pass<2;pass++){ var cx=x; gg.fillStyle=pass?col:shadow;
    for(var i=0;i<s.length;i++){ var gl=F5[s[i]]||F5[' ']; for(var r=0;r<7;r++) for(var c=0;c<gl[r].length;c++) if(gl[r][c]==='#') gg.fillRect(cx+c*sc+(pass?0:sc),y+r*sc+(pass?0:sc),sc,sc); cx+=(gl[0].length+1)*sc; } }
}
function bannerCanvas(s,cloth,dark,hi){
  var sc=2, tw=text5W(s,sc), cw=tw+16, ch=22, tail=7, W2=cw+tail*2, cvb=document.createElement('canvas'); cvb.width=W2; cvb.height=ch+4; var gg=cvb.getContext('2d');
  gg.fillStyle=dark; gg.fillRect(0,5,tail+4,ch-2); gg.fillRect(W2-tail-4,5,tail+4,ch-2);
  gg.fillStyle=shadeHex(cloth,.78); gg.fillRect(1,6,tail+3,ch-4); gg.fillRect(W2-tail-4,6,tail+3,ch-4);
  gg.fillStyle=dark; for(var k=0;k<4;k++){ gg.fillRect(0,9+k,3-k,1); gg.fillRect(0,ch-k,3-k,1); gg.fillRect(W2-3+k,9+k,3-k,1); gg.fillRect(W2-3+k,ch-k,3-k,1); }
  gg.fillStyle=dark; gg.fillRect(tail,0,cw,ch); gg.fillStyle=cloth; gg.fillRect(tail+1,1,cw-2,ch-2); gg.fillStyle=hi; gg.fillRect(tail+1,1,cw-2,2);
  text5(gg,s,tail+8,4,sc,'#fff6ea',dark);
  return cvb;
}
function hatPix(cols){ var p=fromRows(["...o...","..oao..","...a...","..bbb..","..aaa..",".bbbbb.",".aaaaa.","bbbbbbb"],{o:'#ffffff',a:cols[0],b:cols[1]}); return pad(p,1).outline(OUT); }
var HAT_SETS=[['#ff3f7f','#ffd23f'],['#3fd0ff','#fff4d6'],['#b86bff','#7dffb0'],['#ffd23f','#ff3f7f'],['#ff8a2e','#3fd0ff']];
function fishPix(col){ var p=new Pix(13,8); p.ell(6,4,5,3,col); p.ell(5,5,3,1.5,mixHex(col,'#ffffff',.5)); p.poly([[10,4],[13,1],[13,7]],shadeHex(col,.8)); p.px(3,3,OUT); return pad(p,1).outline(OUT); }
function withPicks(o,fn){ var keep={}; Object.keys(o).forEach(function(k){ keep[k]=picks[k]; picks[k]=o[k]; }); try{ return fn(); } finally{ Object.keys(keep).forEach(function(k){ picks[k]=keep[k]; }); } }
function merVariant(tail,hair){ return pad(fromRows(MER,Object.assign({},SKIN,HAIRS[hair],TAILS[tail])),1).outline(OUT); }

/* confetti and fireworks, shared by both celebrations */
var conf=[], settled=[], fireworks=[], fparts=[], balloons=[], calls=[];
function addConf(x,y,vx,vy,floorY){ conf.push({x:x,y:y,vx:vx,vy:vy,c:(Math.random()*PARTY_COLS.length)|0,ang:Math.random()*4,spin:(5+Math.random()*8)*(Math.random()<.5?-1:1)/60,ph:Math.random()*6.3,sw:.2+Math.random()*.4,big:Math.random()<.3,front:Math.random()<.6,landY:floorY?floorY+Math.random()*(VH-floorY-2):null}); }
function confBurst(x,y,n,spd,floorY){ for(var i=0;i<n;i++){ var a=-Math.PI/2+(Math.random()-.5)*2.6, v=spd*(.35+Math.random()*.65); addConf(x,y,Math.cos(a)*v,Math.sin(a)*v,floorY); } }
function launchFirework(x,ty){ fireworks.push({x:x,y:VH+4,ty:ty,vy:-(2.6+Math.random()*.8),c:PARTY_COLS[(Math.random()*6)|0],c2:PARTY_COLS[(Math.random()*8)|0]}); tone(300,.35,'sine',.025,900); }
function updateCelebration(floorY){
  for(var i=conf.length-1;i>=0;i--){ var p=conf[i]; p.vy+=.012; p.vx*=.985; p.vy*=.985; p.x+=p.vx+Math.sin(tick*.05+p.ph)*p.sw; p.y+=p.vy; p.ang+=p.spin;
    var gone=p.x<-20||p.x>W+20||p.y>VH+6;
    if(!gone&&p.landY!=null&&p.vy>0&&p.y>=p.landY){ settled.push({x:Math.round(p.x),y:Math.round(p.landY),c:p.c,wide:Math.random()<.5,die:tick+420+Math.random()*300}); gone=true; }
    if(gone){ conf[i]=conf[conf.length-1]; conf.pop(); } }
  if(settled.length>700) settled.splice(0,settled.length-700);
  if(settled.length&&settled[0].die<tick) settled=settled.filter(function(s){ return s.die>tick; });
  for(i=fireworks.length-1;i>=0;i--){ var f=fireworks[i]; f.y+=f.vy; f.vy+=.018; if(tick%2===0) fparts.push({x:f.x,y:f.y,vx:0,vy:.2,life:14,max:14,c:'#fff3c4'});
    if(f.y<=f.ty||f.vy>=-.3){ var n=34; for(var k=0;k<n;k++){ var a=k/n*Math.PI*2, v=1.1+Math.random()*.5; fparts.push({x:f.x,y:f.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:56,max:56,c:k%3?f.c:f.c2}); } noise(.22,.07); fireworks.splice(i,1); } }
  for(i=fparts.length-1;i>=0;i--){ var q=fparts[i]; q.x+=q.vx; q.y+=q.vy; q.vy+=.022; q.vx*=.97; q.vy*=.97; if(--q.life<=0) fparts.splice(i,1); }
}
function drawConf(front){
  for(var i=0;i<conf.length;i++){ var p=conf[i]; if(p.front!==front) continue; var s=((Math.floor(p.ang)%4)+4)%4, x=Math.round(p.x), y=Math.round(p.y);
    if(p.big){ g.fillStyle=s&1?CONF_DARK[p.c]:PARTY_COLS[p.c]; if(s&1) g.fillRect(x,y,s===1?2:1,s===1?1:2); else g.fillRect(x,y,2,2); }
    else if(s===0){ g.fillStyle=PARTY_COLS[p.c]; g.fillRect(x,y,2,1); } else if(s===2){ g.fillStyle=PARTY_COLS[p.c]; g.fillRect(x,y,1,2); } else { g.fillStyle=CONF_DARK[p.c]; g.fillRect(x,y,1,1); } }
}
function drawFireworks(){
  g.fillStyle='#fff3c4'; fireworks.forEach(function(f){ g.fillRect(Math.round(f.x),Math.round(f.y),1,2); });
  fparts.forEach(function(q){ var k=q.life/q.max; if(k<.25&&(q.life&1)) return; g.fillStyle=k>.75?'#ffffff':q.c; g.fillRect(Math.round(q.x),Math.round(q.y),k>.6?2:1,k>.6?2:1); });
}

/* ---------- world complete: fireworks, a parade and a star for the shelf ---------- */
var ww=null;
var PARADE={deep:['jelly','crab','puffer','fish'],ship:['puffer','crab','fish','jelly'],reef:['turtle','puffer','fish','crab'],lagoon:['turtle','jelly','crab','fish'],clouds:['bird'],candy:['bee','fairy'],vine:['bee','fairy'],rainbow:['bird','fairy'],snow:['snowbird','bird'],night:['owl','fairy']};
function critterPix(kind,i){
  switch(kind){
    case 'jelly': return jellyPix(i%4); case 'crab': return crabPix(0); case 'puffer': return i%2?flipped(pufferPix()):pufferPix();
    case 'turtle': return i%2?flipped(turtlePix(20)):turtlePix(20); case 'fish': return fishPix(['#7fd3ff','#ffb36b','#ffd75e','#ff9fd0'][i%4]);
    case 'bird': return birdPix(i%2); case 'bee': return beePix(i%2); case 'owl': return owlPix(i%2); case 'snowbird': return snowBirdPix(i%2); case 'fairy': return fairyPix(i%2);
  }
}
var FLYERS={bird:1,bee:1,owl:1,snowbird:1,fairy:1,fish:1};
function startWorldWin(){
  var e=LEVELS[world.idx].env, th=world.th, kinds=PARADE[th.key]||['bird'], mem=[];
  for(var i=0;i<6;i++){ var kind=kinds[i%kinds.length], left=i<3, slot=left?[34,66,98][i]:[222,254,286][i-3];
    mem.push({kind:kind,c:critterPix(kind,i).canvas(),fly:!!FLYERS[kind]&&th.kind==='sky'||kind==='fish',x:left?-30-i*24:W+30+(i-3)*24,tx:slot,i:i}); }
  ww={t:0,e:e,th:th,mem:mem,medalX:210,medalY:0,shown:false};
  conf=[]; settled=[]; fireworks=[]; fparts=[];
  SFX.win();
}
function worldWinBg(){
  var key='ww'+ww.th.key+VH; if(scn[key]) return scn[key];
  var th=ww.th, p=new Pix(W,VH); vgrad(p,0,0,W,VH,th.grad.slice(0,Math.max(2,th.grad.length-2)));
  if(th.key==='night'){ for(var i=0;i<60;i++) p.px((i*73+11)%W,(i*37)%Math.round(VH*.7),'#fff4fb'); }
  var gy=VH-34;
  if(th.kind==='sea'||th.kind==='isle'){ for(var x=0;x<W;x++){ var t2=gy+Math.round(Math.sin(x/16)*1.4); for(var y=t2;y<VH;y++) p.px(x,y,y===t2?'#f6dca6':((x*7+y*13)%17===0?'#c99a5b':'#e6c189')); } weed(p,6,gy,26,0); weed(p,300,gy,30,1.2); weed(p,14,gy,16,2); }
  else { var fk=th.plat==='candy'?'candy':th.plat==='night'?'night':th.plat==='ice'?'icy':'normal'; p.stamp(cloudPix(W+8,fk),-4,gy-5); p.rect(0,gy+7,W,VH-gy-7,CLOUDS[fk][1]); }
  var pod=platArt(th,{x:110,y:gy-12,w:100,type:'plat'}); p.stamp(pod.make(),110+pod.dx,gy-12+pod.dy);
  scn[key]=p.canvas(); return scn[key];
}
function updateWorldWin(){
  var t=++ww.t;
  if(t%34===8&&t<520) launchFirework(30+Math.random()*260,20+Math.random()*VH*.3);
  if(t<240&&t%3===0) addConf(Math.random()*W,-4,(Math.random()-.5)*.6,.3+Math.random()*.6);
  if(t===150){ ww.shown=true; var o=$('wdone'); o.hidden=false; }
  if(t===200){ tone(1319,.12,'triangle',.07); tone(1760,.2,'triangle',.06,null,.1); }
  updateCelebration(null);
  if(fairy){ fairy.x=160+Math.cos(t*.04)*60; fairy.y=VH*.5+Math.sin(t*.08)*12; }
}
function drawWorldWin(){
  var t=ww.t, gy=VH-34, bp=t/FPB, th=ww.th;
  g.drawImage(worldWinBg(),0,0);
  drawFireworks();
  /* the banner drops in with a bounce */
  var bc=spr('ban:WORLD COMPLETE!',function(){ return {canvas:function(){ return bannerCanvas('WORLD COMPLETE!','#ff3f7f','#5e0c30','#ff86b0'); }}; });
  var drop=Math.min(1,t/40), by=Math.round(-40+(14+40)*(1-Math.pow(1-drop,3))+(drop>=1?Math.max(0,Math.sin((t-40)/6)*3*Math.exp(-(t-40)/30)):0));
  g.drawImage(bc,Math.round(W/2-bc.width/2),by);
  /* the shelf of world stars */
  var sy=by+30, n=ENVS.length, slot=13, sx0=Math.round(W/2-(n*slot)/2);
  for(var i=0;i<n;i++){ var have=!!save.done[i*5+4]&&!(i===ww.e&&t<200), x=sx0+i*slot;
    g.fillStyle=OUT; g.fillRect(x,sy,11,11); g.fillStyle=have?'#ffe9a6':'#5a4f86'; g.fillRect(x+1,sy+1,9,9);
    if(have) put(g,'smstar',starPix,x+1,sy+1); }
  /* the medal spins, then flies to its place on the shelf */
  if(t<215){
    var mx, my, scale=2;
    if(t<150){ mx=210; my=Math.round(VH*.42)+Math.round(Math.sin(t/12)*2); }
    else { var k=ease((t-150)/65); mx=lerp(210,sx0+ww.e*slot+5,k); my=lerp(Math.round(VH*.42),sy+5,k); scale=lerp(2,.6,k); }
    var star=spr('bstar',bigStarPix), sw=Math.max(2,Math.round(star.width*scale*Math.abs(Math.cos(t/9))));
    if(t<150) glow(g,Math.round(mx),Math.round(my),16+((t>>3)%2),'#fff3c4',t>>2);
    g.drawImage(star,Math.round(mx-sw/2),Math.round(my-star.height*scale/2),sw,Math.round(star.height*scale));
  }
  /* the hero hops on the podium */
  var f=(bp%1), hop=f<.8?Math.round(10*4*(f/.8)*(1-f/.8)):0;
  if(th.kind==='isle'){ var ff0=(tick>>2)%3; put(g,'fbig'+ff0,function(){return fairyBigPix(ff0);},146,gy-12-23-hop); }
  else if(th.kind==='sea') put(g,'merA',function(){return mermaidPix(0,false);},152,gy-12-29-hop);
  else put(g,'rideR',function(){return riderPix();},138,gy-12-42-hop);
  if(fairy){ var ff=(tick>>2)%2; put(g,'fairy'+ff,function(){return fairyPix(ff);},fairy.x-7,fairy.y-6); }
  /* the parade arrives and dances */
  ww.mem.forEach(function(m){
    var arrive=Math.min(1,Math.max(0,(t-10-m.i*6)/90)), x=lerp(m.x,m.tx,ease(arrive)), y;
    var c=m.c;
    if(m.fly){ var ang=t*.03+m.i*1.05; if(arrive>=1){ x=m.tx+Math.cos(ang)*10; } y=Math.round(VH*.52+Math.sin(ang*1.7)*10+(m.i%3)*8); }
    else { var hp=arrive<1?Math.abs(Math.sin(t/7+m.i))*6:(function(){ var ff2=((bp-(m.i%2)*.5)%1+1)%1; return ff2<.8?8*4*(ff2/.8)*(1-ff2/.8):0; })(); y=Math.round(gy-c.height+1-hp); }
    g.drawImage(c,Math.round(x-c.width/2),y);
  });
  drawConf(true); drawConf(false);
  parts.forEach(function(q){ g.fillStyle=q.col; g.fillRect(Math.round(q.x),Math.round(q.y),1,1); });
}
function worldWinTap(x,y){ launchFirework(x,y); confBurst(x,y,30,1.6,null); }

/* ---------- the sunrise party ---------- */
var party=null;
var FL_LITS=['#ff8a2e','#ffd23f','#ff3f7f','#ffb35c','#ff6a3d','#ffe08a','#ff7ae0','#3fd0ff'].map(function(h){ return {f:u32(mixHex(h,'#ffffff',.35)),n:u32(h),d:u32(shadeHex(h,.45))}; });
var FL_BASE=[u32('#2a1630'),u32('#331a3a')], FL_GROUT=u32('#170b1c'), FL_EDGE=u32('#ff9a4a');
var SHOUTS=['YAY!','WHEE!','HOORAY!','WOO!','YAY!'];
var CHORDS=[[48,55,60,64,67],[43,50,55,59,62],[45,52,57,60,64],[41,48,53,57,60]];
var MELODY=[0,2,4,2,3,4,2,1];
function mtof(m){ return 440*Math.pow(2,(m-69)/12); }
function nz(delay,dur,vol,type,freq){ if(muted||!actx) return; var t=actx.currentTime+(delay||0), n=Math.floor(actx.sampleRate*dur), b=actx.createBuffer(1,n,actx.sampleRate), ch=b.getChannelData(0); for(var i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); var s=actx.createBufferSource(), f=actx.createBiquadFilter(), gn=actx.createGain(); s.buffer=b; f.type=type; f.frequency.value=freq; gn.gain.value=vol; s.connect(f); f.connect(gn); gn.connect(actx.destination); s.start(t); }
function kick(delay){ if(muted||!actx) return; var t=actx.currentTime+(delay||0), o=actx.createOscillator(), gn=actx.createGain(); o.type='sine'; o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(45,t+.12); gn.gain.setValueAtTime(.2,t); gn.gain.exponentialRampToValueAtTime(.0001,t+.2); o.connect(gn); gn.connect(actx.destination); o.start(t); o.stop(t+.22); }
function partyMusic(b){
  if(muted||!actx) return;
  var ch=CHORDS[Math.floor(b/4)%4], half=BEATSEC/2;
  kick(0); nz(half,.04,.05,'highpass',7000); if(b%2===1) nz(0,.12,.07,'bandpass',1600);
  tone(mtof(ch[0]-12),half*.9,'triangle',.07); tone(mtof(ch[0]),half*.9,'triangle',.05,null,half);
  var m1=ch[MELODY[(b*2)%8]]+12, m2=ch[MELODY[(b*2+1)%8]]+12;
  if(b%8!==7){ tone(mtof(m1),half*.8,'square',.025); tone(mtof(m2),half*.8,'square',.022,null,half); }
  if(b%16===15) tone(400,BEATSEC,'sine',.03,1600);
}
function buildParty(){
  var P={VH:VH}, ft=Math.round(VH*(VH>260?.5:.56)); P.ft=ft;
  /* sky, sun and the cloud tops we are dancing on */
  var p=new Pix(W,VH); vgrad(p,0,0,W,ft,['#3a1650','#5a1d63','#8a2668','#c23d6c','#ee6a64','#ff9a58','#ffbf5e']);
  for(var i=0;i<40;i++){ var sx=(i*73+11)%W, sy=(i*29)%Math.round(ft*.4); p.px(sx,sy,'#ffe6f0'); }
  var sunY=ft+6; p.ell(160,sunY,50,50,'#ffd447'); p.ell(160,sunY,45,45,'#ffe98a'); p.ell(160,sunY,37,37,'#fff4c2');
  for(i=-1;i<13;i++){ p.ell(i*28+10,ft-3,18,7,'#ffd3c4'); p.ell(i*28+10,ft-2,18,7,'#ffb3b8'); }
  p.rect(0,ft-2,W,VH-ft+2,'#ffb3b8');
  P.bg=p.canvas(); P.sunY=sunY;
  P.rays=[]; for(var k=0;k<6;k++){ var rp=new Pix(W,ft); for(var y=0;y<ft;y++) for(var x=0;x<W;x++){ var d=Math.hypot(x-160,y-sunY); if(d<54) continue; var a=Math.atan2(y-sunY,x-160)+k*(Math.PI/36), band=Math.floor((a+Math.PI*2)/(Math.PI/12)); if(band%2===0&&bayer(x,y)<.42*(1-d/320)) rp.px(x,y,'#ffe0a8'); } P.rays.push(rp.canvas()); }
  /* the dance floor, in perspective */
  var fh=VH-ft, vp=ft-fh*1.6, N=W*fh, tile=new Int32Array(N), grout=new Uint8Array(N), cols=new Int32Array(N), rows=new Int32Array(N), cmin=1e9, cmax=-1e9, rmin=1e9, rmax=-1e9;
  for(y=0;y<fh;y++){ var dv=ft+y-vp, row=Math.floor((fh*2.6)*(fh*2.6)/(11*dv)); for(x=0;x<W;x++){ var col=Math.floor((x+.5-160)/dv*(fh*2.6)/24+.5), j=y*W+x; cols[j]=col; rows[j]=row; if(col<cmin) cmin=col; if(col>cmax) cmax=col; if(row<rmin) rmin=row; if(row>rmax) rmax=row; } }
  var tc=cmax-cmin+1; for(j=0;j<N;j++){ var xx=j%W, yy=(j/W)|0; tile[j]=(rows[j]-rmin)*tc+(cols[j]-cmin); grout[j]=(yy===0||(xx>0&&cols[j]!==cols[j-1])||(yy>0&&rows[j]!==rows[j-W]))?1:0; }
  P.fh=fh; P.tile=tile; P.grout=grout; P.tc=tc; P.cmin=cmin; P.rmin=rmin; P.rmid=Math.floor((fh*2.6)*(fh*2.6)/(11*(ft+fh*.5-vp)));
  P.tcol=new Uint32Array(tc*(rmax-rmin+1)); P.fc=document.createElement('canvas'); P.fc.width=W; P.fc.height=fh; P.fg=P.fc.getContext('2d'); P.img=P.fg.createImageData(W,fh); P.buf=new Uint32Array(P.img.data.buffer);
  /* everyone from all ten worlds */
  var crown=hard||save.crown;
  var KINDS=['mer','jelly','crab','uni','puffer','mer','turtle','jelly','mer','crab','uni','puffer','mer','turtle'];
  var MERS=[['teal','pink'],['pink','blonde'],['gold','red'],['blue','purple'],['purple','brown'],['teal','blue']];
  var MANES2=[['rainbow','yes'],['purple','no'],['gold','yes'],['blue','no']];
  var crowd=[], nrows=Math.max(2,Math.min(5,Math.floor((VH-ft-14)/24)+1)), idx=0, ki=0;
  for(var r=0;r<nrows;r++){
    var gy=Math.round(ft+16+(VH-8-(ft+16))*(nrows===1?1:r/(nrows-1))), list=[], width=0;
    while(width<W-30){ var kind=KINDS[ki++%KINDS.length], c, hx, hy;
      if(kind==='mer'){ var mv=MERS[ki%MERS.length]; c=spr('pm'+mv,function(){ return merVariant(mv[0],mv[1]); }); hx=8; hy=1; }
      else if(kind==='uni'){ var uv=MANES2[ki%MANES2.length]; c=spr('pu'+uv,function(){ return withPicks({mane:uv[0],wings:uv[1]},function(){ return unicornPix(false); }); }); hx=27; hy=5; }
      else if(kind==='jelly'){ var jf=ki%4; c=spr('jelly'+jf,function(){ return jellyPix(jf); }); hx=8; hy=1; }
      else if(kind==='crab'){ c=spr('crab0',function(){ return crabPix(0); }); hx=10; hy=3; }
      else if(kind==='puffer'){ c=spr('puffer',pufferPix); hx=10; hy=2; }
      else { c=spr('pturt',function(){ return turtlePix(20); }); hx=29; hy=7; }
      list.push({c:c,hx:hx,hy:hy,kind:kind}); width+=c.width+6; }
    var x0=Math.round(W/2-width/2+3);
    list.forEach(function(m){ m.x=x0+m.c.width/2; x0+=m.c.width+6; m.gy=gy+((idx*7)%3)-1; m.row=r; m.idx=idx++; m.rnd=Math.random(); m.xn=clamp(m.x/W,0,.999); m.h=(m.c.height>28?9:7)+Math.random()*4; m.lazy=Math.random()<.12; m.hat=Math.random()<.6?spr('hat'+(idx%5),function(){ return hatPix(HAT_SETS[idx%5]); }):null; crowd.push(m); });
  }
  /* the hero dances front and center */
  var front=crowd.filter(function(m){ return m.row===nrows-1; }), mid=front.reduce(function(a,b){ return Math.abs(b.x-160)<Math.abs(a.x-160)?b:a; },front[0]);
  if(mid){ mid.c=spr(crown?'rideC':'rideR',function(){ return riderPix(crown); }); mid.hx=19; mid.hy=13; mid.hat=crown?null:spr('hat0',function(){ return hatPix(HAT_SETS[0]); }); mid.hero=true; mid.h=12; mid.lazy=false; }
  crowd.sort(function(a,b){ return a.gy-b.gy||a.x-b.x; });
  P.crowd=crowd;
  /* flyers above the dance floor */
  var FK=['bird','bee','owl','snowbird','fairy','fish','bird','fairy'];
  P.flyers=FK.map(function(k,i){ return {kind:k,i:i,ph:i*.8,y:ft*.5+((i*23)%Math.max(10,Math.round(ft*.35))),sp:.004+(i%3)*.0015}; });
  P.banner=bannerCanvas('YOU DID IT!','#ff3f7f','#5e0c30','#ff86b0');
  P.bannerY=Math.round(Math.max(26,ft*.34));
  P.discoY=Math.max(10,Math.round(P.bannerY-14));
  return P;
}
var mode2=0, lastBeat=-1, floorPat=0, glints=[];
var MODES=[function(){return 0;},function(m){return m.xn;},function(m){return (m.idx&1)*.5;},function(m){return m.rnd;},function(m){return Math.min(.95,Math.abs(m.xn-.5)*1.8);},function(m){return (m.row&1)*.5;}];
function startParty(){ party=buildParty(); conf=[]; settled=[]; fireworks=[]; fparts=[]; balloons=[]; calls=[]; lastBeat=-1; party.t0=tick; party.hint=tick+480; }
function partyTap(x,y){
  if(!party) return;
  for(var i=balloons.length-1;i>=0;i--) if(Math.hypot(balloons[i].x-x,balloons[i].y-y)<10){ confBurst(balloons[i].x,balloons[i].y,24,1.4,party.ft); balloons.splice(i,1); }
  confBurst(x,y,70,2.6,party.ft); nz(0,.18,.08,'lowpass',2000); tone(880,.1,'triangle',.05,1400);
  var bp=(tick-party.t0)/FPB;
  party.crowd.forEach(function(m){ if(Math.abs(m.x-x)<50&&Math.abs(m.gy-12-y)<60) m.boost=Math.floor(bp)+2; });
  party.hint=Math.min(party.hint,tick);
}
function updateParty(){
  if(!party||party.VH!==VH) startParty();
  var P=party, bp=(tick-P.t0)/FPB, b=Math.floor(bp);
  while(lastBeat<b){ lastBeat++; onPartyBeat(lastBeat); }
  if(tick%2===0) addConf(Math.random()*(W+16)-8,-3,(Math.random()-.5)*.2,.15+Math.random()*.3,P.ft);
  if(tick%70===0&&balloons.length<9) balloons.push({x:10+Math.random()*(W-20),y:VH+10,vy:-(.25+Math.random()*.15),c:(Math.random()*6)|0,ph:Math.random()*6.3,popY:Math.random()<.6?8+Math.random()*P.ft*.7:-99});
  for(var i=balloons.length-1;i>=0;i--){ var bl=balloons[i]; bl.y+=bl.vy; bl.x+=Math.sin(tick*.02+bl.ph)*.08; if(bl.y<=bl.popY){ confBurst(bl.x,bl.y,22,1.4,P.ft); noise(.08,.05); balloons.splice(i,1); } else if(bl.y<-20) balloons.splice(i,1); }
  if(tick%40===0&&calls.length<3){ var m=P.crowd[(Math.random()*P.crowd.length)|0]; calls.push({m:m,w:SHOUTS[(Math.random()*SHOUTS.length)|0],until:tick+70}); }
  calls=calls.filter(function(c){ return c.until>tick; });
  updateCelebration(P.ft);
}
function onPartyBeat(b){
  if(b%8===0){ mode2=b===0?0:(mode2+1+Math.floor(Math.random()*(MODES.length-1)))%MODES.length; floorPat=(b/8)%4; }
  if(b%16===0){ for(var i=0;i<Math.round(110*W/320);i++) addConf(Math.random()*(W+20)-10,-4-Math.random()*20,(Math.random()-.5)*1.2,.4+Math.random()*1.2,party.ft); }
  if(b%8===4){ var side=(b/8|0)%2, x=side?W+2:-2; for(i=0;i<60;i++){ var a=side?-Math.PI*.68:-Math.PI*.32, a2=a+(Math.random()-.5)*.5, v=3.2*(.4+Math.random()*.6); addConf(x,VH-14,Math.cos(a2)*v,Math.sin(a2)*v,party.ft); } nz(0,.15,.06,'lowpass',3000); }
  if(b%8===2) launchFirework(40+Math.random()*240,12+Math.random()*party.ft*.35);
  partyMusic(b);
}
var BAL_COLS=['#ff3f7f','#ffd23f','#3fd0ff','#b86bff','#ff8a2e','#7dffb0'];
function balloonPix(col){ var p=fromRows(["..kkk..",".kccck.","kchccck","khcccdk","kccccdk",".kccdk.","..kdk..","...k..."],{k:shadeHex(col,.45),c:col,h:mixHex(col,'#ffffff',.6),d:shadeHex(col,.72)}); return p; }
function drawParty(){
  if(!party||party.VH!==VH) startParty();
  var P=party, ft=P.ft, bp=(tick-P.t0)/FPB, b=Math.floor(bp), bf=bp-b, t=tick;
  g.drawImage(P.bg,0,0); g.drawImage(P.rays[(t>>3)%6],0,0);
  drawFireworks();
  /* bunting and party lights */
  var sag=function(y0,s,x){ var u=x/W; return y0+s*4*u*(1-u); };
  g.fillStyle='#3a1a40'; for(var x=0;x<W;x++){ g.fillRect(x,Math.round(sag(-1,Math.max(10,ft*.18),x)),1,1); g.fillRect(x,Math.round(sag(2,8,x)),1,1); }
  for(var i=0,fx=3;fx<W-3;fx+=9,i++){ var fy=Math.round(sag(-1,Math.max(10,ft*.18),fx+2))+1, ci=i%6, sw=((b+i)&1)?1:0; g.fillStyle=PARTY_COLS[ci]; g.fillRect(fx,fy,5,2); g.fillRect(fx+1+sw,fy+2,3,2); g.fillRect(fx+2+sw,fy+4,1,1); }
  for(i=0,fx=5;fx<W-4;fx+=8,i++){ var ly=Math.round(sag(2,8,fx))+1, on=((i+b)%3)===0, bc=['#ff4f6d','#ffd23f','#6dff8a','#4fb4ff','#e36bff'][i%5]; g.fillStyle=on?mixHex(bc,'#ffffff',.6):bc; g.fillRect(fx,ly,2,2); if(on){ g.globalAlpha=.25; g.fillRect(fx-1,ly-1,4,4); g.globalAlpha=1; } }
  /* the disco ball */
  var dx=160, dy=P.discoY, rr=7, rot=Math.floor(t/12);
  g.fillStyle='#8a7aa8'; g.fillRect(dx,0,1,dy-rr);
  for(var yy=-rr;yy<=rr;yy++) for(var xx=-rr;xx<=rr;xx++){ var d2=xx*xx+yy*yy; if(d2>rr*rr+rr*.6) continue; var lv=(((xx+rr+rot)>>1)*7+((yy+rr)>>1)*3)%3, l=(-xx*.8-yy)/rr; if(l>.45) lv++; else if(l<-.55) lv--; if(d2>(rr-1)*(rr-1)) lv--; g.fillStyle=['#3c3a58','#6e6c94','#a9a7cf','#e9e7ff'][clamp(lv,0,3)]; g.fillRect(dx+xx,dy+yy,1,1); }
  if(Math.random()<.08) glints.push({x:dx+((Math.random()*10)|0)-6,y:dy+((Math.random()*10)|0)-6,t:t});
  glints=glints.filter(function(q){ return t-q.t<14; }); glints.forEach(function(q){ sparkle(g,q.x,q.y,t-q.t<7?2:1,'#d8f2ff'); });
  /* flyers and the banner, carried by two bluebirds */
  P.flyers.forEach(function(f){ var x=(f.i*41+t*(.35+(f.i%3)*.12))%(W+40)-20, y=Math.round(f.y+Math.sin(t*.05+f.ph)*6+(b%2?0:-1)), fr=(t>>3)%2; var key=f.kind+'P'+fr; put(g,key,(function(k,ff,i2){ return function(){ return critterPix(k,ff+i2*2); }; })(f.kind,fr,f.i),x,y); });
  var bw=P.banner.width, bx=Math.round(W/2-bw/2), by=P.bannerY+(bf<.5?0:1);
  g.fillStyle='#3a1a40'; for(var s2=0;s2<8;s2++){ g.fillRect(bx+3,by-8+s2,1,1); g.fillRect(bx+bw-4,by-8+s2,1,1); }
  var bfr=(t>>3)%2; put(g,'bird'+bfr,function(){ return birdPix(bfr); },bx-6,by-19+(bfr?0:1)); put(g,'birdL'+bfr,function(){ return flipped(birdPix(bfr)); },bx+bw-11,by-19+(bfr?1:0));
  g.drawImage(P.banner,bx,by);
  var wt=tick-P.t0; if(wt<300){ var wxx=lerp(150,W+60,wt/300), wyy=lerp(ft*.5,-30,wt/300), wf=(t>>3)%2; put(g,'witch'+wf,function(){ return witchPix(wf); },wxx,wyy); if(wt<220) text5(g,'HMPH!',Math.round(wxx),Math.round(wyy-10),1,'#e9ffe0',OUT); }
  if(tick<P.hint&&(t%72)<52){ var hint='TAP FOR CONFETTI!', hw=text5W(hint,1); text5(g,hint,Math.round(W/2-hw/2),by+P.banner.height+4,1,'#fff6ea',OUT); }
  balloons.forEach(function(bl){ var bxx=Math.round(bl.x), byy=Math.round(bl.y); g.fillStyle='#e9d0ff'; for(var k=0;k<10;k++) g.fillRect(bxx+Math.round(Math.sin(t*.05+bl.ph+k*.45)*k*.18),byy+5+k,1,1); put(g,'bal'+bl.c,function(){ return balloonPix(BAL_COLS[bl.c]); },bxx-3,byy-4); });
  drawConf(false);
  /* the floor lights up with the beat */
  var flash=bf<.16, dropping=(b%16===0), nL=FL_LITS.length;
  for(var k2=0;k2<P.tcol.length;k2++){ var col=(k2%P.tc)+P.cmin, row=((k2/P.tc)|0)+P.rmin, lit=-1, dim=false;
    if(dropping) lit=(((col-row)%nL)+nL)%nL;
    else if(floorPat===0){ if(((col+row+b)&1)===0) lit=(b>>1)%nL; }
    else if(floorPat===1){ var dd=Math.abs(col)+Math.abs(row-P.rmid); if((((dd-b)%4)+4)%4===0) lit=dd%nL; }
    else if(floorPat===2){ lit=(((col-row+b)%nL)+nL)%nL; dim=true; }
    else { var hsh=((col*73856093)^(row*19349663)^(b*83492791))>>>0; if(hsh%100<34) lit=hsh%nL; }
    P.tcol[k2]=lit<0?FL_BASE[(col+row)&1]:(dim?(flash?FL_LITS[lit].n:FL_LITS[lit].d):(flash||dropping?FL_LITS[lit].f:FL_LITS[lit].n)); }
  for(var j=0,n=P.buf.length;j<n;j++) P.buf[j]=P.grout[j]?(j<W?FL_EDGE:FL_GROUT):P.tcol[P.tile[j]];
  P.fg.putImageData(P.img,0,0); g.drawImage(P.fc,0,ft);
  settled.forEach(function(s){ var life=s.die-tick; g.globalAlpha=life<60?Math.max(0,life/60):1; g.fillStyle=CONF_FLOOR[s.c]; g.fillRect(s.x,s.y,s.wide?2:1,1); }); g.globalAlpha=1;
  /* the crowd hops on the beat */
  var M=MODES[mode2];
  P.crowd.forEach(function(m){
    var off=M(m), q=bp-off, qb=Math.floor(q), f=q-qb, h=m.h*((qb%16===0)?2.1:1)*(m.boost&&qb<=m.boost?2.4:1), y=0;
    if(!(m.lazy&&(qb&1))&&f<.8){ var u=f/.8; y=h*4*u*(1-u); }
    m.y=y; var w2=Math.max(3,Math.round(m.c.width/3-y*.15));
    g.fillStyle='rgba(23,11,28,.45)'; g.fillRect(Math.round(m.x-w2),m.gy,w2*2,1); g.fillRect(Math.round(m.x-w2+1),m.gy+1,w2*2-2,1);
    var left=Math.round(m.x-m.c.width/2), top=Math.round(m.gy-m.c.height+1-y);
    g.drawImage(m.c,left,top); if(m.hat) g.drawImage(m.hat,left+m.hx-5,top+m.hy-10);
    m.top=top;
  });
  calls.forEach(function(c){ var w3=text5W(c.w,1), x2=Math.round(clamp(c.m.x-w3/2,2,W-w3-2)), y2=c.m.top-12; text5(g,c.w,x2,y2,1,'#ffffff',OUT); });
  /* sweeping beams */
  g.globalCompositeOperation='lighter';
  for(var bm=0;bm<2;bm++){ var ax=bm?W+6:-6, tx=W*.5+Math.sin(t*.01+bm*2.1)*W*.36, ty=ft+(VH-ft)*(.45+.3*Math.sin(t*.015+bm*1.3)); g.fillStyle=['#ff4fd8','#4fd8ff','#ffe14f','#9d6bff'][((b>>2)+bm*2)%4]; g.globalAlpha=.08;
    for(var y3=0;y3<=ty;y3++){ var s3=(y3+6)/(ty+6), cx3=ax+(tx-ax)*s3, hw3=1+13*s3; g.fillRect(Math.round(cx3-hw3),y3,Math.round(hw3*2),1); } }
  g.globalAlpha=1; g.globalCompositeOperation='source-over';
  drawConf(true);
}
