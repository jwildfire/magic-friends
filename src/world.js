
/* ---------- more things in the worlds ---------- */
CLOUDS.night=['#d6d9ff','#a9aee8','#5a5ba8'];
CLOUDS.candy=['#ffc7e4','#f9a3cf','#c25d98'];
CLOUDS.candyB=['#c9ecff','#9fd6f7','#5f98c9'];
CLOUDS.icy=['#f2fbff','#cdeaff','#6a9fd0'];
CLOUDS.icebounce=['#d6f2ff','#9fd8ff','#3f7fc0'];
var LEDGE={
  deep:{top:'#93a4dc',body:'#5e6eaa',under:'#47558f',moss:'#3ccf8a',dot:'#7484be',out:'#1c2152'},
  reef:{top:'#ffc6bc',body:'#ff8a86',under:'#e0617a',moss:'#ffd166',dot:'#ffb0a8',out:'#7a2a45'},
  lagoon:{top:'#fff3cf',body:'#f2d595',under:'#dcb670',moss:'#5fd4a0',dot:'#fbe6b4',out:'#7a5a2a'},
  gold:{top:'#fff6c4',body:'#ffd447',under:'#e8a92a',moss:'#ffffff',dot:'#fff0a0',out:'#8a5a10'}
};
function ledge2(w,L){
  var p=new Pix(w,8);
  p.rect(1,0,w-2,1,L.top); p.rect(0,1,w,4,L.body); p.rect(1,5,w-2,2,L.under); p.rect(3,7,w-6,1,L.under);
  for(var x=1;x<w-1;x++){ var hs=(x*37)%11; if(hs<3) p.px(x,0,L.moss); if(hs===0) p.px(x,1,L.moss); if(hs===5) p.px(x,3,L.dot); }
  return pad(p,1).outline(L.out);
}
function turtlePix(w){
  var p=new Pix(w+12,14), x0=5, cx=x0+w/2;
  p.ell(cx,8,w/2,6.5,'#4cc38a',function(x,y){return y<=8;}); p.rect(x0+1,8,w-2,2,'#3a9e6e');
  for(var i=0;i<Math.floor(w/9);i++){ p.ell(x0+7+i*9,5,2.4,1.6,'#2f9a68'); }
  p.ell(x0+w+3,8,3.4,2.8,'#9be3a8'); p.px(x0+w+4,7,OUT);
  p.ell(x0+4,11,3,1.6,'#9be3a8'); p.ell(x0+w-4,11,3,1.6,'#9be3a8');
  return pad(p,1).outline(OUT);
}
function leafPix(w){
  var p=new Pix(w,9); p.ell(w/2,4.5,w/2,4,'#6fd17f'); p.map(function(c,x,y){ return y<=3?'#8fe08f':undefined; });
  p.line(3,5,w-3,4,'#3fae5a'); for(var i=6;i<w-6;i+=8) p.line(i,5,i+3,2,'#3fae5a');
  return pad(p,1).outline('#22603a');
}
function flowerPadPix(w){
  var p=new Pix(w,12);
  for(var i=0;i<5;i++) p.ell(4+i*(w-8)/4,4,4.5,3.5,i%2?'#ff9fd0':'#ff7fbf');
  p.ell(w/2,5,5,3,'#ffd447'); p.px(Math.round(w/2)-2,4,'#fff3b0'); p.rect(Math.round(w/2)-1,7,3,5,'#3fae5a');
  return pad(p,1).outline('#8a2a5a');
}
function gumdropPix(w){
  var p=new Pix(w,11); p.ell(w/2,8,w/2,8,'#7fe08a',function(x,y){return y<8;}); p.rect(0,8,w,3,'#5fc070');
  [[4,3],[w-7,4],[Math.round(w/2),2],[8,6],[w-10,7]].forEach(function(q){ p.px(q[0],q[1],'#ffffff'); });
  return pad(p,1).outline('#2f7a40');
}
function bigStarPix(){ var p=new Pix(17,17); p.poly(starPts(8.5,9,8.6,3.9),'#ffe14d'); p.poly(starPts(8.5,9,5,2.2),'#fff3a6'); p.px(7,10,OUT); p.px(10,10,OUT); return pad(p,1).outline('#a8741a'); }
function beePix(f){
  var p=new Pix(15,12); p.ell(7.5,7.5,6,4,'#ffd447');
  p.map(function(c,x){ return (x===5||x===6||x===9||x===10)?OUT:undefined; });
  if(f%2){ p.ell(6,2.5,3,2.2,'#e6f6ff'); p.ell(10,2,2.6,2,'#e6f6ff'); } else { p.ell(6,3.5,3,1.6,'#e6f6ff'); p.ell(10,3.5,2.6,1.6,'#e6f6ff'); }
  p.px(12,6,OUT); p.px(12,8,'#ff9db0');
  return pad(p,1).outline(OUT);
}
function owlPix(f){
  var p=new Pix(14,14), b='#8a6ab0', B='#6a4a90';
  p.ell(7,8,6,5.5,b); p.ell(7,10,4,3,'#e3d6f5');
  p.px(2,2,b); p.px(3,3,b); p.px(11,2,b); p.px(10,3,b);
  p.ell(4.5,6,2.2,2.2,'#ffffff'); p.ell(9.5,6,2.2,2.2,'#ffffff'); p.px(4,6,OUT); p.px(9,6,OUT);
  p.px(7,8,'#ffb03b'); p.px(7,9,'#ffb03b');
  if(f%2){ p.ell(1,7,1.6,3,B); p.ell(13,7,1.6,3,B); } else { p.ell(1.5,10,1.6,2.5,B); p.ell(12.5,10,1.6,2.5,B); }
  return pad(p,1).outline(OUT);
}
var FAIRY=[["....hhhhh....","...hhhhhhh...","vv.hsesesh.vv","vvv.hsmsh.vvv","vvvv.ddd.vvvv",".vvvsdddsvvv.","..vvdddddvv..","....ddddd....","...ddddddd...",".....s.s....."],
           ["....hhhhh....","...hhhhhhh...","...hsesesh...",".vv.hsmsh.vv.","vvvv.ddd.vvvv","vvvvsdddsvvvv",".vv.ddddd.vv.","....ddddd....","...ddddddd...",".....s.s....."]];
