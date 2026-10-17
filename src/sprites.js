/* ---------- pixel buffer ---------- */
var rgbCache={};
function rgb(hex){ var v=rgbCache[hex]; if(v) return v; var h=hex.slice(1); v=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; rgbCache[hex]=v; return v; }
function Pix(w,h){ this.w=w; this.h=h; this.d=new Array(w*h).fill(null); }
Pix.prototype.px=function(x,y,c){ x=Math.floor(x); y=Math.floor(y); if(x>=0&&y>=0&&x<this.w&&y<this.h) this.d[y*this.w+x]=c; };
Pix.prototype.at=function(x,y){ return (x>=0&&y>=0&&x<this.w&&y<this.h)?this.d[y*this.w+x]:null; };
Pix.prototype.rect=function(x,y,w,h,c){ for(var j=0;j<h;j++) for(var i=0;i<w;i++) this.px(x+i,y+j,c); };
Pix.prototype.ell=function(cx,cy,rx,ry,c,test){
  for(var y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++) for(var x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
    var dx=(x+.5-cx)/rx, dy=(y+.5-cy)/ry; if(dx*dx+dy*dy<=1&&(!test||test(x,y))) this.px(x,y,c);
  }
};
Pix.prototype.line=function(x0,y0,x1,y1,c){
  x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  var dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
  for(;;){ this.px(x0,y0,c); if(x0===x1&&y0===y1) break; var e2=2*e; if(e2>=dy){e+=dy;x0+=sx;} if(e2<=dx){e+=dx;y0+=sy;} }
};
Pix.prototype.poly=function(pts,c){
  var minY=Infinity,maxY=-Infinity; pts.forEach(function(p){minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);});
  for(var y=Math.floor(minY);y<=Math.ceil(maxY);y++){
    var yc=y+.5,xs=[];
    for(var i=0;i<pts.length;i++){ var a=pts[i],b=pts[(i+1)%pts.length]; if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc)) xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0])); }
    xs.sort(function(m,n){return m-n;});
    for(var k=0;k+1<xs.length;k+=2) for(var x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++) this.px(x,y,c);
  }
};
Pix.prototype.map=function(fn){ for(var y=0;y<this.h;y++) for(var x=0;x<this.w;x++){ var i=y*this.w+x,c=this.d[i]; if(c){ var n=fn(c,x,y); if(n!==undefined) this.d[i]=n; } } };
Pix.prototype.outline=function(c){
  var s=this.d.slice(),w=this.w,h=this.h;
  for(var y=0;y<h;y++) for(var x=0;x<w;x++){ if(s[y*w+x]) continue; if((x>0&&s[y*w+x-1])||(x<w-1&&s[y*w+x+1])||(y>0&&s[(y-1)*w+x])||(y<h-1&&s[(y+1)*w+x])) this.d[y*w+x]=c; }
  return this;
};
Pix.prototype.stamp=function(o,ox,oy,flip){ for(var y=0;y<o.h;y++) for(var x=0;x<o.w;x++){ var c=o.d[y*o.w+x]; if(c) this.px(ox+(flip?o.w-1-x:x),oy+y,c); } return this; };
Pix.prototype.canvas=function(){
  var cv=document.createElement('canvas'); cv.width=this.w; cv.height=this.h;
  var gg=cv.getContext('2d'), im=gg.createImageData(this.w,this.h);
  for(var i=0;i<this.d.length;i++){ var c=this.d[i]; if(!c) continue; var v=rgb(c); im.data[i*4]=v[0]; im.data[i*4+1]=v[1]; im.data[i*4+2]=v[2]; im.data[i*4+3]=255; }
  gg.putImageData(im,0,0); return cv;
};
function pad(p,n){ return new Pix(p.w+2*n,p.h+2*n).stamp(p,n,n); }
function flipped(p){ return new Pix(p.w,p.h).stamp(p,0,0,true); }
function fromRows(rows,pal){ var p=new Pix(rows[0].length,rows.length); rows.forEach(function(r,y){ for(var x=0;x<r.length;x++){ var ch=r[x]; if(ch!=='.'&&pal[ch]) p.px(x,y,pal[ch]); } }); return p; }
var BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function bayer(x,y){ return (BAYER[(y&3)*4+(x&3)]+.5)/16; }
function vgrad(p,x0,y0,w,h,cols){ for(var y=0;y<h;y++){ var t=(h===1?0:y/(h-1))*(cols.length-1),i=Math.min(cols.length-2,Math.floor(t)),f=t-i; for(var x=0;x<w;x++) p.px(x0+x,y0+y,f>bayer(x0+x,y0+y)?cols[i+1]:cols[i]); } }
function starPts(cx,cy,R,r){ var pts=[]; for(var i=0;i<10;i++){ var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R; pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]); } return pts; }
function clamp(v,a,b){ return v<a?a:v>b?b:v; }
function lerp(a,b,t){ return a+(b-a)*t; }
function ease(t){ return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2; }

