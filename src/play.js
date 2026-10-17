
/* ---------- state ---------- */
var VH=180, SC=3, tick=0, mode='title', diff=0, hard=false, world=null, pl=null, parts=[], counts={pearls:0,gems:0,stars:0}, lvl={pearls:0,gems:0,stars:0}, cut=0, winT=0, marker=null, pending=null, fairy=null;
var keys={left:false,right:false,jump:false}, jumpBuf=0;
var save={reached:0,done:[],hardUnlocked:false,crown:false,diff:0,pad:false};
try{ var sv=JSON.parse(localStorage.getItem('mfuwg2')||'null'); if(sv) save=Object.assign(save,sv); }catch(e){}
try{ var old=JSON.parse(localStorage.getItem('mfuwg')||'null'); if(old&&old.crown) save.crown=true; }catch(e){}
/* progress from the 8-level version moves to the same places in the 50-level climb */
if(!save.ver||save.ver<3){
  var MOVE=[0,10,15,20,25,30,35,45], done8=save.done||[];
  save.reached=MOVE[Math.min(7,save.reached||0)]||0;
  save.done=[]; done8.forEach(function(d,i){ if(d&&MOVE[i]!=null) save.done[MOVE[i]]=true; });
  save.ver=3;
}
/* the two Fairy Island worlds slot in after the sea, so later progress moves up ten levels */
if(save.ver===3){ if(save.reached>=20) save.reached+=10; var d3=save.done||[]; save.done=[]; d3.forEach(function(d,i){ if(d) save.done[i>=20?i+10:i]=true; }); save.ver=4; }
diff=save.diff===1||save.diff===2?save.diff:0; if(diff===2&&!save.hardUnlocked) diff=1;
function persist(){ try{ localStorage.setItem('mfuwg2',JSON.stringify(save)); }catch(e){} }
var MAGIC=['#ffd0ea','#fff3a6','#c9b6ff','#ffffff'];

/* ---------- play ---------- */
function startLevel(idx,cpIdx){
  hard=diff===2; audio();
  world=buildWorld(idx); parts=[]; marker=null; pending=null; lvl={pearls:0,gems:0,stars:0};
  var ph=world.phys, s=world.start;
  pl={x:s.x,y:s.y,vx:0,vy:0,w:ph.w,h:ph.h,onGround:s.plat,coyote:0,airJumps:ph.airJumps,face:1,inv:0,rescue:null,auto:null,walkTo:null,last:{plat:s.plat,x:s.x,px:0}};
  if(cpIdx!=null){ var c=world.cps.filter(function(q){return q.idx<=cpIdx;}); c.forEach(function(q){ q.active=true; }); if(c.length){ var cp=c[c.length-1]; world.cp=cp; pl.x=cp.x; pl.y=cp.y; pl.onGround=cp.plat; pl.last={plat:cp.plat,x:cp.x,px:cp.plat.x||0}; } }
  if(world.horiz) islandCams(world,true); else world.cam=clamp(pl.y-VH*.62,0,world.H-VH);
  fairy=idx>=FAIRY_FROM?{x:pl.x-16,y:pl.y-50}:null;
  if(idx>save.reached){ save.reached=idx; persist(); }
  if(cpIdx==null) startIntro();
  else { setMode('play'); toast('Level '+(idx+1)+' · '+LEVELS[idx].name,LEVELS[idx].tip,2800); }
}
function overlapX(p){ return pl.x+pl.w/2>p.x+2&&pl.x-pl.w/2<p.x+p.w-2; }
function arcY(p,x){ var dx=x-p.cx; if(Math.abs(dx)>p.R-1) return null; return p.base-Math.sqrt(p.R*p.R-dx*dx); }
function topOf(p){ return p.type==='arc'?p.base-p.R:p.y; }
function addParts(x,y,n,cols,spd,life,grav){ for(var i=0;i<n;i++){ var a=Math.random()*Math.PI*2, s=(.4+Math.random())*spd; parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:life,max:life,col:cols[i%cols.length],grav:grav||0}); } }
function bump(hx){ var d=pl.x<hx?-1:1; pl.vx=d*(hard?3.2:2.2); pl.vy=Math.min(pl.vy,hard?-2:-1.6); pl.onGround=null; pl.auto=null; pl.walkTo=null; pl.inv=70; SFX.bump(); addParts(pl.x,pl.y-pl.h/2,6,['#fff3a6','#ffffff'],1.2,18); }

