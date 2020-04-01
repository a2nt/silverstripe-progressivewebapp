/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/mnt/data/srv/dist/web/nysca/vendor/a2nt/silverstripe-progressivewebapp/client/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/sw.js":
/***/ (function(module, exports, __webpack_require__) {

// caches polyfill because it is not added to native yet!
var caches = __webpack_require__("./client/src/thirdparty/serviceworker-caches.js");

if (typeof self.CACHE_NAME !== 'string') {
  throw new Error('Cache Name cannot be empty');
}

self.addEventListener('fetch', function (event) {
  // Clone the request for fetch and cache
  // A request is a stream and can be consumed only once.
  var fetchRequest = event.request.clone(),
      cacheRequest = event.request.clone(); // Respond with content from fetch or cache

  event.respondWith( // Try fetch
  fetch(fetchRequest) // when fetch is successful, we update the cache
  .then(function (response) {
    // A response is a stream and can be consumed only once.
    // Because we want the browser to consume the response,
    // as well as cache to consume the response, we need to
    // clone it so we have 2 streams
    var responseToCache = response.clone(); // and update the cache

    caches.open(self.CACHE_NAME).then(function (cache) {
      // Clone the request again to use it
      // as the key for our cache
      var cacheSaveRequest = event.request.clone();
      cache.put(cacheSaveRequest, responseToCache);
    }); // Return the response stream to be consumed by browser

    return response;
  }) // when fetch times out or fails
  .catch(function (err) {
    // Return the promise which
    // resolves on a match in cache for the current request
    // or rejects if no matches are found
    return caches.match(cacheRequest);
  }));
}); // Now we need to clean up resources in the previous versions
// of Service Worker scripts

self.addEventListener('activate', function (event) {
  // Destroy the cache
  event.waitUntil(caches.delete(self.CACHE_NAME));
});

/***/ }),

/***/ "./client/src/thirdparty/serviceworker-caches.js":
/***/ (function(module, exports) {

if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this; // Since DOMExceptions are not constructable:

    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }

    NetworkError.prototype = Object.create(Error.prototype);
    return Promise.resolve().then(function () {
      if (arguments.length < 1) throw new TypeError(); // Simulate sequence<(Request or USVString)> binding:

      var sequence = [];
      requests = requests.map(function (request) {
        if (request instanceof Request) {
          return request;
        } else {
          return String(request); // may throw TypeError
        }
      });
      return Promise.all(requests.map(function (request) {
        if (typeof request === 'string') {
          request = new Request(request);
        }

        var scheme = new URL(request.url).protocol;

        if (scheme !== 'http:' && scheme !== 'https:') {
          throw new NetworkError('Invalid scheme');
        }

        return fetch(request.clone());
      }));
    }).then(function (responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(responses.map(function (response, i) {
        return cache.put(requests[i], response);
      }));
    }).then(function () {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;
    return this.keys().then(function (cacheNames) {
      var match;
      return cacheNames.reduce(function (chain, cacheName) {
        return chain.then(function () {
          return match || caches.open(cacheName).then(function (cache) {
            return cache.match(request, opts);
          }).then(function (response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}

module.exports = self.caches;

/***/ })

/******/ });
//# sourceMappingURL=sw.js.map