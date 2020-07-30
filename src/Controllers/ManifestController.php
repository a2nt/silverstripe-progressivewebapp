<?php

namespace A2nt\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\SiteConfig\SiteConfig;
use Site\Pages\HomePage;

class ManifestController extends Controller
{

    private static $gcm_sender_id;
    private static $background = '#000000';
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
    public function index($url)
    {
        $cfg = $this->config();
        $cfg_site = SiteConfig::current_site_config();

        $baseURL = Director::absoluteBaseURL();
        $icons_path = self::join_links($baseURL, RESOURCES_DIR, 'app', 'client', 'dist', 'icons');

        $title = $cfg_site->getField('Title');
        $desc = $cfg_site->getField('Description');
        $desc = $desc ?: $title;

        $manifestContent = [
            'lang' => 'en',
            'dir' => 'ltr',
            'url' => $baseURL,
            'name' => $title,
            'short_name' => $title,
            'description' => $desc,
            'start_url' => Director::baseURL(),
            'scope' => Director::baseURL(),
            'permissions' => [
                'gcm',
            ],
            'display' => 'fullscreen',
            'background_color' => $cfg->get('background'),
            'theme_color' => $cfg->get('background'),
            'orientation' => 'portrait-primary',
            'serviceworker' => [
                'src' => 'sw.js?v='.ServiceWorkerController::Version(),
                'scope' => '/',
                'use_cache' => true,
            ],
            'icons' => [
                [
                    'src' => self::join_links($icons_path, 'favicon-16x16.png'),
                    'sizes' => '16x16',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'favicon-32x32.png'),
                    'sizes' => '32x32',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'android-chrome-48x48.png'),
                    'sizes' => '48x48',
                    'type' => 'image/png',
                ],[
                    'src' => self::join_links($icons_path, 'android-chrome-72x72.png'),
                    'sizes' => '72x72',
                    'type' => 'image/png',
                ], [
                    'src' => self::join_links($icons_path, 'android-chrome-96x96.png'),
                    'sizes' => '96x96',
                    'type' => 'image/png',
                ], [
                    'src' => self::join_links($icons_path, 'android-chrome-144x144.png'),
                    'sizes' => '144x144',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'android-chrome-192x192.png'),
                    'sizes' => '192x192',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'android-chrome-256x256.png'),
                    'sizes' => '256x256',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'android-chrome-384x384.png'),
                    'sizes' => '384x384',
                    'type' => 'image/png',
                ],
                [
                    'src' => self::join_links($icons_path, 'android-chrome-512x512.png'),
                    'sizes' => '512x512',
                    'type' => 'image/png',
                ],
            ]
        ];


        $gcm_sender_id = $cfg->get('gcm_sender_id');
        if($gcm_sender_id) {
            $manifestContent['gcm_sender_id'] = $gcm_sender_id;
            $manifestContent['gcm_user_visible_only'] = true;
        }

        $this->getResponse()->addHeader('Content-Type', 'application/manifest+json; charset="utf-8"');

        return json_encode($manifestContent);
    }
}
