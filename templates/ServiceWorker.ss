'use strict';
var version = '{$Version}',
    appDomain = '{$BaseUrl}',
    lang = 'en',
    debug = <% if $DebugMode %>true<% else %>false<% end_if %>,
    isPushEnabled = true,
    offline = false,
    CACHE_NAME = 'sw' + version;
$Script.RAW;

