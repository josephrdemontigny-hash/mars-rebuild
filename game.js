'use strict';
// ================= Red Planet Rebuild =================
const VERSION='1.0.0';
const TW=64,TH=32,PS=6,NP=8,N=PS*NP,OUT='#3b1a10',GS=1.25;
const $=id=>document.getElementById(id);
const now=()=>Date.now();
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function fmtT(s){s=Math.max(0,Math.ceil(s));if(s<60)return s+'s';if(s<3600){const m=Math.floor(s/60),r=s%60;return m+'m'+(r?' '+r+'s':'');}const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h+'h'+(m?' '+m+'m':'');}
function fmtN(n){n=Math.floor(n);return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e5?Math.round(n/1e3)+'k':n.toLocaleString('en-US');}
function sh(hex,f){let c=parseInt(hex.slice(1),16),r=c>>16,g2=c>>8&255,b=c&255;if(f>0){r+=(255-r)*f;g2+=(255-g2)*f;b+=(255-b)*f;}else{r*=1+f;g2*=1+f;b*=1+f;}return'rgb('+(r|0)+','+(g2|0)+','+(b|0)+')';}
function mix(a,b,t){const A=parseInt(a.slice(1),16),Bc=parseInt(b.slice(1),16);const r=lerp(A>>16,Bc>>16,t),g2=lerp(A>>8&255,Bc>>8&255,t),bb=lerp(A&255,Bc&255,t);return'rgb('+(r|0)+','+(g2|0)+','+(bb|0)+')';}

// ================= DATA =================
// cat: build | homes | deco | x(special)   cur: c (credits) | h (helium-3)
const B={
 skiphab:{n:"Skip's Hab",cat:'homes',s:2,cost:0,bt:8,per:60,c:15,xp:3,lvl:1,uniq:1,hg:58,d:'Home of a pilot who should not be flying.'},
 cmdhab:{n:'Command Hab',cat:'build',s:3,cost:150,bt:20,per:120,c:30,xp:6,lvl:1,uniq:1,unlock:'ada',hg:80,d:'Mission control. Unlocks Commander Ada.'},
 rations:{n:'Rocket Rations',cat:'build',s:2,cost:120,bt:15,per:30,c:10,xp:2,lvl:1,hg:70,d:'Freeze-dried snacks, open 25 hours a sol.'},
 pod:{n:'Pod Home',cat:'homes',s:2,cost:150,bt:20,per:60,c:10,xp:2,lvl:2,hg:46,d:'Cozy. Very, very cozy.'},
 solar:{n:'Solar Array',cat:'build',s:2,cost:200,bt:30,per:180,c:24,xp:5,lvl:2,hg:34,d:'Free power. Some dusting required.'},
 machine:{n:'Machine Shop',cat:'build',s:3,cost:400,bt:60,per:600,c:70,xp:14,lvl:2,uniq:1,unlock:'milo',hg:80,d:'Unlocks Engineer Milo.'},
 pad:{n:'Landing Pad',cat:'build',s:4,cost:25,cur:'h',bt:60,per:3600,c:260,xp:40,lvl:2,uniq:1,hg:150,d:'A proper place to land. Revolutionary.'},
 duplex:{n:'Twin Hab',cat:'homes',s:2,cost:400,bt:90,per:300,c:30,xp:6,lvl:3,hg:66,d:'Two families. One airlock. Drama.'},
 green:{n:'Greenhouse Dome',cat:'build',s:3,cost:600,bt:120,per:1200,c:100,xp:20,lvl:3,uniq:1,unlock:'fern',hg:66,d:'Potatoes! Unlocks Botanist Fern.'},
 charge:{n:'Charging Bay',cat:'build',s:2,cost:750,bt:120,per:900,c:80,xp:16,lvl:3,uniq:1,unlock:'opti',hg:70,d:'Unlocks OPTI-9, the robot with opinions.'},
 ice:{n:'Ice Drill',cat:'build',s:2,cost:500,bt:90,per:360,c:42,xp:8,lvl:3,hg:96,d:'Digs up buried ice. Water!'},
 oxy:{n:'Oxygen Plant',cat:'build',s:2,cost:900,bt:180,per:1500,c:120,xp:22,lvl:4,hg:70,d:'Breathing: highly recommended.'},
 villa:{n:'Dome Villa',cat:'homes',s:3,cost:1100,bt:240,per:1800,c:130,xp:24,lvl:4,hg:80,d:'Luxury living with a view of rocks.'},
 comms:{n:'Comms Tower',cat:'build',s:2,cost:1500,bt:300,per:7200,c:320,xp:60,lvl:4,hg:140,d:'Calls Earth. Earth rarely calls back.'},
 mine:{n:'Regolith Mine',cat:'build',s:3,cost:1200,bt:300,per:3600,c:220,xp:40,lvl:5,uniq:1,unlock:'gus',hg:110,d:'Unlocks Gus the miner.'},
 lounge:{n:'Crater Lounge',cat:'build',s:3,cost:1000,bt:240,per:1800,c:160,xp:30,lvl:5,uniq:1,hg:84,d:'Where tall tales go to get taller.'},
 flag:{n:'Colony Flag',cat:'deco',s:1,cost:30,bonus:1,lvl:1,hg:60},
 rocks:{n:'Rock Garden',cat:'deco',s:1,cost:50,bonus:1,lvl:1,hg:24},
 crystal:{n:'Teal Crystal',cat:'deco',s:1,cost:5,cur:'h',bonus:5,lvl:1,hg:44},
 bench:{n:'Dust Bench',cat:'deco',s:1,cost:40,bonus:1,lvl:2,hg:24},
 dish:{n:'Mini Dish',cat:'deco',s:1,cost:120,bonus:2,lvl:2,hg:44},
 model:{n:'Starship Monument',cat:'deco',s:1,cost:10,cur:'h',bonus:6,lvl:2,hg:76},
 planter:{n:'Shrub Planter',cat:'deco',s:1,cost:80,bonus:2,lvl:3,hg:30},
 rover:{n:'Parked Rover',cat:'deco',s:1,cost:200,bonus:3,lvl:3,hg:28},
 statue:{n:'First Boot Statue',cat:'deco',s:1,cost:500,bonus:4,lvl:4,hg:56},
 debris:{n:'Wreckage',cat:'x',s:1,hg:20},
 wreck:{n:'Crashed Starship',cat:'x',s:3,hg:60,d:"Skip's handiwork. A monument to confidence."},
};
const PATHS={dirt:{n:'Dust Track',col:'#b98a63',edge:'#8a5a3a',lvl:1},paver:{n:'Paver Walk',col:'#d8d0c3',edge:'#8f8578',lvl:1},glow:{n:'Glow Walk',col:'#2a9d94',edge:'#0f5f5a',lvl:3}};
// job: [id,name,icon,seconds,credits,xp,needsBuilding,minLevel]
const C={
 skip:{n:'Skip Rocketti',short:'Skip',role:'Pilot (allegedly)',jobs:[
  ['wander','Wander Aimlessly','🚶',4,5,2],['nap','Nap in the Rubble','😴',60,14,5],['snack','Raid Rocket Rations','🥫',240,32,10,'rations'],
  ['joy','Joyride a Rover','🏎️',3600,150,40,null,2],['excuse','Write Crash Excuses','📝',14400,420,100],['sim','Flight Simulator Practice','🕹️',43200,950,230,'cmdhab']]},
 ada:{n:'Commander Ada Stone',short:'Ada',role:'Commander',unlock:'cmdhab',hello:"Ah. The smell of scorched regolith and poor decisions.",jobs:[
  ['inspect','Inspect the Damage','🔍',10,6,3],['calib','Calibrate Solar Panels','☀️',120,22,8,'solar'],['report','Report to Earth','📡',900,70,20,'cmdhab'],
  ['lecture','Lecture Skip','🗣️',3600,160,45],['plan','Plan the Settlement','🗺️',14400,430,105],['yoga','Low-G Yoga','🧘',43200,960,230]]},
 milo:{n:'Milo Fretz',short:'Milo',role:'Engineer (nervous)',unlock:'machine',hello:"Hi! Hello! Is the ground supposed to be this... ground-y?",jobs:[
  ['recheck','Recheck Everything Twice','🔧',30,10,4],['panic','Panic Quietly','😰',240,30,10],['weld','Weld Hull Patches','🛠️',3600,155,42,'machine'],
  ['triple','Triple-check the Airlocks','🚪',14400,425,104],['invent','Invent a Thing','💡',43200,970,235,'machine']]},
 fern:{n:'Fern Marigold',short:'Fern',role:'Botanist',unlock:'green',hello:"Ooh, this soil has such angry energy. We'll fix that.",jobs:[
  ['water','Water the Potatoes','🥔',60,14,5,'green'],['sing','Sing to Seedlings','🎶',600,50,15],['compost','Compost Duty','🪱',3600,150,40],
  ['harvest','Harvest Lettuce','🥬',14400,440,108,'green'],['dunes','Meditate on the Dunes','🌅',43200,960,232]]},
 opti:{n:'OPTI-9',short:'Opti',role:'Robot (sassy)',unlock:'charge',hello:"OPTI-9 online. Scanning... Oh. It's you people.",jobs:[
  ['judge','Judge the Humans','🙄',60,15,5],['recharge','Recharge','🔋',300,36,11,'charge'],['haul','Haul Scrap','📦',3600,160,42],
  ['sass','Sarcasm Firmware Update','💾',14400,430,106],['dance','Robot Dance-off','🕺',43200,980,236]]},
 gus:{n:'Gus Regolith',short:'Gus',role:'Miner',unlock:'mine',hello:"Name's Gus. I dig holes. Don't touch my shovel.",jobs:[
  ['dig','Dig a Little','🪨',60,16,6,'mine'],['tales','Tell Old Mining Tales','🗯️',900,72,21,'lounge'],['prospect','Prospect the Ridge','⛏️',3600,165,44],
  ['deep','Deep Shift','🔦',14400,450,110,'mine'],['grumble','Grumble at Robots','😤',43200,970,234]]},
};
const CHAR_ORDER=['skip','ada','milo','fern','opti','gus'];
const LOOK={skip:{suit:'#f07a2a',trim:'#fff4e0',skin:'#f1c09a',hair:'#6b3b1f',st:'messy'},ada:{suit:'#eef3f2',trim:'#16a39a',skin:'#7a4a2c',hair:'#1b1210',st:'bun'},
 milo:{suit:'#d9a83a',trim:'#6a4a1a',skin:'#f5d3b5',hair:'#d0562a',st:'curly',glasses:1},fern:{suit:'#4aa35a',trim:'#2c6a36',skin:'#e8b48f',hair:'#c2385a',st:'long'},
 opti:{robot:1},gus:{suit:'#8a6d55',trim:'#e0b23a',skin:'#d39b74',hair:'#f2f2f2',st:'beard'}};
const LV=[0,40,150,400,800,1400,2200,3300,4800,6800,9500,13000];
const QUESTS=[
{id:'crash',lvl:1,giver:'ada',title:'Crash Course',
 intro:[['ada',"Skip. SKIP. Come in, Skip. Are you alive down there?"],['skip',"Define 'alive'. I'm upright. Mostly upright."],['ada',"You were supposed to LAND the ship. Not plant it like a lawn dart."],['skip',"In my defense, the ground came up really fast."],['ada',"The whole outpost is gone. Start with a roof over your head. Rebuild your hab."]],
 obj:[{t:'build',k:'skiphab',n:1,l:"Rebuild Skip's Hab"}],out:[['skip',"Home sweet slightly-singed home!"],['ada',"Don't get comfortable. There's scrap everywhere."]],r:{c:50,xp:20}},
{id:'tidy',req:'crash',lvl:1,giver:'ada',title:'Spring Cleaning',
 intro:[['ada',"Half a Starship is scattered across this crater. Salvage the wreckage. Just tap each piece."],['skip',"Finders keepers, right?"],['ada',"It was YOUR ship."]],
 obj:[{t:'clear',n:4,l:'Clear 4 pieces of wreckage'}],out:[['skip',"Look, a perfectly good bolt! ...It's still on fire."]],r:{c:60,xp:20}},
{id:'work',req:'crash',lvl:1,giver:'ada',title:'Get to Work',
 intro:[['ada',"Every colonist pulls their weight. Even you, Skip."],['skip',"Commander, I'll have you know I'm a world-class wanderer."],['ada',"Prove it. Tap yourself and pick a job."]],
 obj:[{t:'job',c:'skip',j:'wander',n:1,l:'Skip: Wander Aimlessly'}],out:[['skip',"I wandered SO aimlessly. Nailed it."]],r:{c:40,xp:15}},
{id:'cmd',req:'work',lvl:1,giver:'ada',title:'Ground Control',
 intro:[['ada',"I'm coming down on the next shuttle. I need a Command Hab."],['ada',"Ideally one that doesn't explode."],['skip',"No promises, but I'll try!"]],
 obj:[{t:'build',k:'cmdhab',n:1,l:'Build the Command Hab'}],out:[['skip',"Welcome to Mars, Commander! Mind the crater. I made it myself."],['ada',"I noticed."]],r:{c:80,xp:30,h:1}},
{id:'snack',req:'cmd',lvl:1,giver:'skip',title:'Snack Attack',
 intro:[['skip',"Commander, morale is dangerously low."],['ada',"Whose morale?"],['skip',"My stomach's. Can we build a ration shack? For morale?"]],
 obj:[{t:'build',k:'rations',n:1,l:'Build Rocket Rations'},{t:'collect',k:'rations',n:1,l:'Collect from Rocket Rations'}],out:[['skip',"Freeze-dried lasagna. It's like regular lasagna, but sadder."]],r:{c:80,xp:30}},
{id:'power',req:'snack',lvl:2,giver:'ada',title:'Let There Be Watts',
 intro:[['ada',"This colony runs on sunlight and stubbornness. We're short on sunlight."],['skip',"I've got plenty of stubbornness!"],['ada',"Build a Solar Array. I'll calibrate it myself."]],
 obj:[{t:'build',k:'solar',n:1,l:'Build a Solar Array'},{t:'job',c:'ada',j:'calib',n:1,l:'Ada: Calibrate Solar Panels'}],out:[['ada',"Power is online. Nobody touch anything."],['skip',"*touches something*"]],r:{c:120,xp:45}},
{id:'nerves',req:'power',lvl:2,giver:'ada',title:'Nervous Wreck',
 intro:[['ada',"We need a real engineer. Earth is sending Milo Fretz."],['skip',"Is he good?"],['ada',"Brilliant. Also afraid of... most things. Build him a Machine Shop."]],
 obj:[{t:'build',k:'machine',n:1,l:'Build the Machine Shop'},{t:'job',c:'milo',j:'recheck',n:1,l:'Milo: Recheck Everything Twice'}],out:[['milo',"Everything's fine. I checked twice. Should I check a third time? I'm going to check a third time."]],r:{c:150,xp:60}},
{id:'green',req:'nerves',lvl:3,giver:'ada',title:'Green Thumbs',
 intro:[['ada',"We can't live on rations forever."],['skip',"Watch me."],['ada',"Build a Greenhouse Dome for our botanist, Fern. And spruce the place up. Decorations boost everyone's earnings."]],
 obj:[{t:'build',k:'green',n:1,l:'Build the Greenhouse Dome'},{t:'deco',n:2,l:'Have 2 decorations'}],out:[['fern',"Hello, little potatoes! Who's a brave little tuber? You are!"],['milo',"Is... is she talking to the vegetables?"],['fern',"They talk back, Milo. You just have to listen."]],r:{c:200,xp:70,h:1}},
{id:'robot',req:'green',lvl:3,giver:'milo',title:'Robot Rights',
 intro:[['milo',"Good news! Earth shipped us a helper robot. Bad news: it has opinions."],['ada',"Build a Charging Bay and wake it up."]],
 obj:[{t:'build',k:'charge',n:1,l:'Build the Charging Bay'},{t:'job',c:'opti',j:'judge',n:1,l:'Opti: Judge the Humans'}],out:[['opti',"Analysis complete. Humans: squishy. Inefficient. Weirdly lovable. Score: four out of ten."],['skip',"Four! Hey, that's... not great."]],r:{c:250,xp:90}},
{id:'room',req:'robot',lvl:4,giver:'ada',title:'Room to Grow',
 intro:[['ada',"More colonists are coming. We need land and housing."],['opti',"Recommendation: stop putting buildings where Skip lands."],['ada',"Buy a new plot of land and get two Pod Homes up."]],
 obj:[{t:'land',n:1,l:'Expand your land once'},{t:'build',k:'pod',n:2,l:'Have 2 Pod Homes'}],out:[['ada',"Look at that. It's starting to feel like a real settlement."]],r:{c:300,xp:110,h:2}},
{id:'dig',req:'room',lvl:5,giver:'ada',title:'Digging Deep',
 intro:[['ada',"Time to mine. I've hired Gus Regolith. Forty years in the asteroid mines."],['skip',"What happened to the asteroid?"],['gus',"Don't ask, kid. Build me a mine and nobody gets hurt."]],
 obj:[{t:'build',k:'mine',n:1,l:'Build the Regolith Mine'},{t:'job',c:'gus',j:'dig',n:1,l:'Gus: Dig a Little'}],out:[['gus',"Good dirt. Real good dirt. Red as a sunburn."]],r:{c:400,xp:140}},
{id:'lounge',req:'dig',lvl:5,giver:'gus',title:'Last Call at the Crater',
 intro:[['gus',"A miner needs a place to tell stories nobody believes."],['skip',"A lounge! With snacks!"],['ada',"Fine. But nobody names a drink after the crash."]],
 obj:[{t:'build',k:'lounge',n:1,l:'Build the Crater Lounge'},{t:'job',c:'gus',j:'tales',n:1,l:'Gus: Tell Old Mining Tales'},{t:'job',c:'skip',j:'snack',n:1,l:'Skip: Raid Rocket Rations'}],out:[['skip',"I'll have one Lawn Dart, please."],['ada',"SKIP."],['opti',"Chapter one complete. More Mars coming soon. Probably."]],r:{c:500,xp:180,h:3}},
];
const QI={};QUESTS.forEach(q=>QI[q.id]=q);

