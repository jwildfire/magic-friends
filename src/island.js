
/* ---------- the fairy, the witch and the things she takes ---------- */
var FAIRY_BODY=MER.slice(0,12).concat(["...hddddddh...","..sdDddddDds..","..sddddddddss.","...dddddddd...","..ddDddddDdd..",".dddddddddddd.","dDddddddddddDd","....ss..ss....","....pp..pp...."]);
function fairyBigPix(f){
  var p=new Pix(28,25), wc='#e2f8ff', wi='#bfeeff', wo='#6fbfe0';
  var wy=f===1?10:f===2?14:12, wr=f===1?7.5:f===2?5:6.5;
  var wings=new Pix(28,25);
  wings.ell(4.5,wy,4.5,wr,wc); wings.ell(5,wy,2.5,wr-2.5,wi); wings.ell(5.5,19,3,2.6,wc);
  wings.ell(22.5,wy,4.5,wr,wc); wings.ell(22,wy,2.5,wr-2.5,wi); wings.ell(21.5,19,3,2.6,wc);
  wings.outline(wo); p.stamp(wings,0,0);
  var body=fromRows(FAIRY_BODY,Object.assign({},SKIN,{h:'#ffe066',H:'#e0b030',l:'#fff3b0',y:'#ff8fc8',d:'#c9a7ff',D:'#a983ff',p:'#ff8fc8'}));
  var b2=new Pix(28,25); b2.stamp(body,7,2); b2.line(21,16,24,11,'#fff6ea'); b2.outline(OUT);
  p.stamp(b2,0,0);
  p.px(24,8,'#ffd447'); p.px(23,9,'#ffd447'); p.px(24,9,'#fff3a6'); p.px(25,9,'#ffd447'); p.px(24,10,'#ffd447');
  return pad(p,1);
}
function witchPix(f){
  var p=new Pix(32,30), Y=function(v){ return v+5; };
  p.line(3,Y(20),30,Y(16),'#8a552a'); p.line(3,Y(21),30,Y(17),'#6a3f1e');
  p.poly([[0,Y(17)],[7,Y(19)],[7,Y(24)],[0,Y(26)]],'#e8b84a'); p.line(1,Y(19),6,Y(21),'#c48a2a'); p.line(1,Y(24),6,Y(22),'#c48a2a');
  p.poly([[11,Y(10)],[3,Y(f?13:15)],[5,Y(f?18:20)],[12,Y(17)]],'#5a2a8a');
  p.poly([[11,Y(9)],[18,Y(9)],[20,Y(18)],[10,Y(18)]],'#7a3fb0');
  p.rect(19,Y(18),4,2,'#3a2050'); p.px(23,Y(17),'#3a2050');
  p.line(17,Y(12),22,Y(14),'#7a3fb0'); p.line(17,Y(13),22,Y(15),'#7a3fb0'); p.ell(23.5,Y(14.5),1.6,1.6,'#9be08a');
  p.ell(12,Y(7),3.2,4.4,'#3a2050');
  p.ell(15.5,Y(6),3.4,3.4,'#9be08a'); p.px(19,Y(6),'#7cc86a'); p.px(20,Y(7),'#7cc86a');
  p.px(16,Y(5),OUT); p.px(16,Y(8),'#5a2a3a'); p.px(17,Y(8),'#5a2a3a'); p.px(15,Y(7),'#ff9db0');
  p.rect(10,Y(2),10,2,'#5a2a8a'); p.poly([[12,Y(2)],[18,Y(2)],[10,Y(-4)]],'#5a2a8a'); p.rect(12,Y(1),6,1,'#ffd447'); p.px(14,Y(-1),'#ffd447');
  return pad(p,1).outline(OUT);
}
function starPix(){ var p=new Pix(9,9); p.poly(starPts(4.5,5,4.8,2.1),'#ffe14d'); p.px(4,3,'#fff7c2'); p.px(3,4,'#fff7c2'); return pad(p,1).outline(OUT); }
function tiaraPix(){ return pad(fromRows(["y...y...y","yy.yry.yy","yyyyyyyyy","ypyybyypy"],{y:'#ffd447',r:'#ff6f9f',b:'#6fd0ff',p:'#ff8fc8'}),1).outline(OUT); }
function keyPix(){ var p=new Pix(15,7); p.ell(3.5,3.5,3.5,3.5,'#ffd447'); p.ell(3.5,3.5,1.4,1.4,null); p.rect(7,2,8,2,'#ffd447'); p.rect(11,4,1,2,'#ffd447'); p.rect(13,4,2,3,'#ffd447'); p.px(2,1,'#fff3b0'); p.rect(8,2,6,1,'#fff3b0'); return pad(p,1).outline('#8a5a10'); }
function sunbeamPix(){ var p=new Pix(15,15); p.ell(7.5,7.5,5,5,'#ffd447'); p.ell(7.5,7.5,3.4,3.4,'#ffe98a'); p.ell(6.5,6.5,1.5,1.5,'#fffbe0'); [[7,0],[7,14],[0,7],[14,7],[2,2],[12,2],[2,12],[12,12]].forEach(function(q){ p.px(q[0],q[1],'#ffe98a'); }); return pad(p,1).outline('#c98a1a'); }
function cagePix(){
  var p=new Pix(46,44); p.stamp(withPicks({wings:'no'},function(){ return unicornPix(false); }),4,7);
  var bar='#cfb46a', hi='#f2dc96';
  p.ell(23,9,22,7,'#cfb46a',function(x,y){ return y<9&&((x%5===0)||y<4); });
  for(var x=1;x<46;x+=5){ p.rect(x,8,1,33,bar); p.px(x,10,hi); }
  p.rect(0,8,46,2,bar); p.rect(0,40,46,4,'#8a6a2a'); p.rect(0,40,46,1,'#b58a3a'); p.rect(21,0,4,3,bar); p.px(23,1,null);
  return pad(p,1).outline('#4a3a14');
}
function lanternPix(on){ var p=new Pix(8,16); p.rect(3,6,2,10,'#8a552a'); p.rect(1,1,6,6,on?'#ffe066':'#d8d2c0'); p.rect(0,0,8,1,'#5a3a20'); p.rect(0,6,8,1,'#5a3a20'); p.rect(3,2,2,3,on?'#fff6c8':'#bdb6a2'); return pad(p,1).outline(OUT); }
function mushPix(w){ var p=new Pix(w,13); p.ell(w/2,6,w/2,6,'#ff5a6e',function(x,y){ return y<=6; }); p.rect(1,6,w-2,1,'#e0405a'); p.rect(Math.round(w/2)-3,7,6,6,'#fff1dc'); [[4,3],[w-6,2],[Math.round(w/2),1],[Math.round(w/2)-4,5],[w-9,5]].forEach(function(q){ p.px(q[0],q[1],'#ffffff'); p.px(q[0]+1,q[1],'#ffffff'); }); return pad(p,1).outline('#7a2030'); }
function logPix(w){ var p=new Pix(w,8); p.rect(2,1,w-4,6,'#a0623e'); p.ell(2.5,4,2.5,3.5,'#c98a5a'); p.ell(w-2.5,4,2.5,3.5,'#8a4a2a'); p.rect(2,1,w-4,1,'#c98a5a'); for(var x=7;x<w-4;x+=9) p.px(x,4,'#7a4a2a'); return pad(p,1).outline('#4a2a14'); }
function branchPix(w){ var p=new Pix(w,8); p.rect(0,2,w,4,'#8a552a'); p.rect(0,2,w,1,'#b07a44'); p.rect(0,5,w,1,'#6a3f1e'); p.ell(w-3,2,5,3,'#5fca6e'); p.ell(4,2,4,2.5,'#4cb35e'); for(var x=6;x<w-6;x+=7) p.px(x,1,'#5fca6e'); return pad(p,1).outline('#3a2410'); }
function frondPix(w){ var p=new Pix(w,8); for(var i=0;i<5;i++){ var cx=w*(i+.5)/5; p.ell(cx,3.5,w/7+1.5,2.6,i%2?'#4cc36a':'#6fd17f'); } p.line(2,4,w-3,4,'#2f8f4a'); p.ell(w/2-3,6,2,1.8,'#8a5a2a'); p.ell(w/2+2,6,2,1.8,'#7a4a20'); return pad(p,1).outline('#22603a'); }
function parrotPix(f){
  var p=new Pix(15,11),b='#ff5a4f',B='#3fb0ff';
  p.ell(7,6.5,5,3.5,b); p.ell(6.5,8,3,1.8,'#ffd447'); p.ell(11,4.5,2.6,2.5,b);
  p.px(14,4,OUT); p.px(14,5,'#ffd8bf'); p.px(12,3,OUT); p.ell(11,5,1,1,'#ffffff');
  p.poly([[3,5],[0,2],[0,9]],'#3fd07a');
  if(f%2) p.poly([[4,6],[9,6],[6,.5]],B); else p.poly([[4,6],[9,6],[6,10.5]],B);
  return pad(p,1).outline(OUT);
}
FLYERS.parrot=1;
PARADE.palm=['crab','parrot','fish']; PARADE.grove=['bee','parrot'];
var critterPix0=critterPix;
critterPix=function(kind,i){ return kind==='parrot'?parrotPix(i%2):critterPix0(kind,i); };

