# SilverStripe Progressive Web App

Tools to add progressive web app functionality to your silverstripe website

## Installation
```
composer require pixelspin/silverstripe-progressivewebapp
```

## Usage
Install the module, run dev/build and fill in the settings in the siteconfig
Place the link to the manifest file (<link rel="manifest" href="{$BaseHref}manifest.json">) in the head of your pages and add the color meta data as well (<meta name="theme-color" content="$SiteConfig.ManifestColor">)