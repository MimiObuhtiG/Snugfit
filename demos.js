/* SnugFit move demos: a posable figure animated between key poses.
   Side view, facing right. Angles: 0 = straight down, 90 = forward (right), 180 = up.
   A pose sets the hip (x,y), torso angle t (0 upright, 90 leaning flat forward, -90 lying with head left)
   and targets for each hand/foot. Arms and legs are solved with two-bone IK, so poses stay natural
   when the figure moves between them. Hand targets may be {r:[forward,down]} relative to the shoulder. */
(function(){
const LEN={T:34,U:15,F:14,H:24,S:24,R:8.5};
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function shoulderOf(p){return [p.x+Math.sin(rad(p.t))*LEN.T,p.y-Math.cos(rad(p.t))*LEN.T]}
function headOf(p){const k=LEN.T+LEN.R+2;return [p.x+Math.sin(rad(p.t))*k,p.y-Math.cos(rad(p.t))*k]}
function relTarget(p,r){const [sx,sy]=shoulderOf(p),c=Math.cos(rad(p.t)),s=Math.sin(rad(p.t));return [sx+r[0]*c-r[1]*s,sy+r[0]*s+r[1]*c]}
function ik(P,Q,L1,L2,sign){
 let dx=Q[0]-P[0],dy=Q[1]-P[1];let d=Math.hypot(dx,dy)||0.001;const max=L1+L2-0.05,min=Math.abs(L1-L2)+0.05;
 const th=deg(Math.atan2(dx,dy));d=Math.max(min,Math.min(max,d));
 const a=deg(Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d)))));
 const u=th+sign*a;const J=[P[0]+Math.sin(rad(u))*L1,P[1]+Math.cos(rad(u))*L1];
 const E=[P[0]+Math.sin(rad(th))*d,P[1]+Math.cos(rad(th))*d];return [J,E]}
function resolve(p){const o={x:p.x,y:p.y,t:p.t};
 for(const k of ['h','H']){const v=p[k];o[k]=Array.isArray(v)?v:relTarget(p,v.r)}
 o.f=p.f;o.F=p.F;o.ab=p.ab==null?-1:p.ab;o.lb=p.lb==null?1:p.lb;o.prop=p.prop;return o}
function lerp(a,b,k){return a+(b-a)*k}
function lerpPose(A,B,k){const o={x:lerp(A.x,B.x,k),y:lerp(A.y,B.y,k),t:lerp(A.t,B.t,k),ab:B.ab,lb:B.lb,prop:B.prop};
 for(const j of ['h','H','f','F'])o[j]=[lerp(A[j][0],B[j][0],k),lerp(A[j][1],B[j][1],k)];return o}
