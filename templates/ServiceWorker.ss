<%--<script>//Ugly fix for code highlights--%>
    var version = 'v1::';
    var debug = <% if $DebugMode %>true<% else %>false<% end_if %>;
    
    /**
     * Console.log proxy for quick enabling/disabling
     */
    function log(msg){
        if(debug){
            console.log(msg);
        }
    }

    /**
     * Service worker installation
     */
    self.addEventListener('install', function (event) {
        log('Service worker: install start');
        event.waitUntil(caches.open(version + 'fundamentals').then(function (cache) {
            //Install all required pages/assets
            return cache.addAll([
                '$BaseUrl'<% if $CacheOnInstall %>,<% end_if %>
                <% if $CacheOnInstall %>
                    <% loop $CacheOnInstall %>
                        '$Path'<% if not $Last %>,<% end_if %>
                    <% end_loop %>
                <% end_if %>
            ]);
        }).then(function () {
            log('Service worker: install completed');
        }).catch(function(){
            log('Service worker: install failed');
        }));
    });

    /**
     * Service worker activation
     */
    self.addEventListener('activate', function (event) {
        log('Service worker: activate start');
        event.waitUntil(caches.keys().then(function (keys) {
            //Remove old cache entries
            return Promise.all(keys.filter(function (key) {
                return !key.startsWith(version);
            }).map(function (key) {
                return caches.delete(key);
            }));
        }).then(function () {
            log('Service worker: activate completed');
        }));
    });

    /**
     * Fetch handler
     */
    self.addEventListener('fetch', function (event) {
        //We are only interested in get requests
        if (event.request.method !== 'GET') {
            return;
        }
                                   
        //Parse the url
        var requestURL = new URL(event.request.url);
                                   
        //Skip admin url's
        if(requestURL.pathname.indexOf('admin') >= 0){
            log('Service worker: skip admin ' + event.request.url);
            return;
        }
        
        //Test for images
        if (/\.(jpg|jpeg|png|gif|webp)$/.test(requestURL.pathname)) {
            log('Service worker: skip image ' + event.request.url);
            //For now we skip images but change this later to maybe some caching and/or an offline fallback
            return;
        }
        
        //Check for our own urls
        if (requestURL.origin == location.origin) {
            //All our own urls are following this route:
            //-If there is cache serve from cache but also update the cache from the network
            //-If there is no cache then get from the network and put in the cache
            //-If both fail fallback to a generic offline message
            event.respondWith(caches.match(event.request).then(function (cached) {
                var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
                log('Service worker: fetch event ' + (cached ? '(cached)' : '(network)') + ' - ' + event.request.url);
                return cached || networked;
                
                /**
                * Fetched from network handler
                */
               function fetchedFromNetwork(response) {
                   var cacheCopy = response.clone();
                   log('Service worker fetch from network - ' + event.request.url);
                   caches.open(version + 'pages').then(function add(cache) {
                       cache.put(event.request, cacheCopy);
                   }).then(function () {
                       log('Service worker: fetch response stored in cache - ' + event.request.url);
                   });
                   return response;
               }

               /**
                * No internet and no cache handler
                */
               function unableToResolve(error) {
                   log('Service worker: fetch request failed in both cache and network ' + error);
                   return new Response('<h1>Service Unavailable</h1>', {
                       status: 503,
                       statusText: 'Service Unavailable',
                       headers: new Headers({
                           'Content-Type': 'text/html'
                       })
                   });
               }
                
            }));
            return;
        }
        
        //All others, nothing special here
        log('Service worker: other url - ' + event.request.url);
        event.respondWith(caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }));
    });
    //<%--Ugly fix for code highlights</script>--%>