function fairyPix(f){ return pad(fromRows(FAIRY[f%2],{h:'#ffe066',s:'#ffd8bf',e:OUT,m:'#e0607a',d:'#c9a7ff',v:'#e6fbff'}),1).outline(OUT); }
function plankPix(w){
  var p=new Pix(w,8), U='#8a552a';
  p.rect(0,0,w,1,'#e0b07a'); p.rect(0,1,w,5,'#b5773f'); p.rect(0,6,w,2,U);
  for(var x=11;x<w-3;x+=14) p.rect(x,1,1,6,U);
  for(x=4;x<w-2;x+=14){ p.px(x,3,'#ead7b8'); p.px(x+3,3,'#ead7b8'); }
  p.px(0,7,null); p.px(w-1,7,null);
  return pad(p,1).outline('#4a2a14');
}
function barrelPix(w){
  var p=new Pix(w,12);
  p.rect(2,1,w-4,10,'#b5773f'); p.ell(2.5,6,2.5,5,'#9a6232'); p.ell(w-2.5,6,2.5,5,'#c98a4f');
  p.rect(2,1,w-4,1,'#d9a66b'); [6,Math.round(w/2),w-7].forEach(function(x){ p.rect(x,1,2,10,'#9aa3b5'); });
  p.rect(2,9,w-4,2,'#8a552a');
  return pad(p,1).outline('#4a2a14');
}
function icePix(w){
  var p=new Pix(w,10);
  p.rect(0,2,w,5,'#bfe8ff'); p.rect(1,7,w-2,1,'#9fd6f5');
  for(var x=0;x<w;x+=6) p.ell(x+3,1.6,3.6,1.7,'#ffffff');
  p.rect(0,1,w,2,'#ffffff');
  for(x=3;x<w-2;x+=7) p.rect(x,8,1,2,'#9fd6f5');
  p.px(3,4,'#ffffff'); p.px(4,4,'#ffffff'); p.px(w-6,5,'#e6f7ff');
  return pad(p,1).outline('#5a8ac0');
}
function snowBirdPix(f){
  var p=new Pix(15,11),b='#f4f8ff',B='#b9d4f2';
  p.ell(7,6.5,5,3.5,b); p.ell(6.5,8,3,1.8,'#ffffff'); p.ell(11,4.5,2.6,2.5,b);
  p.px(14,4,'#ffb03b'); p.px(14,5,'#ffb03b'); p.px(12,3,OUT); p.px(11,5,'#ff9db0');
  p.poly([[3,5],[0,3],[0,8]],B); p.rect(8,3,3,1,'#ff8fb8');
  if(f%2) p.poly([[4,6],[9,6],[6,.5]],B); else p.poly([[4,6],[9,6],[6,10.5]],B);
  return pad(p,1).outline('#3f5f8f');
}
function lollipopPix(col){ var p=new Pix(12,20); p.rect(5,10,2,10,'#fff6ea'); p.ell(6,6,6,6,col); p.ell(6,6,4,4,'#ffffff'); p.ell(6,6,2.2,2.2,col); return pad(p,1).outline(OUT); }
function flowerPix(col){ var p=new Pix(15,13); [[4,4],[10,4],[3,9],[11,9],[7,2]].forEach(function(q){ p.ell(q[0]+.5,q[1]+.5,3,2.6,col); }); p.ell(7.5,7,3,2.6,'#ffd447'); p.px(6,6,'#fff3b0'); return pad(p,1).outline(OUT); }

