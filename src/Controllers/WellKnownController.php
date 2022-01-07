<?php

namespace A2nt\ProgressiveWebApp\Controllers;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Security\Security;

class WellKnownController extends Controller
{
    private static $allowed_actions = [
        'index',
    ];

    public function index()
    {
        $req = $this->getRequest();
        $action = $req->param('Action');
        switch($action) {
            case 'change-password':
                return $this->changepassword();
            default:
                return $this->httpError(404, 'Not found');
        }
    }

    public function changepassword()
    {
        return $this->redirect(
            Director::absoluteURL(
                Security::singleton()->Link('changepassword')
            ), 303
        );
    }
}
