// caches polyfill because it is not added to native yet!
var log = require('./lib/log');
var caches = require('./thirdparty/serviceworker-caches');

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
  // Clone the request for fetch and cache
  // A request is a stream and can be consumed only once.
  var fetchRequest = event.request.clone(),
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
        var responseToCache = response.clone();

        // and update the cache
        caches.open(self.CACHE_NAME).then((cache) => {
          // Clone the request again to use it
          // as the key for our cache
          var cacheSaveRequest = event.request.clone();
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

self.addEventListener('install', (e) => {
  log(`SW: installing version: ${version}`);
});
