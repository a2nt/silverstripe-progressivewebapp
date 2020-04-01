<?php

namespace A2nt\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\ORM\ArrayList;
use SilverStripe\View\ArrayData;
use SilverStripe\Core\ClassInfo;
use MichelSteege\ProgressiveWebApp\Interfaces\ServiceWorkerCacheProvider;

class ServiceWorkerController extends Controller {

    /**
     * @var array
     */
    private static $allowed_actions = [
        'index'
    ];

    /**
     * @config
     */
    private static $debug_mode = false;

    /**
     * Default controller action for the service-worker.js file
     *
     * @return mixed
     */
    public function index($url) {
        $this->getResponse()->addHeader('Content-Type', 'application/javascript; charset="utf-8"');
        return $this->renderWith('ServiceWorker');
    }

    /**
     * Base URL
     * @return varchar
     */
    public function BaseUrl() {
        return Director::baseURL();
    }

    /**
     * Debug mode
     * @return bool
     */
    public function DebugMode() {
        if(Director::isDev()){
            return true;
        }
        return $this->config()->get('debug_mode');
    }

    /**
     * A list with file to cache in the install event
     * @return ArrayList
     */
    public function CacheOnInstall() {
        $paths = [];
        foreach(ClassInfo::implementorsOf(ServiceWorkerCacheProvider::class) as $class){
            foreach($class::getServiceWorkerCachedPaths() as $path){
                $paths[] = $path;
            }
        }
        $list = new ArrayList();
        foreach($paths as $path){
            $list->push(new ArrayData([
                'Path' => $path
            ]));
        }
        return $list;
    }

}
