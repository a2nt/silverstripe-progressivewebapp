<?php

namespace Pixelspin\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;
use SilverStripe\SiteConfig\SiteConfig;

class ProgressiveWebAppController extends Controller {

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
        $manifestContent['start_url'] = '/';

        if($config->ManifestName){
            $manifestContent['name'] = $config->ManifestName;
        }
        if($config->ManifestShortName){
            $manifestContent['short_name'] = $config->ManifestShortName;
        }
        if($config->ManifestDescription){
            $manifestContent['description'] = $config->ManifestDescription;
        }
        if($config->ManifestColor){
            $manifestContent['background_color'] = $config->ManifestColor;
            $manifestContent['theme_color'] = $config->ManifestColor;
        }
        if($config->ManifestOrientation){
            $manifestContent['orientation'] = $config->ManifestOrientation;
        }
        if($config->ManifestDisplay){
            $manifestContent['display'] = $config->ManifestDisplay;
        }

        $logo = $config->ManifestLogo();
        if($logo && $logo->exists()){
            $mime = $logo->getMimeType();
            $manifestContent['icons'] = [
                [
                    'src' => $logo->Fill(48,48)->Link(),
                    'sizes' => '48x48',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(72,72)->Link(),
                    'sizes' => '72x72',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(96,96)->Link(),
                    'sizes' => '96x96',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(144,144)->Link(),
                    'sizes' => '144x144',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(168,168)->Link(),
                    'sizes' => '168x168',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(192,192)->Link(),
                    'sizes' => '192x192',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(256,256)->Link(),
                    'sizes' => '256x256',
                    'type' => $mime
                ],
                [
                    'src' => $logo->Fill(512,512)->Link(),
                    'sizes' => '512x512',
                    'type' => $mime
                ]
            ];
        }

        $this->getResponse()->addHeader('Content-Type', 'application/manifest+json; charset="utf-8"');
        return json_encode($manifestContent);

    }

}
