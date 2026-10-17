/* title, splash cartoon and sunrise scenes (rebuilt when the screen shape changes) */
function sceneBg(name){
  var key=name+VH; if(scn[key]) return scn[key];
  var p=new Pix(W,VH), wl=Math.round(VH*(name==='title'?.7:.6));
  if(name==='title'||name==='cut'){
    vgrad(p,0,0,W,wl,name==='title'?['#ffd66e','#ffb070','#ff94a2','#e79bd4','#bba5ef']:['#f7b9d7','#e2b6ee','#c9bbf5','#b0cdfa']);
    if(name==='title'){ for(var y=0;y<60;y++) for(var x=0;x<W;x++){ var d=Math.hypot(x-160,y-wl); var a=Math.atan2(y-wl,x-160),b=Math.floor((a+Math.PI*2)/(Math.PI/12)); if(d>60&&b%2===0&&bayer(x,y)<.45) p.px(x,y,'#ffe7a6'); } }
    vgrad(p,0,wl,W,VH-wl,['#4aa6e2','#2f80c6','#2262a8','#183f80']); wave(p,W,wl-1,1.2,6,['#ffffff','#bfe8ff']);
    if(name==='title'){ p.stamp(cloudPix(70,'normal'),226,wl-30); p.stamp(cloudPix(40,'normal'),20,30); p.stamp(cloudPix(30,'normal'),270,18); }
  } else if(name==='dawn'){
    var sunY=Math.round(VH*.66);
    vgrad(p,0,0,W,sunY+20,['#ff7fa8','#ff9196','#ffa77f','#ffbd6c','#ffd36a','#ffe7a0']); p.rect(0,sunY+20,W,VH,'#ffe7a0');
    for(var i=0;i<14;i++) p.px((i*71+13)%W,(i*17)%40,'#ffe6f0');
    p.ell(160,sunY,46,46,'#ffd447'); p.ell(160,sunY,41,41,'#ffe98a'); p.ell(160,sunY,34,34,'#fff4c2');
  }
  scn[key]={canvas:p.canvas(),wl:wl};
  if(name==='dawn'){
    var sunY2=Math.round(VH*.66), fg=new Pix(W,VH);
    for(i=-1;i<13;i++){ fg.ell(i*28+10,sunY2-1,20,9,'#fff3e0'); fg.ell(i*28+10,sunY2,20,9,'#ffc9da'); } fg.rect(0,sunY2,W,VH,'#ffc9da');
    for(i=-1;i<13;i++){ fg.ell(i*32+20,sunY2+17,22,10,'#fff3e0'); fg.ell(i*32+20,sunY2+18,22,10,'#ffdce6'); } fg.rect(0,sunY2+18,W,VH,'#ffdce6');
    for(i=-1;i<12;i++){ fg.ell(i*36+4,sunY2+38,24,10,'#fffaf0'); fg.ell(i*36+4,sunY2+39,24,10,'#fff2f6'); } fg.rect(0,sunY2+39,W,VH,'#fff2f6');
    fg.stamp(cloudPix(84,'dawn'),46,sunY2+10);
    scn[key].fg=fg.canvas(); scn[key].sunY=sunY2;
    scn[key].rays=[];
    for(var k=0;k<6;k++){ var rp=new Pix(W,sunY2+4); for(var ry=0;ry<sunY2+4;ry++) for(var rx=0;rx<W;rx++){ var dd=Math.hypot(rx-160,ry-sunY2); if(dd<50) continue; var aa=Math.atan2(ry-sunY2,rx-160)+k*(Math.PI/36), band=Math.floor((aa+Math.PI*2)/(Math.PI/12)); if(band%2===0&&bayer(rx,ry)<.55*(1-dd/300)) rp.px(rx,ry,'#fff1c9'); } scn[key].rays.push(rp.canvas()); }
  }
  return scn[key];
}
function drawTitle(){
  var s=sceneBg('title'); g.drawImage(s.canvas,0,0);
  var b=(tick>>4)%2;
  put(g,'merHead',function(){return mermaidPix(13);},44,s.wl-14+b);
  g.drawImage(s.canvas,0,s.wl+1,W,VH-s.wl-1,0,s.wl+1,W,VH-s.wl-1);
  put(g,'uni',function(){return unicornPix(false);},240,s.wl-56+((tick>>4)%2?0:-1));
  for(var i=0;i<6;i++) if((tick+i*11)%40<14) sparkle(g,(i*53+30)%300+10,(i*29)%Math.round(VH*.5)+10,1);
}
function drawCut(){
  var s=sceneBg('cut'), wl=s.wl, t=cut; g.drawImage(s.canvas,0,0);
  var cap='Splash!';
  if(t<150){
    var y=t<50?wl+24-ease(t/50)*78:wl-54+Math.round(Math.sin(t/10)*2);
    put(g,'merA',function(){return mermaidPix(0,false);},152,y);
    g.drawImage(s.canvas,0,wl+1,W,VH-wl-1,0,wl+1,W,VH-wl-1);
    if(t>14&&t<90){ for(var i=0;i<12;i++){ var a=Math.PI*(.12+.76*i/11), d=(t-14)*.9+((i*7)%5); g.fillStyle=i%2?'#ffffff':'#bfe8ff'; g.fillRect(Math.round(160+Math.cos(a)*d*1.3),Math.round(wl-Math.sin(a)*d*.9+d*d*.012),2,2); } }
    var r=Math.min(40,t*.5); g.fillStyle='#e8f6ff'; g.fillRect(150-r,wl+5,10,1); g.fillRect(162+r,wl+5,10,1);
  } else if(t<300){
    cap='Hop on!'; var u=t-150, cy=lerp(-50,wl-12,ease(Math.min(1,u/80)));
    put(g,'merHead',function(){return mermaidPix(13);},110,wl-14+((t>>4)%2));
    g.drawImage(s.canvas,0,wl+1,W,VH-wl-1,0,wl+1,W,VH-wl-1);
    put(g,'cl48n',function(){return cloudPix(48,'normal');},176,cy);
    put(g,'uni',function(){return unicornPix(false);},180,cy-27);
    if(u>90){ var hy=wl-40-(u-90)*.3; put(g,'heart',heartPix,150,hy); }
    for(var k=0;k<4;k++) if((t+k*7)%20<8) sparkle(g,186+k*12,cy-34-(k%2)*8,1);
  } else {
    cap='Up we go!'; var v=t-300, ry=wl-48-v*v*.018;
    for(var j=0;j<10;j++){ var q=(j*5+t)%40; sparkle(g,150-q*.6+(j%3)*4,ry+46+q*1.1,q<10?1:0,j%2?'#ffd0ea':'#fff3a6'); }
    put(g,'rideR',function(){return riderPix();},140,ry);
  }
  setCaption(cap);
}
function drawDawn(){
  var s=sceneBg('dawn'); g.drawImage(s.canvas,0,0); g.drawImage(s.rays[(tick>>3)%6],0,0); g.drawImage(s.fg,0,0);
  var C=['#ff6f9f','#ffd447','#6fd0ff','#ffffff','#7fe08a','#b39bff'];
  for(var i=0;i<36;i++){ var x=Math.round((i*53+tick*((i%3)+1)*.08)%W), y=Math.round((i*37+tick*(.15+(i%4)*.1))%(VH+20))-10; g.fillStyle=C[i%6]; g.fillRect(x,y,(tick>>3)%2?2:1,2); }
  var crown=hard||save.crown;
  put(g,crown?'rideC':'rideR',function(){return riderPix(crown);},66,s.sunY+12-42+((tick>>4)%2?0:-1));
  sparkle(g,60,s.sunY-20,(tick>>3)%2?2:1); sparkle(g,118,s.sunY-30,(tick>>3)%2?1:2,'#ffffff');
}