var cache={};
function spr(key,make){ var v=cache[key]; if(!v){ v=make().canvas(); cache[key]=v; } return v; }
function put(gg,key,make,x,y){ gg.drawImage(spr(key,make),Math.round(x),Math.round(y)); }

/* ---------- characters ---------- */
var SKIN={s:'#ffd8bf',S:'#f2b798',e:OUT,w:'#ffffff',c:'#ff9db0',m:'#e0607a',b:'#ffe9a8',B:'#f2c46b',y:'#ffb03b'};
var MER=["....hhhhhh....","..hhhhhhhhyh..",".hhllhhhhyyyh.",".hhhhhhhhhyhh.","hhhhhhhhhhhhhh","hhsssssssssshh","hhswessssweshh","hhseesssseeshh","hhscsssssscshh","hhssssmmsssshh","hhhsssssssshhh","hhhhhhsshhhhhh","hhhsssssssshhh","hhsbbBssBbbshh","HhsbbbssbbbshH",".HssssssssssH.",".HsttttttttsH.","..tTttttttTt..","..ttTttttTtt..","...tttTTttt...","...ttTttTtt...","....tTttTt....",".....tttt.....","......tt......","....ffttff....","..fffFttFfff..",".fFFff..ffFFf.","ffff......ffff"];
var MER_FLICK=["....ffttff....","...ffFttFff...","..fFFf..fFFf..",".fff......fff."];
function merPal(){ return Object.assign({},SKIN,HAIRS[picks.hair],TAILS[picks.tail]); }
function mermaidPix(upto,flick){ var rows=MER.slice(0,upto||MER.length); if(flick&&!upto) rows=MER.slice(0,24).concat(MER_FLICK); return pad(fromRows(rows,merPal()),1).outline(OUT); }
function crownPix(){ return pad(fromRows(["y..y..y","yy.y.yy","yyyyyyy","yryyyby","yyyyyyy"],{y:'#ffd447',r:'#ff6f9f',b:'#6fd0ff'}),1).outline(OUT); }
function unicornPix(rider){
  var M=MANES[picks.mane],u='#fdf7ff',U='#e2d4f7',P='#b49ad8',G='#ffd447',g2='#f0a92a',p=new Pix(36,30);
  p.ell(5.5,14.5,3,3,M.m); p.ell(4,18,2.8,3,M.n); p.ell(3.5,21.5,2.4,2.6,M.k); p.ell(6.5,12.5,2,1.5,M.m);
  p.rect(9,21,3,6,U); p.rect(21,21,3,6,U);
  p.ell(15.5,17.5,9.5,5.5,u); p.map(function(c,x,y){ return (c===u&&y>=21)?U:undefined; });
  p.rect(12,21,3,6,u); p.rect(18,21,3,6,u);
  [9,12,18,21].forEach(function(x){ p.rect(x,26,3,1,P); });
  p.poly([[20,15],[23,6],[28,7],[26,17]],u); p.ell(27,9.5,4.5,4,u); p.ell(30.5,12,3,2.5,u);
  p.poly([[24,7],[25,2.5],[27,6]],u);
  p.poly([[26.5,6],[29,6],[30.5,0]],G); p.px(28,4,g2); p.px(29,2,g2);
  p.ell(23.5,7,2.5,2.2,M.m); p.ell(22,10,2.4,2.4,M.n); p.ell(21,13.5,2.2,2.6,M.k); p.ell(26,5.8,1.6,1.1,M.m);
  p.px(27,9,'#ffffff'); p.px(28,9,OUT); p.px(27,10,OUT); p.px(28,10,OUT); p.px(29,8,OUT);
  p.px(29,12,'#ffb3c7'); p.px(30,12,'#ffb3c7'); p.px(32,11,U);
  var out=pad(p,1).outline(OUT);
  if(picks.wings!=='no'){
    var w=new Pix(38,32),Wc='#ffe3f2',V='#ffb6d9';
    var pts=rider?[[3,15],[10,14],[9,7],[6,1],[2,2],[0,8]]:[[11,16],[18,16],[19,10],[17,5],[14,4],[11,7],[10,11]];
    w.poly(pts.map(function(q){return [q[0]+1,q[1]+1];}),Wc);
    if(rider){ w.line(4,14,4,6,V); w.line(7,14,6,5,V); } else { w.line(14,16,14,9,V); w.line(17,16,17,8,V); }
    out.stamp(w.outline(OUT),0,0);
  }
  return out;
}
function seatedPix(){
  var T=TAILS[picks.tail],q=new Pix(22,26);
  q.stamp(fromRows(MER.slice(0,17),merPal()),8,0);
  q.ell(14.5,18,6,2.6,T.t); q.ell(10.5,20.5,5,2.2,T.t); q.ell(6.5,22,3,1.8,T.t);
  q.px(12,18,T.T); q.px(16,18,T.T); q.px(9,20,T.T); q.px(12,21,T.T); q.px(6,22,T.T);
  q.poly([[4.5,22.5],[0.5,18.5],[0.5,25.5]],T.f); q.px(2,21,T.F); q.px(2,23,T.F);
  return pad(q,1).outline(OUT);
}
function riderPix(crown){ var p=new Pix(44,46); p.stamp(unicornPix(true),4,14); p.stamp(seatedPix(),2,11); if(crown) p.stamp(crownPix(),14,6); return p; }