// ================= DRAW HELPERS =================
const cv=$('cv');let ctx=cv.getContext('2d');let g=ctx;let T=0;let FLIPX=null;
function P(x,y,z=0){return[(x-y)*TW/2,(x+y)*TH/2-z];}
function poly(pts,fill,stroke=OUT,lw=2){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.lineJoin='round';g.stroke();}}
function box(x,y,w,h,z0,z1,top,left,right,lw=2){
 poly([P(x,y+h,z0),P(x+w,y+h,z0),P(x+w,y+h,z1),P(x,y+h,z1)],left,OUT,lw);
 poly([P(x+w,y+h,z0),P(x+w,y,z0),P(x+w,y,z1),P(x+w,y+h,z1)],right,OUT,lw);
 poly([P(x,y,z1),P(x+w,y,z1),P(x+w,y+h,z1),P(x,y+h,z1)],top,OUT,lw);}
function boxc(x,y,w,h,z0,z1,col,lw){box(x,y,w,h,z0,z1,sh(col,.18),col,sh(col,-.2),lw);}
const LF=(x,y,w,h,u,z)=>P(x+w*u,y+h,z), RF=(x,y,w,h,u,z)=>P(x+w,y+h*(1-u),z);
function quadL(x,y,w,h,u0,u1,z0,z1,col,st=OUT){poly([LF(x,y,w,h,u0,z0),LF(x,y,w,h,u1,z0),LF(x,y,w,h,u1,z1),LF(x,y,w,h,u0,z1)],col,st,1.5);}
function quadR(x,y,w,h,u0,u1,z0,z1,col,st=OUT){poly([RF(x,y,w,h,u0,z0),RF(x,y,w,h,u1,z0),RF(x,y,w,h,u1,z1),RF(x,y,w,h,u0,z1)],col,st,1.5);}
function dome(cx,cy,z,r,h,col,glass){const[X,Y]=P(cx,cy,z);const rx=r*45.25,ry=r*22.63;
 g.beginPath();g.ellipse(X,Y,rx,ry,0,0,Math.PI);g.ellipse(X,Y,rx,h,0,Math.PI,Math.PI*2);g.closePath();
 const gr=g.createRadialGradient(X-rx*.35,Y-h*.6,2,X,Y-h*.3,rx*1.15);gr.addColorStop(0,sh(col,.55));gr.addColorStop(1,sh(col,-.2));
 g.fillStyle=gr;g.globalAlpha=glass?.85:1;g.fill();g.globalAlpha=1;g.strokeStyle=OUT;g.lineWidth=2;g.stroke();
 if(glass){g.strokeStyle='rgba(59,26,16,.35)';g.lineWidth=1;for(let i=1;i<4;i++){g.beginPath();g.ellipse(X,Y,rx*i/4,h,0,Math.PI,Math.PI*2);g.stroke();}g.beginPath();g.ellipse(X,Y-h*.5,rx*.87,h*.25,0,0,Math.PI*2);g.stroke();}
 g.beginPath();g.ellipse(X-rx*.38,Y-h*.62,rx*.16,h*.12,-.5,0,7);g.fillStyle='rgba(255,255,255,.6)';g.fill();return[X,Y];}
function cyl(cx,cy,z,r,hh,col){const[X,Y]=P(cx,cy,z);const rx=r*45.25,ry=r*22.63;
 g.beginPath();g.moveTo(X-rx,Y-hh);g.lineTo(X-rx,Y);g.ellipse(X,Y,rx,ry,0,Math.PI,0,true);g.lineTo(X+rx,Y-hh);g.closePath();
 const gr=g.createLinearGradient(X-rx,0,X+rx,0);gr.addColorStop(0,sh(col,.1));gr.addColorStop(.35,sh(col,.45));gr.addColorStop(1,sh(col,-.3));g.fillStyle=gr;g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();
 g.beginPath();g.ellipse(X,Y-hh,rx,ry,0,0,7);g.fillStyle=sh(col,.25);g.fill();g.stroke();return[X,Y-hh];}
function circ(X,Y,r,fill,st=OUT,lw=2){g.beginPath();g.arc(X,Y,r,0,7);if(fill){g.fillStyle=fill;g.fill();}if(st){g.strokeStyle=st;g.lineWidth=lw;g.stroke();}}
function line(a,b,col=OUT,lw=2){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.strokeStyle=col;g.lineWidth=lw;g.lineCap='round';g.stroke();}
function sign(X,Y,txt,bg='#1fb3a6',fg='#fff',fs=10){g.save();if(FLIPX!==null){g.translate(FLIPX,0);g.scale(-1,1);g.translate(-FLIPX,0);}
 g.font=`${fs}px "Luckiest Guy",Fredoka,sans-serif`;const w=g.measureText(txt).width+10;
 g.beginPath();g.roundRect(X-w/2,Y-fs-4,w,fs+7,4);g.fillStyle=bg;g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();
 g.fillStyle=fg;g.textAlign='center';g.textBaseline='alphabetic';g.fillText(txt,X,Y);g.restore();}
function shadow(x,y,s){poly([P(x,y),P(x+s,y),P(x+s,y+s),P(x,y+s)],'rgba(70,25,10,.25)',null);}
function pad(x,y,s,col='#9c8f82'){const i=.08;box(x+i,y+i,s-2*i,s-2*i,0,4,sh(col,.15),sh(col,-.05),sh(col,-.25),1.5);}

// ---- Starship (side view; nose at -L/2, heat shield on +x side)
function ship(L,flame=0){const r=L*.085,top=-L/2,ne=top+L*.2,bot=L/2;
 const fin=(sx)=>{poly([[sx*r,bot-L*.25],[sx*(r+L*.1),bot-L*.17],[sx*(r+L*.1),bot-L*.03],[sx*r,bot-L*.04]],'#3d4349',OUT,1.6);
  poly([[sx*r*.9,ne-L*.01],[sx*(r+L*.065),ne+L*.05],[sx*(r+L*.06),ne+L*.12],[sx*r,ne+L*.11]],'#3d4349',OUT,1.6);};
 fin(-1);fin(1);
 if(flame>0){for(let i=-1;i<=1;i++){const fl=L*(.18+.08*Math.sin(T*40+i))*flame;g.beginPath();g.moveTo(i*r*.55-r*.25,bot+L*.03);g.lineTo(i*r*.55,bot+L*.03+fl);g.lineTo(i*r*.55+r*.25,bot+L*.03);g.closePath();
  const gr=g.createLinearGradient(0,bot,0,bot+fl);gr.addColorStop(0,'#fff8d0');gr.addColorStop(.4,'#ffb04a');gr.addColorStop(1,'rgba(255,90,30,0)');g.fillStyle=gr;g.fill();}}
 for(let i=-1;i<=1;i++)poly([[i*r*.55-r*.2,bot],[i*r*.55+r*.2,bot],[i*r*.55+r*.28,bot+L*.035],[i*r*.55-r*.28,bot+L*.035]],'#2a2d31',OUT,1.2);
 g.beginPath();g.moveTo(-r,bot);g.lineTo(-r,ne);g.quadraticCurveTo(-r,top+L*.03,0,top);g.quadraticCurveTo(r,top+L*.03,r,ne);g.lineTo(r,bot);g.closePath();
 const gr=g.createLinearGradient(-r,0,r,0);gr.addColorStop(0,'#868e94');gr.addColorStop(.3,'#f4f6f7');gr.addColorStop(.6,'#c4cacd');gr.addColorStop(1,'#7a8288');g.fillStyle=gr;g.fill();
 g.save();g.clip();g.fillStyle='#24272c';g.fillRect(r*.12,top,r*2,L);g.fillStyle='rgba(255,255,255,.07)';for(let yy=top;yy<bot;yy+=L*.04)g.fillRect(r*.12,yy,r*2,1);
 g.fillStyle='rgba(0,0,0,.12)';for(let yy=top+L*.25;yy<bot;yy+=L*.12)g.fillRect(-r,yy,r*2,1.2);g.restore();
 g.strokeStyle=OUT;g.lineWidth=2;g.stroke();}
// ================= BUILDING DRAWERS (x,y = tile origin, s = size, o = object) =================
const D={};
D.skiphab=(x,y,s)=>{const i=.28,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s);boxc(X,Y,w,w,4,18,'#e9e2d5');quadL(X,Y,w,w,.38,.62,4,16,'#c4532a');
 for(const u of[.2,.8])quadL(X,Y,w,w,u-.07,u+.07,9,14,'#7fd6d0');quadR(X,Y,w,w,.3,.7,8,13,'#7fd6d0');
 const[Xc,Yc]=dome(x+s/2,y+s/2,18,.56,28,'#f2ece2');g.fillStyle='#f08a3c';g.fillRect(Xc-25,Yc-6,50,4);
 line([Xc+8,Yc-26],[Xc+16,Yc-46]);circ(Xc+16,Yc-47,3,'#ff5a3a');sign(Xc,Yc+18,'SKIP','#f08a3c');
 g.fillStyle='rgba(40,20,10,.35)';g.beginPath();g.ellipse(Xc-12,Yc-10,7,4,0,0,7);g.fill();};
D.cmdhab=(x,y,s)=>{const i=.25,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#8f8a84');boxc(X,Y,w,w,4,26,'#e8ece9');g.fillStyle='#1fb3a6';
 quadL(X,Y,w,w,0,1,20,24,'#1fb3a6');quadR(X,Y,w,w,0,1,20,24,'#138a80');quadL(X,Y,w,w,.42,.6,4,18,'#2b3a40');
 for(const u of[.12,.25,.75,.88])quadL(X,Y,w,w,u-.04,u+.04,9,16,'#7fd6d0');for(const u of[.2,.4,.6,.8])quadR(X,Y,w,w,u-.05,u+.05,9,16,'#7fd6d0');
 const[Xc,Yc]=dome(x+s/2,y+s/2,26,.85,42,'#8fe0d8',1);
 line([Xc+50,Yc+4],[Xc+50,Yc-52]);poly([[Xc+50,Yc-52],[Xc+72,Yc-46],[Xc+50,Yc-40]],'#f08a3c',OUT,1.5);
 g.save();g.translate(Xc-48,Yc-6);line([0,0],[0,-16]);g.beginPath();g.ellipse(0,-20,10,6,-.5,0,7);g.fillStyle='#eef';g.fill();g.strokeStyle=OUT;g.stroke();g.restore();
 sign(Xc,Yc+26,'COMMAND','#1fb3a6');};
D.rations=(x,y,s)=>{const i=.22,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#9a8c80');boxc(X,Y,w,w,4,32,'#f4e3c3');
 quadL(X,Y,w,w,.08,.92,8,20,'#8fe0d8');quadL(X,Y,w,w,.4,.6,4,20,'#2b3a40');
 for(let k=0;k<6;k++){const u0=k/6,u1=(k+1)/6;poly([LF(X,Y,w,w,u0,26),LF(X,Y,w,w,u1,26),P(X+w*u1,Y+w+.35,18),P(X+w*u0,Y+w+.35,18)],k%2?'#fff':'#e8562a',OUT,1.2);}
 quadR(X,Y,w,w,.2,.8,10,24,'#f08a3c');const[a,b]=P(x+s/2,y+s/2,32);
 g.save();g.translate(a,b-14);g.rotate(-.5);g.scale(.18,.18);ship(130);g.restore();sign(a,b+4,'ROCKET RATIONS','#e8562a','#fff',9);};
D.pod=(x,y,s)=>{pad(x,y,s);const[Xc,Yc]=dome(x+s/2,y+s/2,4,.62,34,'#f3eee6');g.fillStyle='#1fb3a6';g.fillRect(Xc-28,Yc-12,56,4);
 g.beginPath();g.ellipse(Xc-10,Yc+2,7,10,0,Math.PI,0);g.fillStyle='#c4532a';g.fill();g.strokeStyle=OUT;g.lineWidth=1.5;g.stroke();circ(Xc+14,Yc-18,5,'#7fd6d0',OUT,1.5);};
D.duplex=(x,y,s)=>{const i=.25,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s);boxc(X,Y,w,w,4,24,'#f0e6d6');boxc(X+.1,Y+.1,w-.2,w-.2,24,42,'#e3d3bd');
 for(const z of[10,30]){quadL(X,Y,w,w,.15,.35,z,z+7,'#7fd6d0');quadL(X,Y,w,w,.65,.85,z,z+7,'#7fd6d0');quadR(X,Y,w,w,.3,.7,z,z+7,'#7fd6d0');}
 quadL(X,Y,w,w,.42,.58,4,17,'#1fb3a6');const[a,b]=P(x+s/2,y+s/2,42);cyl(x+s/2,y+s/2,42,.12,10,'#c4532a');};
D.villa=(x,y,s)=>{pad(x,y,s);for(let k=0;k<5;k++){const[a,b]=P(x+.4+k*.3,y+s-.35);circ(a,b-4,5,'#4aa35a',OUT,1.2);}
 dome(x+1,y+1.2,4,.5,26,'#f3eee6');const[Xc,Yc]=dome(x+1.7,y+1.6,4,.85,50,'#f6f1e8');dome(x+1.7,y+1.6,40,.35,14,'#8fe0d8',1);
 g.fillStyle='#f08a3c';g.fillRect(Xc-38,Yc-16,76,5);g.beginPath();g.ellipse(Xc+8,Yc+4,8,13,0,Math.PI,0);g.fillStyle='#c4532a';g.fill();g.stroke();};
D.solar=(x,y,s)=>{pad(x,y,s,'#8d8378');for(let a=0;a<2;a++)for(let b=0;b<2;b++){const px=x+.2+a*.85,py=y+.2+b*.85;
 line(P(px+.35,py+.35,0),P(px+.35,py+.35,12),'#555',3);poly([P(px,py,20),P(px+.7,py,20),P(px+.7,py+.7,8),P(px,py+.7,8)],'#2a5d9c',OUT,1.6);
 line(P(px+.35,py,20),P(px+.35,py+.7,8),'rgba(160,220,255,.6)',1);line(P(px,py+.35,14),P(px+.7,py+.35,14),'rgba(160,220,255,.6)',1);}};
D.machine=(x,y,s)=>{const i=.2,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#8a8178');boxc(X,Y,w,w,4,34,'#9aa3a8');
 poly([P(X,Y,34),P(X+w,Y,34),P(X+w,Y+w/2,48),P(X,Y+w/2,48)],'#c4532a');poly([P(X,Y+w/2,48),P(X+w,Y+w/2,48),P(X+w,Y+w,34),P(X,Y+w,34)],'#e06a3a');
 poly([P(X+w,Y+w,34),P(X+w,Y+w/2,48),P(X+w,Y,34)],'#7f878c');
 quadR(X,Y,w,w,.15,.65,4,26,'#5b646a');for(let z=8;z<26;z+=4)line(RF(X,Y,w,w,.15,z),RF(X,Y,w,w,.65,z),'rgba(0,0,0,.35)',1);
 quadL(X,Y,w,w,.15,.35,12,22,'#7fd6d0');quadL(X,Y,w,w,.6,.75,4,20,'#2b3a40');cyl(X+.4,Y+.4,40,.12,26,'#666');
 const[a,b]=P(X+.4,Y+.4,66);for(let k=0;k<3;k++){const p=(T*.4+k/3)%1;circ(a+p*10,b-p*30,4+p*8,`rgba(200,200,200,${.6*(1-p)})`,null);}
 const[sx,sy]=LF(X,Y,w,w,.5,40);sign(sx,sy,'⚙ SHOP','#f2c218',OUT,10);};
D.green=(x,y,s)=>{pad(x,y,s,'#8a8178');const[Xc,Yc]=P(x+s/2,y+s/2,4);
 g.save();g.beginPath();g.ellipse(Xc,Yc,62,31,0,0,7);g.fillStyle='#5b3a24';g.fill();g.restore();
 for(let k=0;k<9;k++){const a=k*.7,r=12+k*4;circ(Xc+Math.cos(a)*r*1.4,Yc+Math.sin(a)*r*.5-6,6+k%3*2,k%2?'#3d9a4a':'#62c06a',OUT,1.2);}
 dome(x+s/2,y+s/2,4,1.3,58,'#bff5d8',1);sign(Xc,Yc+30,'GREENHOUSE','#3d9a4a');};