/* where the bubble takes you: Easy goes back to the ledge or cloud you left, the others to the last checkpoint */
function rescueSpot(){
  var L=pl.last;
  if(diff===0&&L&&L.plat&&L.plat.active!==false){
    var p=L.plat;
    if(p.type==='arc') return {x:p.cx,y:p.base-p.R,plat:p};
    if(p.type==='floor') return {x:L.x,y:p.y,plat:p};
    return {x:clamp(L.x+(p.type==='drift'?p.x-L.px:0),p.x+6,p.x+p.w-6),y:p.y,plat:p};
  }
  return {x:world.cp.x,y:world.cp.y,plat:world.cp.plat};
}
function startRescue(){
  var t=rescueSpot(), w=world, fromY=w.horiz?Math.min(pl.y,w.waterY+4):Math.min(pl.y,w.cam+VH+6);
  pl.rescue={t:0,dur:diff===0?64:96,fx:pl.x,fy:fromY,tx:t.x,ty:t.y,plat:t.plat,c0:w.cam,c1:w.horiz?(VH>=w.H?w.H-VH:clamp(t.y-VH*.62,0,w.H-VH)):clamp(t.y-VH*.62,0,w.H-VH),cx0:w.camX||0,cx1:w.horiz?clamp(t.x-W*.4,0,Math.max(0,w.Wd-W)):0};
  pl.vx=pl.vy=0; pl.onGround=null; pl.auto=null; pl.walkTo=null; pending=null; SFX.bubble();
}
function land(p,top){
  var ph=world.phys; pl.y=top; pl.auto=null; pl.riding=false;
  if(p.type==='bouncy'){ pl.vy=ph.bounceV; pl.vx*=.3; pl.onGround=null; pl.airJumps=ph.airJumps; SFX.boing(); addParts(pl.x,top,8,['#ffd0ea','#ffffff'],1.4,18); return; }
  pl.vy=0; pl.onGround=p; pl.last={plat:p,x:pl.x,px:p.x||0};
  if(p.type==='goal'&&mode==='play'){ completeLevel(); setMode('winning'); winT=0; SFX.win(); }
}