/* ---------- Fairy Island: levels that scroll sideways ---------- */
function genIsland(def){
  var palm=def.theme==='palm', R=rng(def.seed), tt=Math.min(4,def.tier||0), H=240, wy=222;
  var L={horiz:true,H:H,waterY:wy,plats:[],arcs:[],jellies:[],elev:[],haz:[],rains:[],cps:[],items:[],path:[],trees:[],goal:null,surface:null};
  function rr(a,b){ return a+R()*(b-a); }
  function item(x,y){ L.items.push({x:Math.round(x),y:Math.round(y)}); }
  var start={x:0,y:200,w:120,type:'plat',ground:true}; L.plats.push(start); L.floorP=start;
  var cur=start, n=0, sinceCp=0, sinceHaz=1, target=1300+tt*240+(palm?0:180), maxGap=40+tt*3;
  while(cur.x+cur.w<target){
    n++; sinceCp++; sinceHaz++;
    var prev=cur, r=R(), kind;
    if(n>2&&r<.14&&cur.y>150) kind='mush';
    else if(r<.36&&cur.y>150) kind='ground';
    else if(r<.48&&cur.y>160) kind='log';
    else kind='tree';
    var gap=Math.round(rr(14,maxGap)), p;
    if(kind==='ground'){ var gw=Math.round(rr(76-tt*4,124-tt*6)); p={x:cur.x+cur.w+gap,y:Math.round(rr(194,206)),w:gw,type:'plat',ground:true}; }
    else if(kind==='log'){ var lw=Math.round(rr(42,54)), amp=Math.round(rr(10,18)); p={x:cur.x+cur.w+gap+amp,y:wy-5,w:lw,type:'drift',amp:amp,spd:.016+R()*.008,log:true}; p.x0=p.x; }
    else if(kind==='mush'){
      var mw=22, mx=cur.x+cur.w+Math.round(rr(12,26)), m={x:mx,y:202,w:mw,type:'bouncy'}; L.plats.push(m); L.path.push([cur,m,'bounce']);
      L.trees.push({kind:'rock',x:mx+mw/2,y:202});
      var tw=Math.round(rr(40,52)); p={x:Math.round(mx+mw/2-tw/2+rr(-10,10)),y:Math.round(202-rr(78,92)),w:tw,type:'plat',tree:true};
      L.plats.push(p); L.path.push([m,p,'bounced']); item(mx+mw/2,150); item(mx+mw/2,124);
      L.trees.push({kind:palm?'palm':'oak',p:p,side:R()<.5}); cur=p; item(p.x+p.w/2,p.y-12); continue;
    }
    else { var bw=Math.round(rr(38-tt,52-tt)); p={x:cur.x+cur.w+gap,y:Math.round(clamp(cur.y-rr(-34,40),84,190)),w:bw,type:'plat',tree:true}; L.trees.push({kind:palm?'palm':'oak',p:p,side:R()<.5}); }
    L.plats.push(p); L.path.push([cur,p,'jump']); cur=p;
    item(p.x+p.w/2,p.y-12); if(p.ground&&p.w>100) item(p.x+p.w/2+20,p.y-12);
    if(p.ground&&p.w>=90&&R()<.6) L.haz.push({kind:'crab',x0:p.x+6,x1:p.x+p.w-26,y:p.y,hardOnly:R()<.4});
    if(sinceHaz>=6-Math.floor(tt/2)&&prev.type==='plat'&&!prev.log){ var l=prev.x+prev.w, rx=p.x; if(rx-l>=16){ L.haz.push({kind:palm?'parrot':(R()<.5?'bee':'parrot'),x0:Math.round(l-6),x1:Math.round(Math.max(l-6,rx+6-18)),y:Math.round((prev.y+p.y)/2-18),hardOnly:false}); sinceHaz=0; } }
    else if(sinceHaz===3&&prev.type==='plat'&&!prev.log){ var l2=prev.x+prev.w, r2=p.x; if(r2-l2>=16) L.haz.push({kind:'bee',x0:Math.round(l2-6),x1:Math.round(Math.max(l2-6,r2+6-18)),y:Math.round((prev.y+p.y)/2-18),hardOnly:true}); }
    if(sinceCp>=5&&p.type==='plat'&&!p.log){ L.cps.push({x:Math.round(p.x+p.w/2),y:p.y,keep:L.cps.length%2===1,plat:p}); p.cp=true; sinceCp=0; }
  }
  var goal={x:cur.x+cur.w+Math.round(rr(18,34)),y:200,w:130,type:'goal',ground:true}; L.plats.push(goal); L.path.push([cur,goal,'jump']); L.goal=goal;
  L.Wd=goal.x+goal.w+40;
  return L;
}
var ISLE_LOOK={
  palm:{sky:['#6cc4ff','#8fd4ff','#b9e6ff','#e4f6ff'],far:'#7fc6c8',farTop:'#5fae7a',water:['#5fd8e0','#3fbccc','#2ea0b8'],top:'#f6dca6',soil:'#e6c189',soil2:'#d9ad6a'},
  grove:{sky:['#9fd8f0','#b8e6e4','#d4f0d8','#ecf8e0'],far:'#8fc8a8',farTop:'#6aae84',water:['#5ac8d0','#3eaebc','#2f94a8'],top:'#6fd17f',soil:'#a0703f',soil2:'#8a5a30'}
};
function islandLayers(w){
  var lk=ISLE_LOOK[w.th.key], H=w.H, Wd=w.Wd, wy=w.waterY, p=new Pix(Wd,H);
  w.trees.forEach(function(t){
    if(t.kind==='rock'){ p.ell(t.x,t.y+10,12,10,'#8a8f9e'); p.ell(t.x-3,t.y+6,6,4,'#a9aebd'); return; }
    var q=t.p, cx=Math.round(q.x+q.w/2);
    if(t.kind==='palm'){
      var bend=t.side?14:-14, top=q.y+3;
      for(var y=top;y<wy+2;y++){ var u=(y-top)/(wy-top), x=Math.round(cx+bend*u*u); p.rect(x-2,y,5,1,((y>>2)&1)?'#b5773f':'#9a6232'); p.px(x-3,y,'#6a3f1e'); p.px(x+3,y,'#6a3f1e'); }
      p.ell(cx+bend,wy+1,15,6,lk.top); p.ell(cx+bend,wy+3,15,5,lk.soil);
    } else {
      var tx=t.side?q.x-4:q.x+q.w-4, ct=q.y-28;
      p.ell(tx+4,ct,26,16,'#3f9a58'); p.ell(tx-8,ct-6,14,10,'#4cb366'); p.ell(tx+16,ct-4,14,10,'#4cb366'); p.ell(tx+4,ct-10,12,8,'#6fd17f');
      for(var y2=ct+6;y2<wy+2;y2++){ p.rect(tx,y2,9,1,'#7a4a2a'); p.px(tx,y2,'#5e3820'); p.px(tx+8,y2,'#5e3820'); if((y2*7)%11===0) p.px(tx+3,y2,'#5e3820'); }
      p.poly([[tx-4,wy+2],[tx,wy-8],[tx+9,wy-8],[tx+13,wy+2]],'#7a4a2a');
    }
  });
  w.plats.forEach(function(q){
    if(q.ground){ p.ell(q.x+6,q.y+10,8,10,lk.soil); p.ell(q.x+q.w-6,q.y+10,8,10,lk.soil); p.rect(q.x+2,q.y+1,q.w-4,wy+4-q.y,lk.soil); for(var x=q.x+2;x<q.x+q.w-2;x++){ p.px(x,q.y,lk.top); p.px(x,q.y+1,lk.top); if((x*13)%7===0) p.px(x,q.y+2,lk.soil2); } p.rect(q.x,q.y,q.w,1,lk.top);
      if(w.th.key==='grove'){ for(x=q.x+4;x<q.x+q.w-4;x+=9){ p.px(x,q.y-1,'#4cb35e'); p.px(x+1,q.y-2,'#4cb35e'); } } else { for(x=q.x+8;x<q.x+q.w-8;x+=23){ p.px(x,q.y+4,'#ff8fb0'); p.px(x+1,q.y+4,'#ffb3c8'); } }
      if(q.type==='goal') p.stamp(new Pix(1,1),0,0);
    }
    else if(q.type==='plat'){ p.stamp(w.th.key==='palm'?frondPix(q.w):branchPix(q.w),q.x-1,q.y-2); }
    else if(q.type==='bouncy'){ p.stamp(mushPix(q.w),q.x-1,q.y-1); }
  });
  return p.canvas();
}
function islandSky(w){
  var key='isky'+w.th.key+VH; if(scn[key]) return scn[key];
  var lk=ISLE_LOOK[w.th.key], p=new Pix(W,VH); vgrad(p,0,0,W,VH,lk.sky);
  if(w.th.key==='palm'){ p.ell(262,26,16,16,'#fff3b0'); p.ell(262,26,12,12,'#ffffff'); } else { for(var y=0;y<VH;y++) for(var x=0;x<W;x++) if(((x+y*2)%46<5)&&bayer(x,y)<.35*(1-y/VH)) p.px(x,y,'#ffffff'); }
  [[40,30,22],[150,18,16],[230,48,20]].forEach(function(c){ p.ell(c[0],c[1],c[2],c[2]*.35,'#ffffff'); p.ell(c[0]-c[2]*.4,c[1]-3,c[2]*.5,c[2]*.3,'#ffffff'); });
  scn[key]=p.canvas(); return scn[key];
}
function islandFar(w){
  var key='ifar'+w.th.key; if(scn[key]) return scn[key];
  var lk=ISLE_LOOK[w.th.key], p=new Pix(640,w.H), base=w.waterY-2;
  for(var i=0;i<5;i++){ var cx=i*130+40, rw=40+(i*17)%30, rh=14+(i*11)%14; p.ell(cx,base,rw,rh,lk.far,function(x,y){ return y<=base; });
    if(w.th.key==='palm'){ for(var k=0;k<2;k++){ var px=cx-10+k*22; p.rect(px,base-rh-14,2,14,lk.farTop); p.ell(px,base-rh-15,7,2.5,lk.farTop); } }
    else { for(var k2=0;k2<4;k2++) p.ell(cx-24+k2*16,base-rh-4,9,9,lk.farTop); } }
  scn[key]=p.canvas(); return scn[key];
}
function buildIsland(idx){
  var def=LEVELS[idx], th=THEMES[def.theme], L=genIsland(def);
  var w={idx:idx,def:def,th:th,kind:'isle',horiz:true,H:L.H,Wd:L.Wd,waterY:L.waterY,floorY:L.waterY,plats:[],jellies:[],elev:[],haz:[],rains:[],items:[],cps:[],path:L.path,goal:L.goal,surface:null,trees:L.trees,cam:0,camX:0};
  w.phys=PHYS.isle;
  L.plats.forEach(function(p){ p.active=true; p.dx=0; w.plats.push(p); });
  w.floor=L.floorP;
  L.haz.forEach(function(h,i){ if(h.hardOnly&&!hard) return; var span=Math.max(1,h.x1-h.x0); w.haz.push({kind:h.kind,x0:h.x0,x1:h.x1,x:h.x0+((i*37)%span),y0:h.y,y:h.y,dir:i%2?-1:1,spd:(hard?.95:.5)*(h.kind==='crab'?.8:1),ph:i*1.7,r:7}); });
  L.items.forEach(function(it){ w.items.push({x:it.x,y:it.y,got:false,ph:(it.x*7+it.y)%16}); });
  L.cps.forEach(function(c,i){ if(hard&&!c.keep) return; w.cps.push({x:c.x,y:c.y,plat:c.plat,active:false,idx:i}); });
  w.start={x:40,y:L.floorP.y,plat:L.floorP,idx:-1}; w.cp=w.start; w.goalY=0;
  w.bg=TEST&&window.__noBg?document.createElement('canvas'):islandLayers(w);
  return w;
}
function islandCams(w,snap){
  var tx=clamp(pl.x-W*.4,0,Math.max(0,w.Wd-W)), ty;
  if(VH>=w.H) ty=w.H-VH; else { ty=pl.onGround?pl.y-VH*.62:w.cam; var head=pl.y-pl.h-VH*.14; if(head<ty) ty=head; ty=clamp(ty,0,w.H-VH); }
  if(snap){ w.camX=tx; w.cam=ty; } else { w.camX+=(tx-w.camX)*.12; w.cam+=(ty-w.cam)*.1; }
}
function drawIsland(){
  var w=world, lk=ISLE_LOOK[w.th.key], cx=Math.round(w.camX), cy=Math.round(w.cam);
  g.drawImage(islandSky(w),0,0);
  var far=islandFar(w), fo=-Math.round(cx*.3)%640; g.drawImage(far,fo,-cy); g.drawImage(far,fo+640,-cy);
  var wsy=w.waterY-cy; g.fillStyle=lk.water[1]; g.fillRect(0,wsy,W,VH-wsy); g.fillStyle=lk.water[2]; g.fillRect(0,wsy+10,W,VH-wsy-10);
  var sy0=Math.max(0,cy), dy0=sy0-cy, hh=Math.min(w.H-sy0,VH-dy0); if(hh>0) g.drawImage(w.bg,cx,sy0,W,hh,0,dy0,W,hh);
  g.fillStyle=lk.water[0]; for(var x=0;x<W;x++){ var yy=wsy+Math.round(Math.sin((x+cx)/9+tick/20)*1.3); g.fillRect(x,yy,1,2); if(((x+cx+(tick>>2))%37)<3){ g.fillStyle='#ffffff'; g.fillRect(x,yy,1,1); g.fillStyle=lk.water[0]; } }
  var SX=function(x){ return Math.round(x-cx); }, SY=function(y){ return Math.round(y-cy); };
  w.plats.forEach(function(p){ if(p.type==='drift'){ var xx=SX(p.x); if(xx<-60||xx>W+10) return; put(g,'log'+p.w,function(){ return logPix(p.w); },xx-1,SY(p.y)-2); } });
  if(w.th.key==='grove') for(var i=0;i<8;i++){ var fx=((i*97+tick*.3)%(W+20))-10, fy=60+((i*53)%120)+Math.sin(tick/15+i)*6; if((tick+i*13)%40<26){ g.fillStyle='#fff6a0'; g.fillRect(Math.round(fx),Math.round(fy),1,1); } }
  w.items.forEach(function(it){ if(it.got) return; var xx=SX(it.x), yy=SY(it.y)+(((tick>>3)+it.ph)%8<4?0:-1); if(xx<-8||xx>W+8) return; put(g,'star',starPix,xx-5,yy-5); if(((tick>>2)+it.ph)%24===0) sparkle(g,xx+3,yy-4,1); });
  w.cps.forEach(function(c){ var xx=SX(c.x); if(xx<-20||xx>W+20) return; if(c.active) glow(g,xx,SY(c.y)-10,10+((tick>>4)%2),'#fff0b8',tick>>3); put(g,c.active?'lanOn':'lanOff',function(){ return lanternPix(c.active); },xx-5,SY(c.y)-17); });
  if(w.goal){ var gx=SX(w.goal.x+w.goal.w/2), gy=SY(w.goal.y); if(gx>-60&&gx<W+60) drawGoalThing(gx,gy); }
  w.haz.forEach(function(h){ var xx=SX(h.x), yy=SY(h.y), f=(tick>>3)%2; if(xx<-30||xx>W+30) return;
    if(h.kind==='crab') put(g,'crab'+f,function(){ return crabPix(f); },xx,yy-14);
    else if(h.kind==='bee'){ if(h.dir>0) put(g,'bee'+f,function(){ return beePix(f); },xx,yy-7); else put(g,'beeL'+f,function(){ return flipped(beePix(f)); },xx,yy-7); }
    else { if(h.dir>0) put(g,'parrot'+f,function(){ return parrotPix(f); },xx,yy-6); else put(g,'parrotL'+f,function(){ return flipped(parrotPix(f)); },xx,yy-6); }
  });
  if(marker){ var mx=SX(marker.x), my=SY(marker.y); g.fillStyle=marker.free?'#ffffff':'#fff3a6'; var mr=marker.free?3:5+((marker.t>>2)%2); for(var a2=0;a2<16;a2++){ var an=a2/16*Math.PI*2; g.fillRect(Math.round(mx+Math.cos(an)*mr*1.6),Math.round(my-2+Math.sin(an)*mr*.6),1,1); } }
  drawPlayer(cy,cx);
  parts.forEach(function(q){ var xx=Math.round(q.x-cx), yy=Math.round(q.y-cy); if(q.max>=24&&q.life>q.max*.5) sparkle(g,xx,yy,1,q.col); else { g.fillStyle=q.col; g.fillRect(xx,yy,1,1); } });
  hud();
}

