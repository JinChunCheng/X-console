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
        'bootstrap-table': 'lib/bootstrap-table/bootstrap-table',
        'bootstrap-table-fixed-column': 'lib/bootstrap-table/bootstrap-table-fixed-columns',
        'bootstrap-table-ng': 'lib/bootstrap-table/extensions/angular/bootstrap-table-angular',
        'bootstrap-table-zh-cn': 'lib/bootstrap-table/locale/bootstrap-table-zh-CN.min',
        'scrollbar': 'lib/scrollbar/jquery.mCustomScrollbar.concat.min',
        'icheck': 'lib/icheck/icheck.min',
        'ui-bootstrap': 'lib/ui-bootstrap/ui-bootstrap-tpls',
        'zh-cn': 'lib/angular/i18n/angular-locale_zh-cn',
        'select2': 'lib/select2-ng/select.min',
        'chart': 'lib/angular-chart/Chart.min',
        'angular-chart': 'lib/angular-chart/angular-chart.min',
        'websocket': 'lib/websocket/angular-websocket.min',
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
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-table': {
            deps: ['jquery']
        },
        'scrollbar': {
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
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        'zh-cn': {
            deps: ['angular']
        },
        'select2': {
            deps: ['angular']
        },
        'angular-chart': {
            deps: ['angular', 'chart']
        },
        'websocket': {
          deps: ['angular']
        }
    },
    urlArgs: "v=" + (new Date()).getTime()
});
requirejs([
        'angular',
        'jquery',
        'app',
        'router',
        'zh-cn'
    ],
    function(angular, $) {
        $(function() {
            angular.bootstrap(document, ['mgr']);
        });
    }
);