/* ---------- themes and levels ---------- */
var THEMES={
  deep:{kind:'sea',grad:['#62b8ea','#4ea8e2','#4298d8','#3887cb','#3078bf','#2b6cb3','#2762a9','#245aa0'],ray:'#9ad8f6',wall:'#2a5a9c',wallHi:'#4a7fc0',rock:'#2e63a6',specials:['bounce','elev','drift'],haz:'puffer'},
  ship:{kind:'sea',grad:['#6cc0cf','#56aec2','#4499b2','#3886a3','#2f7694','#296886','#245c7a'],ray:'#a8e2ea',wall:'#4a2f20',wallHi:'#7a5236',rock:'#2c6a86',specials:['bounce','drift','elev'],haz:'puffer',ship:true},
  reef:{kind:'sea',grad:['#a6f2f2','#7fe4ec','#5fd3e4','#4cc1da','#3eaed0','#349cc4'],ray:'#d2f9fb',wall:'#c95a78',wallHi:'#ff9fb0',rock:'#2f8fbf',specials:['drift','drift','bounce','elev'],haz:'puffer',reef:true},
  lagoon:{kind:'sea',surface:true,grad:['#d0f8f6','#aeeef1','#8ce2ec','#6fd3e4','#5cc5dd','#50b9d6'],ray:'#ffffff',wall:'#d9b878',wallHi:'#fff0c4',rock:'#7fcfdc',specials:['drift','bounce','elev'],haz:'puffer'},
  palm:{kind:'isle',grad:['#6cc4ff','#8fd4ff','#b9e6ff','#e4f6ff','#f6dca6'],plat:'branch',haz:'parrot'},
  grove:{kind:'isle',grad:['#9fd8f0','#b8e6e4','#d4f0d8','#ecf8e0','#a0703f'],plat:'branch',haz:'bee'},
  clouds:{kind:'sky',grad:['#ffe7b0','#ffcfa0','#ffb8b8','#f7b9d7','#e9b7ed','#d0b9f5','#b8c7f9','#abd6fc','#c2e7ff'],plat:'cloud',bouncy:'cloud',haz:'bird',specials:['bounce','drift','arc'],decor:'clouds',rain:true,ocean:true},
  candy:{kind:'sky',grad:['#ffd8ec','#ffe4d6','#ffd2ea','#f3d6ff','#e2dcff','#d4ecff'],plat:'candy',bouncy:'gumdrop',haz:'bee',specials:['bounce','bounce','drift'],decor:'candy'},
  vine:{kind:'sky',grad:['#c4ecff','#d4f6ee','#e8fbdc','#dff6f0','#cdeeff'],plat:'leaf',bouncy:'flower',haz:'bee',specials:['bounce','bounce','drift'],decor:'vine'},
  rainbow:{kind:'sky',grad:['#ffe6f3','#f3dfff','#e0e8ff','#d8f5ff','#dcfdf0'],plat:'cloud',bouncy:'cloud',haz:'bird',specials:['arc','arc','bounce','drift'],decor:'rainbow',rain:true},
  snow:{kind:'sky',grad:['#fdf6ff','#eef0ff','#e0e8ff','#d4e2ff','#cadcfb','#c2d6f6'],plat:'ice',bouncy:'icebounce',haz:'snowbird',specials:['bounce','drift','arc'],decor:'snow'},
  night:{kind:'sky',grad:['#ffd9a0','#ffb0a8','#c98fc0','#7a64b4','#4b3d96','#2f2675','#211a58','#1a1446'],plat:'night',bouncy:'star',haz:'owl',specials:['bounce','drift','arc'],decor:'night'}
};
var ENVS=[
  {key:'deep',name:'Deep Blue Sea',tip:'Tap a ledge to jump onto it!'},
  {key:'ship',name:'Sunken Treasure Ship',tip:'Climb the old ship and look for treasure!'},
  {key:'reef',name:'Coral Reef',tip:'Hop on the sea turtles!'},
  {key:'lagoon',name:'Sparkle Lagoon',tip:'Swim up toward the sparkly surface!'},
  {key:'palm',name:'Palm Tree Island',tip:'Tap a beach or a palm tree to flutter there.'},
  {key:'grove',name:'Fairy Treetops',tip:'Bounce on the red mushrooms!'},
  {key:'clouds',name:'Cloud Hop',tip:'Riding together! Tap a cloud to jump.'},
  {key:'candy',name:'Candy Clouds',tip:'A fairy friend joins the team!'},
  {key:'vine',name:'Giant Flower Vine',tip:'Bounce on the flowers!'},
  {key:'rainbow',name:'Rainbow Bridges',tip:'Run across the rainbows!'},
  {key:'snow',name:'Snowflake Sky',tip:'Hop across the icy clouds!'},
  {key:'night',name:'Starry Night',tip:'Climb the stars to the sunrise!'}
];
var TIERTIPS=['','Can you find every treasure?','A little higher this time!','Watch out for the critters!','Last one here. You can do it!'];
var LEVELS=[];
ENVS.forEach(function(e,ei){
  for(var t=0;t<5;t++){
    var L={env:ei,tier:t,theme:e.key,envName:e.name,name:e.name+' '+(t+1),seed:1000+ei*97+t*31,height:860+t*110+Math.min(ei,6)*20,tip:t===0?e.tip:TIERTIPS[t]};
    if(ei===0&&t===0) L.hand='sea1';
    if(e.key==='clouds'&&t===0) L.hand='sky1';
    if(e.key==='grove'&&t===4){ L.rescue=true; L.tip='Find the cage and free the unicorn!'; }
    if(ei===3&&t===4){ L.surface=true; L.tip='Swim all the way up to the surface!'; }
    if(e.key==='night'&&t===4) L.tip='The sunrise is at the very top!';
    LEVELS.push(L);
  }
});
var FAIRY_FROM=30;
var PHYS={
  sea:{grav:.15,gravHold:.09,jumpV:-3.9,airJumpV:-3,airJumps:1,maxFall:2.4,maxFallHold:1.4,speed:1.5,accel:.25,airAccel:.18,bounceV:-6,w:10,h:24,autoG:.12,autoMax:86,autoVx:2.4,single:60},
  isle:{grav:.16,gravHold:.08,jumpV:-3.9,airJumpV:-3.2,airJumps:2,maxFall:2.2,maxFallHold:1,speed:1.7,accel:.28,airAccel:.2,bounceV:-6.2,w:12,h:22,autoG:.14,autoMax:92,autoVx:3,single:58},
  sky:{grav:.2,gravHold:.13,jumpV:-4.6,airJumpV:-4,airJumps:1,maxFall:3.6,maxFallHold:3.6,speed:1.8,accel:.3,airAccel:.2,bounceV:-7,w:24,h:30,autoG:.17,autoMax:122,autoVx:2.8,single:66}
};

function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function newLevel(H,f){ var L={H:H,floor:f,plats:[],arcs:[],jellies:[],elev:[],haz:[],rains:[],cps:[],items:[],path:[],goal:null,surface:null}; L.floorP={x:0,y:f,w:W,type:'floor'}; L.plats.push(L.floorP); return L; }
function platNear(L,x,y){ for(var i=0;i<L.plats.length;i++){ var p=L.plats[i]; if(p.w&&Math.abs(p.y-y)<1&&x>=p.x-2&&x<=p.x+p.w+2) return p; } return L.floorP; }