D.charge=(x,y,s)=>{const i=.25,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#8a8178');boxc(X,Y,w,w,4,30,'#e6eaec');quadL(X,Y,w,w,0,1,22,26,'#1fb3a6');
 quadR(X,Y,w,w,.2,.8,6,22,'#2b3a40');const[a,b]=P(x+s/2,y+s/2,30);
 g.save();g.translate(a,b-8);poly([[-4,-14],[6,-14],[0,-4],[8,-4],[-6,14],[-1,1],[-8,1]],'#5ff0e0',OUT,1.5);g.restore();
 for(const u of[.1,.9]){const[px,py]=P(x+u*s,y+s-.05);line([px,py],[px,py-26],'#555',3);circ(px,py-28,4,`hsl(174,80%,${50+20*Math.sin(T*4)}%)`,OUT,1.5);}};
D.ice=(x,y,s)=>{pad(x,y,s,'#8a8178');cyl(x+1.4,y+.6,4,.4,30,'#9fdcf0');const[a,b]=P(x+.7,y+1.3,4);
 for(const dx of[-12,12])line([a+dx,b],[a,b-90],'#c4532a',3);for(let k=1;k<5;k++)line([a-12+k*2.4,b-k*18],[a+12-k*2.4,b-k*18],'#c4532a',2);
 const bob=Math.sin(T*3)*4;line([a,b-90],[a,b-20+bob],'#444',2);poly([[a-4,b-20+bob],[a+4,b-20+bob],[a,b-8+bob]],'#888',OUT,1.2);circ(a,b-92,3,'#ff5a3a');};
D.oxy=(x,y,s)=>{pad(x,y,s,'#8a8178');cyl(x+.6,y+.6,4,.38,44,'#eef2f3');cyl(x+1.4,y+1.3,4,.38,36,'#eef2f3');
 const[a,b]=P(x+.6,y+.6,30),[c,d]=P(x+1.4,y+1.3,24);line([a,b],[c,d],'#1fb3a6',5);line([a,b],[c,d],OUT,1);
 g.font='bold 12px Fredoka';g.fillStyle='#1fb3a6';g.textAlign='center';const[e,f]=P(x+1.4,y+1.3,14);g.fillText('O₂',e,f);};
D.comms=(x,y,s)=>{pad(x,y,s,'#8a8178');const[a,b]=P(x+1,y+1,4);
 for(const dx of[-16,16])line([a+dx,b],[a,b-130],'#d8dcdf',3);for(let k=1;k<7;k++){line([a-16+k*2.2,b-k*18],[a+16-(k+1)*2.2,b-(k+1)*18],'#aab',1.5);}
 g.save();g.translate(a-8,b-96);g.rotate(-.6);g.beginPath();g.ellipse(0,0,16,8,0,0,7);g.fillStyle='#f4f4f4';g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();line([0,0],[10,-6]);g.restore();
 circ(a,b-132,3.5,Math.sin(T*3)>0?'#ff3a2a':'#6a1a10',OUT,1.2);};
D.mine=(x,y,s)=>{pad(x,y,s,'#7a6a5c');const[h0,h1]=P(x+.9,y+.9,4);g.beginPath();g.ellipse(h0,h1,26,13,0,0,7);g.fillStyle='#1d0f08';g.fill();g.stroke();
 for(const dx of[-24,24])line([h0+dx,h1],[h0,h1-96],'#6b4a2a',4);line([h0-14,h1-50],[h0+14,h1-50],'#6b4a2a',3);circ(h0,h1-96,9,'#444',OUT,2);
 line([h0,h1-96],[h0,h1-8],'#222',1.5);const[p0,p1]=P(x+2.2,y+2.1,4);g.beginPath();g.moveTo(p0-30,p1);g.quadraticCurveTo(p0,p1-40,p0+30,p1);g.closePath();g.fillStyle='#a8452a';g.fill();g.stroke();
 for(let k=0;k<5;k++)circ(p0-14+k*7,p1-6-(k%2)*8,3,'#e07b45',OUT,1);
 const[q0,q1]=P(x+1.5,y+1.5,20);line([h0+10,h1-30],[p0,p1-30],'#555',4);sign(q0,q1+34,'MINE','#a8452a');};
D.lounge=(x,y,s)=>{const i=.22,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#7a6a5c');boxc(X,Y,w,w,4,30,'#6a3d5a');dome(x+s/2,y+s/2,30,.75,26,'#8a4d76');
 g.beginPath();const[dx,dy]=LF(X,Y,w,w,.5,4);g.ellipse(dx,dy-9,8,12,0,Math.PI,0);g.fillStyle='#2b1a24';g.fill();g.stroke();
 for(const u of[.18,.82])quadL(X,Y,w,w,u-.06,u+.06,10,20,'#ffcf6a');for(const u of[.25,.5,.75])quadR(X,Y,w,w,u-.06,u+.06,10,20,'#ffcf6a');
 const[a,b]=P(x+s/2,y+s/2,62);const on=Math.sin(T*2.4)>-.7;sign(a,b,'CRATER LOUNGE',on?'#ff5fa8':'#7a2a50',on?'#fff':'#c88',10);
 g.save();g.translate(a+50,b+22);g.rotate(.2);poly([[-6,-8],[6,-8],[0,2]],on?'#5ff0e0':'#2a6a64',OUT,1.2);line([0,2],[0,10],OUT,1.5);g.restore();};
D.pad=(x,y,s)=>{const[Xc,Yc]=P(x+s/2,y+s/2,0);g.beginPath();g.ellipse(Xc,Yc,s*41,s*20.5,0,0,7);g.fillStyle='#8e8a85';g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();
 g.beginPath();g.ellipse(Xc,Yc,s*30,s*15,0,0,7);g.strokeStyle='#f2c218';g.lineWidth=3;g.stroke();g.beginPath();g.ellipse(Xc,Yc,s*12,s*6,0,0,7);g.strokeStyle='#fff';g.lineWidth=2;g.stroke();
 g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(Xc,Yc,16,8,0,0,7);g.fill();g.save();g.translate(Xc,Yc-68);ship(140);g.restore();
 for(const dx of[-14,0,14])line([Xc+dx,Yc-2],[Xc+dx*1.6,Yc+5],'#555',2);};
D.flag=(x,y)=>{const[a,b]=P(x+.5,y+.5);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(a,b,8,4,0,0,7);g.fill();line([a,b],[a,b-52],'#ddd',3);line([a,b],[a,b-52],OUT,1);
 const w=Math.sin(T*3)*3;g.beginPath();g.moveTo(a,b-52);g.quadraticCurveTo(a+12,b-56+w,a+26,b-50);g.lineTo(a+26,b-36);g.quadraticCurveTo(a+12,b-40+w,a,b-36);g.closePath();g.fillStyle='#1fb3a6';g.fill();g.stroke();
 circ(a+13,b-44+w/2,4,'#f08a3c',null);};
D.rocks=(x,y)=>{const[a,b]=P(x+.5,y+.5);g.beginPath();g.ellipse(a,b,24,12,0,0,7);g.fillStyle='#e9c9a2';g.fill();g.strokeStyle=OUT;g.lineWidth=1.5;g.stroke();
 for(const[dx,dy,r,c]of[[-8,-2,7,'#8a4a2c'],[7,-4,9,'#a8563a'],[2,4,5,'#6e3a22']]){g.beginPath();g.ellipse(a+dx,b+dy-r*.4,r,r*.75,0,0,7);g.fillStyle=c;g.fill();g.stroke();}};
D.crystal=(x,y)=>{const[a,b]=P(x+.5,y+.5);const gl=.5+.3*Math.sin(T*2);g.fillStyle=`rgba(95,240,224,${gl*.35})`;g.beginPath();g.ellipse(a,b,22,11,0,0,7);g.fill();
 for(const[dx,h,w2]of[[-9,24,6],[8,30,7],[0,40,8]])poly([[a+dx-w2,b],[a+dx-w2*.6,b-h*.75],[a+dx,b-h],[a+dx+w2*.6,b-h*.75],[a+dx+w2,b]],'#3fd3c4',OUT,1.5);
 line([a-1,b-36],[a+2,b-8],'rgba(255,255,255,.7)',1.5);};
D.bench=(x,y)=>{const i=.2;box(x+i,y+.35,1-2*i,.3,10,13,'#c78a55','#a86a3a','#8a5530',1.5);for(const u of[.25,.75]){const[a,b]=P(x+u,y+.65);line([a,b],[a,b-10],OUT,2);}
 box(x+i,y+.3,1-2*i,.06,13,22,'#c78a55','#a86a3a','#8a5530',1.5);};
D.dish=(x,y)=>{const[a,b]=P(x+.5,y+.5);line([a,b],[a,b-20],'#888',4);g.save();g.translate(a,b-26);g.rotate(-.5+Math.sin(T*.5)*.15);
 g.beginPath();g.ellipse(0,0,18,10,0,0,7);g.fillStyle='#f4f4f4';g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();g.beginPath();g.ellipse(0,0,12,6,0,0,7);g.strokeStyle='#ccc';g.stroke();line([0,0],[0,-14]);circ(0,-15,2.5,'#f08a3c');g.restore();};
D.model=(x,y)=>{const i=.22;boxc(x+i,y+i,1-2*i,1-2*i,0,14,'#cfc6b8',1.5);const[a,b]=P(x+.5,y+.5,14);g.save();g.translate(a,b-30);ship(62);g.restore();};
D.planter=(x,y)=>{const i=.15;boxc(x+i,y+i,1-2*i,1-2*i,0,12,'#c4532a',1.5);const[a,b]=P(x+.5,y+.5,12);
 for(const[dx,dy,r]of[[-8,0,8],[8,0,8],[0,-6,10],[0,5,7]])circ(a+dx,b+dy-4,r,dy<0?'#62c06a':'#3d9a4a',OUT,1.3);circ(a+4,b-14,2.5,'#ffcf6a',null);};
D.rover=(x,y)=>{const[a,b]=P(x+.5,y+.5);g.save();g.translate(a,b);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(0,0,24,10,0,0,7);g.fill();
 for(const[wx,wy]of[[-16,-2],[-4,4],[10,6],[16,-6],[4,-10],[-10,-12]])circ(wx,wy-4,4.5,'#333',OUT,1.2);
 poly([[-20,-10],[4,0],[22,-8],[0,-18]],'#f4f4f4');poly([[-20,-10],[4,0],[4,-8],[-20,-18]],'#ddd');poly([[4,0],[22,-8],[22,-16],[4,-8]],'#bbb');poly([[-20,-18],[4,-8],[22,-16],[0,-26]],'#f6f6f6');
 poly([[-6,-16],[8,-11],[12,-15],[-2,-20]],'#1fb3a6',OUT,1);line([14,-14],[16,-34]);circ(16,-35,2,'#f08a3c');g.restore();};
D.statue=(x,y)=>{const i=.18;boxc(x+i,y+i,1-2*i,1-2*i,0,18,'#cfc6b8',1.5);const[a,b]=P(x+.5,y+.5,18);
 poly([[a-10,b-4],[a-10,b-28],[a+2,b-28],[a+2,b-12],[a+14,b-10],[a+14,b-2],[a-10,b-2]],'#d9a54a');line([a-10,b-20],[a+2,b-20],OUT,1.5);
 g.fillStyle=OUT;g.font='bold 7px Fredoka';g.textAlign='center';g.fillText('SOL 1',a,b+10);};
D.debris=(x,y,s,o)=>{const[a,b]=P(x+.5,y+.5);const v=(o.id*7)%3;g.fillStyle='rgba(30,15,8,.45)';g.beginPath();g.ellipse(a,b,20,10,0,0,7);g.fill();
 if(v===0){poly([[a-14,b],[a-4,b-18],[a+2,b-6],[a+14,b-14],[a+10,b+2]],'#c9cfd2');poly([[a-4,b-18],[a+2,b-6],[a-2,b-2]],'#8a9398',OUT,1);}
 else if(v===1){poly([[a-12,b+2],[a-14,b-10],[a+4,b-16],[a+14,b-4],[a+6,b+4]],'#2a2d31');for(let k=0;k<3;k++)circ(a-6+k*6,b-6,1.5,'#555',null);}
 else{poly([[a-14,b-2],[a+10,b-20],[a+16,b-12],[a-4,b+4]],'#3d4349');}
 const f=Math.sin(T*12+o.id)*2;poly([[a-3,b-6],[a+1,b-20-f],[a+5,b-6]],'#ffb04a','#e8562a',1);
 const p=(T*.5+o.id*.13)%1;circ(a+p*6,b-20-p*28,4+p*7,`rgba(90,80,75,${.5*(1-p)})`,null);};
D.wreck=(x,y,s)=>{const[Xc,Yc]=P(x+s/2,y+s/2);g.beginPath();g.ellipse(Xc,Yc,s*31,s*15.5,0,0,7);g.fillStyle='#4a2414';g.fill();
 g.beginPath();g.ellipse(Xc,Yc,s*25,s*12,0,0,7);g.fillStyle='#2d1209';g.fill();
 g.save();g.translate(Xc,Yc-14);g.rotate(Math.PI/2+.4636+.12);ship(128);g.restore();
 g.save();g.translate(Xc+4,Yc-16);g.strokeStyle=OUT;g.lineWidth=3;g.beginPath();g.moveTo(-8,-14);g.lineTo(-2,-4);g.lineTo(-9,4);g.lineTo(-3,14);g.stroke();g.restore();
 for(let k=0;k<3;k++){const p=(T*.25+k/3)%1;circ(Xc-30+k*28+p*14,Yc-30-p*70,8+p*16,`rgba(80,70,65,${.45*(1-p)})`,null);}
 const f=Math.sin(T*10)*2;poly([[Xc+40,Yc-18],[Xc+44,Yc-36-f],[Xc+50,Yc-18]],'#ffb04a','#e8562a',1);};
function drawConstruction(o){const d=B[o.t],s=d.s,x=o.x,y=o.y;const i=.2,X=x+i,Y=y+i,w=s-2*i;pad(x,y,s,'#a39380');
 const pr=clamp(1-(o.be-now())/(d.bt*1000),0,1);const hz=Math.max(18,d.hg*.6);
 boxc(X+.15,Y+.15,w-.3,w-.3,4,4+hz*pr*.8,'#d8cfc0');
 const cs=[[X,Y],[X+w,Y],[X+w,Y+w],[X,Y+w]];for(const[cx,cy]of cs)line(P(cx,cy,0),P(cx,cy,hz),'#f2c218',3);
 for(const z of[hz*.5,hz]){line(P(X,Y+w,z),P(X+w,Y+w,z),'#f2c218',3);line(P(X+w,Y+w,z),P(X+w,Y,z),'#f2c218',3);}
 line(P(X,Y+w,0),P(X+w,Y+w,hz*.5),'#e0a010',1.5);line(P(X+w,Y+w,0),P(X+w,Y,hz*.5),'#e0a010',1.5);
 const[a,b]=P(x+s/2,y+s/2,hz+16);sign(a,b,'🚧','#f2c218',OUT,11);}