const seg=(a,b,w,cls)=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke-width="${w}" class="${cls}"/>`;
function figure(p){
 const hip=[p.x,p.y],sh=shoulderOf(p),hd=headOf(p);
 const [ka,fa]=ik(hip,p.F,LEN.H,LEN.S,p.lb),[kb,fb]=ik(hip,p.f,LEN.H,LEN.S,p.lb);
 const [ea,ha]=ik(sh,p.H,LEN.U,LEN.F,p.ab),[eb,hb]=ik(sh,p.h,LEN.U,LEN.F,p.ab);
 let g='<g class="far">'+seg(hip,ka,7,'l')+seg(ka,fa,7,'l')+seg(sh,ea,6,'l')+seg(ea,ha,6,'l')+propAt(p.prop,ha)+'</g>';
 g+='<g class="near">'+seg(hip,sh,10,'l')+`<circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="${LEN.R}" class="hd"/>`+seg(hip,kb,7.5,'l')+seg(kb,fb,7.5,'l')+seg(sh,eb,6.5,'l')+seg(eb,hb,6.5,'l')+propAt(p.prop,hb)+'</g>';
 return g}
function propAt(kind,at){if(!kind)return '';const [x,y]=at;
 if(kind==='db')return `<rect x="${(x-6).toFixed(1)}" y="${(y-2).toFixed(1)}" width="12" height="4" rx="2" class="pr"/><rect x="${(x-8).toFixed(1)}" y="${(y-4.5).toFixed(1)}" width="4" height="9" rx="1.5" class="pr"/><rect x="${(x+4).toFixed(1)}" y="${(y-4.5).toFixed(1)}" width="4" height="9" rx="1.5" class="pr"/>`;
 if(kind==='bottle')return `<rect x="${(x-3).toFixed(1)}" y="${(y-12).toFixed(1)}" width="6" height="14" rx="2.5" class="pr"/>`;
 if(kind==='basket')return `<rect x="${(x-4).toFixed(1)}" y="${(y-9).toFixed(1)}" width="18" height="14" rx="3" class="pr"/>`;
 return ''}
const FLOOR='<line x1="8" y1="131.5" x2="192" y2="131.5" class="fl"/>';
const SCENES={
 bed:'<rect x="18" y="103" width="166" height="13" rx="5" class="sc"/><rect x="26" y="95" width="34" height="9" rx="4.5" class="sc2"/><rect x="24" y="116" width="6" height="15" rx="2" class="sc"/><rect x="172" y="116" width="6" height="15" rx="2" class="sc"/>'+FLOOR,
 couch:'<rect x="34" y="58" width="16" height="64" rx="7" class="sc"/><rect x="34" y="108" width="84" height="15" rx="6" class="sc"/><rect x="40" y="123" width="5" height="8" class="sc"/><rect x="108" y="123" width="5" height="8" class="sc"/>'+FLOOR,
 counter:'<rect x="124" y="72" width="70" height="60" rx="3" class="sc"/><rect x="120" y="68" width="76" height="6" rx="3" class="sc2"/>'+FLOOR,
 wall:'<rect x="58" y="10" width="14" height="122" class="sc"/>'+FLOOR,
 wallR:'<rect x="152" y="10" width="14" height="122" class="sc"/>'+FLOOR,
 door:'<rect x="134" y="14" width="8" height="118" class="sc"/><rect x="178" y="14" width="8" height="118" class="sc"/><rect x="134" y="10" width="52" height="8" class="sc"/>'+FLOOR,
 stairs:'<path d="M92 132V117h18V105h18V93h18V81h18V69h22V132z" class="sc"/><line x1="92" y1="70" x2="182" y2="18" class="rail"/>'+FLOOR,
 out:'<line x1="8" y1="131.5" x2="192" y2="131.5" class="fl"/><circle cx="170" cy="44" r="12" class="sc2"/><rect x="166" y="54" width="8" height="78" rx="3" class="sc"/><circle cx="160" cy="60" r="18" class="sc"/>',
 house:'<rect x="150" y="30" width="34" height="102" rx="2" class="sc"/><circle cx="156" cy="84" r="2.5" class="sc2"/>'+FLOOR,
 floor:FLOOR
};
/* ---- base poses ---- */
const B={
 stand:{x:100,y:80,t:0,h:[103,74],H:[97,74],f:[104,128],F:[96,128]},
 sit:{x:90,y:104,t:0,h:{r:[10,26]},H:{r:[8,26]},f:[118,128],F:[114,128]},
 back:{x:112,y:99,t:-90,h:[104,101],H:[102,101],f:[134,100],F:[132,100]},
 fours:{x:112,y:74,t:84,h:[147,100],H:[145,100],f:[90,100],F:[88,100]},
 prone:{x:94,y:99,t:90,h:[132,101],H:[130,101],f:[48,100],F:[48,100]}
};
const P=(base,o)=>Object.assign({},B[base],o||{});
const TT={f:[136,76],F:[134,76]};
const walk=(len,arm,y)=>[P('stand',{y:y||80,f:[100+len,128],F:[100-len,128],h:[100-arm,72],H:[100+arm,72]}),P('stand',{y:(y||80)-2,f:[102,128],F:[92,114]}),P('stand',{y:y||80,f:[100-len,128],F:[100+len,128],h:[100+arm,72],H:[100-arm,72]}),P('stand',{y:(y||80)-2,f:[92,114],F:[102,128]})];
const D={
 // core
 deadbug:{s:'bed',k:[P('back',{h:[80,70],H:[80,70],...TT}),P('back',{h:[50,98],H:[80,70],f:[136,76],F:[160,94]}),P('back',{h:[80,70],H:[80,70],...TT}),P('back',{h:[80,70],H:[50,98],f:[160,94],F:[134,76]})],d:1100},
 pelvictilt:{s:'bed',k:[P('back'),P('back',{y:97,t:-86})],d:1300},
 toetaps:{s:'bed',k:[P('back',TT),P('back',{f:[134,99],F:[134,76]}),P('back',TT),P('back',{f:[136,76],F:[132,99]})],d:900},
 revcrunch:{s:'bed',k:[P('back',TT),P('back',{y:95,t:-96,f:[112,68],F:[110,68]})],d:1100},
 bicycle:{s:'bed',k:[P('back',{t:-80,h:{r:[-6,-12]},H:{r:[-6,-12]},f:[110,72],F:[160,92]}),P('back',{t:-80,h:{r:[-6,-12]},H:{r:[-6,-12]},f:[160,92],F:[110,72]})],d:1000},
 legraise:{s:'bed',k:[P('back'),P('back',TT)],d:1200},
 flutter:{s:'bed',k:[P('back',{h:[110,102],H:[108,102],f:[160,90],F:[160,98]}),P('back',{h:[110,102],H:[108,102],f:[160,98],F:[160,90]})],d:380},
 leanback:{s:'couch',k:[P('sit',{h:{r:[12,12]},H:{r:[12,14]}}),P('sit',{t:-22,h:{r:[12,12]},H:{r:[12,14]}})],d:1400},
 seatedtwist:{s:'couch',k:[P('sit',{h:{r:[20,18]},H:{r:[18,18]}}),P('sit',{t:4,h:{r:[8,18]},H:{r:[22,16]}}),P('sit',{h:{r:[20,18]},H:{r:[18,18]}}),P('sit',{t:-4,h:{r:[22,16]},H:{r:[8,18]}})],d:800},
 kneetuck:{s:'couch',k:[P('sit',{t:-22,h:[82,108],H:[80,108],f:[140,108],F:[138,108]}),P('sit',{t:-14,h:[82,108],H:[80,108],f:[110,92],F:[108,92]})],d:1000},
 sidebend:{s:'couch',k:[P('sit',{h:{r:[-4,-10]},H:{r:[4,26]},prop:'db'}),P('sit',{t:-16,h:{r:[-4,-10]},H:{r:[4,26]},prop:'db'})],d:1100},
 birddog:{s:'bed',k:[P('fours'),P('fours',{h:[176,66],F:[64,72]}),P('fours'),P('fours',{H:[176,66],f:[64,72]})],d:1100},
 sideplank:{s:'bed',k:[P('back',{x:112,y:99,t:-78,h:[94,101],H:[94,101],f:[158,100],F:[156,100]}),P('back',{x:112,y:86,t:-72,h:[94,101],H:[94,101],f:[158,100],F:[156,100]})],d:1300},
 standcrunch:{s:'floor',k:[P('stand',{h:{r:[-2,-12]},H:{r:[-2,-12]}}),P('stand',{t:14,h:{r:[-2,-12]},H:{r:[-2,-12]},f:[122,100]}),P('stand',{h:{r:[-2,-12]},H:{r:[-2,-12]}}),P('stand',{t:14,h:{r:[-2,-12]},H:{r:[-2,-12]},F:[122,100]})],d:800},
 counterplank:{s:'counter',k:[P('stand',{x:76,y:86,t:60,h:[131,66],H:[129,66],f:[48,126],F:[46,126]}),P('stand',{x:76,y:84,t:60,h:[131,66],H:[129,66],f:[48,126],F:[46,126]})],d:1500},
 // lower
 bridge:{s:'bed',k:[P('back',{h:[100,101],H:[98,101]}),P('back',{y:84,t:-112,h:[100,101],H:[98,101]})],d:1200},
 clamshell:{s:'bed',k:[P('back',{t:-90,h:[70,92],H:[70,92],f:[128,101],F:[126,101],lb:-1}),P('back',{t:-90,h:[70,92],H:[70,92],f:[128,100],F:[126,101],lb:1})],d:1100},
 sideleg:{s:'bed',k:[P('back',{h:[70,92],H:[106,98],f:[160,100],F:[160,101]}),P('back',{h:[70,92],H:[106,98],f:[156,76],F:[160,101]})],d:1100},
 sittostand:{s:'couch',k:[P('sit',{f:[116,128],F:[112,128]}),P('sit',{x:98,y:100,t:38,h:{r:[16,14]},H:{r:[16,14]},f:[116,128],F:[112,128]}),P('stand',{x:112,f:[116,128],F:[112,128],h:[114,74],H:[110,74]}),P('sit',{x:98,y:100,t:38,h:{r:[16,14]},H:{r:[16,14]},f:[116,128],F:[112,128]})],d:900},
 legext:{s:'couch',k:[P('sit'),P('sit',{f:[138,104]}),P('sit'),P('sit',{F:[136,104]})],d:900},
 calfraise:{s:'counter',k:[P('stand',{h:[124,70],H:[122,70]}),P('stand',{y:75,h:[124,66],H:[122,66],f:[105,124],F:[97,124]})],d:800},
 donkey:{s:'bed',k:[P('fours'),P('fours',{f:[88,50]}),P('fours'),P('fours',{F:[88,50]})],d:1000},
 chairsquat:{s:'couch',k:[P('stand',{x:104,h:{r:[12,14]},H:{r:[12,14]},f:[110,128],F:[106,128],prop:'db'}),P('stand',{x:88,y:104,t:30,h:{r:[12,14]},H:{r:[12,14]},f:[110,128],F:[106,128],prop:'db'})],d:1100},
 wallsit:{s:'wall',k:[P('stand',{x:84,h:[88,76],H:[86,76],f:[96,128],F:[94,128]}),P('stand',{x:84,y:102,h:[104,100],H:[102,100],f:[110,128],F:[108,128]}),P('stand',{x:84,y:102,h:[104,100],H:[102,100],f:[110,128],F:[108,128]})],d:1500},
 countersquat:{s:'counter',k:[P('stand',{h:[124,70],H:[122,70]}),P('stand',{x:92,y:100,t:24,h:[124,70],H:[122,70]})],d:1100},
 sidesteps:{s:'counter',k:[P('stand',{y:86,h:[124,70],H:[122,70],f:[110,128],F:[94,128]}),P('stand',{y:86,h:[124,70],H:[122,70],f:[104,128],F:[100,124]})],d:600},
 laundrysquat:{s:'floor',k:[P('stand',{h:{r:[14,14]},H:{r:[14,14]},prop:'basket'}),P('stand',{x:92,y:102,t:22,h:{r:[16,14]},H:{r:[16,14]},prop:'basket'})],d:1100},
 counterkick:{s:'counter',k:[P('stand',{t:6,h:[124,70],H:[122,70]}),P('stand',{t:14,h:[124,70],H:[122,70],f:[70,110]}),P('stand',{t:6,h:[124,70],H:[122,70]})],d:800},
 // upper
 curl:{s:'couch',k:[P('sit',{h:{r:[4,27]},H:{r:[3,27]},prop:'db'}),P('sit',{h:{r:[12,4]},H:{r:[11,4]},prop:'db'})],d:1000},
 press:{s:'couch',k:[P('sit',{h:{r:[8,2]},H:{r:[6,2]},prop:'db'}),P('sit',{h:{r:[3,-28]},H:{r:[1,-28]},prop:'db'})],d:1100},
 row:{s:'couch',k:[P('sit',{t:36,h:[116,106],H:[114,106],prop:'db'}),P('sit',{t:36,h:[102,96],H:[100,96],prop:'db'})],d:1000},
 chestpress:{s:'bed',k:[P('back',{h:[84,88],H:[82,88],prop:'db'}),P('back',{h:[79,71],H:[77,71],prop:'db'})],d:1100},
 bottlecurl:{s:'couch',k:[P('sit',{h:{r:[4,27]},H:{r:[3,27]},prop:'bottle'}),P('sit',{h:{r:[12,4]},H:{r:[11,4]},prop:'bottle'})],d:1000},
 incline:{s:'couch',k:[P('stand',{x:72,y:102,t:-66,h:[46,104],H:[44,104],f:[120,128],F:[118,128]}),P('stand',{x:70,y:106,t:-74,h:[46,104],H:[44,104],f:[120,128],F:[118,128]})],d:1000},
 dips:{s:'couch',k:[P('stand',{x:124,y:112,t:0,h:[112,108],H:[110,108],f:[150,128],F:[148,128]}),P('stand',{x:124,y:121,t:0,h:[112,108],H:[110,108],f:[150,128],F:[148,128]})],d:1000},
 counterpush:{s:'counter',k:[P('stand',{x:74,y:88,t:56,h:[128,67],H:[126,67],f:[46,128],F:[44,128]}),P('stand',{x:80,y:87,t:66,h:[128,67],H:[126,67],f:[46,128],F:[44,128]})],d:1000},
 wallpush:{s:'wallR',k:[P('stand',{x:106,t:16,h:[152,52],H:[152,54],f:[106,128],F:[100,128]}),P('stand',{x:112,t:28,h:[152,52],H:[152,54],f:[106,128],F:[100,128]})],d:1000},
 punch:{s:'couch',k:[P('sit',{h:{r:[12,10]},H:{r:[10,10]}}),P('sit',{h:{r:[29,6]},H:{r:[10,10]}}),P('sit',{h:{r:[12,10]},H:{r:[10,10]}}),P('sit',{h:{r:[12,10]},H:{r:[29,6]}})],d:420},
 armcircles:{s:'floor',k:[P('stand',{h:{r:[27,-6]},H:{r:[26,-4]}}),P('stand',{h:{r:[28,0]},H:{r:[27,2]}}),P('stand',{h:{r:[27,6]},H:{r:[26,8]}}),P('stand',{h:{r:[24,0]},H:{r:[23,2]}})],d:350},
 // cardio
 seatedmarch:{s:'couch',k:[P('sit',{h:{r:[2,26]},H:{r:[14,18]}}),P('sit',{f:[118,112],h:{r:[14,18]},H:{r:[2,26]}}),P('sit',{h:{r:[2,26]},H:{r:[14,18]}}),P('sit',{F:[116,112],h:{r:[14,18]},H:{r:[2,26]}})],d:500},
 seatedjacks:{s:'couch',k:[P('sit',{f:[116,128],F:[112,128]}),P('sit',{h:{r:[6,-28]},H:{r:[4,-28]},f:[128,128],F:[106,128]})],d:600},
 standmarch:{s:'floor',k:walk(0,10,80).map((p,i)=>i%2?P('stand',{f:i===1?[122,104]:[104,128],F:i===3?[122,104]:[96,128],h:i===1?[90,72]:[112,62],H:i===1?[112,62]:[90,72]}):P('stand')),d:450},
 stepjack:{s:'floor',k:[P('stand'),P('stand',{h:{r:[4,-28]},H:{r:[2,-28]},f:[120,128]}),P('stand'),P('stand',{h:{r:[4,-28]},H:{r:[2,-28]},F:[80,128]})],d:600},
 lyingmarch:{s:'bed',k:[P('back'),P('back',{f:[136,88]}),P('back'),P('back',{F:[134,88]})],d:700},
 speedbag:{s:'couch',k:[P('sit',{h:{r:[18,10]},H:{r:[14,16]}}),P('sit',{h:{r:[20,16]},H:{r:[16,10]}}),P('sit',{h:{r:[14,16]},H:{r:[18,10]}}),P('sit',{h:{r:[16,10]},H:{r:[20,16]}})],d:160},
 hallway:{s:'house',k:walk(14,12),d:420},
 roomtour:{s:'house',k:walk(17,16),d:360},
 tidysprint:{s:'floor',k:[P('stand'),P('stand',{x:96,y:104,t:40,h:[124,126],H:[122,126]}),P('stand',{h:[120,40],H:[116,42]})],d:700},
 // stairs
 stairclimb:{s:'stairs',k:[P('stand',{x:78,f:[100,116],F:[76,128],h:[70,70],H:[88,64]}),P('stand',{x:98,y:68,f:[100,116],F:[118,104],h:[110,58],H:[90,64]}),P('stand',{x:112,y:58,f:[100,116],F:[118,104],h:[106,62],H:[118,52]})],d:800},
 stepup:{s:'stairs',k:[P('stand',{x:78,f:[100,116],F:[76,128],h:[86,70],H:[118,40]}),P('stand',{x:98,y:68,f:[100,116],F:[98,116],h:[102,62],H:[118,40]})],d:1000},
 stepcalf:{s:'stairs',k:[P('stand',{x:98,y:70,f:[100,117],F:[98,117],h:[104,62],H:[124,48]}),P('stand',{x:98,y:64,f:[100,111],F:[98,111],h:[104,56],H:[124,42]})],d:800},
 stairpush:{s:'stairs',k:[P('stand',{x:76,y:104,t:66,h:[130,92],H:[128,92],f:[40,128],F:[38,128]}),P('stand',{x:78,y:106,t:74,h:[130,92],H:[128,92],f:[40,128],F:[38,128]})],d:1000},
 steptap:{s:'stairs',k:[P('stand',{x:80,f:[100,116],F:[80,128],h:[70,72],H:[92,64]}),P('stand',{x:80,f:[84,128],F:[100,116],h:[92,64],H:[70,72]})],d:420},
 doublestep:{s:'stairs',k:[P('stand',{x:80,f:[118,104],F:[78,128],h:[72,70],H:[96,62]}),P('stand',{x:116,y:57,f:[118,104],F:[116,104],h:[118,50],H:[136,30]})],d:1100},
 stairdips:{s:'stairs',k:[P('stand',{x:128,y:112,t:-4,h:[116,104],H:[114,104],f:[150,128],F:[148,128]}),P('stand',{x:128,y:120,t:-4,h:[116,104],H:[114,104],f:[150,128],F:[148,128]})],d:1000},
 // stretch & warm-up
 kneechest:{s:'bed',k:[P('back',{h:[106,74],H:[104,76],f:[106,78],F:[160,100]}),P('back',{h:[102,72],H:[100,74],f:[100,76],F:[160,100]})],d:1500},
 supinetwist:{s:'bed',k:[P('back',{h:[70,90],H:[86,104]}),P('back',{h:[70,90],H:[86,104],f:[142,104],F:[140,104]})],d:1600},
 childpose:{s:'bed',k:[P('fours'),P('fours',{x:92,y:94,t:104,h:[168,100],H:[166,100],f:[74,100],F:[72,100]})],d:1600},
 forwardfold:{s:'couch',k:[P('sit'),P('sit',{t:62,h:[122,126],H:[120,126]})],d:1600},
 neckroll:{s:'couch',k:[P('sit',{h:{r:[2,26]},H:{r:[2,26]}}),P('sit',{t:4,h:{r:[2,24]},H:{r:[2,24]}}),P('sit',{t:-4,h:{r:[2,24]},H:{r:[2,24]}})],d:1000},
 cobra:{s:'bed',k:[P('prone'),P('prone',{t:64})],d:1500},
 catcow:{s:'bed',k:[P('fours',{y:76,t:86}),P('fours',{y:70,t:80})],d:1400},
 figure4:{s:'couch',k:[P('sit',{f:[114,100],h:{r:[18,24]},H:{r:[16,26]}}),P('sit',{t:26,f:[114,100],h:{r:[18,24]},H:{r:[16,26]}})],d:1600},
 doorstretch:{s:'door',k:[P('stand',{x:108,t:4,h:[136,40],H:[134,40],f:[122,128],F:[100,128]}),P('stand',{x:114,t:12,h:[136,40],H:[134,40],f:[122,128],F:[100,128]})],d:1600},
 standquad:{s:'counter',k:[P('stand',{h:[124,70],H:[124,70]}),P('stand',{h:[86,88],H:[124,70],f:[86,88],lb:1})],d:1400},
 standreach:{s:'floor',k:[P('stand'),P('stand',{t:-12,h:{r:[4,-28]},H:[97,74]})],d:1500},
 heeltoe:{s:'house',k:walk(7,0,80).map(p=>Object.assign({},p,{h:[110,58],H:[90,58]})),d:700},
 seatedmarchwarm:null,
 // full-body mobility warm-up (v2.6)
 shouldercar:{s:'floor',k:[P('stand',{h:{r:[4,27]}}),P('stand',{h:{r:[27,2]}}),P('stand',{h:{r:[4,-28]}}),P('stand',{h:{r:[-22,-12]}}),P('stand',{h:{r:[-12,24]}})],d:950},
 hipcar:{s:'counter',k:[P('stand',{h:[124,70],H:[122,70]}),P('stand',{h:[124,70],H:[122,70],f:[118,104]}),P('stand',{t:4,h:[124,70],H:[122,70],f:[100,100]}),P('stand',{t:10,h:[124,70],H:[122,70],f:[74,108]}),P('stand',{h:[124,70],H:[122,70],f:[96,126]})],d:950},
 hipcircle:{s:'floor',k:[P('stand',{x:106,t:-8,h:{r:[0,31]},H:{r:[0,31]}}),P('stand',{x:100,y:82,h:{r:[0,31]},H:{r:[0,31]}}),P('stand',{x:94,t:8,h:{r:[0,31]},H:{r:[0,31]}}),P('stand',{x:100,y:78,h:{r:[0,31]},H:{r:[0,31]}})],d:700},
 torsotwist:{s:'floor',k:[P('stand',{t:-3,h:{r:[22,12]},H:{r:[-16,14]}}),P('stand',{h:{r:[6,22]},H:{r:[6,22]}}),P('stand',{t:3,h:{r:[-16,14]},H:{r:[22,12]}}),P('stand',{h:{r:[6,22]},H:{r:[6,22]}})],d:650},
 legswing:{s:'counter',k:[P('stand',{h:[124,70],H:[122,70],f:[132,108]}),P('stand',{h:[124,70],H:[122,70],f:[102,126]}),P('stand',{t:6,h:[124,70],H:[122,70],f:[72,114]}),P('stand',{h:[124,70],H:[122,70],f:[102,126]})],d:600},
 hinge:{s:'floor',k:[P('stand',{h:{r:[9,8]},H:{r:[9,8]}}),P('stand',{x:90,y:83,t:58,h:{r:[9,8]},H:{r:[9,8]}})],d:1300},
 openbook:{s:'bed',k:[P('back',{h:{r:[24,6]},H:{r:[24,6]},f:[136,94],F:[134,96]}),P('back',{h:{r:[28,-4]},H:{r:[24,6]},f:[136,94],F:[134,96]}),P('back',{h:{r:[6,-26]},H:{r:[24,6]},f:[136,94],F:[134,96]}),P('back',{h:{r:[28,-4]},H:{r:[24,6]},f:[136,94],F:[134,96]})],d:1100},
 squatreach:{s:'floor',k:[P('stand',{h:{r:[14,16]},H:{r:[14,16]}}),P('stand',{x:92,y:100,t:24,h:{r:[24,4]},H:{r:[24,4]}}),P('stand',{y:79,h:{r:[3,-28]},H:{r:[1,-28]}})],d:1000},
 // walks
 walkeasy:{s:'out',k:walk(14,12),d:440},
 walkbrisk:{s:'out',k:walk(18,18),d:320},
 walkhouse:{s:'house',k:walk(14,12),d:440},
 walkbriskin:{s:'house',k:walk(17,16),d:340}
};
D.armcircles.s='floor';
function frames(id){const m=D[id];if(!m)return null;return {s:m.s,d:m.d||900,k:m.k.map(resolve)}}
const ease=k=>0.5-0.5*Math.cos(Math.PI*k);
const running=new Set();
function svgFor(id,color,cls){const m=frames(id);if(!m)return '';
 return `<svg class="demo ${cls||''}" data-demo="${id}" viewBox="0 0 200 140" role="img" aria-label="Animated demo" style="--fig:${color}"><g class="scene">${SCENES[m.s]||FLOOR}</g><g class="fig">${figure(m.k[0])}</g></svg>`}
function tick(now){for(const el of running){if(!el.isConnected){running.delete(el);continue}
  const m=el._m;const n=m.k.length;const per=m.d;const t=Math.max(0,now-el._t0)/per;const i=Math.floor(t)%n;const k=ease(t-Math.floor(t));
  el._fig.innerHTML=figure(lerpPose(m.k[i],m.k[(i+1)%n],k))}
 if(running.size)requestAnimationFrame(tick)}
function start(root){const reduce=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
 (root||document).querySelectorAll('svg.demo[data-demo]').forEach(el=>{if(running.has(el))return;const m=frames(el.dataset.demo);if(!m)return;el._m=m;el._fig=el.querySelector('.fig');el._t0=performance.now();
  if(reduce){el._fig.innerHTML=figure(m.k[Math.min(1,m.k.length-1)]);return}
  const was=running.size;running.add(el);if(!was)requestAnimationFrame(tick)})}
function svgAt(id,i){const m=frames(id);return `<svg class="demo" viewBox="0 0 200 140" style="--fig:#8E3AA6"><g class="scene">${SCENES[m.s]||FLOOR}</g><g class="fig">${figure(m.k[i%m.k.length])}</g></svg>`}
window.SnugDemos={svgAt,svgFor,start,has:id=>!!D[id],ids:()=>Object.keys(D).filter(k=>D[k])};
})();
