<?php


namespace A2nt\ProgressiveWebApp\Extensions;


use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataExtension;

class SiteTree extends DataExtension
{
    private static $db = [
        'AvailableOffline' => 'Boolean(1)',
    ];

    public function updateSettingsFields(FieldList $fields)
    {
        parent::updateCMSFields($fields);

        $fields->addFieldsToTab('Root.Settings', [
           CheckboxField::create('AvailableOffline', 'Make page available offline'),
        ]);
    }
}
