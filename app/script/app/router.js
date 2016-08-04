'use strict';
define(['app', 'lazy-load'], function(app, lazyLoad) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {
            $urlRouterProvider.otherwise('/404');
            $stateProvider
                .state('dashboard', lazyLoad.config('', 'view/dashboard/dashboard.html', 'controller/dashboard/dashboard', { directives: [], services: ['service/dashboard'], filters: [] }))
                .state('404', lazyLoad.config('/404', 'view/shared/404.html', '', { directives: [], services: [], filters: [] }))
                .state('login', lazyLoad.config('/login', 'view/login/login.html', 'controller/login/login', { directives: [], services: [], filters: [] }))
                //.state('borrower', lazyLoad.config('/borrower', '', 'controller/borrower/borrower', { directives: [], services: [], filters: [] }, true))
                .state('borrower-list', lazyLoad.config('/borrower/list', '/view/borrower/list.html', 'controller/borrower/list', { directives: [], services: [], filters: [] }))
                .state('borrower-repayments', lazyLoad.config('/borrower/repayments', '/view/borrower/repayments.html', 'controller/borrower/repayments', { directives: [], services: [], filters: [] }))
                .state('investor-investorList', lazyLoad.config('/investor/investorList', '/view/investor/investorList.html', 'controller/investor/investorList', { directives: [], services: [], filters: [] }))
                .state('investor-investorCheck', lazyLoad.config('/investor/investorCheck', '/view/investor/investorCheck.html', 'controller/investor/investorCheck', { directives: [], services: [], filters: [] }))

            $locationProvider.html5Mode(true);
        }
    ]);
});
