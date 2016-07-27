'use strict';
requirejs.config({
    paths: {
        'angular': 'library/angular/angular.min',
        'animate': 'library/angular/angular-animate.min',
        'sanitize': 'library/angular/angular-sanitize.min',
        'ui-router': 'library/angular/angular-ui-router.min',
        'resource': 'library/angular/angular-resource.min',
        'jquery': 'library/jquery/jquery-1.11.3.min',
        'cookie': 'library/jquery/jquery.cookie',
        'text': 'library/require/text-2.0.12',
        'app': 'script/app/app',
        'router': 'script/app/router',
        'lazy-load': 'script/common/router-lazy-load',
        'controller': 'script/controller',
        'directive': 'script/directive',
        'filter': 'script/filter',
        'common': 'script/common',
        'service': 'script/service',
        'components': 'library/components',
        'ztree': 'library/components/zTree_v3/js',
        'module': 'script/module',
        'zh-cn': 'library/angular/i18n/angular-locale_zh-cn'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'animate': {
            deps: ['angular']
        },
        'sanitize': {
            deps: ['angular']
        },
        'ui-router': {
            deps: ['angular']
        },
        'resource': {
            deps: ['angular']
        },
        'components/ocLazyload': {
            deps: ['angular']
        },
        'module/common': {
            deps: ['angular']
        },
        'components/ui-bootstrap-tpls': {
            deps: ['angular']
        },
        'components/angular-ueditor.min': {
            deps: ['angular', 'components/ueditor/ueditor.config', 'components/ueditor/ueditor.all.min']
        },
        'components/waitingDialog': {
            deps: ['components/bootstrap.min']
        },
        'components/bootstrap.min': {
            deps: ['jquery']
        },
        'components/select.min': {
            deps: ['angular']
        },
        'directive/ztree': {
            deps: ['angular']
        },
        'zh-cn': {
            deps: ['angular']
        }
    },
    urlArgs: "v=@@hash"
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
