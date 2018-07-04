<?php

namespace Pixelspin\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;

class ServiceWorkerController extends Controller {

    /**
     * @var array
     */
    private static $allowed_actions = [
        'index'
    ];

    /**
     * Default controller action for the service-worker.js file
     *
     * @return mixed
     */
    public function index($url) {
        $this->getResponse()->addHeader('Content-Type', 'application/javascript; charset="utf-8"');
        return $this->renderWith('ServiceWorker');
    }

}