/* the prize waiting at the end of every level: the crown, a key, the cage or a sunbeam */
function goalThing(){ var d=LEVELS[world.idx]; if(world.kind==='sea') return 'tiara'; if(world.kind==='isle') return d.rescue?'cage':'key'; return 'sunbeam'; }
function drawGoalThing(gx,gy){
  var k=goalThing(), bob=Math.round(Math.sin(tick/20)*2), got=(mode==='winning'||mode==='done'||mode==='worldwin')?Math.min(1,winT/40):0;
  if(k==='cage'){ var cg=spr('cage',cagePix); g.drawImage(cg,gx-Math.round(cg.width/2),gy-cg.height+1); if(got<1&&(tick>>4)%3===0) text5(g,'HELP!',gx-14,gy-cg.height-10,1,'#ffffff',OUT); return; }
  var px=gx, py=gy-26+bob;
  if(got>0){ var hx=Math.round(pl.x-(world.horiz?world.camX:0)), hy=Math.round(pl.y-world.cam-pl.h-8); px=Math.round(lerp(gx,hx,ease(got))); py=Math.round(lerp(gy-26,hy,ease(got))); }
  if(k==='key'&&got<1){ g.fillStyle='#9a8f86'; g.fillRect(gx-6,gy-10,12,10); g.fillStyle='#c9bfb2'; g.fillRect(gx-6,gy-10,12,2); }
  if(got<1) glow(g,px,py,12+((tick>>4)%2),'#fff3c4',tick>>3);
  if(k==='tiara'){ var tc=spr('tiara',tiaraPix); g.drawImage(tc,px-tc.width,py-tc.height,tc.width*2,tc.height*2); }
  else if(k==='key') put(g,'key',keyPix,px-8,py-4);
  else put(g,'sunbeam',sunbeamPix,px-8,py-8);
  if((tick+3)%20<8) sparkle(g,px+9,py-8,1);
}

