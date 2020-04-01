if ('serviceWorker' in navigator) {
  var baseHref = (document.getElementsByTagName('base')[0] || {}).href;
  if (baseHref) {
    navigator.serviceWorker.register(`${baseHref}sw.js`).then(() => {
      console.log('Service Worker Registered');
    });
  }
}