/* Level 1, drawn by hand */
function handSea1(){
  var f=1188, L=newLevel(1240,f), prev=L.floorP;
  [[20,40,60],[110,80,50],[200,118,56],[110,158,50],[30,196,56],[120,236,46],[220,270,94],[130,310,50],[30,350,60],[120,392,48],[226,430,64],[130,470,60],[40,510,44],[120,552,50],[220,594,56],[130,636,50],[30,676,56],[120,714,60],[30,756,50],[110,798,50],[210,840,56],[110,882,50],[20,924,56],[110,966,46],[200,1008,60],[110,1050,56],[20,1090,60]].forEach(function(l,i){
    var p={x:l[0],y:f-l[1],w:l[2],type:'plat'}; L.plats.push(p); L.path.push([prev,p,'jump']); prev=p;
    if(i%3===2&&l[2]>=50){ L.items.push({x:l[0]+l[2]/2-10,y:f-l[1]-12}); L.items.push({x:l[0]+l[2]/2+10,y:f-l[1]-12}); } else L.items.push({x:l[0]+l[2]/2,y:f-l[1]-12});
  });
  L.goal={x:96,y:f-1132,w:76,type:'goal'}; L.plats.push(L.goal); L.path.push([prev,L.goal,'jump']);
  [[268,40],[236,728],[290,1030]].forEach(function(j){ L.jellies.push({x:j[0],y:f-j[1]}); });
  L.elev.push({x:292,bottom:f-270,top:f-440,w:18});
  [[80,112,490,0],[156,192,862,0],[80,102,698,1],[160,182,1030,1]].forEach(function(q){ L.haz.push({kind:'puffer',x0:q[0],x1:q[1],y:f-q[2],hardOnly:!!q[3]}); });
  L.haz.push({kind:'crab',x0:110,x1:240,y:f,hardOnly:false});
  [[244,270,0],[160,470,1],[150,714,0],[48,924,1]].forEach(function(c){ L.cps.push({x:c[0],y:f-c[1],keep:!!c[2],plat:platNear(L,c[0],f-c[1])}); });
  for(var e=300;e<=420;e+=30) L.items.push({x:301,y:f-e});
  [[268,80],[268,110],[236,780],[236,810],[290,1080],[290,1110]].forEach(function(q){ L.items.push({x:q[0],y:f-q[1]}); });
  return L;
}
/* Level 4, drawn by hand */
function handSky1(){
  var f=1220, L=newLevel(1280,f), C=[];
  [[30,46,60,'plat'],[130,92,50,'plat'],[230,136,56,'bouncy'],[120,182,50,'plat'],[220,240,60,'plat'],[110,286,60,'drift',40],[20,330,56,'plat'],[110,376,50,'plat',0,1],[210,420,60,'plat'],[14,466,44,'plat'],[122,466,44,'plat'],[60,552,50,'plat'],[160,596,56,'plat'],[250,640,50,'bouncy'],[150,684,50,'plat',0,1],[40,728,56,'drift',30],[160,772,60,'plat'],[60,816,56,'plat'],[160,860,48,'plat',0,1],[250,904,56,'plat'],[140,948,50,'drift',40],[30,992,60,'plat',0,1],[130,1036,50,'plat'],[230,1080,56,'bouncy'],[120,1124,56,'plat']].forEach(function(c){
    var p={x:c[0],y:f-c[1],w:c[2],type:c[3]}; if(c[3]==='drift'){ p.amp=c[4]; p.x0=c[0]; p.spd=.012+(c[4]%7)*.001; } if(c[5]) p.puffable=true;
    L.plats.push(p); C.push(p);
    if(c[3]==='bouncy'){ L.items.push({x:c[0]+c[2]/2,y:f-c[1]-40}); L.items.push({x:c[0]+c[2]/2,y:f-c[1]-70}); } else L.items.push({x:c[0]+c[2]/2,y:f-c[1]-14});
  });
  var arc={type:'arc',cx:90,base:f-466,R:46}; L.arcs.push(arc); L.plats.push(arc);
  L.goal={x:100,y:f-1166,w:120,type:'goal'}; L.plats.push(L.goal);
  var P=function(i){ return i===0?L.floorP:i==='arc'?arc:i==='goal'?L.goal:C[i-1]; };
  [[0,1],[1,2],[2,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,11],[11,'arc'],['arc',12],[12,13],[13,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,25],[25,'goal']].forEach(function(q){ L.path.push([P(q[0]),P(q[1]),'jump']); });
  [[250,240,0],[188,596,1],[88,816,0],[155,1036,1]].forEach(function(c){ L.cps.push({x:c[0],y:f-c[1],keep:!!c[2],plat:platNear(L,c[0],f-c[1])}); });
  [[262,506,46],[262,946,46]].forEach(function(r){ L.rains.push({x:r[0],y:f-r[1],w:r[2]}); });
  [[104,146,574,0],[84,112,1014,0],[202,236,882,1]].forEach(function(q){ L.haz.push({kind:'bird',x0:q[0],x1:q[1],y:f-q[2],hardOnly:!!q[3]}); });
  L.items.push({x:90,y:f-466-46-12}); L.items.push({x:66,y:f-512}); L.items.push({x:114,y:f-512});
  return L;
}