/* ---------- the witch's mischief at the start of each level ---------- */
var intro=null;
function cackle(){ [0,.14,.28].forEach(function(d,i){ tone(900-i*60,.1,'square',.035,620-i*40,d); }); }
function startIntro(){
  var k=world.kind; intro={t:0,kind:k,len:k==='isle'?250:230};
  if(world.horiz) islandCams(world,true);
  setMode('intro');
}
function witchAt(){
  var t=intro.t, px=pl.x-(world.horiz?world.camX:0), py=pl.y-world.cam;
  if(intro.kind==='isle'){ var u=t/intro.len; return {x:lerp(-70,W+70,u),y:22+Math.sin(t/14)*5,face:1}; }
  var gx=intro.kind==='sea'?px+6:W/2+8, gy=intro.kind==='sea'?py-pl.h-26:12;
  if(t<100){ var e=ease(t/100); return {x:lerp(W+30,gx,e),y:lerp(4,gy,e)+Math.sin(t/9)*3,face:-1}; }
  if(t<122) return {x:gx,y:gy+Math.sin(t/4)*2,face:-1};
  var e2=Math.pow((t-122)/(intro.len-122),1.6); return {x:lerp(gx,-60,e2),y:lerp(gy,-50,e2),face:-1};
}
function updateIntro(){
  intro.t++; updateWorldThings();
  if(intro.t===12) cackle();
  if(intro.t===108&&intro.kind!=='isle'){ SFX.magic(); addParts(pl.x,pl.y-pl.h-6,10,MAGIC,1.4,24); }
  if(intro.t>=intro.len) endIntro();
}
function endIntro(){
  intro=null; setMode('play');
  var d=LEVELS[world.idx], k=world.kind;
  var line=k==='sea'?'The witch took your crown! Chase her to the top!':k==='isle'?(d.rescue?'Find the cage and free the unicorn!':'Follow the witch to save the unicorn!'):'The witch took a sunbeam! Get it back at the top!';
  toast('Level '+(world.idx+1)+' · '+d.name,line+(d.tier===0&&d.tip?' '+d.tip:''),3200);
}
function drawIntro(){
  var t=intro.t, w=witchAt(), wx=Math.round(w.x), wy=Math.round(w.y), fr=(t>>3)%2;
  if(intro.kind==='sky'&&t<108){ var sx=W/2+20, sy2=24; glow(g,sx,sy2,12+((t>>4)%2),'#fff3c4',t>>3); put(g,'sunbeam',sunbeamPix,sx-8,sy2-8); }
  if(intro.kind==='sea'&&t<108){ var tc=spr('tiara',tiaraPix); g.drawImage(tc,Math.round(pl.x-world.camX-5),Math.round(pl.y-world.cam-29-4)); }
  if(intro.kind==='isle'){ var cg=spr('cage',cagePix); g.fillStyle='#5a3a20'; g.fillRect(wx+15,wy+28,1,8); g.drawImage(cg,wx+15-Math.round(cg.width/2),wy+35); if((t>>4)%3!==2) text5(g,'HELP!',wx+2,wy+48,1,'#ffffff',OUT); }
  if(w.face<0) put(g,'witchL'+fr,function(){ return flipped(witchPix(fr)); },wx,wy); else put(g,'witch'+fr,function(){ return witchPix(fr); },wx,wy);
  if(t>=108&&intro.kind==='sea'){ var tc2=spr('tiara',tiaraPix); g.drawImage(tc2,wx+2,wy+20); }
  if(t>=108&&intro.kind==='sky') put(g,'sunbeam',sunbeamPix,wx+2,wy+18);
  if(t>16&&t<150) text5(g,intro.kind==='sky'?'MINE!':'HEE HEE!',wx-4,wy-10,1,'#e9ffe0',OUT);
  if(t>120&&intro.kind!=='isle'){ var sx3=Math.round(pl.x-world.camX-8), sy3=Math.round(pl.y-world.cam-pl.h-20); text5(g,'HEY!',sx3,sy3,1,'#ffffff',OUT); }
  if(intro.kind==='isle'&&t>150){ text5(g,'OH NO!',Math.round(pl.x-world.camX-14),Math.round(pl.y-world.cam-pl.h-18),1,'#ffffff',OUT); }
}