/* ---------- things in the worlds ---------- */
function jellyPix(f){
  var p=new Pix(14,16);
  p.ell(7,5.5,6,5,'#ff9fe0',function(x,y){return y<=6;}); p.rect(1,6,12,2,'#e070c4');
  p.px(4,2,'#ffd2f2'); p.px(5,2,'#ffd2f2'); p.px(4,3,'#ffd2f2'); p.px(10,3,'#ffd2f2'); p.px(5,5,OUT); p.px(9,5,OUT);
  for(var i=0;i<4;i++){ var x=2+i*3; for(var y=8;y<15;y++) p.px(x+(((y+f+i)>>1)%2),y,'#ffb8ea'); }
  return pad(p,1).outline(OUT);
}
function crabPix(f){
  var p=new Pix(18,12),r='#ff6b5b',R='#d9483c';
  p.ell(9,7,6,3.5,r); p.map(function(c,x,y){ return (c===r&&y>=9)?R:undefined; });
  p.ell(2.5,4,2,2,r); p.ell(15.5,4,2,2,r); p.px(2,2,null); p.px(15,2,null);
  p.px(7,3,r); p.px(11,3,r); p.px(7,2,OUT); p.px(11,2,OUT);
  p.px(8,7,OUT); p.px(9,8,OUT); p.px(10,7,OUT);
  [4,6,12,14].forEach(function(x,i){ p.px(x+((f+i)%2),11,R); });
  return pad(p,1).outline(OUT);
}
function pufferPix(){
  var p=new Pix(18,16),y1='#ffcf4a',y2='#f2a62a';
  p.ell(9,8,6.5,6,y1); p.ell(8,10.5,4.5,3,'#fff1b8');
  [[9,1],[5,2],[13,2],[2,6],[2,11],[16,6],[16,11],[5,14],[12,14]].forEach(function(q){ p.px(q[0],q[1],y2); });
  p.poly([[15,8],[18,5],[18,11]],y2);
  p.px(6,6,'#ffffff'); p.px(7,6,'#ffffff'); p.px(6,7,'#ffffff'); p.px(7,7,OUT);
  p.px(3,9,'#e0607a'); p.px(3,10,'#e0607a'); p.px(11,8,y2); p.px(12,8,y2); p.px(12,9,y2);
  return pad(p,1).outline(OUT);
}
function pearlPix(){ var p=new Pix(4,4); p.ell(2,2,2,2,'#f3e8ff'); p.px(1,1,'#ffffff'); p.px(2,3,'#d7c4f2'); p.px(3,2,'#d7c4f2'); return pad(p,1).outline(OUT); }
function chestPix(){
  var p=new Pix(14,11),G='#ffd447';
  p.rect(0,4,14,7,'#b56d3c'); p.ell(7,4,7,4,'#cf8448',function(x,y){return y<4;});
  [3,10].forEach(function(x){ for(var y=0;y<11;y++) if(p.at(x,y)) p.px(x,y,G); });
  p.rect(0,4,14,1,G); p.rect(6,5,2,3,G); p.px(6,6,OUT); p.px(7,6,OUT); p.px(5,1,'#fff3b0');
  return pad(p,1).outline(OUT);
}
function chestOpenPix(){
  var p=new Pix(14,13),G='#ffd447';
  p.rect(1,0,12,4,'#cf8448'); p.rect(1,0,12,1,'#e39a5c'); p.rect(3,0,1,4,G); p.rect(10,0,1,4,G);
  p.rect(0,4,14,2,'#ffe066'); p.px(3,4,'#fff6c8'); p.px(7,4,'#ff8fb8'); p.px(10,4,'#7fe0ff'); p.px(5,5,'#fff6c8');
  p.rect(0,6,14,7,'#b56d3c'); [3,10].forEach(function(x){ p.rect(x,6,1,7,G); }); p.rect(0,6,14,1,G); p.rect(6,7,2,3,G);
  return pad(p,1).outline(OUT);
}
function gemPix(){
  var p=new Pix(9,8),C=['#ff8fb8','#ffd75e','#7fe08a','#6fc8ff','#b39bff'];
  p.poly([[1.5,0],[7.5,0],[9,2.5],[4.5,8],[0,2.5]],'#ffffff'); p.map(function(c,x){ return C[Math.min(4,Math.floor(x/1.8))]; }); p.px(3,1,'#ffffff');
  return pad(p,1).outline(OUT);
}
function heartPix(){ var p=fromRows([".hh.hh.","hhhhhhh","hhhhhhh",".hhhhh.","..hhh..","...h..."],{h:'#ff6f9f'}); p.px(1,1,'#ffc0d6'); return pad(p,1).outline(OUT); }
function birdPix(f){
  var p=new Pix(15,11),b='#6fb8ff',B='#3f86d6';
  p.ell(7,6.5,5,3.5,b); p.ell(6.5,8,3,1.8,'#e3f3ff'); p.ell(11,4.5,2.6,2.5,b);
  p.px(14,4,'#ffb03b'); p.px(14,5,'#ffb03b'); p.px(12,3,OUT); p.px(11,5,'#ff9db0');
  p.poly([[3,5],[0,3],[0,8]],B);
  if(f%2) p.poly([[4,6],[9,6],[6,.5]],B); else p.poly([[4,6],[9,6],[6,10.5]],B);
  return pad(p,1).outline(OUT);
}
function flagPix(on){
  var p=new Pix(12,18),R=on?['#ff7f9b','#ffb36b','#ffe46b','#7fe08a','#6fc8ff','#a98bff']:['#f4f1fb','#dcd6ee','#f4f1fb','#dcd6ee','#f4f1fb','#dcd6ee'];
  p.rect(1,1,1,17,'#f6f2ff'); p.rect(0,0,3,2,on?'#ffd447':'#c9c2e0');
  R.forEach(function(c,i){ p.rect(2,2+i,9-(i>3?1:0),1,c); });
  return pad(p,1).outline(OUT);
}
var CLOUDS={normal:['#ffffff','#e1e4ff','#9aa2da'],bouncy:['#ffd0ea','#f6a6d2','#c4609e'],rain:['#b4b8d6','#9095b8','#5b5f88'],dawn:['#fff6f8','#f9cfdd','#d98aa8'],gold:['#fff3c4','#ffd98a','#d0902e']};
function cloudPix(w,kind){
  var K=CLOUDS[kind],h=12,p=new Pix(w,h),n=Math.max(2,Math.round(w/12));
  p.ell(w/2,8,w/2,4,K[0]);
  for(var i=0;i<n;i++){ var cx=w*(i+.5)/n,r=Math.min(6,w/n*.62)+(i%2?0:1); p.ell(cx,7-(i%2?0:1.5),r,r*.85,K[0]); }
  p.map(function(c,x,y){ return y>=h-3?K[1]:undefined; });
  if(kind==='bouncy'){ var bx=Math.round(w*.3); p.px(bx,6,'#ffffff'); p.px(bx+1,6,'#ffffff'); }
  if(kind==='rain'){ p.px(Math.round(w*.35),7,OUT); p.px(Math.round(w*.62),7,OUT); p.px(Math.round(w*.45),9,OUT); p.px(Math.round(w*.52),9,OUT); }
  return pad(p,1).outline(K[2]);
}
function ledgePix(w){
  var p=new Pix(w,8);
  p.rect(1,0,w-2,1,'#93a4dc'); p.rect(0,1,w,4,'#5e6eaa'); p.rect(1,5,w-2,2,'#47558f'); p.rect(3,7,w-6,1,'#47558f');
  for(var x=1;x<w-1;x++){ var hs=(x*37)%11; if(hs<3) p.px(x,0,'#3ccf8a'); if(hs===0) p.px(x,1,'#3ccf8a'); if(hs===5) p.px(x,3,'#7484be'); }
  return pad(p,1).outline('#1c2152');
}
function coralPix(col,dark){
  var p=new Pix(13,16);
  p.rect(5,4,3,12,col); p.rect(1,6,2,6,col); p.rect(1,11,5,2,col); p.rect(10,2,2,8,col); p.rect(7,8,4,2,col);
  p.ell(2,6,1.6,1.6,col); p.ell(11,2,1.6,1.6,col); p.ell(6.5,3.5,2,2,col); p.px(6,7,dark); p.px(6,11,dark); p.px(10,5,dark);
  return pad(p,1).outline(dark);
}
function clamPix(){ var p=new Pix(14,8); p.ell(7,4,7,4,'#9a7bd6',function(x,y){return y<4;}); p.rect(0,4,14,3,'#7a5bb6'); p.ell(7,4.5,2,1.6,'#f3e8ff'); return pad(p,1).outline(OUT); }
function bubblePix(i){ var r=[1.5,2.2,3][i],s=Math.ceil(r*2)+1,p=new Pix(s,s),c=s/2; p.ell(c,c,r,r,'#c4f0ff'); if(r>2) p.ell(c,c,r-1,r-1,null); p.px(Math.floor(c-r*.5),Math.floor(c-r*.5),'#ffffff'); return p; }
function weed(p,x,base,hgt,ph){ for(var i=0;i<hgt;i++){ var xx=x+Math.round(Math.sin(i/3+ph)*1.5); p.px(xx,base-i,'#2fbf71'); p.px(xx+1,base-i,'#1f8a55'); } }
function wave(p,w,top,amp,per,cols){ for(var x=0;x<w;x++){ var yy=top+Math.round(Math.sin(x/per)*amp); for(var k=0;k<cols.length;k++) p.px(x,yy+k,cols[k]); } }

