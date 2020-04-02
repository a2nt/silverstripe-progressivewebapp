<?php

namespace A2nt\ProgressiveWebApp\Templates;

use A2nt\ProgressiveWebApp\Controllers\ServiceWorkerController;
use SilverStripe\View\TemplateGlobalProvider;

class ServiceWorkerTemplateProvider implements TemplateGlobalProvider
{
    public static function get_template_global_variables(): array
    {
        return [
            'SWVersion' => 'swVersion',
        ];
    }

    public static function swVersion()
    {
        if(class_exists(ServiceWorkerController::class)) {
            return ServiceWorkerController::Version();
        }
    }
}