// ================= CHARACTERS =================
function drawChar(id,X,Y,face=1,walk=0,work=0,portrait=0){const L=LOOK[id];const t=T+id.length;
 const bob=walk?Math.abs(Math.sin(t*10))*2:work?Math.abs(Math.sin(t*6))*1.5:0;
 g.save();g.translate(X,Y);if(!portrait)g.scale(1.2,1.2);if(!portrait){g.fillStyle='rgba(60,20,10,.3)';g.beginPath();g.ellipse(0,0,8,3.5,0,0,7);g.fill();}
 g.translate(0,-bob);g.scale(face,1);g.lineJoin='round';g.lineCap='round';
 const sw=walk?Math.sin(t*10)*3:0;
 if(L.robot){
  g.fillStyle='#e9eef0';g.strokeStyle=OUT;g.lineWidth=1.6;
  for(const[lx,o]of[[-3.5,sw],[3.5,-sw]]){g.beginPath();g.roundRect(lx-2,-9+o*.3,4,9,1.5);g.fill();g.stroke();}
  g.beginPath();g.roundRect(-6.5,-22,13,14,4);g.fill();g.stroke();circ(0,-15,2.4,`hsl(174,85%,${55+15*Math.sin(T*3)}%)`,OUT,1);
  const arm=work?Math.sin(t*8)*4:0;g.fillStyle='#e9eef0';g.beginPath();g.roundRect(-9.5,-21-arm,3.5,10,1.5);g.fill();g.stroke();g.beginPath();g.roundRect(6,-21,3.5,10,1.5);g.fill();g.stroke();
  g.beginPath();g.roundRect(-7,-34,14,12,5);g.fill();g.stroke();g.fillStyle='#14181c';g.beginPath();g.roundRect(-5.5,-31.5,11,7,3);g.fill();
  g.strokeStyle='#5ff0e0';g.lineWidth=1.4;g.beginPath();g.moveTo(-3.6,-27);g.lineTo(-2.2,-29);g.lineTo(-.8,-27);g.moveTo(.8,-27);g.lineTo(2.2,-29);g.lineTo(3.6,-27);g.stroke();
  g.restore();return;}
 g.strokeStyle=OUT;g.lineWidth=1.6;
 for(const[lx,o]of[[-3,sw],[3,-sw]]){g.fillStyle=sh(L.suit,-.25);g.beginPath();g.roundRect(lx-2,-9+o*.2,4,9,1.5);g.fill();g.stroke();g.fillStyle='#4a3a30';g.beginPath();g.roundRect(lx-2.5+o*.3,-2,5,3,1);g.fill();}
 g.fillStyle=L.suit;g.beginPath();g.roundRect(-6.5,-21,13,13,4.5);g.fill();g.stroke();
 g.fillStyle=L.trim;g.fillRect(-6,-11,12,2);g.fillRect(-1,-20,2,9);
 const arm=work?Math.sin(t*8)*5:walk?sw:0;g.fillStyle=L.suit;g.beginPath();g.roundRect(-9.5,-20-Math.max(0,arm),3.6,10,1.8);g.fill();g.stroke();g.beginPath();g.roundRect(6,-20,3.6,10,1.8);g.fill();g.stroke();
 circ(-7.7,-9.5-Math.max(0,arm),1.8,L.skin,OUT,1);circ(7.8,-9.5,1.8,L.skin,OUT,1);
 // head
 if(L.st==='long'){g.fillStyle=L.hair;g.beginPath();g.roundRect(-8,-34,16,18,6);g.fill();g.stroke();}
 if(L.st==='bun'){circ(0,-38.5,4,L.hair,OUT,1.4);}
 circ(0,-27.5,7.2,L.skin,OUT,1.6);
 g.fillStyle=L.hair;
 if(L.st==='messy'){g.beginPath();g.moveTo(-7,-28);for(let k=0;k<6;k++)g.lineTo(-7+k*2.8,-35.5-(k%2)*3.2);g.lineTo(7.4,-28);g.quadraticCurveTo(0,-32,-7,-28);g.fill();g.stroke();}
 if(L.st==='bun'){g.beginPath();g.arc(0,-28.5,7.4,Math.PI*1.03,Math.PI*1.97);g.quadraticCurveTo(0,-31,-7.3,-29.5);g.fill();g.stroke();}
 if(L.st==='curly'){for(let k=0;k<5;k++)circ(-6+k*3,-33.5-(k%2),3,L.hair,OUT,1.1);}
 if(L.st==='long'){g.beginPath();g.arc(0,-28.5,7.5,Math.PI*1.05,Math.PI*1.95);g.quadraticCurveTo(-1,-29,-7.3,-29.5);g.fill();g.stroke();circ(5.5,-33,2.4,'#ffcf6a',OUT,1);}
 if(L.st==='beard'){g.beginPath();g.moveTo(-6.5,-27);g.quadraticCurveTo(-6,-17,0,-17.5);g.quadraticCurveTo(6,-17,6.5,-27);g.quadraticCurveTo(0,-23,-6.5,-27);g.fill();g.stroke();
  g.fillStyle='#e0b23a';g.beginPath();g.arc(0,-29,7.6,Math.PI,0);g.closePath();g.fill();g.stroke();circ(0,-35,2.2,'#fff7b0',OUT,1);}
 // face
 for(const ex of[-2.4,2.6]){circ(ex,-28,2.3,'#fff',OUT,1);circ(ex+.8,-27.8,1,'#111',null);}
 if(L.glasses){g.strokeStyle=OUT;g.lineWidth=1;circ(-2.4,-28,3,null,OUT,1);circ(2.6,-28,3,null,OUT,1);g.fillStyle='rgba(120,200,255,.5)';g.beginPath();g.ellipse(9,-29,1.2,2,0,0,7);g.fill();}
 g.strokeStyle=OUT;g.lineWidth=1.2;g.beginPath();
 if(id==='skip'){g.arc(1,-24.2,2.6,.1,Math.PI-.1);g.stroke();g.fillStyle='rgba(60,30,20,.25)';g.beginPath();g.ellipse(0,-22.5,5,2,0,0,7);g.fill();}
 else if(id==='ada'){g.moveTo(-1.5,-23.5);g.lineTo(2.5,-23.5);g.stroke();g.beginPath();g.moveTo(-4.4,-31.2);g.lineTo(-1,-30.4);g.moveTo(1.2,-30.4);g.lineTo(4.6,-31.2);g.stroke();}
 else if(id==='milo'){g.ellipse(1,-23.4,1.6,1.2,0,0,7);g.stroke();}
 else if(id==='fern'){g.arc(1,-24.6,2.2,.2,Math.PI-.2);g.stroke();g.fillStyle='rgba(230,90,90,.4)';circ(-4.5,-25,1.4,'rgba(230,90,90,.4)',null);circ(5.2,-25,1.4,'rgba(230,90,90,.4)',null);}
 else if(id==='gus'){g.moveTo(-1.5,-22.8);g.lineTo(2.5,-23.2);g.stroke();}
 g.restore();}
function portrait(cvs,id){const c=cvs.getContext('2d');const old=g;g=c;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cvs.width,cvs.height);const k=cvs.width/64;
 c.setTransform(k*2.1,0,0,k*2.1,32*k,k*(id==='opti'?92:94));drawChar(id,0,0,1,0,0,1);g=old;}

// ================= STATE =================
let S=null;const SK='rpr-save-v1',BK='rpr-backup-v1';
function newState(){return{v:1,t0:now(),credits:300,he3:5,xp:0,lvl:1,plots:{'3,3':1,'4,3':1,'3,4':1,'4,4':1},objs:[],paths:{},chars:{skip:{x:24.5,y:26.5,job:null}},
 q:{active:[],done:[],prog:{}},inv:{},nid:1,intro:0,land:0,cam:null,sound:1};}
const RT={chars:{}};let occ=new Int32Array(N*N);
function owned(x,y){if(x<0||y<0||x>=N||y>=N)return false;return!!S.plots[((x/PS)|0)+','+((y/PS)|0)];}
function objById(id){return S.objs.find(o=>o.id===id);}
function rebuildOcc(){occ.fill(0);for(const o of S.objs){const s=B[o.t].s;for(let a=0;a<s;a++)for(let b=0;b<s;b++){const x=o.x+a,y=o.y+b;if(x>=0&&y>=0&&x<N&&y<N)occ[y*N+x]=o.id;}}}
function walkable(x,y){return owned(x,y)&&!occ[y*N+x];}
function canPlace(t,x,y,ex){const s=B[t].s;for(let a=0;a<s;a++)for(let b=0;b<s;b++){const X=x+a,Y=y+b;if(!owned(X,Y))return false;const o=occ[Y*N+X];if(o&&o!==ex)return false;if(S.paths[X+','+Y])return false;}return true;}
function bonusPct(){let b=0;for(const o of S.objs)if(B[o.t].bonus)b+=B[o.t].bonus;return Math.min(100,b);}
function count(t,built=1){return S.objs.filter(o=>o.t===t&&(!built||o.st==='ok')).length;}
function ownedAny(t){return S.objs.some(o=>o.t===t)||(S.inv[t]>0);}
function hasBuilt(t){return S.objs.some(o=>o.t===t&&o.st==='ok');}
function charUnlocked(id){const u=C[id].unlock;return!u||!!S.chars[id];}
function lvlProgress(){const a=LV[S.lvl-1]||0,b=LV[S.lvl]||a+5000;return[(S.xp-a)/(b-a),S.xp-a,b-a];}

// ================= GROUND =================
let groundCv=null,groundDirty=true;
function renderGround(){const w=N*TW,h=N*TH;if(!groundCv){groundCv=document.createElement('canvas');groundCv.width=w*GS;groundCv.height=h*GS;}
 const c=groundCv.getContext('2d');const old=g;g=c;c.setTransform(GS,0,0,GS,w/2*GS,0);c.clearRect(-w/2,0,w,h);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const own=owned(x,y),n=hash(x,y);const col=own?mix('#e48450','#d46e3a',n):mix('#b65e36','#a7522e',n);
  const pts=[P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)];c.beginPath();c.moveTo(pts[0][0],pts[0][1]-.5);c.lineTo(pts[1][0]+.6,pts[1][1]);c.lineTo(pts[2][0],pts[2][1]+.5);c.lineTo(pts[3][0]-.6,pts[3][1]);c.closePath();c.fillStyle=col;c.fill();
  const n2=hash(x+99,y+7);const[cx,cy]=P(x+.5,y+.5);
  if(n2<.35){c.fillStyle=own?'rgba(120,50,20,.35)':'rgba(70,25,10,.35)';c.beginPath();c.ellipse(cx+(n-.5)*30,cy+(n2-.2)*20,2+n*3,1+n*1.5,0,0,7);c.fill();}
  if(n2>.9){c.fillStyle='rgba(255,220,180,.25)';c.beginPath();c.ellipse(cx,cy,6,3,0,0,7);c.fill();}
  if(!own&&n2>.82&&n2<.9){c.fillStyle='rgba(60,20,8,.35)';c.beginPath();c.ellipse(cx,cy,18,9,0,0,7);c.fill();c.fillStyle='rgba(255,200,160,.18)';c.beginPath();c.ellipse(cx,cy+3,16,7,0,0,Math.PI);c.fill();}}
 c.strokeStyle='rgba(255,236,200,.75)';c.lineWidth=2.5;c.setLineDash([8,6]);c.beginPath();
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!owned(x,y))continue;
  if(!owned(x,y-1)){const a=P(x,y),b=P(x+1,y);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  if(!owned(x+1,y)){const a=P(x+1,y),b=P(x+1,y+1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  if(!owned(x,y+1)){const a=P(x,y+1),b=P(x+1,y+1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}
  if(!owned(x-1,y)){const a=P(x,y),b=P(x,y+1);c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);}}
 c.stroke();c.setLineDash([]);g=old;groundDirty=false;}
const MESAS=[];(()=>{for(let k=0;k<60;k++)MESAS.push({u:hash(k,3)*1.2-.1,side:k%2,h:20+hash(k,9)*70,w:.03+hash(k,5)*.07,d:hash(k,11)});})();
function drawFar(){const E=18;const A=P(-E,-E),Bp=P(N+E,-E),Cp=P(N+E,N+E),Dp=P(-E,N+E);
 const gr=g.createLinearGradient(0,A[1],0,Cp[1]);gr.addColorStop(0,'#d99a72');gr.addColorStop(.18,'#b8653c');gr.addColorStop(1,'#8e4426');
 poly([A,Bp,Cp,Dp],gr,null);
 for(const m of MESAS){const p0=m.side?[lerp(A[0],Dp[0],m.u),lerp(A[1],Dp[1],m.u)]:[lerp(A[0],Bp[0],m.u),lerp(A[1],Bp[1],m.u)];const w=m.w*1500,h=m.h*(1.4-m.d*.5);
  g.fillStyle=mix('#b06a48','#8c4a30',m.d);g.beginPath();g.moveTo(p0[0]-w,p0[1]+4);g.lineTo(p0[0]-w*.6,p0[1]-h);g.lineTo(p0[0]+w*.6,p0[1]-h);g.lineTo(p0[0]+w,p0[1]+4);g.closePath();g.fill();
  g.fillStyle='rgba(255,210,170,.18)';g.fillRect(p0[0]-w*.6,p0[1]-h,w*1.2,3);}}
function drawPaths(vx0,vy0,vx1,vy1){for(const k in S.paths){const[x,y]=k.split(',').map(Number);const[cx,cy]=P(x+.5,y+.5);if(cx<vx0-40||cx>vx1+40||cy<vy0-40||cy>vy1+40)continue;
 const p=PATHS[S.paths[k]]||PATHS.dirt;const pts=[P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)];poly(pts,p.col,null);
 if(S.paths[k]==='paver'){line(P(x+.5,y),P(x+.5,y+1),'rgba(0,0,0,.12)',1);line(P(x,y+.5),P(x+1,y+.5),'rgba(0,0,0,.12)',1);}
 if(S.paths[k]==='glow'){g.fillStyle=`rgba(95,240,224,${.25+.15*Math.sin(T*2+x+y)})`;poly([P(x+.3,y+.3),P(x+.7,y+.3),P(x+.7,y+.7),P(x+.3,y+.7)],g.fillStyle,null);}
 if(S.paths[k]==='dirt'){g.fillStyle='rgba(90,50,30,.25)';circ(cx-8,cy+2,1.5,g.fillStyle,null);circ(cx+6,cy-3,1.2,g.fillStyle,null);}
 const nb=(dx,dy)=>!!S.paths[(x+dx)+','+(y+dy)];
 if(!nb(0,-1))line(pts[0],pts[1],p.edge,2.5);if(!nb(1,0))line(pts[1],pts[2],p.edge,2.5);if(!nb(0,1))line(pts[2],pts[3],p.edge,2.5);if(!nb(-1,0))line(pts[3],pts[0],p.edge,2.5);}}

// ================= CAMERA / VIEW =================
let W=0,H=0,DPR=1;const cam={x:0,y:24*TH,z:.8};let shake=0;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cv.style.width=W+'px';cv.style.height=H+'px';}
addEventListener('resize',resize);resize();
function s2w(sx,sy){return[(sx-W/2)/cam.z+cam.x,(sy-H/2)/cam.z+cam.y];}
function w2s(wx,wy){return[(wx-cam.x)*cam.z+W/2,(wy-cam.y)*cam.z+H/2];}
function w2t(wx,wy){return[(wx/(TW/2)+wy/(TH/2))/2,(wy/(TH/2)-wx/(TW/2))/2];}
function clampCam(){cam.z=clamp(cam.z,.38,2.2);cam.x=clamp(cam.x,-N*TW/2,N*TW/2);cam.y=clamp(cam.y,-200,N*TH);}
function centerOn(tx,ty){const[a,b]=P(tx,ty);cam.x=a;cam.y=b;clampCam();}

// ================= CHARACTER RUNTIME =================
function spawnChar(id,x,y){const sv=S.chars[id]||(S.chars[id]={x,y,job:null});RT.chars[id]={id,x:sv.x??x,y:sv.y??y,path:[],idle:Math.random()*2,face:1,walking:0,hidden:0};}
function bfs(sx,sy,tx,ty,max=900){sx=clamp(Math.floor(sx),0,N-1);sy=clamp(Math.floor(sy),0,N-1);if(sx===tx&&sy===ty)return[];const prev=new Int32Array(N*N).fill(-1);const q=[sy*N+sx];prev[sy*N+sx]=sy*N+sx;let n=0;
 while(q.length&&n++<max){const c=q.shift(),cx=c%N,cy=(c/N)|0;if(cx===tx&&cy===ty){const out=[];let k=c;while(k!==sy*N+sx){out.unshift([k%N+.5,((k/N)|0)+.5]);k=prev[k];}return out;}
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=N||ny>=N)continue;const ni=ny*N+nx;if(prev[ni]>=0||!walkable(nx,ny))continue;prev[ni]=c;q.push(ni);}}return null;}
function jobDef(id,jid){return C[id].jobs.find(j=>j[0]===jid);}
function frontTile(o){const s=B[o.t].s;const cand=[];for(let k=0;k<s;k++){cand.push([o.x+k,o.y+s],[o.x+s,o.y+k]);}for(let k=0;k<s;k++){cand.push([o.x+k,o.y-1],[o.x-1,o.y+k]);}return cand.find(([x,y])=>walkable(x,y));}
function updateChars(dt){for(const id in RT.chars){const r=RT.chars[id],sv=S.chars[id];if(r.hidden)continue;
 if(r.path.length){const[tx,ty]=r.path[0];const dx=tx-r.x,dy=ty-r.y,d=Math.hypot(dx,dy),sp=(id==='opti'?1.6:1.15)*dt;
  if(d<=sp){r.x=tx;r.y=ty;r.path.shift();}else{r.x+=dx/d*sp;r.y+=dy/d*sp;}const sx=dx-dy;if(Math.abs(sx)>.01)r.face=sx>0?1:-1;r.walking=1;continue;}
 r.walking=0;r.idle-=dt;if(r.idle>0)continue;r.idle=1.5+Math.random()*3.5;
 const job=sv.job&&jobDef(id,sv.job.id);let tgt=null;
 if(job&&job[6]&&now()<sv.job.e){const o=S.objs.find(o=>o.t===job[6]&&o.st==='ok');if(o){const ft=frontTile(o);if(ft){if(Math.floor(r.x)===ft[0]&&Math.floor(r.y)===ft[1]){r.idle=4;continue;}tgt=ft;}}}
 if(!tgt){for(let k=0;k<12;k++){const x=Math.floor(r.x+(Math.random()-.5)*12),y=Math.floor(r.y+(Math.random()-.5)*12);if(walkable(x,y)){tgt=[x,y];break;}}}
 if(tgt){const p=bfs(r.x,r.y,tgt[0],tgt[1]);if(p)r.path=p;}
 sv.x=r.x;sv.y=r.y;}}
// ================= FX =================
const parts=[],floats=[],fx=[];
function flyTo(sx,sy,kind,n=5){const el=kind==='xp'?$('lvlstar'):kind==='he3'?$('hh'):$('cc');const rc=el.getBoundingClientRect();
 for(let i=0;i<n;i++)parts.push({x:sx,y:sy,x0:sx+(Math.random()-.5)*50,y0:sy-30-Math.random()*40,tx:rc.left+rc.width/2,ty:rc.top+rc.height/2,t:-i*.06,kind,el});}
