// Register service worker
if ('serviceWorker' in navigator) {
  const baseHref = (document.getElementsByTagName('base')[0] || {}).href;
  const version = (document.querySelector('meta[name="swversion"]') || {})
    .content;
  if (baseHref) {
    navigator.serviceWorker
      .register(`${baseHref}sw.js?v=${version}`)
      .then(() => {
        console.log('SW: Registered');
      });
  }
}