/* ---------- tap where you want to go ---------- */
function resolveTap(tx,ty){
  var w=world, best=null, bd=1e9;
  function score(top,x0,x1,x,ref,extra){ if(tx<x0-12||tx>x1+12) return; var dy=ty-top; if(dy<-44||dy>(ref&&ref.ground?64:22)) return; var d=Math.abs(dy+10)+Math.max(0,x0-tx,tx-x1)*2; if(d<bd){ bd=d; best=Object.assign({x:x,y:top,plat:ref},extra||{}); } }
  w.plats.forEach(function(p){
    if(!p.active) return;
    if(p.type==='arc'){ var ax=clamp(tx,p.cx-p.R+6,p.cx+p.R-6); score(arcY(p,ax),p.cx-p.R,p.cx+p.R,ax,p); }
    else score(p.y,p.x,p.x+p.w,clamp(tx,p.x+6,p.x+p.w-6),p);
  });
  w.jellies.forEach(function(j){ score(j.y+j.bob,j.x-7,j.x+7,j.x,j,{jelly:true}); });
  w.elev.forEach(function(e){ if(tx>e.x-8&&tx<e.x+e.w+8&&ty>e.top&&ty<e.bottom+12&&(!best||bd>10)){ best={x:e.x+e.w/2,y:e.bottom,plat:null,elev:e}; bd=0; } });
  return best||{x:tx,y:ty,free:true};
}
function tapAt(tx,ty){
  if(mode!=='play'||!world||pl.rescue) return;
  var t=resolveTap(tx,ty);
  marker={x:t.x,y:t.y,t:40,free:!!t.free};
  doTap(t);
}
/* bubbles carry you once you swim into the bottom of the column, never when a jump just flies past */
function inElevator(){ if(pl.auto) return false; for(var i=0;i<world.elev.length;i++){ var e=world.elev[i]; if(pl.x>e.x-2&&pl.x<e.x+e.w+2&&pl.y>e.top+(pl.riding?0:30)&&pl.y-pl.h<e.bottom) return true; } return false; }
function doTap(t){
  if(t.elev&&pl.onGround&&Math.abs(pl.y-t.elev.bottom)<3){ pl.walkTo=t.x; return; }
  if(pl.onGround){
    if(t.plat&&t.plat===pl.onGround&&!t.jelly){ pl.walkTo=t.x; return; }
    launchTo(t,false); return;
  }
  if(inElevator()){ pending={t:t,ttl:120}; return; }
  if(pl.airJumps>0){ launchTo(t,true); return; }
  pending={t:t,ttl:70};
}
function launchTo(t,inAir){
  var ph=world.phys, g=ph.autoG;
  function plan(tx){
    var dx=tx-pl.x, up=pl.y-t.y, rise;
    if(t.free) rise=clamp(up,14,ph.autoMax);
    else if(up<-4) rise=12;
    else rise=clamp(up+14,16,ph.autoMax);
    var Tof=function(r){ var tu=Math.sqrt(2*r/g); return t.free?tu:tu+Math.sqrt(2*Math.max(0,r-up)/g); }, T=Tof(rise);
    /* a long way across: jump higher so there is time to get there */
    while(!t.free&&Math.abs(dx)/T>ph.autoVx&&rise<ph.autoMax){ rise=Math.min(ph.autoMax,rise+6); T=Tof(rise); }
    var vy0=-Math.sqrt(2*g*rise);
    return {vx:clamp(dx/Math.max(T,1),-ph.autoVx,ph.autoVx),vy:vy0,T:T,rise:rise,dx:dx};
  }
  var tx=t.x, P=plan(tx), q=t.plat, left=q&&q.w?q.x:0;
  if(q&&q.type==='drift'){ left=q.x0+Math.sin((tick+P.T)*q.spd)*q.amp; tx=clamp(t.x+(left-q.x),left+6,left+q.w-6); P=plan(tx); }
  if(!t.free&&q&&q.w&&Math.abs(P.vx)>=ph.autoVx-1e-6){ P=plan(clamp(pl.x,left+6,left+q.w-6)); }
  /* a moving cloud that is still too far away: walk to the edge and wait for it to come closer */
  if(!inAir&&!t.free&&q&&q.type==='drift'&&Math.abs(P.vx)>=ph.autoVx-1e-6&&(t.wait=(t.wait||0)+1)<240){
    var on=pl.onGround; pending={t:t,ttl:3};
    if(on&&on.w) pl.walkTo=clamp(left+q.w/2<pl.x?on.x+6:on.x+on.w-6,on.x+6,on.x+on.w-6);
    return;
  }
  pl.vy=P.vy; pl.onGround=null; pl.coyote=0; pl.walkTo=null; pl.riding=false;
  pl.auto={vx:P.vx,g:g,free:!!t.free};
  if(Math.abs(P.dx)>1) pl.face=P.dx>0?1:-1;
  if(inAir||P.rise>ph.single){ pl.airJumps=0; SFX.magic(); addParts(pl.x,pl.y-4,14,MAGIC,1.6,26); }
  else { SFX.jump(); if(world.kind==='sea') addParts(pl.x,pl.y,4,['#c4f0ff'],.6,20,-.03); }
}