function floatTxt(wx,wy,txt,col='#fff'){floats.push({x:wx,y:wy,txt,col,t:0});}
function drawParts(dt){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt*1.4;if(p.t<0)continue;if(p.t>=1){parts.splice(i,1);p.el.classList.remove('bump');void p.el.offsetWidth;p.el.classList.add('bump');continue;}
 const t=p.t,u=1-t;const x=u*u*p.x+2*u*t*p.x0+t*t*p.tx,y=u*u*p.y+2*u*t*p.y0+t*t*p.ty;
 if(p.kind==='coin'){circ(x,y,9,'#f5b321',OUT,2);g.fillStyle=OUT;g.font='bold 10px Fredoka';g.textAlign='center';g.fillText('¢',x,y+3.5);}
 else if(p.kind==='he3'){circ(x,y,9,'#3fd3c4',OUT,2);}
 else{g.save();g.translate(x,y);g.beginPath();for(let k=0;k<10;k++){const r=k%2?4:9,a=k*Math.PI/5-Math.PI/2;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fillStyle='#ffd23a';g.fill();g.strokeStyle=OUT;g.lineWidth=1.5;g.stroke();g.restore();}}}
function drawFloats(dt){for(let i=floats.length-1;i>=0;i--){const f=floats[i];f.t+=dt;if(f.t>1.4){floats.splice(i,1);continue;}
 g.globalAlpha=Math.min(1,(1.4-f.t)*2);g.font='20px "Luckiest Guy",Fredoka';g.textAlign='center';g.lineWidth=4;g.strokeStyle=OUT;g.strokeText(f.txt,f.x,f.y-f.t*40);g.fillStyle=f.col;g.fillText(f.txt,f.x,f.y-f.t*40);g.globalAlpha=1;}}
function drawFx(dt){for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.t+=dt;if(p.t>p.life){fx.splice(i,1);continue;}const k=p.t/p.life;
 if(p.k==='fire'){p.y-=dt*30;circ(p.x,p.y,p.r*(.5+k),`rgba(255,${(200-150*k)|0},${(60-40*k)|0},${1-k})`,null);}
 else if(p.k==='smoke'){p.y-=dt*22;p.x+=dt*6;circ(p.x,p.y,p.r*(.6+k*1.4),`rgba(70,60,55,${.55*(1-k)})`,null);}
 else if(p.k==='chunk'){p.vh-=500*dt;p.h+=p.vh*dt;if(p.h<0){p.h=0;p.vh*=-.3;p.vx*=.6;p.vy*=.6;}p.x+=p.vx*dt;p.y+=p.vy*dt;g.save();g.translate(p.x,p.y-p.h);g.rotate(p.t*8);g.fillStyle=p.c;g.fillRect(-4,-3,8,6);g.strokeStyle=OUT;g.lineWidth=1;g.strokeRect(-4,-3,8,6);g.restore();}
 else if(p.k==='ring'){g.beginPath();g.ellipse(p.x,p.y,p.r*k*3,p.r*k*1.5,0,0,7);g.strokeStyle=`rgba(255,240,200,${1-k})`;g.lineWidth=6*(1-k);g.stroke();}
 else if(p.k==='spark'){circ(p.x+Math.cos(p.a)*k*40,p.y+Math.sin(p.a)*k*20-k*20,3*(1-k),p.c,null);}}}
function poof(wx,wy,n=8,col='#fff2c0'){for(let i=0;i<n;i++)fx.push({k:'spark',x:wx,y:wy,a:i/n*7,t:0,life:.6,c:col});fx.push({k:'smoke',x:wx,y:wy,r:10,t:0,life:1});}

// ================= RENDER =================
let BUB=[];let ghostOK=true;
function drawObj(o,alpha=1){const d=B[o.t];g.globalAlpha=alpha;
 if(o.f&&d.s>0){const[cx]=P(o.x+d.s/2,o.y+d.s/2);FLIPX=cx;g.save();g.translate(cx,0);g.scale(-1,1);g.translate(-cx,0);}
 if(o.st==='build')drawConstruction(o);else D[o.t](o.x,o.y,d.s,o);
 if(FLIPX!==null){g.restore();FLIPX=null;}g.globalAlpha=1;}
