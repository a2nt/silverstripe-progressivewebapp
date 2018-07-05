# SilverStripe Progressive Web App

Tools to add progressive web app functionality to your silverstripe website

## Installation
```
composer require michelsteege/silverstripe-progressivewebapp
```

## Usage
- Install the module, run dev/build and fill in the settings in the siteconfig
- Include the required js to register the service worker
```
Requirements::javascript('michelsteege/silverstripe-progressivewebapp:resources/js/progressivewebapp.js');
```
- Add the following tags to the head of your website
```
<meta name="theme-color" content="$SiteConfig.ManifestColor">
<link rel="manifest" href="{$BaseHref}manifest.json">
```