/* ---------- story cartoons: meeting the fairy, and freeing the unicorn ---------- */
var story=null;
function startStory(kind,next){ story={kind:kind,next:next,len:kind==='island'?600:540}; cut=0; setMode('cutscene'); }
function storyBg(){
  var key='sbg'+VH; if(scn[key]) return scn[key];
  var p=new Pix(W,VH), wl=Math.round(VH*.62);
  vgrad(p,0,0,W,wl,['#7fd0ff','#a6defc','#cdeefd']); vgrad(p,0,wl,W,VH-wl,['#5fd8e0','#3fbccc','#2ea0b8']); wave(p,W,wl-1,1.2,6,['#ffffff','#bfe8ff']);
  p.ell(250,wl+6,90,22,'#f6dca6',function(x,y){ return y<=wl+6; }); p.rect(170,wl+2,150,VH-wl,'#e6c189'); p.ell(250,wl+3,90,8,'#f6dca6');
  for(var y=wl-56;y<wl+2;y++){ var u=(y-(wl-56))/56, x=Math.round(268+10*u*u); p.rect(x-2,y,5,1,((y>>2)&1)?'#b5773f':'#9a6232'); }
  for(var i=0;i<5;i++) p.ell(268+Math.cos(i*1.26)*14,wl-58+Math.sin(i*1.26)*5,9,3,'#4cc36a');
  scn[key]={canvas:p.canvas(),wl:wl}; return scn[key];
}
function drawStory(){
  var t=cut, cap='';
  if(story.kind==='island'){
    if(t<150){ drawCut(); return; }
    var s=storyBg(), wl=s.wl; g.drawImage(s.canvas,0,0);
    put(g,'merHead',function(){ return mermaidPix(13); },70,wl-14+((t>>4)%2));
    g.drawImage(s.canvas,0,wl+1,W,VH-wl-1,0,wl+1,W,VH-wl-1);
    var fx=t<230?lerp(W+20,140,ease((t-150)/80)):140+Math.sin(t/12)*6, fy=wl-46+Math.sin(t/9)*4, ff=(t>>2)%3;
    put(g,'fbig'+ff,function(){ return fairyBigPix(ff); },fx-14,fy);
    cap='A fairy friend!';
    if(t>=330){ var u=(t-330)/220, wx=lerp(-80,W+80,u), wy=10+Math.sin(t/12)*4, fr=(t>>3)%2, cg=spr('cage',cagePix);
      g.fillStyle='#5a3a20'; g.fillRect(wx+15,wy+28,1,8); g.drawImage(cg,Math.round(wx+15-cg.width/2),Math.round(wy+35)); put(g,'witch'+fr,function(){ return witchPix(fr); },wx,wy);
      if((t>>4)%3!==2) text5(g,'HELP!',Math.round(wx+2),Math.round(wy+86),1,'#ffffff',OUT); if(t<480) text5(g,'HEE HEE!',Math.round(wx-4),Math.round(wy-8),1,'#e9ffe0',OUT);
      cap=t<500?'Oh no! The witch took the unicorn!':'I will save you!'; if(t===332) cackle(); }
  } else {
    if(t<200){
      var s2=storyBg(), wl2=s2.wl; g.drawImage(s2.canvas,0,0);
      var cg2=spr('cage',cagePix), cx=200-Math.round(cg2.width/2), cyy=wl2+4-cg2.height;
      if(t<140){ g.drawImage(cg2,cx,cyy); if((t>>4)%3!==2) text5(g,'HELP!',cx+8,cyy-10,1,'#ffffff',OUT); }
      else { put(g,'uni',function(){ return unicornPix(false); },cx+4,cyy+7-Math.round(Math.abs(Math.sin((t-140)/8))*6)); if(t<170) for(var k=0;k<6;k++) sparkle(g,cx+Math.random()*cg2.width,cyy+Math.random()*cg2.height,1); if(t>150) put(g,'heart',heartPix,cx+40,cyy-6-((t-150)>>2)%12); }
      var ff2=(t>>2)%3, fx2=lerp(40,150,ease(Math.min(1,t/70)));
      put(g,'fbig'+ff2,function(){ return fairyBigPix(ff2); },fx2-14,wl2-56+Math.sin(t/9)*3);
      if(t>60&&t<140) for(var k2=0;k2<3;k2++) sparkle(g,fx2+10+((t*3+k2*17)%40),wl2-46+((t+k2*9)%30),1,'#fff3a6');
      if(t===140){ SFX.save(); }
      cap=t<140?'Magic keys, open the cage!':'The unicorn is free!';
    } else if(t<360){
      var u2=t-200, s3=storyBg(), wl3=s3.wl; g.drawImage(s3.canvas,0,0);
      put(g,'merHead',function(){ return mermaidPix(13); },96,wl3-14+((t>>4)%2));
      g.drawImage(s3.canvas,0,wl3+1,W,VH-wl3-1,0,wl3+1,W,VH-wl3-1);
      put(g,'uni',function(){ return unicornPix(false); },150,wl3-28);
      var ff3=(t>>2)%3; put(g,'fbig'+ff3,function(){ return fairyBigPix(ff3); },210,wl3-70+Math.sin(t/9)*3);
      if(u2>60) put(g,'heart',heartPix,128,wl3-40-((u2>>2)%10));
      cap='Hop on!';
    } else { cut=300+(t-360); drawCut(); cut=t; cap='Up to the sky!'; var ff4=(t>>2)%3; put(g,'fbig'+ff4,function(){ return fairyBigPix(ff4); },110,VH*.4-(t-360)*.5+Math.sin(t/9)*3); }
  }
  setCaption(cap);
}
