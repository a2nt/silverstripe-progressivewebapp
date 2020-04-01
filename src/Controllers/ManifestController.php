<?php

namespace A2nt\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;
use SilverStripe\SiteConfig\SiteConfig;

class ManifestController extends Controller {

    /**
     * @var array
     */
    private static $allowed_actions = [
        'index'
    ];

    /**
     * Default controller action for the manifest.json file
     *
     * @return mixed
     */
    public function index($url) {

        $config = SiteConfig::current_site_config();

        $manifestContent = [];
        $this->getResponse()->addHeader('Content-Type', 'application/manifest+json; charset="utf-8"');
        return json_encode($manifestContent);
    }

}