/* ---------- small drawing helpers ---------- */
var DIG={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111','x':'000101010101000'};
function text(gg,s,x,y,col){ for(var pass=0;pass<2;pass++){ gg.fillStyle=pass?col:OUT; var cx=x; for(var k=0;k<s.length;k++){ var d=DIG[s[k]]; if(d) for(var i=0;i<15;i++) if(d[i]==='1') gg.fillRect(cx+i%3+(pass?0:1),y+((i/3)|0)+(pass?0:1),1,1); cx+=4; } } }
function glow(gg,cx,cy,r,col,t){ gg.fillStyle=col; for(var y=-r;y<=r;y++) for(var x=-r;x<=r;x++){ var d=Math.hypot(x,y); if(d<=r&&d>r-3&&((x+y+t)&1)===0) gg.fillRect(cx+x,cy+y,1,1); } }
function sparkle(gg,x,y,size,col){ x=Math.round(x); y=Math.round(y); gg.fillStyle=col||'#fff3a6'; if(size<=0){ gg.fillRect(x,y,1,1); return; } gg.fillRect(x-size,y,size*2+1,1); gg.fillRect(x,y-size,1,size*2+1); gg.fillStyle='#ffffff'; gg.fillRect(x,y,1,1); }
function ring(gg,cx,cy,r,t){
  cx=Math.round(cx); cy=Math.round(cy);
  for(var y=-r;y<=r;y++) for(var x=-r;x<=r;x++){ var d=Math.hypot(x+.5,y+.5); if(d>r) continue;
    if(d>r-1.5){ gg.fillStyle='#c4f0ff'; gg.fillRect(cx+x,cy+y,1,1); } else if(d>r-3&&((x+y+t)&1)===0){ gg.fillStyle='#e6f9ff'; gg.fillRect(cx+x,cy+y,1,1); } }
  gg.fillStyle='#ffffff'; gg.fillRect(cx-Math.round(r*.5),cy-Math.round(r*.55),3,1); gg.fillRect(cx-Math.round(r*.55),cy-Math.round(r*.45),1,2);
}

/* ---------- sound (tiny synth, starts after the first tap or key) ---------- */
var actx=null, muted=false;
try{ muted=localStorage.getItem('mfuwg-muted')==='1'; }catch(e){}
function audio(){ if(!actx){ try{ var A=window.AudioContext||window.webkitAudioContext; if(A) actx=new A(); }catch(e){} } if(actx&&actx.state==='suspended') actx.resume(); return actx; }
function tone(f,d,type,vol,to,delay){
  if(muted||!actx) return; var t=actx.currentTime+(delay||0), o=actx.createOscillator(), gn=actx.createGain();
  o.type=type||'square'; o.frequency.setValueAtTime(f,t); if(to) o.frequency.exponentialRampToValueAtTime(to,t+d);
  gn.gain.setValueAtTime(vol||.06,t); gn.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(gn); gn.connect(actx.destination); o.start(t); o.stop(t+d+.03);
}
function noise(d,vol){
  if(muted||!actx) return; var n=Math.floor(actx.sampleRate*d), b=actx.createBuffer(1,n,actx.sampleRate), ch=b.getChannelData(0);
  for(var i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n);
  var s=actx.createBufferSource(), f=actx.createBiquadFilter(), gn=actx.createGain(); s.buffer=b; f.type='lowpass'; f.frequency.value=1400; gn.gain.value=vol||.12;
  s.connect(f); f.connect(gn); gn.connect(actx.destination); s.start();
}
var SFX={
  jump:function(){ tone(330,.14,'square',.035,620); },
  magic:function(){ tone(660,.14,'triangle',.06,1320); tone(990,.12,'triangle',.04,1760,.06); },
  boing:function(){ tone(170,.3,'sine',.12,700); },
  ding:function(){ tone(1047,.08,'triangle',.06); tone(1568,.14,'triangle',.05,null,.07); },
  save:function(){ [523,659,784,1047].forEach(function(f,i){ tone(f,.16,'triangle',.07,null,i*.09); }); },
  bump:function(){ tone(180,.16,'square',.04,90); },
  bubble:function(){ for(var i=0;i<5;i++) tone(380+i*110,.09,'sine',.06,680+i*110,i*.08); },
  poof:function(){ noise(.18,.06); },
  splash:function(){ noise(.45,.14); tone(500,.3,'sine',.05,180); },
  win:function(){ [523,659,784,1047,784,1047,1319].forEach(function(f,i){ tone(f,.22,'triangle',.08,null,i*.13); }); }
};