/* Every other level is grown from a seed, so it plays the same way every time */
function genLevel(def){
  var th=THEMES[def.theme], sea=th.kind==='sea', R=rng(def.seed), R2=rng(def.seed*31+7);
  var H=def.height, f=H-52, L=newLevel(H,f);
  var tt=Math.min(4,def.tier||0), stopY=def.surface?104:120, cur=L.floorP, dir=1, n=0, sinceSp=0, sinceHaz=1, sinceCp=0, sinceRain=0, maxGap=sea?32+tt:38+tt, hazEvery=7-Math.floor(tt/2);
  function rr(a,b){ return a+R()*(b-a); }
  function busy(x,y,w,h){ for(var i=0;i<L.plats.length;i++){ var q=L.plats[i]; if(!q.w||q.type==='floor') continue; if(x<q.x+q.w+6&&x+w>q.x-6&&y<q.y+14&&y+h>q.y-12) return true; } return false; }
  function placeX(w,gapMax,gapMin){
    if(cur.type==='floor') return Math.round(rr(14,80));
    for(var t=0;t<8;t++){ var d=t<4?(R()<.72?-dir:dir):-dir, gap=rr(gapMin==null?-14:gapMin,gapMax), x=d>0?cur.x+cur.w+gap:cur.x-gap-w; if(x>=12&&x+w<=W-12){ dir=d; return Math.round(x); } }
    dir=-dir; return Math.round(clamp(dir>0?cur.x+cur.w+8:cur.x-8-w,12,W-12-w));
  }
  function item(x,y){ L.items.push({x:Math.round(x),y:Math.round(y)}); }
  function guard(a,b,hardOnly){
    var l,r; if(b.x+b.w/2>a.x+a.w/2){ l=a.x+a.w; r=b.x; } else { l=b.x+b.w; r=a.x; }
    if(r-l<10) return false;
    L.haz.push({kind:sea?'puffer':th.haz,x0:clamp(Math.round(l-6),12,W-30),x1:clamp(Math.round(Math.max(l-6,r+6-18)),12,W-30),y:Math.round((a.y+b.y)/2-12),hardOnly:!!hardOnly});
    return true;
  }
  while(cur.y>stopY+44){
    n++; sinceSp++; sinceHaz++; sinceCp++; sinceRain++;
    var choice='jump', prev=cur;
    if(n>2&&sinceSp>=4&&R()<.38+.04*tt) choice=th.specials[Math.floor(R()*th.specials.length)];
    if((choice==='bounce'||choice==='elev')&&cur.y-160<stopY) choice='jump';
    if(choice==='arc'&&cur.y-120<stopY) choice='jump';
    if(choice==='elev'&&cur.type==='floor') choice='jump';
    if(choice==='jump'||choice==='drift'){
      var w=Math.round(rr(50-tt*2,66-tt*2)), x=placeX(w,maxGap), p={x:x,y:Math.round(cur.y-rr(sea?36:40,sea?42:46)),w:w,type:choice==='drift'?'drift':'plat'};
      if(choice==='drift'){ p.amp=Math.round(rr(16,26)); p.x=Math.round(clamp(p.x,12+p.amp,W-12-w-p.amp)); p.x0=p.x; p.spd=.011+R()*.006; sinceSp=0; }
      L.plats.push(p); L.path.push([cur,p,'jump']); cur=p; item(p.x+p.w/2,p.y-12);
    } else if(choice==='bounce'){
      var bw=sea?14:(th.bouncy==='star'?16:Math.round(rr(30,40))), bx=placeX(bw,26,4), by=Math.round(cur.y-rr(14,24)), bp, bc;
      if(sea){ bp={x:Math.round(bx+bw/2),y:by}; L.jellies.push(bp); bc=bp.x; L.path.push([cur,bp,'jelly']); }
      else { bp={x:bx,y:by,w:bw,type:'bouncy'}; L.plats.push(bp); bc=bx+bw/2; L.path.push([cur,bp,'bounce']); }
      var w2=Math.round(rr(50,64)), p2={x:Math.round(clamp(bc-w2/2+rr(-w2/2+12,w2/2-12),12,W-12-w2)),y:Math.round(by-rr(86,96)),w:w2,type:'plat'};
      if(bc<p2.x+8||bc>p2.x+p2.w-8) p2.x=Math.round(clamp(bc-w2/2,12,W-12-w2));
      L.plats.push(p2); L.path.push([bp,p2,'bounced']); cur=p2; sinceSp=0;
      item(bc,by-34); item(bc,by-60); item(p2.x+p2.w/2,p2.y-12);
    } else if(choice==='elev'){
      var side=cur.x+cur.w/2<W/2?1:-1, ex=Math.round(clamp(side>0?cur.x+cur.w-20:cur.x+2,14,W-32));
      var e={x:ex,top:cur.y-150,bottom:cur.y,w:18}; L.elev.push(e);
      var w3=Math.round(rr(50,62)), x3=(ex+24+w3<=W-12)?ex+24:ex-6-w3;
      var p3={x:Math.round(clamp(x3,12,W-12-w3)),y:Math.round(cur.y-136),w:w3,type:'plat'};
      L.plats.push(p3); L.path.push([cur,e,'elev']); L.path.push([e,p3,'elevtop']); cur=p3; sinceSp=0;
      item(ex+9,e.bottom-40); item(ex+9,e.bottom-80); item(ex+9,e.bottom-120); item(p3.x+p3.w/2,p3.y-12);
    } else if(choice==='arc'){
      var Rr=Math.round(rr(38,46)), fw=40, a={x:placeX(fw,34),y:Math.round(cur.y-rr(40,44)),w:fw,type:'plat',foot:true};
      var adir=a.x+fw/2<W/2?1:-1, cx=adir>0?a.x+fw-8+Rr:a.x+8-Rr;
      L.plats.push(a); L.path.push([cur,a,'jump']);
      if(cx-Rr<12||cx+Rr>W-12){ a.foot=false; cur=a; item(a.x+fw/2,a.y-12); }
      else {
        var arc={type:'arc',cx:cx,base:a.y,R:Rr}; L.arcs.push(arc); L.plats.push(arc);
        var bx2=adir>0?cx+Rr-8:cx-Rr-fw+8; if(bx2>=12&&bx2+fw<=W-12) L.plats.push({x:Math.round(bx2),y:a.y,w:fw,type:'plat',foot:true});
        L.path.push([a,arc,'arc']);
        var p4w=Math.round(rr(48,60)), p4={x:Math.round(clamp(cx-p4w/2+rr(-18,18),12,W-12-p4w)),y:Math.round(a.y-Rr-rr(34,40)),w:p4w,type:'plat'};
        L.plats.push(p4); L.path.push([arc,p4,'jump']); cur=p4; sinceSp=0;
        item(cx,a.y-Rr-12); item(cx-Rr*.62,a.y-Rr*.78-10); item(cx+Rr*.62,a.y-Rr*.78-10); item(p4.x+p4.w/2,p4.y-12);
      }
    }
    if(cur.type==='plat'&&!cur.foot&&sinceCp>=5){ L.cps.push({x:Math.round(cur.x+cur.w/2),y:cur.y,keep:L.cps.length%2===1,plat:cur}); cur.cp=true; sinceCp=0; }
    if(prev.w&&prev.type!=='floor'&&cur.type==='plat'&&prev.type==='plat'){
      if(sinceHaz>=hazEvery){ if(guard(prev,cur,false)) sinceHaz=0; }
      else if(sinceHaz===3) guard(prev,cur,true);
    }
    if(th.rain&&sinceRain>7&&prev.w&&prev.type==='plat'&&cur.type==='plat'&&R()<.45){
      var rw=46, rx=Math.round(clamp((cur.x+cur.w/2>prev.x+prev.w/2)?prev.x-14:prev.x+prev.w-32,12,W-12-rw)), ry=prev.y-86;
      if(!busy(rx,ry,rw,90)){ L.rains.push({x:rx,y:ry,w:rw}); sinceRain=0; }
    }
  }
  if(def.surface) L.surface=64;
  else { var gw=sea?76:100; L.goal={x:Math.round(clamp(cur.x+cur.w/2-gw/2+rr(-24,24),12,W-12-gw)),y:Math.round(cur.y-rr(38,42)),w:gw,type:'goal'}; L.plats.push(L.goal); L.path.push([cur,L.goal,'jump']); }
  if(sea) L.haz.push({kind:'crab',x0:100,x1:240,y:f,hardOnly:false});
  if(!sea) L.plats.forEach(function(p){ if(p.type==='plat'&&!p.cp&&!p.foot&&R2()<.28) p.puffable=true; });
  return L;
}

/* how each theme draws its platforms */
function platArt(th,p){
  if(th.kind==='isle'){ if(p.type==='bouncy') return {key:'mush'+p.w,make:function(){return mushPix(p.w);},dx:-1,dy:-1}; if(p.type==='drift') return {key:'log'+p.w,make:function(){return logPix(p.w);},dx:-1,dy:-2}; return {key:(th.key==='palm'?'frond':'br')+p.w,make:function(){return th.key==='palm'?frondPix(p.w):branchPix(p.w);},dx:-1,dy:-2}; }
  var k=th.kind==='sea'?'sea':th.plat;
  if(p.type==='goal') return th.kind==='sea'?{key:'goalL'+p.w,make:function(){return ledge2(p.w,LEDGE.gold);},dx:-1,dy:-1}:{key:'goalC'+p.w,make:function(){return cloudPix(p.w,'gold');},dx:-1,dy:-5};
  if(p.type==='bouncy'){
    if(th.bouncy==='flower') return {key:'flw'+p.w,make:function(){return flowerPadPix(p.w);},dx:-1,dy:-1};
    if(th.bouncy==='gumdrop') return {key:'gum'+p.w,make:function(){return gumdropPix(p.w);},dx:-1,dy:-1};
    if(th.bouncy==='star') return {key:'bstar',make:bigStarPix,dx:-1,dy:-2};
    if(th.bouncy==='icebounce') return {key:'clib'+p.w,make:function(){return cloudPix(p.w,'icebounce');},dx:-1,dy:-5};
    return {key:'clb'+p.w,make:function(){return cloudPix(p.w,'bouncy');},dx:-1,dy:-5};
  }
  if(k==='sea'){
    if(p.type==='drift') return th.ship?{key:'barrel'+p.w,make:function(){return barrelPix(p.w);},dx:-1,dy:-2}:{key:'turt'+p.w,make:function(){return turtlePix(p.w);},dx:-6,dy:-3};
    if(th.ship) return {key:'plank'+p.w,make:function(){return plankPix(p.w);},dx:-1,dy:-1};
    var Lg=LEDGE[th.key]||LEDGE.deep; return {key:'lg'+th.key+p.w,make:function(){return ledge2(p.w,Lg);},dx:-1,dy:-1};
  }
  if(k==='ice') return {key:'ice'+p.w,make:function(){return icePix(p.w);},dx:-1,dy:-1};
  if(k==='leaf') return {key:'leaf'+p.w,make:function(){return leafPix(p.w);},dx:-1,dy:-1};
  if(k==='candy'){ var c=((p.x0!=null?p.x0:p.x)+p.y)%2?'candy':'candyB'; return {key:c+p.w,make:function(){return cloudPix(p.w,c);},dx:-1,dy:-5}; }
  if(k==='night') return {key:'nc'+p.w,make:function(){return cloudPix(p.w,'night');},dx:-1,dy:-5};
  return {key:'cl'+p.w+'n',make:function(){return cloudPix(p.w,'normal');},dx:-1,dy:-5};
}
Object.keys(THEMES).forEach(function(k){ THEMES[k].key=k; });