function depthCmp(a,b){if(a.x1<=b.x0||a.y1<=b.y0)return-1;if(b.x1<=a.x0||b.y1<=a.y0)return 1;return(a.x0+a.y0)-(b.x0+b.y0);}
function bubble(wx,wy,icon,kind,act,prog){const r=Math.max(15,13/cam.z),bob=Math.sin(T*4+wx*.01)*3;const y=wy-bob;
 g.save();if(kind==='think'){g.globalAlpha=.85;circ(wx-r*.5,wy+r*1.05,r*.18,'#fff',OUT,1.5);circ(wx-r*.25,wy+r*.7,r*.28,'#fff',OUT,1.5);}
 else{g.beginPath();g.moveTo(wx-r*.35,y+r*.8);g.lineTo(wx,y+r*1.35);g.lineTo(wx+r*.35,y+r*.8);g.fillStyle=kind==='coin'?'#ffe9a0':'#fff';g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();}
 circ(wx,y,r,kind==='coin'?'#ffe9a0':kind==='done'?'#d8fff9':'#fff',OUT,2.2);
 if(prog!=null){g.beginPath();g.arc(wx,y,r-3,-Math.PI/2,-Math.PI/2+Math.PI*2*prog);g.strokeStyle='#1fb3a6';g.lineWidth=3;g.stroke();}
 if(kind==='coin'){circ(wx,y,r*.6,'#f5b321',OUT,2);g.fillStyle=OUT;g.font=`bold ${r*.8}px Fredoka`;g.textAlign='center';g.textBaseline='middle';g.fillText('¢',wx,y+1);}
 else{g.font=`${r*1.05}px system-ui,"Apple Color Emoji","Noto Color Emoji",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(icon,wx,y+1);}
 if(kind==='done'){circ(wx+r*.7,y-r*.7,r*.38,'#3fd36a',OUT,1.5);g.fillStyle='#fff';g.font=`bold ${r*.5}px Fredoka`;g.fillText('✓',wx+r*.7,y-r*.68);}
 g.restore();g.textBaseline='alphabetic';if(act)BUB.push({x:wx,y,r:r*1.35,act});}
function render(dt){const c=ctx;g=c;c.setTransform(1,0,0,1,0,0);
 const sk=c.createLinearGradient(0,0,0,H*DPR);sk.addColorStop(0,'#0f2a33');sk.addColorStop(.45,'#2c6b70');sk.addColorStop(.8,'#d7955f');sk.addColorStop(1,'#e8ad78');c.fillStyle=sk;c.fillRect(0,0,W*DPR,H*DPR);
 const shx=shake>0?(Math.random()-.5)*shake*24:0,shy=shake>0?(Math.random()-.5)*shake*24:0;
 c.setTransform(DPR*cam.z,0,0,DPR*cam.z,DPR*(W/2-cam.x*cam.z+shx),DPR*(H/2-cam.y*cam.z+shy));
 const[vx0,vy0]=s2w(0,0),[vx1,vy1]=s2w(W,H);
 drawFar();if(groundDirty)renderGround();c.imageSmoothingEnabled=true;c.drawImage(groundCv,-N*TW/2,0,N*TW,N*TH);
 drawPaths(vx0,vy0,vx1,vy1);
 if(mode==='land')drawLandOverlay();
 if(mode==='place'||mode==='path')drawGrid(vx0,vy0,vx1,vy1);
 // collect drawables
 const L=[];const mv=PL&&PL.moveId;
 for(const o of S.objs){if(o.id===mv)continue;const s=B[o.t].s;const[cx,cy]=P(o.x+s/2,o.y+s/2);if(cx<vx0-200||cx>vx1+200||cy<vy0-60||cy>vy1+260)continue;L.push({x0:o.x,y0:o.y,x1:o.x+s,y1:o.y+s,o});}
 for(const id in RT.chars){const r=RT.chars[id];if(r.hidden)continue;L.push({x0:r.x-.2,y0:r.y-.2,x1:r.x+.2,y1:r.y+.2,ch:r});}
 if(PL){const s=B[PL.t].s;ghostOK=canPlace(PL.t,PL.x,PL.y,PL.moveId);L.push({x0:PL.x,y0:PL.y,x1:PL.x+s,y1:PL.y+s,ghost:1});}
 L.sort(depthCmp);BUB=[];const later=[];
 for(const e of L){if(e.o){drawObj(e.o);later.push(e);}else if(e.ch){const r=e.ch,[X,Y]=P(r.x,r.y);const sv=S.chars[r.id];const working=sv.job&&now()<sv.job.e;drawChar(r.id,X,Y,r.face,r.walking,working&&!r.walking);later.push(e);}
  else if(e.ghost){const s=B[PL.t].s;poly([P(PL.x,PL.y),P(PL.x+s,PL.y),P(PL.x+s,PL.y+s),P(PL.x,PL.y+s)],ghostOK?'rgba(80,240,120,.45)':'rgba(255,60,40,.5)',ghostOK?'#1a8a3a':'#a01a0a',2.5);
   drawObj({t:PL.t,x:PL.x,y:PL.y,f:PL.f,st:'ok',id:0},.85);const[a,b]=P(PL.x+s/2,PL.y+s/2,(B[PL.t].hg||40)+30);
   g.save();g.translate(a,b+Math.sin(T*5)*3);poly([[-10,-8],[10,-8],[0,6]],'#fff',OUT,2);g.restore();}}
 if(IN)drawIntroShip();
 drawFx(dt);
 if(mode!=='intro'){const t=now();for(const e of later){if(e.o){const o=e.o,d=B[o.t];const[a,b]=P(o.x+d.s/2,o.y+d.s/2,(d.hg||40)+18);
   if(o.st==='build'){if(t>=o.be)bubble(a,b,'🔨','done',{o});}else if(d.per&&t-o.lc>=d.per*1000)bubble(a,b,'','coin',{o});}
  else{const r=e.ch,sv=S.chars[r.id];if(!sv.job)continue;const j=jobDef(r.id,sv.job.id);if(!j)continue;const[X,Y]=P(r.x,r.y);
   if(t>=sv.job.e)bubble(X,Y-66,j[2],'done',{ch:r.id});else bubble(X+12,Y-62,j[2],'think',null,(t-sv.job.s)/(sv.job.e-sv.job.s));}}
  drawWorldArrow();}
 drawFloats(dt);
 c.setTransform(DPR,0,0,DPR,0,0);drawParts(dt);}
function drawGrid(vx0,vy0,vx1,vy1){g.strokeStyle='rgba(255,245,225,.22)';g.lineWidth=1;g.beginPath();for(let k=0;k<=N;k++){const a=P(k,0),b=P(k,N),c2=P(0,k),d=P(N,k);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.moveTo(c2[0],c2[1]);g.lineTo(d[0],d[1]);}g.stroke();}
function buyablePlots(){const out=[];for(let py=0;py<NP;py++)for(let px=0;px<NP;px++){if(S.plots[px+','+py])continue;if(S.plots[(px-1)+','+py]||S.plots[(px+1)+','+py]||S.plots[px+','+(py-1)]||S.plots[px+','+(py+1)])out.push([px,py]);}return out;}
function landPrice(){return Math.round(250*Math.pow(1.7,S.land)/10)*10;}
function drawLandOverlay(){const pr=landPrice();for(const[px,py]of buyablePlots()){const x=px*PS,y=py*PS;poly([P(x,y),P(x+PS,y),P(x+PS,y+PS),P(x,y+PS)],`rgba(31,179,166,${.25+.1*Math.sin(T*3)})`,'#5ff0e0',3);
 const[a,b]=P(x+PS/2,y+PS/2);line([a,b],[a,b-40],'#6b4a2a',4);g.beginPath();g.roundRect(a-38,b-70,76,32,6);g.fillStyle='#fff6e8';g.fill();g.strokeStyle=OUT;g.lineWidth=2.5;g.stroke();
 g.fillStyle=OUT;g.font='11px "Luckiest Guy",Fredoka';g.textAlign='center';g.fillText('FOR SALE',a,b-57);g.font='bold 12px Fredoka';g.fillStyle='#b8650c';g.fillText('¢ '+fmtN(pr),a,b-43);}}

// ================= SOUND =================
let AC=null;function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();}
function tone(f,d,type='square',v=.06,when=0,slide=0){if(!AC||!S||!S.sound)return;const t=AC.currentTime+when,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn).connect(AC.destination);o.start(t);o.stop(t+d+.02);}
function noise(d,v=.3){if(!AC||!S||!S.sound)return;const len=AC.sampleRate*d,buf=AC.createBuffer(1,len,AC.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);const s=AC.createBufferSource(),gn=AC.createGain(),f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=700;s.buffer=buf;gn.gain.value=v;s.connect(f).connect(gn).connect(AC.destination);s.start();}
const SFX={coin:()=>{tone(988,.08);tone(1319,.18,'square',.05,.07);},tap:()=>tone(660,.05,'triangle',.08),build:()=>{tone(220,.08,'square',.05);tone(330,.08,'square',.05,.09);tone(440,.12,'square',.05,.18);},
 done:()=>{tone(523,.1,'triangle',.08);tone(659,.1,'triangle',.08,.1);tone(784,.2,'triangle',.08,.2);},lvl:()=>{[523,659,784,1047,1319].forEach((f,i)=>tone(f,.18,'square',.05,i*.1));},
 err:()=>tone(160,.15,'sawtooth',.05),boom:()=>{noise(1.6,.6);tone(90,.8,'sawtooth',.12,0,30);},quest:()=>{[392,523,659,784].forEach((f,i)=>tone(f,.14,'triangle',.08,i*.08));},poof:()=>tone(300,.15,'triangle',.06,0,120)};
const sfx=n=>{try{SFX[n]&&SFX[n]();}catch(e){}};

// ================= ECONOMY / PROGRESSION =================
function addXP(n,wx,wy){S.xp+=n;if(wx!=null){const[sx,sy]=w2s(wx,wy);flyTo(sx,sy,'xp',2);}while(S.lvl<LV.length-1&&S.xp>=LV[S.lvl]){S.lvl++;levelUp();}hud();}
function addC(n,wx,wy){S.credits+=n;if(wx!=null){const[sx,sy]=w2s(wx,wy);flyTo(sx,sy,'coin',Math.min(8,2+Math.floor(n/15)));}hud();}
function addH(n,wx,wy){S.he3+=n;if(wx!=null){const[sx,sy]=w2s(wx,wy);flyTo(sx,sy,'he3',n);}hud();}
function rareDrop(wx,wy){if(Math.random()<.04){addH(1,wx,wy);floatTxt(wx,wy-30,'+1 ⚛','#7ff7ea');toast('Lucky find: +1 Helium-3!');}}
function levelUp(){addH(2);sfx('lvl');const un=Object.entries(B).filter(([k,d])=>d.lvl===S.lvl&&d.cat!=='x').map(([k,d])=>d.n);
 const pu=Object.values(PATHS).filter(p=>p.lvl===S.lvl).map(p=>p.n);
 setTimeout(()=>{modal(`<h2>Level ${S.lvl}!</h2><p style="text-align:center;font-size:44px;margin:0">⭐</p><div class="rew"><span><b class="he3"></b>+2 Helium-3</span></div>${un.length+pu.length?`<p><b>New in the store:</b> ${[...un,...pu].join(', ')}</p>`:''}<div class="btnrow"><button class="btn g" data-close>Awesome!</button></div>`);},400);
 setTimeout(checkQuests,600);}
function collectObj(o){const d=B[o.t];const amt=Math.round(d.c*(1+bonusPct()/100));const[a,b]=P(o.x+d.s/2,o.y+d.s/2,d.hg||40);o.lc=now();addC(amt,a,b);addXP(d.xp,a,b);floatTxt(a,b,'+'+amt,'#ffe27a');sfx('coin');rareDrop(a,b);ev('collect',o.t);save(1);}
function finishBuild(o){const d=B[o.t];o.st='ok';o.lc=now();const[a,b]=P(o.x+d.s/2,o.y+d.s/2,d.hg||40);const xp=Math.max(4,Math.round((d.cur==='h'?d.cost*20:d.cost)/10));addXP(xp,a,b);floatTxt(a,b,'+'+xp+' XP','#9ff5ec');sfx('done');poof(a,b+20,10);
 if(d.unlock&&!S.chars[d.unlock]){const id=d.unlock,ft=frontTile(o)||[o.x+d.s,o.y+d.s];S.chars[id]={x:ft[0]+.5,y:ft[1]+.5,job:null};spawnChar(id);toast(`New character: ${C[id].n}!`);
  if(C[id].hello&&id!=='ada')say([[id,C[id].hello]]);}
 ev('build',o.t);save(1);}
function startJob(id,j){const sv=S.chars[id];sv.job={id:j[0],s:now(),e:now()+j[3]*1000};RT.chars[id].idle=0;RT.chars[id].path=[];sfx('tap');closeSheet();save(1);hint();}
function collectJob(id){const sv=S.chars[id],j=jobDef(id,sv.job.id),r=RT.chars[id];const[a,b]=P(r.x,r.y,50);const amt=Math.round(j[4]*(1+bonusPct()/100));sv.job=null;
 addC(amt,a,b);addXP(j[5],a,b);floatTxt(a,b,'+'+amt,'#ffe27a');sfx('coin');rareDrop(a,b);ev('job',id,j[0]);save(1);}
function speedCost(ms){return Math.max(1,Math.ceil(ms/3600000));}
function trySpeed(ms,fn){const c=speedCost(ms);if(S.he3<c){toast('Not enough Helium-3. Earn more by leveling up and finishing quests!');sfx('err');return;}
 modal(`<h2>Speed up?</h2><p style="text-align:center">Finish now for <b>${c} ⚛ Helium-3</b>?</p><div class="btnrow"><button class="btn" data-close>No</button><button class="btn t" id="spd">Yes!</button></div>`);
 $('spd').onclick=()=>{S.he3-=c;hud();closeModal();fn();};}

// ================= QUESTS =================
function qProg(q,i){const o=q.obj[i];const pr=S.q.prog[q.id]||[];
 if(o.t==='build')return Math.min(o.n,count(o.k));if(o.t==='deco')return Math.min(o.n,S.objs.filter(x=>B[x.t].cat==='deco').length);if(o.t==='land')return Math.min(o.n,S.land);return Math.min(o.n,pr[i]||0);}
function qDone(q){return q.obj.every((o,i)=>qProg(q,i)>=o.n);}
function ev(type,a,b){for(const id of S.q.active){const q=QI[id];const pr=S.q.prog[id]||(S.q.prog[id]=q.obj.map(()=>0));q.obj.forEach((o,i)=>{if(o.t!==type)return;if(type==='clear'||(type==='job'&&o.c===a&&o.j===b)||(type==='collect'&&o.k===a))pr[i]++;});}checkQuests();}
let questBusy=false;
function checkQuests(){if(!S||!S.intro||mode==='intro')return;let changed=false;
 for(const id of[...S.q.active]){const q=QI[id];if(qDone(q)){S.q.active=S.q.active.filter(x=>x!==id);S.q.done.push(id);changed=true;const r=q.r;
  say(q.out,()=>{modal(`<h2>Quest Complete!</h2><p style="text-align:center;font-weight:700">${q.title}</p><div class="rew">${r.c?`<span><b class="coin"></b>+${r.c}</span>`:''}${r.xp?`<span>⭐ +${r.xp} XP</span>`:''}${r.h?`<span><b class="he3"></b>+${r.h}</span>`:''}</div><div class="btnrow"><button class="btn g" data-close>Collect</button></div>`,()=>{const cx=W/2,cy=H/2;const[wx,wy]=s2w(cx,cy);if(r.c)addC(r.c,wx,wy);if(r.h)addH(r.h,wx,wy);if(r.xp)addXP(r.xp,wx,wy);sfx('coin');save(1);setTimeout(checkQuests,300);});sfx('quest');});}}
 for(const q of QUESTS){if(S.q.done.includes(q.id)||S.q.active.includes(q.id))continue;if(q.req&&!S.q.done.includes(q.req))continue;if(S.lvl<q.lvl)continue;
  S.q.active.push(q.id);S.q.prog[q.id]=q.obj.map(()=>0);changed=true;say(q.intro,()=>{toast('New quest: '+q.title);hint();});}
 if(changed){renderQuests();save(1);}}
function renderQuests(){const el=$('quests');el.innerHTML='';for(const id of S.q.active.slice(0,6)){const q=QI[id];const b=document.createElement('button');b.className='qbtn'+(qDone(q)?' done':'');
 const c=document.createElement('canvas');c.width=96;c.height=96;portrait(c,q.giver);b.appendChild(c);const bg=document.createElement('div');bg.className='bang';bg.textContent=qDone(q)?'✓':'!';b.appendChild(bg);b.onclick=()=>{sfx('tap');showQuest(id);};el.appendChild(b);}}
function showQuest(id){const q=QI[id];modal(`<h2>${q.title}</h2>${q.obj.map((o,i)=>{const p=qProg(q,i),ok=p>=o.n;return`<div class="obj ${ok?'ok':''}"><span class="ck">${ok?'✓':''}</span>${o.l}<span class="cnt">${p}/${o.n}</span></div>`;}).join('')}
 <div class="rew">Reward: ${q.r.c?`<span><b class="coin"></b>${q.r.c}</span>`:''}${q.r.xp?`<span>⭐${q.r.xp}</span>`:''}${q.r.h?`<span><b class="he3"></b>${q.r.h}</span>`:''}</div><div class="btnrow"><button class="btn" id="qrep">💬 Replay talk</button><button class="btn g" data-close>OK</button></div>`);
 $('qrep').onclick=()=>{closeModal();say(q.intro);};}

// ================= UI: HUD / TOAST / MODAL / DIALOG =================
function hud(){if(!S)return;$('credits').textContent=fmtN(S.credits);$('he3').textContent=fmtN(S.he3);$('lvlstar').textContent=S.lvl;const[p,a,b]=lvlProgress();$('xpfill').style.width=clamp(p*100,0,100)+'%';$('xptxt').textContent=S.lvl>=LV.length-1?'MAX':`${fmtN(a)}/${fmtN(b)}`;
 const bp=bonusPct();$('bonus').textContent=`Bonus +${bp}%`;$('bonus').classList.toggle('hide',!bp||mode==='intro');}
function toast(msg,click){const d=document.createElement('div');d.className='tst'+(click?' click':'');d.textContent=msg;if(click)d.onclick=click;$('toast').appendChild(d);setTimeout(()=>d.remove(),click?15000:2600);}
let modalCb=null;function modal(html,cb){$('modalIn').innerHTML=html;$('modal').classList.remove('hide');modalCb=cb||null;$('modalIn').querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{sfx('tap');closeModal(true);});}
function closeModal(ok){$('modal').classList.add('hide');const cb=modalCb;modalCb=null;if(ok&&cb)cb();}
const DQ=[];let dlgCur=null;
function say(lines,cb){if(!lines||!lines.length){cb&&cb();return;}DQ.push({lines:[...lines],cb});if(!dlgCur)nextDlg();}
function nextDlg(){if(dlgCur&&dlgCur.lines.length){const[who,txt]=dlgCur.lines.shift();showLine(who,txt);return;}if(dlgCur){const cb=dlgCur.cb;dlgCur=null;cb&&cb();}
 if(!dlgCur&&DQ.length){dlgCur=DQ.shift();return nextDlg();}if(!dlgCur){document.body.classList.remove('talk');$('dlg').classList.add('hide');$('dlgCover').classList.add('hide');hint();}}
function showLine(who,txt){document.body.classList.add('talk');$('dlg').classList.remove('hide');$('dlgCover').classList.remove('hide');portrait($('dlgP'),who);$('dlgN').textContent=C[who].n+(who==='ada'&&!S.chars.ada?' (radio)':'');$('dlgT').textContent=txt;tone(500+Math.random()*200,.04,'triangle',.04);}
$('dlgCover').onclick=()=>nextDlg();$('dlg').onclick=()=>nextDlg();
$('modal').onclick=e=>{if(e.target.id==='modal')closeModal();};

// ================= SHEETS =================
function openSheet(html){const s=$('sheet');s.innerHTML=html;s.classList.remove('hide');$('bbar').classList.add('hide');s.querySelectorAll('[data-x]').forEach(b=>b.onclick=closeSheet);}
function closeSheet(){$('sheet').classList.add('hide');sheetRef=null;if(mode==='play'&&S&&S.intro)$('bbar').classList.remove('hide');}
let sheetRef=null;
function jobSheet(id){const ch=C[id],sv=S.chars[id];sheetRef={k:'char',id};const t=now();
 let body='';if(sv.job){const j=jobDef(id,sv.job.id);const rem=sv.job.e-t;body=`<div class="job"><span class="ic">${j[2]}</span><div class="info"><div class="nm">${j[1]}</div><div class="prog"><i style="width:${clamp((t-sv.job.s)/(sv.job.e-sv.job.s)*100,0,100)}%"></i></div><div class="rw">${rem>0?fmtT(rem/1000)+' left':'Done!'}</div></div>${rem>0?`<button id="spdJob">⚛ ${speedCost(rem)}</button>`:`<button id="colJob">Collect</button>`}</div>`;}
 else{const qj=new Set();for(const qid of S.q.active)QI[qid].obj.forEach(o=>{if(o.t==='job'&&o.c===id)qj.add(o.j);});
  body=ch.jobs.map(j=>{const lockB=j[6]&&!hasBuilt(j[6]),lockL=j[7]&&S.lvl<j[7];const lk=lockB||lockL;
   return`<div class="job ${lk?'lock':''}"><span class="ic">${j[2]}</span><div class="info"><div class="nm">${j[1]}${qj.has(j[0])?'<span class="tag">QUEST</span>':''}</div><div class="rw">⏱ ${fmtT(j[3])} · ¢${j[4]} · ⭐${j[5]}${lockB?` · needs ${B[j[6]].n}`:''}${lockL?` · Lv ${j[7]}`:''}</div></div><button data-j="${j[0]}" ${lk?'disabled':''}>Go</button></div>`;}).join('');}
 openSheet(`<div class="sh-h"><canvas width="112" height="112" id="shp"></canvas><div style="flex:1"><h2>${ch.n}</h2><div class="sub" style="margin:0">${ch.role}</div></div><button class="x" data-x>✕</button></div>${body}`);
 portrait($('shp'),id);$('sheet').querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>startJob(id,jobDef(id,b.dataset.j)));
 if($('spdJob'))$('spdJob').onclick=()=>trySpeed(sv.job.e-now(),()=>{sv.job.e=now();closeSheet();});if($('colJob'))$('colJob').onclick=()=>{closeSheet();collectJob(id);};}
function objSheet(o){const d=B[o.t];sheetRef={k:'obj',id:o.id};const t=now();let st='',btn='';
 if(o.t==='debris'){return clearDebris(o);}
 if(o.st==='build'){const rem=o.be-t;st=`<div class="prog"><i style="width:${clamp((1-rem/(d.bt*1000))*100,0,100)}%"></i></div><div class="sub">${rem>0?'Under construction: '+fmtT(rem/1000)+' left':'Construction finished!'}</div>`;btn=rem>0?`<button class="btn t" id="spd2">⚛ ${speedCost(rem)} Finish now</button>`:`<button class="btn g" id="fin">Finish!</button>`;}
 else if(d.per){const el=t-o.lc,rem=d.per*1000-el;st=`<div class="prog"><i style="width:${clamp(el/(d.per*1000)*100,0,100)}%"></i></div><div class="sub">${rem>0?`Earning ¢${Math.round(d.c*(1+bonusPct()/100))} in ${fmtT(rem/1000)}`:'Ready to collect!'}</div>`;btn=rem>0?`<button class="btn t" id="spd3">⚛ ${speedCost(rem)} Rush</button>`:`<button class="btn g" id="col">Collect ¢</button>`;}
 else if(d.bonus)st=`<div class="sub">Decoration: +${d.bonus}% to all earnings</div>`;
 openSheet(`<div class="sh-h"><h2>${d.n}</h2><button class="x" data-x>✕</button></div>${d.d?`<div class="sub">${d.d}</div>`:''}${st}<div class="btnrow">${btn}<button class="btn" id="mv">✥ Move</button><button class="btn" id="fl">⇋ Flip</button>${o.st==='build'?'':'<button class="btn" id="stor">📦 Store</button>'}</div>`);
 const on=(id,f)=>{if($(id))$(id).onclick=f;};
 on('fin',()=>{closeSheet();finishBuild(o);});on('spd2',()=>trySpeed(o.be-now(),()=>{o.be=now();closeSheet();finishBuild(o);}));
 on('col',()=>{closeSheet();collectObj(o);});on('spd3',()=>trySpeed(d.per*1000-(now()-o.lc),()=>{o.lc=now()-d.per*1000;closeSheet();collectObj(o);}));
 on('mv',()=>{closeSheet();startMove(o);});on('fl',()=>{o.f=o.f?0:1;sfx('tap');save(1);});
 on('stor',()=>{closeSheet();S.objs=S.objs.filter(x=>x!==o);S.inv[o.t]=(S.inv[o.t]||0)+1;rebuildOcc();toast(d.n+' moved to storage');sfx('poof');save(1);});}
function clearDebris(o){const[a,b]=P(o.x+.5,o.y+.5,10);S.objs=S.objs.filter(x=>x!==o);rebuildOcc();poof(a,b,10,'#ffd27a');sfx('poof');addC(5,a,b);addXP(2,a,b);floatTxt(a,b,'+5','#ffe27a');rareDrop(a,b);ev('clear');save(1);}
function crewSheet(){sheetRef={k:'crew'};openSheet(`<div class="sh-h"><h2>Crew</h2><button class="x" data-x>✕</button></div>${CHAR_ORDER.map(id=>{const ch=C[id],un=!!S.chars[id];const sv=S.chars[id];
 const st=!un?`🔒 Build ${B[ch.unlock].n}`:sv.job?(now()>=sv.job.e?'✅ Job done, tap to collect':'⏳ '+jobDef(id,sv.job.id)[1]):'💤 Idle, needs a job';
 return`<div class="job ${un?'':'lock'}"><canvas width="80" height="80" data-p="${id}" style="width:40px;height:40px;border-radius:50%;border:2px solid #3b1a10;background:#ffe6c4"></canvas><div class="info"><div class="nm">${ch.n}</div><div class="rw">${st}</div></div>${un?`<button data-c="${id}">Go</button>`:''}</div>`;}).join('')}`);
 $('sheet').querySelectorAll('[data-p]').forEach(c=>portrait(c,c.dataset.p));$('sheet').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const id=b.dataset.c,r=RT.chars[id];centerOn(r.x,r.y);if(S.chars[id].job&&now()>=S.chars[id].job.e){closeSheet();collectJob(id);}else jobSheet(id);});}

// ================= STORE =================
const TABS=[['build','🏗️ Buildings'],['homes','🏠 Homes'],['deco','🌵 Decor'],['paths','🛣️ Paths'],['chars','👥 Characters'],['land','🚩 Land'],['inv','📦 Storage']];
let storeTab='build';const thumbCache={};
function thumb(t){if(thumbCache[t])return thumbCache[t];const d=B[t],c=document.createElement('canvas');c.width=220;c.height=156;const x=c.getContext('2d');const old=g;g=x;const T0=T;T=1;
 const s=d.s,hg=(d.hg||40)+16,ww=s*64+16,hh=s*32+hg;const k=Math.min(200/ww,140/hh);x.setTransform(k,0,0,k,110,150-s*32*k-(140-hh*k)/2+4);
 if(d.cat==='x'&&t==='debris')D.debris(0,0,1,{id:1});else D[t](0,0,s,{id:1});g=old;T=T0;return thumbCache[t]=c;}
function pathThumb(k){const c=document.createElement('canvas');c.width=220;c.height=156;const x=c.getContext('2d');const old=g;g=x;x.setTransform(1.3,0,0,1.3,110,40);const bak=S.paths;S.paths={'0,0':k,'1,0':k,'0,1':k,'1,1':k};drawPaths(-1e4,-1e4,1e4,1e4);S.paths=bak;g=old;return c;}
function openStore(tab){if(tab)storeTab=tab;$('store').classList.remove('hide');closeSheet();renderStore();sfx('tap');}
function closeStore(){$('store').classList.add('hide');hint();}
$('storeX').onclick=closeStore;$('store').onclick=e=>{if(e.target.id==='store')closeStore();};
function priceHTML(d){return d.cost===0?'FREE':`<b class="${d.cur==='h'?'he3':'coin'}"></b>${fmtN(d.cost)}`;}
function renderStore(){$('tabs').innerHTML=TABS.map(([k,n])=>`<button class="tab ${k===storeTab?'on':''}" data-t="${k}">${n}</button>`).join('');
 $('tabs').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{storeTab=b.dataset.t;renderStore();sfx('tap');});
 const grid=$('grid');grid.innerHTML='';const add=(html,c,fn,cls='')=>{const d=document.createElement('div');d.className='card '+cls;d.innerHTML=html;if(c){const cc=d.querySelector('canvas');cc.width=c.width;cc.height=c.height;cc.getContext('2d').drawImage(c,0,0);}if(fn)d.onclick=fn;grid.appendChild(d);return d;};
 if(['build','homes','deco'].includes(storeTab)){const items=Object.entries(B).filter(([k,d])=>d.cat===storeTab).sort((a,b)=>a[1].lvl-b[1].lvl||a[1].cost-b[1].cost);
  for(const[k,d]of items){const lock=S.lvl<d.lvl,own=d.uniq&&ownedAny(k);const afford=d.cur==='h'?S.he3>=d.cost:S.credits>=d.cost;
   const meta=d.bonus?`+${d.bonus}% bonus`:d.per?`¢${d.c} / ${fmtT(d.per)}`:'';
   const el=add(`<canvas></canvas><div class="nm">${d.n}</div><div class="meta">${meta}${d.unlock?` · 👤 ${C[d.unlock].short}`:''}</div><div class="pr" style="${!afford&&!lock&&!own?'color:#c0301a':''}">${own?'Owned ✓':priceHTML(d)}</div>${lock?`<div class="lk">🔒 Level ${d.lvl}</div>`:''}`,thumb(k),()=>{
    if(lock){toast(`Unlocks at level ${d.lvl}`);sfx('err');return;}if(own){toast('You already have one!');return;}if(!afford){toast(d.cur==='h'?'Not enough Helium-3':'Not enough credits');sfx('err');return;}closeStore();startPlace(k);},(lock?'lock':own?'owned':''));el.dataset.k=k;}}
 else if(storeTab==='paths'){for(const[k,p]of Object.entries(PATHS)){const lock=S.lvl<p.lvl;add(`<canvas></canvas><div class="nm">${p.n}</div><div class="pr">FREE</div>${lock?`<div class="lk">🔒 Level ${p.lvl}</div>`:''}`,pathThumb(k),()=>{if(lock){toast(`Unlocks at level ${p.lvl}`);return;}closeStore();startPath(k);},lock?'lock':'');}}
 else if(storeTab==='chars'){for(const id of CHAR_ORDER){const ch=C[id],un=!!S.chars[id];const c=document.createElement('canvas');c.width=156;c.height=156;portrait(c,id);
  add(`<canvas></canvas><div class="nm">${ch.n}</div><div class="meta">${ch.role}</div><div class="pr">${un?'In colony ✓':'🔒 '+B[ch.unlock].n}</div>`,c,()=>{if(un){closeStore();const r=RT.chars[id];centerOn(r.x,r.y);jobSheet(id);}else{storeTab=B[ch.unlock].cat;renderStore();}},un?'':'lock');}}
 else if(storeTab==='land'){const c=document.createElement('canvas');c.width=220;c.height=156;const x=c.getContext('2d');x.font='90px system-ui';x.textAlign='center';x.fillText('🚩',110,110);
  add(`<canvas></canvas><div class="nm">Expand Land</div><div class="meta">${buyablePlots().length} plots available</div><div class="pr"><b class="coin"></b>${fmtN(landPrice())}</div>`,c,()=>{closeStore();startLand();});}
 else if(storeTab==='inv'){const ks=Object.keys(S.inv).filter(k=>S.inv[k]>0);if(!ks.length)grid.innerHTML='<p style="grid-column:1/-1;text-align:center;opacity:.7">Storage is empty. Store buildings from their menu to place them later for free.</p>';
  for(const k of ks)add(`<canvas></canvas><div class="nm">${B[k].n}</div><div class="pr">×${S.inv[k]} · place free</div>`,thumb(k),()=>{closeStore();startPlace(k,1);});}
 hint();}

// ================= MODES: place / move / path / land =================
let mode='title',PL=null,PM=null;
function setMode(m){mode=m;const ui=m==='play';$('bbar').classList.toggle('hide',!ui);$('quests').classList.toggle('hide',!ui&&m!=='place'&&m!=='path'&&m!=='land');$('modebar').classList.toggle('hide',ui||m==='intro'||m==='title');$('modelabel').classList.toggle('hide',ui||m==='intro'||m==='title');if(ui){PL=null;PM=null;}hud();hint();}
function modebar(html,label){$('modebar').innerHTML=html;$('modelabel').textContent=label;}
function nearestFree(t,x0,y0,ex){const s=B[t].s;for(let r=0;r<20;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(canPlace(t,x0+dx,y0+dy,ex))return[x0+dx,y0+dy];}return[x0,y0];}
function screenCenterTile(s){const[wx,wy]=s2w(W/2,H*.45);const[tx,ty]=w2t(wx,wy);return[Math.round(tx-s/2),Math.round(ty-s/2)];}
function startPlace(t,inv){const s=B[t].s;const[cx,cy]=screenCenterTile(s);const[x,y]=nearestFree(t,cx,cy);PL={t,x,y,f:0,inv:!!inv};closeSheet();setMode('place');placeBar();}
function startMove(o){PL={t:o.t,x:o.x,y:o.y,f:o.f||0,moveId:o.id};setMode('place');placeBar();}
function placeBar(){const d=B[PL.t];modebar(`<button class="mb no" id="pX">✕</button><button class="mb" id="pF">⇋</button><button class="mb ok" id="pOK">✓ ${PL.moveId?'Move':'Place'}</button>`,PL.moveId?`Drag ${d.n} to a new spot`:`${d.n} · ${d.cost&&!PL.inv?(d.cur==='h'?'⚛':'¢')+d.cost:'free'} · drag to position`);
 $('pX').onclick=()=>{sfx('tap');setMode('play');};$('pF').onclick=()=>{PL.f=PL.f?0:1;sfx('tap');};$('pOK').onclick=confirmPlace;}
function confirmPlace(){const d=B[PL.t];if(!canPlace(PL.t,PL.x,PL.y,PL.moveId)){toast("Can't place it there");sfx('err');return;}
 if(PL.moveId){const o=objById(PL.moveId);o.x=PL.x;o.y=PL.y;o.f=PL.f;rebuildOcc();sfx('build');save(1);setMode('play');return;}
 if(!PL.inv){if(d.cur==='h'){if(S.he3<d.cost){toast('Not enough Helium-3');return;}S.he3-=d.cost;}else{if(S.credits<d.cost){toast('Not enough credits');return;}S.credits-=d.cost;}}else S.inv[PL.t]--;
 const o={id:S.nid++,t:PL.t,x:PL.x,y:PL.y,f:PL.f,st:'ok',lc:now()};const fromInv=PL.inv;
 if(d.bt&&!fromInv){o.st='build';o.be=now()+d.bt*1000;}S.objs.push(o);rebuildOcc();sfx('build');const[a,b]=P(o.x+d.s/2,o.y+d.s/2,20);poof(a,b,8,'#ffe2a0');
 if(d.cat==='deco'&&!fromInv){const xp=Math.max(2,Math.round((d.cur==='h'?d.cost*20:d.cost)/10));addXP(xp,a,b);floatTxt(a,b,'+'+xp+' XP','#9ff5ec');ev('deco');}
 for(const id in RT.chars){const r=RT.chars[id];if(occ[Math.floor(r.y)*N+Math.floor(r.x)]===o.id){const ft=frontTile(o);if(ft){r.x=ft[0]+.5;r.y=ft[1]+.5;r.path=[];}}}
 hud();save(1);
 const again=!d.uniq&&!fromInv&&(d.cur==='h'?S.he3>=d.cost:S.credits>=d.cost)&&d.cost>0;
 if(again){const[nx,ny]=nearestFree(PL.t,PL.x+d.s,PL.y,0);PL.x=nx;PL.y=ny;placeBar();$('modelabel').textContent=`Placed! Place another ${d.n}, or tap ✕ when done`;}else setMode('play');}
function startPath(k){PM={k,erase:false};closeSheet();setMode('path');pathBar();}
function pathBar(){modebar(`<button class="mb ${PM.erase?'':'on'}" id="pP">🛣️ Draw</button><button class="mb ${PM.erase?'on':''}" id="pE">🧽 Erase</button><button class="mb ok" id="pD">✓ Done</button>`,PM.erase?'Drag to erase paths · 2 fingers to pan/zoom':`${PATHS[PM.k].n}: drag one finger to draw · 2 fingers pan/zoom`);
 $('pP').onclick=()=>{PM.erase=false;pathBar();};$('pE').onclick=()=>{PM.erase=true;pathBar();};$('pD').onclick=()=>{save(1);setMode('play');};}
function paintTile(tx,ty,stroke){tx=Math.floor(tx);ty=Math.floor(ty);if(!owned(tx,ty))return;const k=tx+','+ty;if(stroke.done.has(k))return;
 if(PM.erase){if(!S.paths[k])return;stroke.undo.push([k,S.paths[k]]);delete S.paths[k];}else{if(occ[ty*N+tx]||S.paths[k]===PM.k)return;stroke.undo.push([k,S.paths[k]||null]);S.paths[k]=PM.k;}stroke.done.add(k);tone(700+Math.random()*80,.03,'triangle',.03);}
function undoStroke(st){for(let i=st.undo.length-1;i>=0;i--){const[k,v]=st.undo[i];if(v)S.paths[k]=v;else delete S.paths[k];}st.undo=[];}
function startLand(){if(!buyablePlots().length){toast('No land left to buy!');return;}closeSheet();setMode('land');modebar(`<button class="mb ok" id="lD">✓ Done</button>`,`Tap a glowing plot to buy it · ¢${fmtN(landPrice())}`);$('lD').onclick=()=>setMode('play');const p=buyablePlots()[0];}
function tryBuyPlot(px,py){const pr=landPrice();modal(`<h2>Buy Land?</h2><p style="text-align:center">Expand the colony onto this plot for</p><div class="rew"><span><b class="coin"></b>${fmtN(pr)}</span></div><div class="btnrow"><button class="btn" data-close>Not now</button><button class="btn g" id="buyL">Buy it!</button></div>`);
 $('buyL').onclick=()=>{if(S.credits<pr){toast('Not enough credits');sfx('err');return;}S.credits-=pr;S.plots[px+','+py]=1;S.land++;groundDirty=true;closeModal();const[a,b]=P(px*PS+PS/2,py*PS+PS/2);poof(a,b,16,'#5ff0e0');sfx('lvl');addXP(10,a,b);ev('land');save(1);
  if(buyablePlots().length)$('modelabel').textContent=`Tap a glowing plot to buy it · ¢${fmtN(landPrice())}`;else setMode('play');};}

// ================= TUTORIAL HINTS =================
let arrowT=null,tutTab=null;
function hint(){if(!S)return;tutTab=null;document.querySelectorAll('.pulse').forEach(e=>e.classList.remove('pulse'));arrowT=null;let tip='';
 if(mode==='intro'||mode==='title'||dlgCur){$('tip').classList.add('hide');return;}
 const act=id=>S.q.active.includes(id);const storeOpen=!$('store').classList.contains('hide');
 const wantBuild=(k,label)=>{if(ownedAny(k)){const o=S.objs.find(o=>o.t===k);if(o&&o.st==='build'){tip=now()>=o.be?`Tap the 🔨 bubble to finish ${B[k].n}!`:`Building ${B[k].n}... tap the 🔨 when it's done.`;if(now()>=o.be)arrowT={o};}return true;}
  if(mode==='place'&&PL&&PL.t===k){tip='Drag it where you want, then tap ✓ Place';$('pOK')&&$('pOK').classList.add('pulse');return true;}
  if(storeOpen){const tb=B[k].cat;if(storeTab!==tb){const b=document.querySelector(`.tab[data-t="${tb}"]`);b&&b.classList.add('pulse');}else{const c=document.querySelector(`.card[data-k="${k}"]`);c&&c.classList.add('pulse');}tip=`Tap ${label}`;}
  else if(mode==='play'){$('storeBtn').classList.add('pulse');tutTab=B[k].cat;tip=`Open the Build store to get ${label}`;}return true;};
 if(act('crash')&&!hasBuilt('skiphab'))wantBuild('skiphab',"Skip's Hab");
 else if(act('work')&&!S.chars.skip.job&&mode==='play'){tip='Tap Skip to give him a job';arrowT={ch:'skip'};}
 else if(act('work')&&S.chars.skip.job&&mode==='play'){tip=now()>=S.chars.skip.job.e?'Tap the ✓ bubble over Skip to collect':'Skip is working... wait for the ✓ bubble';if(now()>=S.chars.skip.job.e)arrowT={ch:'skip'};}
 else if(act('tidy')&&mode==='play'&&S.objs.some(o=>o.t==='debris')){tip='Tap the burning wreckage to salvage it';arrowT={o:S.objs.find(o=>o.t==='debris')};}
 else if(act('cmd')&&!hasBuilt('cmdhab'))wantBuild('cmdhab','the Command Hab');
 else if(act('snack')&&!hasBuilt('rations'))wantBuild('rations','Rocket Rations');
 else if(act('snack')&&mode==='play'){tip='When the ¢ bubble pops up over Rocket Rations, tap it to collect';}
 if(storeOpen&&!tip)tip='';
 $('tip').textContent=tip;$('tip').classList.toggle('hide',!tip||storeOpen&&!tip);}
