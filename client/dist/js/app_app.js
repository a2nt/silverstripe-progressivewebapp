!function(){if("serviceWorker"in navigator){var e=(document.getElementsByTagName("base")[0]||{}).href,n=(document.querySelector('meta[name="swversion"]')||{}).content;e&&navigator.serviceWorker.register("".concat(e,"sw.js?v=").concat(n)).then((function(){console.log("SW: Registered")}))}}();