/* ---------- backgrounds, drawn once per level ---------- */
function seaBg(w){
  var th=w.th, H=w.H, f=w.floorY, p=new Pix(W,H), top=0;
  var surf=w.surface!=null;
  if(surf){ vgrad(p,0,0,W,62,['#ffc9a8','#f7b9d7','#d6b9f3']); top=62; }
  vgrad(p,0,top,W,H-top,th.grad);
  if(surf) wave(p,W,61,1.2,6,['#ffffff','#d8f2ff','#9fd8f6']);
  var rayEnd=Math.min(H,top+(surf?700:420));
  [[24,18],[110,12],[186,22],[262,14]].forEach(function(r){ for(var y=top+4;y<rayEnd;y++){ var fade=1-(y-top)/(rayEnd-top); for(var x=0;x<r[1];x++){ var xx=r[0]+x+Math.round(y*.35); if(((xx+y)&1)===0&&bayer(xx,y)<fade*.8) p.px(xx%W,y,th.ray); } } });
  for(var k0=0;k0<50;k0++) p.px((k0*83)%300+10,(k0*197)%(H-200)+120,th.ray);
  for(var y=top+8;y<H;y++){ var lw=5+Math.round(3*Math.sin(y/37)+2*Math.sin(y/13)), rw=5+Math.round(3*Math.sin(y/29+2)+2*Math.sin(y/11)); for(var x=0;x<lw;x++) p.px(x,y,th.wall); for(x=0;x<rw;x++) p.px(W-1-x,y,th.wall); p.px(lw,y,th.wallHi); p.px(W-1-rw,y,th.wallHi); }
  if(th.reef){ var cc=[['#ff7a8a','#8a2a4a'],['#ffa25a','#8a4a1a'],['#c48bff','#5b2d8f'],['#ffd166','#8a6a10']]; for(var k=0;k*58<H-120;k++){ var c=cc[k%4]; p.stamp(coralPix(c[0],c[1]),k%2?-3:W-12,f-60-k*58); } }
  if(th.ship){
    var hy=Math.round(H*.55), hc='#2c6280';
    p.poly([[24,hy+160],[46,hy-24],[276,hy-64],[300,hy+120]],hc);
    p.poly([[46,hy-24],[276,hy-64],[278,hy-54],[48,hy-14]],'#3a7896');
    for(var k1=0;k1<5;k1++){ p.ell(84+k1*44,hy+16-k1*7,5,5,'#5a9ab8'); p.ell(84+k1*44,hy+16-k1*7,3,3,'#24506a'); }
    p.rect(152,hy-300,5,250,hc); p.rect(118,hy-230,74,3,hc);
    p.poly([[157,hy-290],[222,hy-268],[212,hy-178],[157,hy-188]],'#4f8fac');
    for(var y1=hy-420;y1<f-110;y1+=3){ p.px(206,y1,hc); p.px(207,y1+1,hc); }
    p.rect(205,f-110,3,34,hc); p.ell(206,f-78,12,7,hc,function(x,y){return y>=f-78;}); p.rect(196,f-100,21,3,hc);
  }
  p.poly([[0,H],[0,f-60],[10,f-72],[22,f-56],[34,f-76],[48,f-58],[60,H]],th.rock);
  p.poly([[240,H],[256,f-48],[270,f-62],[286,f-44],[302,f-70],[320,f-56],[320,H]],th.rock);
  for(x=0;x<W;x++){ var t2=f+Math.round(Math.sin(x/16)*1.4); for(y=t2;y<H;y++) p.px(x,y,y===t2?'#f6dca6':((x*7+y*13)%17===0?'#c99a5b':'#e6c189')); }
  if(th.ship){ for(var c1=0;c1<22;c1++) p.px((c1*53+17)%300+10,f+3+(c1%5),'#ffd447'); p.stamp(chestPix(),132,f-12); }
  weed(p,8,f,30,0); weed(p,13,f,20,1); weed(p,70,f,16,2); weed(p,150,f,22,.5); weed(p,258,f,28,1.5); weed(p,300,f,36,2.5); weed(p,306,f,22,.3);
  p.stamp(coralPix('#c48bff','#5b2d8f'),36,f-16); p.stamp(coralPix('#ff7a8a','#8a2a4a'),262,f-18); p.stamp(coralPix('#ffa25a','#8a4a1a'),284,f-14);
  w.plats.forEach(function(q,i){ if(q.type!=='plat'&&q.type!=='goal') return; var a=platArt(th,q); p.stamp(a.make(),q.x+a.dx,q.y+a.dy); if(q.type==='plat'&&i%4===1) weed(p,q.x+3,q.y-1,6,i); });
  w.elev.forEach(function(e){ p.stamp(clamPix(),e.x-1,e.bottom-9); });
  return p;
}
function skyBg(w){
  var th=w.th, H=w.H, f=w.floorY, p=new Pix(W,H), x, y, i;
  vgrad(p,0,0,W,H,th.grad);
  if(th.decor==='night'){
    for(i=0;i<220;i++){ var sx=(i*73+11)%W, sy=90+(i*131)%(H-140); var dark=sy>H*.3; if(!dark&&i%3) continue; p.px(sx,sy,'#fff4fb'); if(i%11===0){ p.px(sx-1,sy,'#fff4fb'); p.px(sx+1,sy,'#fff4fb'); p.px(sx,sy-1,'#fff4fb'); p.px(sx,sy+1,'#fff4fb'); } }
    var my=Math.round(H*.52), mcut=p.at(257,my-5); p.ell(250,my,16,16,'#fff1c1'); p.ell(257,my-5,14,14,mcut);
    for(y=0;y<70;y++) for(x=0;x<W;x++){ var d=Math.hypot(x-160,y-26), a=Math.atan2(y-26,x-160), band=Math.floor((a+Math.PI*2)/(Math.PI/12)); if(d>44&&band%2===0&&bayer(x,y)<.5*(1-d/240)) p.px(x,y,'#fff1c9'); }
    p.ell(160,26,40,40,'#ffd447'); p.ell(160,26,35,35,'#ffe98a'); p.ell(160,26,28,28,'#fff4c2');
  } else if(th.decor==='candy'){
    var SPR=['#ff6f9f','#ffd447','#6fd0ff','#7fe08a','#b39bff','#ffffff'];
    for(i=0;i<420;i++){ p.px((i*97+13)%W,(i*61+29)%H,SPR[i%6]); }
    for(i=0;i*130<H-160;i++){ p.stamp(lollipopPix(SPR[i%5]),i%2?2:W-16,f-120-i*130); }
    for(i=0;i<8;i++) p.ell(i*48,f+10,34,22,i%2?'#ffc7e4':'#e2c9ff');
  } else if(th.decor==='vine'){
    for(y=0;y<H;y++){ var vx=Math.round(160+Math.sin(y/70)*70+Math.sin(y/23)*6); for(x=-6;x<=6;x++) p.px(vx+x,y,Math.abs(x)>4?'#2b7a43':(x<-1?'#3fae5a':'#5fca6e')); if(y%46===0){ var lx=vx+(y%92?9:-30); var lf=leafPix(22); p.stamp(lf,lx,y-4); } if(y%130===65) p.stamp(flowerPix(y%260?'#ff8fc8':'#c48bff'),vx+(y%260?10:-24),y); }
  } else if(th.decor==='snow'){
    for(i=0;i<9;i++){ var px0=i*44-20, pk=60+(i*37)%50; p.poly([[px0,f+20],[px0+30,f-pk],[px0+62,f+20]],i%2?'#e2ecff':'#d2e0fb'); p.poly([[px0+21,f-pk+13],[px0+30,f-pk],[px0+39,f-pk+13]],'#ffffff'); }
    for(i=0;i<260;i++){ var fx2=(i*89+7)%W, fy2=(i*53+11)%H; p.px(fx2,fy2,'#ffffff'); if(i%7===0){ p.px(fx2-1,fy2,'#ffffff'); p.px(fx2+1,fy2,'#ffffff'); p.px(fx2,fy2-1,'#ffffff'); p.px(fx2,fy2+1,'#ffffff'); } }
  } else if(th.decor==='rainbow'){
    var RBF=['#ffd2dc','#ffe2c8','#fff3c8','#d8f5d8','#d2ecff','#e4dcff'];
    for(i=0;i<5;i++){ var cx=(i*131)%W, cy=200+i*Math.round((H-300)/5), Rr=60+(i%3)*20; for(y=cy-Rr;y<=cy;y++) for(x=cx-Rr;x<=cx+Rr;x++){ var dd=Math.hypot(x+.5-cx,y+.5-cy); if(dd<=Rr&&dd>Rr-12&&bayer(x,y)<.6) p.px(x,y,RBF[Math.min(5,Math.floor((Rr-dd)/2))]); } }
  } else {
    for(i=0;i<90;i++){ var sx2=(i*73+11)%W, sy2=200+(i*131)%(H-560); p.px(sx2,sy2,'#fff4fb'); }
  }
  if(th.decor!=='night'&&th.decor!=='vine') for(i=0;i<16;i++){ var c2=(i*97+30)%300+10, cy2=120+(i*233)%(H-260), r=14+(i%4)*5; p.ell(c2,cy2,r,r*.35,'#f6f0ff'); p.ell(c2-r*.4,cy2-3,r*.5,r*.3,'#f6f0ff'); p.ell(c2+r*.3,cy2-4,r*.45,r*.35,'#f6f0ff'); }
  if(th.ocean) for(x=0;x<W;x++){ var t3=f+6+Math.round(Math.sin(x/7)*1.2); for(y=t3;y<H;y++) p.px(x,y,y===t3?'#ffffff':(y<t3+3?'#6cc0f0':'#3d9ce0')); }
  var RB=['#ff7f9b','#ffb36b','#ffe46b','#7fe08a','#6fc8ff','#a98bff'];
  w.plats.forEach(function(arc){ if(arc.type!=='arc') return; for(var yy=arc.base-arc.R-2;yy<=arc.base;yy++) for(var xx=arc.cx-arc.R-2;xx<=arc.cx+arc.R+2;xx++){ var d2=Math.hypot(xx+.5-arc.cx,yy+.5-arc.base); if(d2<=arc.R+1&&d2>arc.R) p.px(xx,yy,OUT); else if(d2<=arc.R&&d2>arc.R-12) p.px(xx,yy,RB[Math.min(5,Math.floor((arc.R-d2)/2))]); else if(d2<=arc.R-12&&d2>arc.R-13) p.px(xx,yy,OUT); } });
  var fk=th.plat==='candy'?'candy':th.plat==='night'?'night':th.plat==='ice'?'icy':'normal';
  p.stamp(cloudPix(W+8,fk),-4,f-5); if(!th.ocean) p.rect(0,f+7,W,H-f-7,CLOUDS[fk][1]);
  w.plats.forEach(function(q){ if(q.type==='plat'&&!q.puff||q.type==='bouncy'||q.type==='goal'){ var a=platArt(th,q); p.stamp(a.make(),q.x+a.dx,q.y+a.dy); } });
  w.rains.forEach(function(r){ p.stamp(cloudPix(r.w,'rain'),r.x-1,r.y-5); });
  return p;
}

