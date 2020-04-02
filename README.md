# SilverStripe Progressive Web App

Tools to add progressive web app functionality to your silverstripe website
And make it available offline

## Installation
```
composer require a2nt/silverstripe-progressivewebapp
```

## Usage
- Install the module, run dev/build and fill in the settings in the siteconfig
- Add js to register the service worker (example can be found at client/src/app.js)
```
if ('serviceWorker' in navigator) {
    var baseHref = (document.getElementsByTagName('base')[0] || {}).href;
    if(baseHref){
        navigator.serviceWorker.register(baseHref + 'sw.js').then(function() {
            console.log('Service Worker Registered');
        });
    }
}
```
- Add the following tags to the head of your website
```
<meta name="theme-color" content="#000000" />
<link rel="manifest" href="{$BaseHref}manifest.json" />
<meta name="swversion" content="{$SWVersion}" />
```
