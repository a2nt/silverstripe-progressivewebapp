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
        'index',
    ];

    /**
     * @config
     */
    private static $debug_mode = false;
    private static $version = '1';
    private static $custom_sw_path;

    /**
     * Default controller action for the service-worker.js file
     *
     * @return mixed
     */
    public function index($req) {
        $resp = $this->getResponse();
        $script = file_get_contents(self::getScriptPath());

        if($req->param('Action') === 'cachequeue') {
            return json_encode([
                'urls' => [
                    self::join_links(self::BaseUrl(),'app','client','dist','app.js')
                ]
            ]);
        }

        $resp->addHeader('Content-Type', 'application/javascript; charset="utf-8"');
        return $this->customise([
            'Script' => $script,
        ])->renderWith('ServiceWorker');
    }

    private static function getScriptPath()
    {
        $custom_path = self::config()->get('custom_sw_path');
        return $custom_path ? $custom_path : join(DIRECTORY_SEPARATOR, [
            __DIR__,
            '..',
            '..',
            'client',
            'dist',
            'sw.js',
        ]);
    }

    /**
     * Base URL
     * @return varchar
     */
    public static function BaseUrl() {
        return Director::absoluteBaseURL();
    }

    /**
     * Debug mode
     * @return bool
     */
    public static function DebugMode() {
        if(Director::isDev()){
            return true;
        }
        return self::config()->get('debug_mode');
    }

    public static function Version() {
        return self::config()->get('version').filemtime(self::getScriptPath());
    }

    /**
     * A list with file to cache in the install event
     * @return ArrayList
     */
    public static function CacheOnInstall() {
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
