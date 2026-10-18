// Red Planet Rebuild service worker. Bump VERSION on every release.
const VERSION='rpr-v1';
const CORE=['./','index.html','game.js','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting();});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){// network-first so updates arrive; cache fallback offline
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined))));return;}
 if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){// fonts: cache-first
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;})));}});
