'use strict';
requirejs.config({
    paths: {
        'angular': 'lib/angular/angular.min',
        'animate': 'lib/angular/angular-animate.min',
        'sanitize': 'lib/angular/angular-sanitize.min',
        'resource': 'lib/angular/angular-resource.min',
        'ui-router': 'lib/ui-router/angular-ui-router',
        'jquery': 'lib/jquery/jquery-1.11.1.min',
        'cookie': 'lib/jquery/jquery.cookies.min',
        'text': 'lib/require/text',
        'app': 'script/app/app',
        'router': 'script/app/router',
        'lazy-load': 'script/common/router-lazy-load',
        'controller': 'script/controller',
        'service': 'script/service',
        'directive': 'script/directive',
        'filter': 'script/filter',
        'common': 'script/common',
        'module': 'script/module',
        'bootstrap': 'lib/bootstrap/js/bootstrap.min',
        'bootstrap-dropdown': 'lib/bootstrap-dropdown/bootstrap-hover-dropdown.min',
        'bootstrap-table': 'lib/bootstrap-table/bootstrap-table.min',
        'bootstrap-table-fixed-column': 'lib/bootstrap-table/bootstrap-table-fixed-columns',
        'bootstrap-table-ng': 'lib/bootstrap-table/extensions/angular/bootstrap-table-angular.min',
        'bootstrap-table-zh-cn': 'lib/bootstrap-table/locale/bootstrap-table-zh-CN.min',
        'scrollbar': 'lib/scrollbar/jquery.mCustomScrollbar.concat.min',
        'icheck': 'lib/icheck/icheck.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'ui-router': {
            deps: ['angular']
        },
        'animate': {
            deps: ['angular']
        },
        'sanitize': {
            deps: ['angular']
        },
        'resource': {
            deps: ['angular']
        },
        'cookie': {
            deps: ['jquery']
        },
        'icheck': {
            deps: ['jquery']
        },
        'module/common': {
            deps: ['angular', 'cookie', 'scrollbar', 'bootstrap', 'bootstrap-dropdown']
        },
        'bootstrap-table': {
            deps: ['jquery']
        },
        'bootstrap-table-zh-cn': {
            deps: ['bootstrap-table']
        },
        'bootstrap-table-fixed-column': {
            deps: ['bootstrap-table']
        },
        'bootstrap-table-ng': {
            deps: ['angular', 'bootstrap-table-fixed-column', 'bootstrap-table-zh-cn']
        }
    },
    urlArgs: "v=" + (new Date()).getTime()
});
requirejs([
        'angular',
        'jquery',
        'app',
        'router'
    ],
    function(angular, $) {
        $(function() {
            angular.bootstrap(document, ['mgr']);
        });
    }
);