function themeThumb(key){
  var th=THEMES[key], p=new Pix(64,40);
  vgrad(p,0,0,64,40,th.grad.slice(-4));
  if(th.kind==='isle'){
    vgrad(p,0,0,64,30,ISLE_LOOK[key].sky); p.rect(0,30,64,10,ISLE_LOOK[key].water[1]); p.rect(0,30,64,1,'#ffffff');
    p.ell(14,32,16,6,ISLE_LOOK[key].top,function(x,y){return y<=32;}); p.rect(0,32,30,8,ISLE_LOOK[key].soil);
    if(key==='palm'){ for(var y3=10;y3<32;y3++) p.rect(46+Math.round((y3-10)*(y3-10)/60),y3,2,1,'#9a6232'); p.stamp(frondPix(22),36,6); p.stamp(parrotPix(0),6,8); }
    else { p.ell(44,14,16,11,'#3f9a58'); p.ell(44,10,9,6,'#6fd17f'); p.rect(42,20,5,12,'#7a4a2a'); p.stamp(branchPix(18),24,18); p.stamp(mushPix(12),4,22); }
    p.stamp(fairyBigPix(1).canvas?fairyBigPix(1):fairyBigPix(1),18,4);
    return p;
  }
  if(th.kind==='sea'){
    if(key==='lagoon'){ vgrad(p,0,0,64,8,['#f7b9d7','#d6b9f3']); wave(p,64,7,1,4,['#ffffff']); }
    if(key==='ship'){ p.poly([[4,30],[10,8],[58,2],[62,26]],'#2c6280'); p.ell(22,16,3,3,'#5a9ab8'); p.ell(40,12,3,3,'#5a9ab8'); }
    for(var x=0;x<64;x++){ for(var y=35;y<40;y++) p.px(x,y,y===35?'#f6dca6':'#e6c189'); }
    var Lg=LEDGE[key]||LEDGE.deep; if(key==='ship'){ p.stamp(plankPix(22),6,24); p.stamp(barrelPix(18),38,13); p.stamp(chestPix(),44,24); } else { p.stamp(ledge2(20,Lg),6,24); p.stamp(ledge2(18,Lg),36,13); }
    if(key==='deep') p.stamp(jellyPix(0),44,18); if(key==='reef') p.stamp(coralPix('#ff7a8a','#8a2a4a'),4,19); if(key==='lagoon') p.stamp(turtlePix(18),30,26);
    weed(p,58,35,10,0);
  } else {
    if(key==='night'){ for(var i=0;i<16;i++) p.px((i*23+5)%64,(i*13+3)%30,'#fff4fb'); var tc=p.at(55,7); p.ell(52,9,6,6,'#fff1c1'); p.ell(55,7,5,5,tc); p.stamp(bigStarPix(),8,16); p.stamp(cloudPix(22,'night'),34,24); }
    else if(key==='snow'){ for(var i2=0;i2<30;i2++) p.px((i2*29+3)%64,(i2*17+5)%36,'#ffffff'); p.poly([[0,40],[16,22],[32,40]],'#d2e0fb'); p.poly([[30,40],[48,18],[64,40]],'#e2ecff'); p.stamp(icePix(22),4,24); p.stamp(icePix(20),36,12); p.stamp(snowBirdPix(0),42,26); }
    else if(key==='candy'){ p.stamp(cloudPix(24,'candy'),4,26); p.stamp(cloudPix(22,'candyB'),36,14); p.stamp(lollipopPix('#ff6f9f'),46,18); }
    else if(key==='vine'){ for(var y2=0;y2<40;y2++){ var vx=Math.round(32+Math.sin(y2/9)*8); p.rect(vx-2,y2,5,1,'#3fae5a'); } p.stamp(leafPix(20),2,24); p.stamp(leafPix(18),40,12); p.stamp(flowerPix('#ff8fc8'),44,26); }
    else if(key==='rainbow'){ var RB=['#ff7f9b','#ffb36b','#ffe46b','#7fe08a','#6fc8ff','#a98bff']; for(var yy=6;yy<=30;yy++) for(var xx=8;xx<=56;xx++){ var d=Math.hypot(xx+.5-32,yy+.5-30); if(d<=22&&d>10) p.px(xx,yy,RB[Math.min(5,Math.floor((22-d)/2))]); } p.stamp(cloudPix(20,'normal'),2,27); p.stamp(cloudPix(20,'normal'),42,27); }
    else { p.stamp(cloudPix(24,'normal'),4,26); p.stamp(cloudPix(22,'normal'),36,14); p.stamp(birdPix(0),40,28); }
  }
  return p;
}