function updatePlay(){
  var w=world, ph=w.phys;
  if(marker&&--marker.t<=0) marker=null;
  if(pl.rescue){
    var r=pl.rescue; r.t++; var e=ease(Math.min(1,r.t/r.dur));
    pl.x=lerp(r.fx,r.tx,e); pl.y=lerp(r.fy,r.ty,e); w.cam=lerp(r.c0,r.c1,e); if(w.horiz) w.camX=lerp(r.cx0,r.cx1,e);
    if(r.t>=r.dur){
      var p=r.plat; pl.rescue=null; pl.onGround=p; pl.inv=50;
      if(p.type==='drift') pl.x=clamp(pl.x,p.x+6,p.x+p.w-6);
      pl.y=p.type==='arc'?(arcY(p,pl.x)||topOf(p)):p.y;
      pl.last={plat:p,x:pl.x,px:p.x||0};
      w.plats.forEach(function(q){ if(q.puff){ q.active=true; q.timer=0; q.respawn=0; } });
    }
    updateWorldThings(); return;
  }
  w.plats.forEach(function(p){
    if(p.type==='drift'){ var nx=p.x0+Math.sin(tick*p.spd)*p.amp; p.dx=nx-p.x; p.x=nx; }
    if(p.puff){
      if(p.active){ if(pl.onGround===p||p.timer>0) p.timer++; if(p.timer>80){ p.active=false; p.respawn=210; p.timer=0; SFX.poof(); addParts(p.x+p.w/2,p.y,12,['#ffffff','#e1e4ff'],1.6,24); if(pl.onGround===p) pl.onGround=null; } }
      else if(--p.respawn<=0){ p.active=true; p.timer=0; }
    }
  });
  var dir=(keys.right?1:0)-(keys.left?1:0);
  if(dir){ pl.walkTo=null; pl.auto=null; pending=null; pl.face=dir; }
  var walking=false;
  if(!dir&&pl.walkTo!=null&&pl.onGround){ var dd=pl.walkTo-pl.x; if(Math.abs(dd)<1.5){ pl.walkTo=null; pl.vx*=.3; } else { dir=dd>0?1:-1; pl.face=dir; walking=true; } }
  var target=dir*ph.speed*(walking&&Math.abs(pl.walkTo-pl.x)<8?.5:1), a=pl.onGround?ph.accel:ph.airAccel;
  if(pl.vx<target) pl.vx=Math.min(target,pl.vx+a); else if(pl.vx>target) pl.vx=Math.max(target,pl.vx-a);
  if(pl.auto) pl.vx=pl.auto.vx;
  if(pl.onGround){ pl.coyote=7; pl.airJumps=ph.airJumps; } else if(pl.coyote>0) pl.coyote--;
  if(jumpBuf>0){
    if(pl.coyote>0){ pl.vy=ph.jumpV; pl.onGround=null; pl.coyote=0; jumpBuf=0; pl.auto=null; pl.walkTo=null; pl.riding=false; SFX.jump(); if(w.kind==='sea') addParts(pl.x,pl.y,4,['#c4f0ff'],.6,20,-.03); }
    else if(pl.airJumps>0){ pl.vy=ph.airJumpV; pl.airJumps--; jumpBuf=0; pl.auto=null; pl.riding=false; SFX.magic(); addParts(pl.x,pl.y-4,14,MAGIC,1.6,26); }
    else jumpBuf--;
  }
  var inElev=inElevator();
  if(inElev){ pl.riding=true; pl.airJumps=ph.airJumps; pl.vy=Math.max(pl.vy-.45,-2.6); pl.onGround=null; pl.auto=null; pl.walkTo=null; if(tick%5===0) addParts(pl.x,pl.y-4,1,['#c4f0ff'],.3,24,-.04); }
  else if(!pl.onGround) pl.vy+=pl.auto?pl.auto.g:((keys.jump&&pl.vy<0)?ph.gravHold:ph.grav);
  w.rains.forEach(function(r){ if(!pl.onGround&&!pl.auto&&pl.x>r.x&&pl.x<r.x+r.w&&pl.y-pl.h<r.y+70&&pl.y>r.y+4) pl.vy+=.16; });
  var mf=pl.auto?7:(keys.jump?ph.maxFallHold:ph.maxFall); if(pl.vy>mf) pl.vy=mf;
  if(pl.auto&&pl.auto.free&&pl.vy>=0) pl.auto=null;
  if(pending){ if(--pending.ttl<=0) pending=null; else if(!inElev&&(pl.onGround||pl.airJumps>0)){ var pt=pending.t; pending=null; doTap(pt); } }
  var carry=(pl.onGround&&pl.onGround.dx)?pl.onGround.dx:0;
  pl.x=clamp(pl.x+pl.vx+carry,pl.w/2+2,(w.Wd||W)-pl.w/2-2);
  var prevY=pl.y;
  if(pl.onGround){
    var g0=pl.onGround;
    if(!g0.active) pl.onGround=null;
    else if(g0.type==='arc'){ var s=arcY(g0,pl.x); if(s===null) pl.onGround=null; else pl.y=s; }
    else if(!overlapX(g0)) pl.onGround=null;
    else pl.y=g0.y;
  }
  if(!pl.onGround){
    pl.y+=pl.vy;
    if(pl.vy>=0){
      for(var i=0;i<w.plats.length;i++){ var p=w.plats[i], top; if(!p.active) continue;
        if(p.type==='arc'){ top=arcY(p,pl.x); if(top===null) continue; }
        else { if(!overlapX(p)) continue; top=p.y; }
        if(prevY<=top+1&&pl.y>=top){ land(p,top); break; } }
      if(!pl.onGround) w.jellies.forEach(function(j){ var top=j.y+j.bob; if(Math.abs(pl.x-j.x)<pl.w/2+6&&prevY<=top+1&&pl.y>=top){ pl.y=top; pl.vy=ph.bounceV; pl.vx*=.3; pl.auto=null; pl.airJumps=ph.airJumps; j.squish=12; SFX.boing(); addParts(j.x,top,8,['#ffb8ea','#ffffff'],1.3,18); } });
    }
  }
  if(pl.inv>0) pl.inv--;
  updateWorldThings();
  w.items.forEach(function(it){ if(it.got) return; if(Math.abs(it.x-pl.x)<pl.w/2+5&&it.y>pl.y-pl.h-5&&it.y<pl.y+4){ it.got=true; if(w.kind==='sea'){ counts.pearls++; lvl.pearls++; } else if(w.kind==='isle'){ counts.stars=(counts.stars||0)+1; lvl.stars++; } else { counts.gems++; lvl.gems++; } SFX.ding(); addParts(it.x,it.y,6,['#fff3a6','#ffffff','#ffd0ea'],1,16); } });
  w.cps.forEach(function(c){ if(c.active) return; if(Math.abs(c.x-pl.x)<16&&Math.abs(c.y-pl.y)<18){ c.active=true; w.cp=c; SFX.save(); addParts(c.x,c.y-8,16,['#fff3a6','#ffd447','#ffffff','#ff8fb8'],1.8,30); toast('Checkpoint!','Your spot is saved.',1300); } });
  w.haz.forEach(function(h){
    if(pl.inv>0||pl.rescue) return;
    if(h.kind==='crab'){ if(Math.abs(pl.x-(h.x+10))<pl.w/2+7&&pl.y>h.y-10&&pl.y-pl.h<h.y) bump(h.x+10); return; }
    var cx=h.x+(h.kind==='puffer'?10:8), cy=h.y, nx=clamp(cx,pl.x-pl.w/2,pl.x+pl.w/2), ny=clamp(cy,pl.y-pl.h,pl.y);
    if((nx-cx)*(nx-cx)+(ny-cy)*(ny-cy)<h.r*h.r) bump(cx);
  });
  if(w.horiz) islandCams(w,false);
  else { var want=pl.onGround?pl.y-VH*.62:w.cam, head=pl.y-pl.h-VH*.12;
  if(head<want) want=head;
  w.cam+=(want-w.cam)*.1; w.cam=clamp(w.cam,0,w.H-VH); }
  if(w.surface!=null&&pl.y-pl.h<w.surface&&mode==='play'){ completeLevel(); SFX.splash(); if(LEVELS[w.idx].tier===4) setMode('worldwin'); else { setMode('cutscene'); cut=0; } return; }
  if(w.horiz){ if(pl.y-pl.h*.4>w.waterY){ addParts(pl.x,w.waterY,12,['#ffffff','#bfe8ff'],1.6,22); noise(.2,.06); startRescue(); } return; }
  if(diff===0&&!pl.onGround&&!inElev&&pl.vy>0&&pl.last&&pl.last.plat&&pl.last.plat.type!=='floor'&&pl.y>topOf(pl.last.plat)+30){ startRescue(); return; }
  if(pl.y-pl.h>w.cam+VH+12) startRescue();
}
function updateWorldThings(){
  var w=world;
  w.jellies.forEach(function(j){ j.bob=Math.round(Math.sin(tick/40+j.x)*2); if(j.squish>0) j.squish--; });
  w.haz.forEach(function(h){ h.x+=h.dir*h.spd; if(h.x>h.x1){ h.x=h.x1; h.dir=-1; } if(h.x<h.x0){ h.x=h.x0; h.dir=1; } if(h.kind!=='crab') h.y=h.y0+Math.sin(tick/34+h.ph)*5; });
  for(var i=parts.length-1;i>=0;i--){ var q=parts[i]; q.x+=q.vx; q.y+=q.vy; q.vy+=q.grav; q.vx*=.96; q.vy*=.96; if(--q.life<=0) parts.splice(i,1); }
  if(fairy&&pl){ var fx=pl.x-pl.face*20, fy=pl.y-pl.h-22+Math.sin(tick/14)*3; fairy.x+=(fx-fairy.x)*.07; fairy.y+=(fy-fairy.y)*.07; if(tick%18===0) parts.push({x:fairy.x+(pl.face>0?6:0),y:fairy.y+8,vx:0,vy:.25,life:22,max:22,col:'#fff3a6',grav:0}); }
}
function completeLevel(){
  var i=world.idx; save.done[i]=true; if(i+1<LEVELS.length&&save.reached<i+1) save.reached=i+1;
  if(i>=4) save.hardUnlocked=true;
  persist();
}

