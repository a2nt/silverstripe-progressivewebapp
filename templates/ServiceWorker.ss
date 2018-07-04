self.addEventListener('install', function(e) {
    console.log('Install');
    /*
 e.waitUntil(
   caches.open('airhorner').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.html?homescreen=1',
       '/?homescreen=1',
       '/styles/main.css',
       '/scripts/main.min.js',
       '/sounds/airhorn.mp3'
     ]);
   })
 );
 */
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);
});

self.addEventListener('beforeinstallprompt', function(event) {
 console.log('beforeinstallprompt');
});