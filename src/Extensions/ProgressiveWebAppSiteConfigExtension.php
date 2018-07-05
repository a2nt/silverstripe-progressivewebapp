<?php

namespace MichelSteege\ProgressiveWebApp\Extensions;

use SilverStripe\ORM\DataExtension;
use SilverWare\Colorpicker\ORM\FieldType\DBColor;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\FieldList;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\DropdownField;
use SilverWare\Colorpicker\Forms\ColorField;

class ProgressiveWebAppSiteConfigExtension extends DataExtension {

    private static $db = [
        'ManifestName' => 'Varchar',
        'ManifestShortName' => 'Varchar',
        'ManifestDescription' => 'Varchar(255)',
        'ManifestColor' => DBColor::class,
        'ManifestOrientation' => 'Varchar',
        'ManifestDisplay' => 'Varchar'
    ];
    
    private static $displays = [
        'fullscreen',
        'standalone',
        'minimal-ui',
        'browser'
    ];
    
    private static $orientations = [
        'any',
        'natural',
        'landscape',
        'landscape-primary',
        'landscape-secondary',
        'portrait',
        'portrait-primary',
        'portrait-secondary'
    ];
    
    private static $has_one = [
        'ManifestLogo' => Image::class
    ];
    
    public function onAfterWrite() {
        parent::onAfterWrite();
        $manifestLogo = $this->owner->ManifestLogo();
        if ($manifestLogo && $manifestLogo->exists()) {
            $manifestLogo->doPublish();
        }
    }
    
    public function updateCMSFields(FieldList $fields) {
        
        $fields->addFieldToTab('Root.ProgressiveWebApp', TextField::create('ManifestName', 'Name')->setDescription('Application name'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', TextField::create('ManifestShortName', 'Short name')->setDescription('Short human-readable name for the application try to keep it at a maximum of 12 characters'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', TextField::create('ManifestDescription', 'Description')->setDescription('Short description about the app'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', ColorField::create('ManifestColor', 'Color')->setDescription('Color used for the splash screen and/or icon'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', DropdownField::create('ManifestOrientation', 'Orientation', array_combine(self::$orientations, self::$orientations))->setDescription('App orientation'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', DropdownField::create('ManifestDisplay', 'Display', array_combine(self::$displays, self::$displays))->setDescription('Display mode of the app'));
        $fields->addFieldToTab('Root.ProgressiveWebApp', UploadField::create('ManifestLogo', 'Logo')->setDescription('This image must be square and at least 512x512px'));
        
    }
    

}
