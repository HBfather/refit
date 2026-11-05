const ROOT=new URL('./',self.location.href).href;
const PREFIX='refit-shell-'+encodeURIComponent(ROOT)+'-';
const CACHE=PREFIX+'v5.6.0';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
// Wait until existing app windows close, so one workout never mixes application versions.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(ROOT))return;
 if(req.mode==='navigate'){event.respondWith(caches.open(CACHE).then(async c=>(await c.match(new URL('index.html',ROOT).href))||fetch(req)));return}
 if(FILES.includes(url.href))event.respondWith(caches.open(CACHE).then(async c=>(await c.match(req))||fetch(req)));
});
