// caches polyfill because it is not added to native yet!
var log = require('../lib/log');
var caches = require('../../thirdparty/serviceworker-caches');

if (debug) {
  log('SW: debug is on');
  log(`SW: CACHE_NAME: ${CACHE_NAME}`);
  log(`SW: appDomain: ${appDomain}`);
  log(`SW: lang: ${lang}`);
}

if (typeof self.CACHE_NAME !== 'string') {
  throw new Error('Cache Name cannot be empty');
}

self.addEventListener('fetch', (event) => {
  // skip non-get
  if (event.request.method !== 'GET') {
    return;
  }

  //Parse the url
  const requestURL = new URL(event.request.url);

  //Check for our own urls
  /*if (requestURL.origin !== location.origin) {
    log('SW: skip external ' + event.request.url);
    return;
  }*/

  //Skip admin url's
  if (
    requestURL.pathname.indexOf('admin') >= 0 ||
    requestURL.pathname.indexOf('Security') >= 0 ||
    requestURL.pathname.indexOf('dev') >= 0
  ) {
    log(`SW: skip admin ${event.request.url}`);
    return;
  }

  //Test for images
  /*if (/\.(jpg|jpeg|png|gif|webp)$/.test(requestURL.pathname)) {
    log('SW: skip image ' + event.request.url);
    //For now we skip images but change this later to maybe some caching and/or an offline fallback
    return;
  }*/

  // Clone the request for fetch and cache
  // A request is a stream and can be consumed only once.
  const fetchRequest = event.request.clone(),
    cacheRequest = event.request.clone();

  // Respond with content from fetch or cache
  event.respondWith(
    // Try fetch
    fetch(fetchRequest)
      // when fetch is successful, we update the cache
      .then((response) => {
        // A response is a stream and can be consumed only once.
        // Because we want the browser to consume the response,
        // as well as cache to consume the response, we need to
        // clone it so we have 2 streams
        const responseToCache = response.clone();

        // and update the cache
        caches.open(self.CACHE_NAME).then((cache) => {
          // Clone the request again to use it
          // as the key for our cache
          const cacheSaveRequest = event.request.clone();
          cache.put(cacheSaveRequest, responseToCache);
        });

        // Return the response stream to be consumed by browser
        return response;
      })

      // when fetch times out or fails
      .catch((err) => {
        log('SW: fetch failed');
        // Return the promise which
        // resolves on a match in cache for the current request
        // or rejects if no matches are found
        return caches.match(cacheRequest);
      }),
  );
});

// Now we need to clean up resources in the previous versions
// of Service Worker scripts
self.addEventListener('activate', (event) => {
  log(`SW: activated: ${version}`);
  // Destroy the cache
  event.waitUntil(caches.delete(self.CACHE_NAME));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((response) => {
            return response;
          })
          .catch(() => {
            // Offline fallback image
            if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
              return new Response(
                '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><path fill="rgba(145,145,145,0.5)" d="M0 0h400v225H0z" /><text fill="rgba(0,0,0,0.33)" font-family="Helvetica Neue,Arial,sans-serif" font-size="27" text-anchor="middle" x="200" y="113" dominant-baseline="central">offline</text></svg>',
                {
                  headers: {
                    'Content-Type': 'image/svg+xml',
                  },
                }
              );
            }
          });
      })
  );
});


self.addEventListener('install', (e) => {
  log(`SW: installing version: ${version}`);
});