function drawWorldArrow(){if(!arrowT||mode!=='play')return;let X,Y;if(arrowT.ch){const r=RT.chars[arrowT.ch];if(!r)return;[X,Y]=P(r.x,r.y,62);}else{const o=arrowT.o;if(!S.objs.includes(o))return;const d=B[o.t];[X,Y]=P(o.x+d.s/2,o.y+d.s/2,(d.hg||30)+(o.st==='build'?52:20));}
 const b=Math.sin(T*6)*6;g.save();g.translate(X,Y-b);poly([[-9,-22],[9,-22],[9,-8],[16,-8],[0,6],[-16,-8],[-9,-8]],'#ffe24a',OUT,2.5);g.restore();}
setInterval(()=>{if(mode==='play'&&S&&S.intro){hint();if(sheetRef&&!$('sheet').classList.contains('hide')){if(sheetRef.k==='char')jobSheet(sheetRef.id);else if(sheetRef.k==='obj'){const o=objById(sheetRef.id);if(o)objSheet(o);}}}},1000);

// ================= INTRO: the crash =================
let IN=null;const CRASH=[21,22];
function caption(t){const c=$('cap');if(!t){c.classList.add('hide');return;}c.textContent=t;c.classList.remove('hide');}
function startIntro(){setMode('intro');document.body.classList.add('cine');$('skipIntro').classList.remove('hide');
 S.objs=[{id:S.nid++,t:'pod',x:24,y:20,st:'ok',lc:now(),old:1},{id:S.nid++,t:'cmdhab',x:20,y:24,st:'ok',lc:now(),old:1},{id:S.nid++,t:'comms',x:25,y:24,st:'ok',lc:now(),old:1},{id:S.nid++,t:'solar',x:19,y:20,st:'ok',lc:now(),old:1},{id:S.nid++,t:'flag',x:23,y:27,st:'ok',lc:now(),old:1}];
 rebuildOcc();spawnChar('skip',24.5,26.5);RT.chars.skip.hidden=1;IN={t:0,boom:0,caps:{}};centerOn(23,23.5);cam.y-=60;cam.z=Math.min(.85,W/560);}
function introShip(t){const[cx,cy]=P(CRASH[0]+1.5,CRASH[1]+1.5);
 if(t<3.6){const k=clamp((t-.4)/3.2,0,1);return{x:lerp(cx-420,cx-130,k),y:lerp(cy-760,cy-280,ease(k)),a:Math.PI/2+Math.sin(t*3)*.05,fl:0};}
 if(t<4.5){const k=(t-3.6)/.9;return{x:lerp(cx-130,cx-60,k),y:lerp(cy-280,cy-180,k),a:lerp(Math.PI/2,-.7,ease(k)),fl:Math.random()<.7?1:0};}
 const k=clamp((t-4.5)/.7,0,1);return{x:lerp(cx-60,cx,k),y:lerp(cy-180,cy-14,k*k),a:lerp(-.7,-2.1,k),fl:Math.random()<.25?.6:0};}
function updateIntro(dt){if(!IN)return;IN.t+=dt;const t=IN.t;const cap=(at,txt)=>{if(t>=at&&!IN.caps[at]){IN.caps[at]=1;caption(txt);}};
 cap(.2,'Mars. Outpost Alpha. Sol 1.');cap(1.8,'SKIP (radio): Coming in hot! Totally on purpose!');cap(3.6,'SKIP: Flip maneuver in 3... 2...');cap(4.5,'SKIP: ...which way is up?');
 if(t>=5.2&&!IN.boom)boom(true);cap(6.8,'');if(t>=6.6&&RT.chars.skip.hidden){RT.chars.skip.hidden=0;const[a,b]=P(24.5,26.5,10);poof(a,b,10,'#ccc');}
 if(t>=8.4)endIntro();}
function boom(loud){IN.boom=1;const[cx,cy]=P(CRASH[0]+1.5,CRASH[1]+1.5);S.objs=S.objs.filter(o=>!o.old);
 if(!IN.replay){S.objs.push({id:S.nid++,t:'wreck',x:CRASH[0],y:CRASH[1],st:'ok',lc:now()});}
 const spots=[[19,19],[22,19],[26,20],[28,22],[19,26],[21,28],[25,26],[27,27],[18,23],[24,21],[28,25],[22,26]];if(!IN.replay)for(const[x,y]of spots)S.objs.push({id:S.nid++,t:'debris',x,y,st:'ok',lc:now()});else S.objs.push({id:-9,t:'wreck',x:CRASH[0],y:CRASH[1],st:'ok',lc:now()});rebuildOcc();
 if(loud){sfx('boom');shake=1;$('flash').style.transition='none';$('flash').style.opacity=1;requestAnimationFrame(()=>{$('flash').style.transition='opacity .9s';$('flash').style.opacity=0;});
  for(let i=0;i<26;i++)fx.push({k:'fire',x:cx+(Math.random()-.5)*120,y:cy+(Math.random()-.5)*50-10,r:14+Math.random()*22,t:-Math.random()*.4,life:1+Math.random()*.6});
  for(let i=0;i<22;i++)fx.push({k:'smoke',x:cx+(Math.random()-.5)*140,y:cy+(Math.random()-.5)*60-20,r:16+Math.random()*20,t:-Math.random()*1.2,life:3+Math.random()*1.5});
  for(let i=0;i<30;i++){const a=Math.random()*7,v=80+Math.random()*220;fx.push({k:'chunk',x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,h:10,vh:150+Math.random()*250,t:0,life:2.5,c:['#c9cfd2','#2a2d31','#e9e2d5','#f08a3c'][i%4]});}
  fx.push({k:'ring',x:cx,y:cy,r:60,t:0,life:.8});}}