/* ---------- build a level to play ---------- */
function buildWorld(idx){
  if(THEMES[LEVELS[idx].theme].kind==='isle') return buildIsland(idx);
  var def=LEVELS[idx], th=THEMES[def.theme], L=def.hand==='sea1'?handSea1():def.hand==='sky1'?handSky1():genLevel(def);
  var w={camX:0,idx:idx,def:def,th:th,kind:th.kind,H:L.H,floorY:L.floor,plats:[],jellies:[],elev:L.elev,haz:[],rains:L.rains,items:[],cps:[],path:L.path,goal:L.goal,surface:L.surface,cam:0};
  w.phys=PHYS[th.kind];
  L.plats.forEach(function(p){ p.active=true; p.dx=0; if(p.type==='drift'&&p.x0==null) p.x0=p.x; if(p.puffable&&hard){ p.puff=true; p.timer=0; p.respawn=0; } w.plats.push(p); });
  w.floor=L.floorP;
  L.jellies.forEach(function(j){ j.squish=0; j.bob=0; w.jellies.push(j); });
  L.haz.forEach(function(h,i){ if(h.hardOnly&&!hard) return; var span=Math.max(1,h.x1-h.x0); w.haz.push({kind:h.kind,x0:h.x0,x1:h.x1,x:h.x0+((i*37)%span),y0:h.y,y:h.y,dir:i%2?-1:1,spd:(hard?.95:.5)*(h.kind==='crab'?.8:1),ph:i*1.7,r:7}); });
  L.items.forEach(function(it){ w.items.push({x:it.x,y:it.y,got:false,ph:(it.x*7+it.y)%16}); });
  L.cps.forEach(function(c,i){ if(hard&&!c.keep) return; w.cps.push({x:c.x,y:c.y,plat:c.plat,active:false,idx:i}); });
  w.start={x:40,y:L.floor,plat:L.floorP,idx:-1}; w.cp=w.start;
  w.goalY=L.surface!=null?L.surface:L.goal.y;
  w.bg=TEST&&window.__noBg?document.createElement('canvas'):(th.kind==='sea'?seaBg(w):skyBg(w)).canvas();
  return w;
}