/* ---------- drawing the level ---------- */
var stageEl=document.getElementById('stage'), fit=document.getElementById('fit'), screenEl=document.getElementById('screen'), cv=document.getElementById('game'), g=cv.getContext('2d');
var scn={};
function drawPlay(){
  var w=world, th=w.th, cam=Math.round(w.cam);
  g.drawImage(w.bg,0,cam,W,VH,0,0,W,VH);
  var sy=function(y){ return Math.round(y-cam); };
  if(w.kind==='sea'){
    var fishC=['#7fd3ff','#ffb36b','#ffd75e','#c9b6ff','#ff9fd0'];
    for(var i=0;i<7;i++){ var fy=w.floorY-90-i*180, fx=((tick*(.4+(i%3)*.2)+i*130)%380)-30, yy=sy(fy); if(yy<-6||yy>VH+6) continue; g.fillStyle=fishC[i%5]; g.fillRect(fx+1,yy,4,3); g.fillRect(fx-1,yy-1,1,5); g.fillRect(fx,yy,1,3); g.fillStyle=OUT; g.fillRect(fx+4,yy+1,1,1); }
    w.elev.forEach(function(e){ var hgt=e.bottom-e.top; for(var k=0;k<14;k++){ var by=e.bottom-((tick*1.4+k*13)%hgt), bx=e.x+4+Math.round(Math.sin((tick/20)+k)*3)+(k%3)*2, yy=sy(by); if(yy>-6&&yy<VH) put(g,'bub'+(k%3),(function(n){return function(){return bubblePix(n);};})(k%3),bx,yy); } });
    for(i=0;i<10;i++){ var ay=w.floorY-((tick*.6+i*121)%w.H), ax=(i*61)%300+10, ay2=sy(ay); if(ay2>-4&&ay2<VH){ g.fillStyle='#e6f9ff'; g.fillRect(ax+Math.round(Math.sin(tick/25+i)*2),ay2,1,1); } }
  } else {
    if(th.decor==='night') for(i=0;i<8;i++){ if((tick+i*23)%60<16){ sparkle(g,(i*97+30)%300+10,((i*53+tick*0)%VH),1,'#fff4fb'); } }
    if(th.decor==='vine') for(i=0;i<3;i++){ var bxx=(tick*.5+i*120)%360-20, byy=40+i*50+Math.sin(tick/9+i)*8; var wing=(tick>>2)%2; g.fillStyle=['#ff9fd0','#ffd447','#b39bff'][i]; g.fillRect(bxx-2-wing,byy-1,2,3); g.fillRect(bxx+1+wing,byy-1,2,3); g.fillStyle=OUT; g.fillRect(bxx,byy-1,1,3); }
    if(th.decor==='snow'){ g.fillStyle='#ffffff'; for(i=0;i<26;i++){ var sx3=Math.round((i*53+Math.sin(tick/40+i)*8+tick*.15)%W), sy3=Math.round((i*37+tick*(.25+(i%4)*.08))%(VH+10))-5; g.fillRect(sx3,sy3,i%5===0?2:1,i%5===0?2:1); } }
    if(th.decor==='candy') for(i=0;i<6;i++){ var cx2=(i*61+20)%300, cy2=((tick*.3+i*40)%(VH+20))-10; g.fillStyle=['#ff6f9f','#ffd447','#6fd0ff','#7fe08a','#b39bff','#ffffff'][i]; g.fillRect(cx2,cy2,2,1); }
    w.plats.forEach(function(p){ if(p.type!=='bouncy') return; var yy=sy(p.y); if(yy>-10&&yy<VH+10&&(tick>>4)%3===0){ g.fillStyle='#c4609e'; g.fillRect(p.x+Math.round(p.w*.25),yy-9,1,3); g.fillRect(p.x+Math.round(p.w/2),yy-11,1,3); g.fillRect(p.x+Math.round(p.w*.75),yy-9,1,3); } });
    g.fillStyle='#5f8fe6';
    w.rains.forEach(function(r){ for(var k=0;k<12;k++){ var rx=r.x+3+(k*7)%(r.w-4), ry=sy(r.y+8)+((tick*1.2+k*9)%64); if(ry>-2&&ry<VH) g.fillRect(rx,ry,1,2); } });
  }
  w.plats.forEach(function(p){
    if(!p.active) return;
    if(p.type==='drift'||p.puff){
      var a=platArt(th,p), yy=sy(p.y+a.dy); if(yy<-24||yy>VH) return;
      var shake=p.puff&&p.timer>45?((tick>>1)%2?1:-1):0; if(p.puff&&p.timer>60&&(tick>>2)%2) return;
      put(g,a.key,a.make,p.x+a.dx+shake,yy);
      if(p.type==='drift'&&w.kind==='sky'){ g.fillStyle=OUT; var ax2=Math.round(p.x), ay3=sy(p.y)+3; for(var k=0;k<3;k++){ g.fillRect(ax2-6+k,ay3-k,1,2*k+1); g.fillRect(ax2+p.w+5-k,ay3-k,1,2*k+1); } }
    }
  });
  if(w.goal){ var gy=sy(w.goal.y); if((gy>-40&&gy<VH+10)||mode!=='play'){ for(var k2=0;k2<5;k2++) if((tick+k2*9)%30<12) sparkle(g,w.goal.x+8+k2*(w.goal.w-16)/4,gy-8-(k2%2)*6,1,'#fff3a6'); drawGoalThing(Math.round(w.goal.x+w.goal.w/2),gy); } }
  w.items.forEach(function(it){ if(it.got) return; var yy=sy(it.y)+(((tick>>3)+it.ph)%8<4?0:-1); if(yy<-10||yy>VH+4) return; if(w.kind==='sea') put(g,'pearl',pearlPix,it.x-3,yy-3); else { put(g,'gem',gemPix,it.x-5,yy-5); if(((tick>>2)+it.ph)%24===0) sparkle(g,it.x+3,yy-4,1); } });
  w.cps.forEach(function(c){ var yy=sy(c.y); if(yy<-30||yy>VH+10) return;
    if(w.kind==='sea'){ if(c.active){ glow(g,c.x,yy-7,11+((tick>>4)%2),'#fff0b8',tick>>3); put(g,'chestO',chestOpenPix,c.x-8,yy-15); if((tick>>3)%4===0) sparkle(g,c.x-4+((tick>>5)%3)*4,yy-18,1); } else put(g,'chest',chestPix,c.x-8,yy-13); }
    else { put(g,c.active?'flagOn':'flagOff',function(){return flagPix(c.active);},c.x-2,yy-20); if(c.active&&(tick>>3)%4===0) sparkle(g,c.x+8,yy-22,1); }
  });
  w.jellies.forEach(function(j){ var yy=sy(j.y+j.bob); if(yy<-20||yy>VH) return; var f=(tick>>3)%4; put(g,'jelly'+f,function(){return jellyPix(f);},j.x-8,yy-1+(j.squish>6?2:0)); });
  w.haz.forEach(function(h){ var yy=sy(h.y); if(yy<-20||yy>VH+20) return; var f=(tick>>3)%2;
    if(h.kind==='puffer'){ if(h.dir>0) put(g,'pufferR',function(){return flipped(pufferPix());},h.x,yy-9); else put(g,'puffer',pufferPix,h.x,yy-9); }
    else if(h.kind==='crab') put(g,'crab'+f,function(){return crabPix(f);},h.x,yy-14);
    else if(h.kind==='bee'){ if(h.dir>0) put(g,'bee'+f,function(){return beePix(f);},h.x,yy-7); else put(g,'beeL'+f,function(){return flipped(beePix(f));},h.x,yy-7); }
    else if(h.kind==='owl') put(g,'owl'+f,function(){return owlPix(f);},h.x,yy-8);
    else if(h.kind==='snowbird'){ if(h.dir>0) put(g,'sbird'+f,function(){return snowBirdPix(f);},h.x,yy-6); else put(g,'sbirdL'+f,function(){return flipped(snowBirdPix(f));},h.x,yy-6); }
    else { if(h.dir>0) put(g,'bird'+f,function(){return birdPix(f);},h.x,yy-6); else put(g,'birdL'+f,function(){return flipped(birdPix(f));},h.x,yy-6); }
  });
  if(marker){ var mx=Math.round(marker.x), my=sy(marker.y), mr=marker.free?3:5+((marker.t>>2)%2); g.fillStyle=marker.free?'#ffffff':'#fff3a6';
    for(var a2=0;a2<16;a2++){ var an=a2/16*Math.PI*2; g.fillRect(Math.round(mx+Math.cos(an)*mr*1.6),Math.round(my-2+Math.sin(an)*mr*.6),1,1); }
    if(!marker.free){ var bob=(marker.t>>3)%2; g.fillStyle=OUT; for(var k3=0;k3<4;k3++) g.fillRect(mx-3+k3,my-14+k3+bob,7-k3*2,1); g.fillStyle='#fff3a6'; for(k3=0;k3<3;k3++) g.fillRect(mx-2+k3,my-14+k3+bob,5-k3*2,1); }
  }
  drawPlayer(cam);
  if(fairy){ var ff=(tick>>2)%2; if(pl.face<0) put(g,'fairyL'+ff,function(){return flipped(fairyPix(ff));},fairy.x-7,sy(fairy.y)-6); else put(g,'fairy'+ff,function(){return fairyPix(ff);},fairy.x-7,sy(fairy.y)-6); }
  parts.forEach(function(q){ var yy=Math.round(q.y-cam); if(q.max>=24&&q.life>q.max*.5) sparkle(g,q.x,yy,1,q.col); else { g.fillStyle=q.col; g.fillRect(Math.round(q.x),yy,1,1); } });
  hud();
}
function drawPlayer(cam,camX){
  if(pl.inv>0&&!pl.rescue&&(tick>>2)%2===0) return;
  var x=Math.round(pl.x-(camX||0)), y=Math.round(pl.y-cam);
  if(world.kind==='isle'){
    var fr=pl.onGround?(tick>>4)%2:(tick>>2)%3;
    if(pl.face<0) put(g,'fbigL'+fr,function(){return flipped(fairyBigPix(fr));},x-14,y-23); else put(g,'fbig'+fr,function(){return fairyBigPix(fr);},x-14,y-23);
  } else if(world.kind==='sea'){
    var moving=Math.abs(pl.vx)>.3||!pl.onGround, fl=moving&&(tick>>3)%2===1, idle=!moving&&(tick>>5)%2;
    put(g,fl?'merB':'merA',function(){return mermaidPix(0,fl);},x-8,y-29-(idle?1:0));
  } else {
    var walk=pl.onGround&&Math.abs(pl.vx)>.3&&(tick>>3)%2;
    if(pl.face<0) put(g,'rideL',function(){return flipped(riderPix());},x-22,y-42-(walk?1:0));
    else put(g,'rideR',function(){return riderPix();},x-22,y-42-(walk?1:0));
  }
  if(pl.rescue) ring(g,x,y-pl.h/2-2,world.kind==='sky'?28:18,tick>>2);
}
function hud(){
  var n=world.kind==='sea'?lvl.pearls:world.kind==='isle'?lvl.stars:lvl.gems;
  g.fillStyle=OUT; g.fillRect(4,4,38,15);
  if(world.kind==='isle'){ put(g,'star',starPix,6,6); text(g,'x'+n,18,9,'#fff6ea');
    var bx=110, bw=100, fr2=clamp(pl.x/world.Wd,0,1); g.fillStyle=OUT; g.fillRect(bx-2,6,bw+4,7); g.fillStyle='#e9e4ff'; g.fillRect(bx,8,bw,3); g.fillStyle='#ffd447'; g.fillRect(bx,8,Math.round(bw*fr2),3);
    g.fillStyle=OUT; g.fillRect(bx+Math.round(bw*fr2)-3,4,7,11); g.fillStyle='#ffe066'; g.fillRect(bx+Math.round(bw*fr2)-2,5,5,5); g.fillStyle='#ffd8bf'; g.fillRect(bx+Math.round(bw*fr2)-1,7,3,3);
    put(g,LEVELS[world.idx].rescue?'key':'key',keyPix,bx+bw+4,6); return; }
  if(world.kind==='sea'){ put(g,'pearl',pearlPix,8,8); text(g,'x'+n,17,9,'#fff6ea'); }
  else { put(g,'gem',gemPix,6,6); text(g,'x'+n,18,9,'#fff6ea'); }
  var frac=clamp((world.floorY-pl.y)/(world.floorY-world.goalY),0,1), x=306, top=44, H=Math.min(80,VH-70);
  g.fillStyle=OUT; g.fillRect(x,top-2,7,H+4); g.fillStyle='#e9e4ff'; g.fillRect(x+2,top,3,H);
  var fy=top+Math.round(H*(1-frac)); g.fillStyle='#ffd447'; g.fillRect(x+2,fy,3,top+H-fy);
  g.fillStyle=OUT; g.fillRect(x-2,fy-3,11,7); g.fillStyle=HAIRS[picks.hair].h; g.fillRect(x-1,fy-2,9,5); g.fillStyle='#ffd8bf'; g.fillRect(x+2,fy-1,3,3);
  g.fillStyle=OUT; g.fillRect(x-1,top-12,9,9); g.fillStyle='#ffd447'; g.fillRect(x,top-11,7,7); g.fillStyle='#fff3b0'; g.fillRect(x+2,top-9,3,3);
}