function drawIntroShip(){if(!IN||IN.boom)return;const s=introShip(IN.t);g.save();g.translate(s.x,s.y);g.rotate(s.a);ship(150,s.fl);g.restore();
 if(IN.t<3.6&&IN.t>.4){g.save();g.translate(s.x,s.y);g.globalAlpha=.5;for(let k=0;k<4;k++){circ(-10-k*14,-Math.random()*6,6+k*2,'rgba(255,190,120,.5)',null);}g.restore();}}
function endIntro(){if(!IN)return;if(!IN.boom)boom(false);const rp=IN.replay;IN=null;if(rp){S.objs=rp;rebuildOcc();caption('');RT.chars.skip.hidden=0;$('skipIntro').classList.add('hide');document.body.classList.remove('cine');setMode('play');['hud','quests','bbar'].forEach(i=>$(i).classList.remove('hide'));return;}caption('');RT.chars.skip.hidden=0;$('skipIntro').classList.add('hide');document.body.classList.remove('cine');
 S.intro=1;setMode('play');['hud','quests','bbar'].forEach(i=>$(i).classList.remove('hide'));hud();save(1);setTimeout(checkQuests,300);}
$('skipIntro').onclick=e=>{e.stopPropagation();endIntro();};

// ================= INPUT =================
const ptrs=new Map();let gest=null;
function tileAt(sx,sy){const[wx,wy]=s2w(sx,sy);return w2t(wx,wy);}
cv.addEventListener('pointerdown',e=>{audio();try{cv.setPointerCapture(e.pointerId);}catch(_){}ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(ptrs.size===1){gest={k:'pend',sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,t:now(),moved:0,multi:0};
  if(mode==='place'&&PL){const[tx,ty]=tileAt(e.clientX,e.clientY);const s=B[PL.t].s;if(tx>=PL.x-.6&&tx<=PL.x+s+.6&&ty>=PL.y-.6&&ty<=PL.y+s+.6){gest.k='ghost';gest.ox=tx-PL.x;gest.oy=ty-PL.y;}}
  else if(mode==='path'&&PM){gest.k='paint';gest.stroke={undo:[],done:new Set()};gest.started=0;}}
 else if(ptrs.size===2){if(gest&&gest.k==='paint'&&gest.stroke)undoStroke(gest.stroke);const[a,b]=[...ptrs.values()];gest={k:'pinch',d:Math.hypot(a.x-b.x,a.y-b.y),mx:(a.x+b.x)/2,my:(a.y+b.y)/2,multi:1};}});
cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p||!gest)return;p.x=e.clientX;p.y=e.clientY;
 if(gest.k==='pinch'&&ptrs.size>=2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  const[wx,wy]=s2w(mx,my);cam.z=clamp(cam.z*d/Math.max(1,gest.d),.38,2.2);cam.x=wx-(mx-W/2)/cam.z;cam.y=wy-(my-H/2)/cam.z;cam.x-=(mx-gest.mx)/cam.z;cam.y-=(my-gest.my)/cam.z;clampCam();gest.d=d;gest.mx=mx;gest.my=my;return;}
 if(ptrs.size!==1)return;const dx=e.clientX-gest.lx,dy=e.clientY-gest.ly;if(Math.hypot(e.clientX-gest.sx,e.clientY-gest.sy)>8)gest.moved=1;
 if(gest.k==='ghost'){const[tx,ty]=tileAt(e.clientX,e.clientY);PL.x=Math.round(tx-gest.ox);PL.y=Math.round(ty-gest.oy);}
 else if(gest.k==='paint'){if(gest.multi)return;if(!gest.started&&(gest.moved||now()-gest.t>90))gest.started=1;if(gest.started){const[tx,ty]=tileAt(e.clientX,e.clientY);const[px,py]=gest.lt||[tx,ty];const n=Math.ceil(Math.hypot(tx-px,ty-py)*2)+1;for(let i=0;i<=n;i++)paintTile(lerp(px,tx,i/n),lerp(py,ty,i/n),gest.stroke);gest.lt=[tx,ty];}}
 else if(gest.k==='pend'||gest.k==='pan'||gest.k==='after'){if(gest.moved||gest.k!=='pend'){gest.k=gest.k==='after'?'after':'pan';cam.x-=dx/cam.z;cam.y-=dy/cam.z;clampCam();}}
 gest.lx=e.clientX;gest.ly=e.clientY;});
function endPtr(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(!gest)return;
 if(gest.k==='pinch'){if(ptrs.size===1){const[a]=[...ptrs.values()];gest={k:'after',sx:a.x,sy:a.y,lx:a.x,ly:a.y,moved:1,multi:1};}return;}
 if(ptrs.size===0){const g0=gest;gest=null;if(e.type==='pointercancel')return;
  if(g0.k==='paint'&&!g0.multi){if(!g0.started){const[tx,ty]=tileAt(e.clientX,e.clientY);paintTile(tx,ty,g0.stroke);}return;}
  if(g0.k==='ghost'&&!g0.moved){return;}
  if(!g0.moved&&!g0.multi&&(g0.k==='pend'))tap(e.clientX,e.clientY);}}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('wheel',e=>{e.preventDefault();const[wx,wy]=s2w(e.clientX,e.clientY);cam.z=clamp(cam.z*Math.exp(-e.deltaY*.0015),.38,2.2);cam.x=wx-(e.clientX-W/2)/cam.z;cam.y=wy-(e.clientY-H/2)/cam.z;clampCam();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());document.addEventListener('dblclick',e=>e.preventDefault());
function hitObj(wx,wy){const list=S.objs.slice().sort((a,b)=>-depthCmp({x0:a.x,y0:a.y,x1:a.x+B[a.t].s,y1:a.y+B[a.t].s},{x0:b.x,y0:b.y,x1:b.x+B[b.t].s,y1:b.y+B[b.t].s}));
 for(const o of list){const d=B[o.t],s=d.s,h=(o.st==='build'?Math.max(18,d.hg*.6):d.hg||30)*.9;const pts=[P(o.x,o.y+s),P(o.x+s,o.y+s),P(o.x+s,o.y),P(o.x+s,o.y,h),P(o.x,o.y,h),P(o.x,o.y+s,h)];
  let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>wy)!==(yj>wy))&&(wx<(xj-xi)*(wy-yi)/(yj-yi)+xi))inside=!inside;}if(inside)return o;}return null;}
function tap(sx,sy){if(!S)return;const[wx,wy]=s2w(sx,sy);const[tx,ty]=w2t(wx,wy);
 if(mode==='place'&&PL){const s=B[PL.t].s;PL.x=Math.round(tx-s/2);PL.y=Math.round(ty-s/2);return;}
 if(mode==='land'){const px=Math.floor(tx/PS),py=Math.floor(ty/PS);if(buyablePlots().some(([a,b])=>a===px&&b===py))tryBuyPlot(px,py);return;}
 if(mode!=='play')return;
 for(let i=BUB.length-1;i>=0;i--){const b=BUB[i];if(Math.hypot(wx-b.x,wy-b.y)<b.r){if(b.act.o){if(b.act.o.st==='build')finishBuild(b.act.o);else collectObj(b.act.o);}else collectJob(b.act.ch);closeSheet();hint();return;}}
 let best=null,bd=1e9;for(const id in RT.chars){const r=RT.chars[id];if(r.hidden)continue;const[X,Y]=P(r.x,r.y);const d=Math.hypot(wx-X,(wy-(Y-16))*1.2);const lim=Math.max(20,24/cam.z);if(d<lim&&d<bd){bd=d;best=id;}}
 if(best){sfx('tap');const sv=S.chars[best];if(sv.job&&now()>=sv.job.e){collectJob(best);closeSheet();}else jobSheet(best);return;}
 const o=hitObj(wx,wy);if(o){sfx('tap');if(o.t==='debris'){clearDebris(o);return;}if(o.st==='build'&&now()>=o.be){finishBuild(o);return;}if(o.st==='ok'&&B[o.t].per&&now()-o.lc>=B[o.t].per*1000){collectObj(o);return;}objSheet(o);return;}
 closeSheet();}

// ================= SAVE / LOAD =================
let lastSave=0;
function save(force){if(!S||!S.intro||mode==='intro')return;if(!force&&now()-lastSave<3000)return;lastSave=now();for(const id in RT.chars){S.chars[id].x=RT.chars[id].x;S.chars[id].y=RT.chars[id].y;}S.cam={x:cam.x,y:cam.y,z:cam.z};S.saved=now();
 try{localStorage.setItem(SK,JSON.stringify(S));}catch(e){console.warn('save failed',e);}}
function validState(o){return o&&typeof o==='object'&&Array.isArray(o.objs)&&o.plots&&o.chars&&o.q;}
function loadState(raw){const o=JSON.parse(raw);if(!validState(o))throw new Error('bad save');const base=newState();for(const k in base)if(o[k]===undefined)o[k]=base[k];
 o.objs=o.objs.filter(x=>B[x.t]);o.q.active=o.q.active.filter(id=>QI[id]);return o;}
function boot(){let raw=null;try{raw=localStorage.getItem(SK);}catch(e){}
 if(raw){try{S=loadState(raw);try{localStorage.setItem(BK,raw);}catch(e){}}catch(e){console.warn('load failed',e);try{localStorage.setItem('rpr-corrupt-'+now(),raw);}catch(_){}S=null;}}
 if(!S)S=newState();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}
 RT.chars={};for(const id in S.chars)spawnChar(id,S.chars[id].x,S.chars[id].y);rebuildOcc();
 if(S.cam){cam.x=S.cam.x;cam.y=S.cam.y;cam.z=S.cam.z;clampCam();}else centerOn(24,24);hud();}
function exportCode(){save(1);return'RPR1:'+btoa(unescape(encodeURIComponent(JSON.stringify(S))));}
function importCode(code){code=code.trim();if(code.startsWith('RPR1:'))code=code.slice(5);const json=decodeURIComponent(escape(atob(code)));return loadState(json);}
addEventListener('pagehide',()=>save(1));document.addEventListener('visibilitychange',()=>{if(document.hidden)save(1);});
setInterval(()=>save(1),10000);setInterval(()=>{try{if(S&&S.intro)localStorage.setItem(BK,JSON.stringify(S));}catch(e){}},300000);

// ================= MENU =================
$('menuBtn').onclick=()=>{sfx('tap');modal(`<h2>Menu</h2><p style="text-align:center;font-size:13px;opacity:.7">Red Planet Rebuild v${VERSION} · autosaves every 10s</p>
 <div class="btnrow"><button class="btn t" id="mSave">💾 Save now</button><button class="btn" id="mSnd">${S.sound?'🔊 Sound on':'🔇 Sound off'}</button></div>
 <div class="btnrow"><button class="btn" id="mExp">📤 Export save</button><button class="btn" id="mImp">📥 Import save</button></div>
 <div class="btnrow"><button class="btn" id="mBak">⏪ Restore backup</button><button class="btn" id="mReplay">🎬 Replay crash</button></div>
 <div class="btnrow"><button class="btn r" id="mNew">🗑️ New colony</button><button class="btn g" data-close>Close</button></div>`);
 $('mSave').onclick=()=>{save(1);toast('Saved!');closeModal();};$('mSnd').onclick=()=>{S.sound=S.sound?0:1;$('mSnd').textContent=S.sound?'🔊 Sound on':'🔇 Sound off';save(1);};
 $('mExp').onclick=()=>{const c=exportCode();modal(`<h2>Export</h2><p>Copy this code and keep it safe. Paste it into Import on another device or the home-screen app.</p><textarea readonly id="expT">${c}</textarea><div class="btnrow"><button class="btn t" id="cpy">📋 Copy</button><button class="btn" data-close>Done</button></div>`);
  $('expT').onclick=()=>$('expT').select();$('cpy').onclick=async()=>{try{await navigator.clipboard.writeText(c);toast('Copied!');}catch(e){$('expT').select();document.execCommand('copy');toast('Copied!');}};};
 $('mImp').onclick=()=>{modal(`<h2>Import</h2><p>Paste an export code. This replaces your current colony (it's kept as the backup).</p><textarea id="impT" placeholder="RPR1:..."></textarea><div class="btnrow"><button class="btn" data-close>Cancel</button><button class="btn g" id="impGo">Import</button></div>`);
  $('impGo').onclick=()=>{try{const st=importCode($('impT').value);localStorage.setItem(BK,JSON.stringify(S));localStorage.setItem(SK,JSON.stringify(st));location.reload();}catch(e){toast('That code didn\'t work. Check you copied all of it.');}};};
 $('mBak').onclick=()=>{const raw=localStorage.getItem(BK);if(!raw){toast('No backup yet');return;}let st;try{st=loadState(raw);}catch(e){toast('Backup is damaged');return;}
  modal(`<h2>Restore backup?</h2><p>Backup is Level ${st.lvl} with ¢${fmtN(st.credits)}. Your current colony becomes the new backup.</p><div class="btnrow"><button class="btn" data-close>Cancel</button><button class="btn g" id="bGo">Restore</button></div>`);
  $('bGo').onclick=()=>{const cur=JSON.stringify(S);localStorage.setItem(SK,raw);localStorage.setItem(BK,cur);S=null;location.reload();};};
 $('mReplay').onclick=()=>{closeModal();replayCrash();};
 $('mNew').onclick=()=>{modal(`<h2>Start over?</h2><p>This wipes your colony. Your current one is kept as the backup, so you can restore it from the menu.</p><div class="btnrow"><button class="btn" data-close>Cancel</button><button class="btn r" id="nGo">Start over</button></div>`);
  $('nGo').onclick=()=>{localStorage.setItem(BK,JSON.stringify(S));localStorage.removeItem(SK);S=null;location.reload();};};};
function replayCrash(){const keep=S.objs;save(1);setMode('intro');document.body.classList.add('cine');closeSheet();
 S.objs=[{id:-1,t:'pod',x:24,y:20,st:'ok',lc:now(),old:1},{id:-2,t:'cmdhab',x:20,y:24,st:'ok',lc:now(),old:1},{id:-3,t:'comms',x:25,y:24,st:'ok',lc:now(),old:1}];rebuildOcc();
 IN={t:0,boom:0,caps:{},replay:keep};RT.chars.skip.hidden=1;centerOn(23,23.5);cam.y-=60;$('skipIntro').classList.remove('hide');}
$('charBtn').onclick=()=>{sfx('tap');crewSheet();};$('storeBtn').onclick=()=>{openStore(tutTab);};$('landBtn').onclick=()=>{sfx('tap');startLand();};

// ================= LOOP =================
let last=performance.now();
function frame(t){const dt=Math.min(.05,(t-last)/1000);last=t;T+=dt;if(shake>0)shake=Math.max(0,shake-dt*1.2);
 if(S){if(mode==='intro')updateIntro(dt);else updateChars(dt);render(dt);}
 requestAnimationFrame(frame);}

// ================= TITLE / START =================
function drawTitle(){const c=$('titleShip'),x=c.getContext('2d');const old=g;g=x;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,600,600);
 x.fillStyle='rgba(255,220,180,.15)';x.beginPath();x.arc(300,300,250,0,7);x.fill();
 const gr=x.createLinearGradient(0,380,0,600);gr.addColorStop(0,'#d9824b');gr.addColorStop(1,'#a8452a');x.fillStyle=gr;x.beginPath();x.ellipse(300,520,330,110,0,0,7);x.fill();
 x.save();x.translate(300,250+Math.sin(T*2)*8);x.rotate(.18);x.scale(2.2,2.2);ship(150,1);x.restore();
 x.save();x.translate(150,470);x.scale(2.2,2.2);drawChar('skip',0,0,1);x.restore();x.save();x.translate(460,480);x.scale(2.2,2.2);drawChar('opti',0,0,-1);x.restore();g=old;}
let titleAnim=true;(function tl(){if(!titleAnim)return;T+=1/60;drawTitle();requestAnimationFrame(tl);})();
$('ver').textContent='v'+VERSION+' · fan-made, original characters';
boot();if(S.intro){$('tapgo').textContent='Tap to continue';}
$('title').onclick=()=>{audio();titleAnim=false;$('title').classList.add('hide');sfx('tap');
 if(!S.intro){startIntro();}else{setMode('play');['hud','quests','bbar'].forEach(i=>$(i).classList.remove('hide'));renderQuests();hud();
  const away=S.saved?(now()-S.saved)/1000:0;if(away>120)toast(`Welcome back! You were away ${fmtT(away)}.`);setTimeout(checkQuests,400);}};
requestAnimationFrame(frame);
window.__S=()=>S;window.__mode=()=>mode;window.__api={startPlace,confirmPlace,finishBuild,collectObj,startJob,jobDef,checkQuests,endIntro,openStore,setMode,tap,objById,nextDlg};

// ================= PWA =================
if('serviceWorker' in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').then(reg=>{
 const ask=w=>toast('Update ready! Tap here to reload.',()=>{w.postMessage('skipWaiting');});
 if(reg.waiting&&navigator.serviceWorker.controller)ask(reg.waiting);
 reg.addEventListener('updatefound',()=>{const w=reg.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)ask(w);});});
 setInterval(()=>reg.update().catch(()=>{}),30*60*1000);}).catch(()=>{});
 let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;save(1);location.reload();});}
