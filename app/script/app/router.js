'use strict';
define(['app', 'lazy-load'], function(app, lazyLoad) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {
            $urlRouterProvider.otherwise('/404');
            $stateProvider
                .state('dashboard', lazyLoad.config('', 'view/dashboard/dashboard.html', 'controller/dashboard/dashboard', { directives: [], services: ['service/dashboard'], filters: [] }))
                .state('404', lazyLoad.config('/404', 'view/shared/404.html', '', { directives: [], services: [], filters: [] }))
                .state('login', lazyLoad.config('/login', 'view/login/login.html', 'controller/login/login', { directives: [], services: [], filters: [] }))
                .state('borrower-list', lazyLoad.config('/borrower/list', '/view/borrower/list.html', 'controller/borrower/list', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower-repayments', lazyLoad.config('/borrower/repayments', '/view/borrower/repayments.html', 'controller/borrower/repayments', { directives: [], services: [], filters: [] }))
                .state('investor-investorList', lazyLoad.config('/investor/investorList', '/view/investor/investorList.html', 'controller/investor/investorList', { directives: [], services: [], filters: [] }))
                .state('investor-investorCheck', lazyLoad.config('/investor/investorCheck', '/view/investor/investorCheck.html', 'controller/investor/investorCheck', { directives: [], services: [], filters: [] }))
                .state('investor-newTender', lazyLoad.config('/investor/newTender', '/view/investor/newTender.html', 'controller/investor/newTender', { directives: [], services: [], filters: [] }))
                .state('investor-tenderList', lazyLoad.config('/investor/tenderList', '/view/investor/tenderList.html', 'controller/investor/tenderList', { directives: [], services: [], filters: [] }))
                .state('investor-investmentList', lazyLoad.config('/investor/investmentList', '/view/investor/investmentList.html', 'controller/investor/investmentList', { directives: [], services: [], filters: [] }))
                .state('projectManagement-projectList', lazyLoad.config('/projectManagement/projectList', '/view/projectManagement/projectList.html', 'controller/projectManagement/projectList', { directives: [], services: [], filters: [] }))
                .state('projectManagement-newProject', lazyLoad.config('/projectManagement/newProject', '/view/projectManagement/newProject.html', 'controller/projectManagement/newProject', { directives: [], services: [], filters: [] }))
                .state('projectManagement-releaseCheck', lazyLoad.config('/projectManagement/releaseCheck', '/view/projectManagement/releaseCheck.html', 'controller/projectManagement/releaseCheck', { directives: [], services: [], filters: [] }))
                .state('projectManagement-endTenderCheck', lazyLoad.config('/projectManagement/endTenderCheck', '/view/projectManagement/endTenderCheck.html', 'controller/projectManagement/endTenderCheck', { directives: [], services: [], filters: [] }))
                .state('projectManagement-repaymentList', lazyLoad.config('/projectManagement/repaymentList', '/view/projectManagement/repaymentList.html', 'controller/projectManagement/repaymentList', { directives: [], services: [], filters: [] }))
                .state('fundManagement-chargeList', lazyLoad.config('/fundManagement/chargeList', '/view/fundManagement/chargeList.html', 'controller/fundManagement/chargeList', { directives: [], services: [], filters: [] }))
                .state('fundManagement-withdrawCheck', lazyLoad.config('/fundManagement/withdrawCheck', '/view/fundManagement/withdrawCheck.html', 'controller/fundManagement/withdrawCheck', { directives: [], services: [], filters: [] }))
                .state('fundManagement-withdrawList', lazyLoad.config('/fundManagement/withdrawList', '/view/fundManagement/withdrawList.html', 'controller/fundManagement/withdrawList', { directives: [], services: [], filters: [] }))
                .state('fundManagement-ratePreserve', lazyLoad.config('/fundManagement/ratePreserve', '/view/fundManagement/ratePreserve.html', 'controller/fundManagement/ratePreserve', { directives: [], services: [], filters: [] }))
                .state('fundManagement-fallbackCheck', lazyLoad.config('/fundManagement/fallbackCheck', '/view/fundManagement/fallbackCheck.html', 'controller/fundManagement/ratePreserve', { directives: [], services: [], filters: [] }))
                .state('fundManagement-chargeQuery', lazyLoad.config('/fundManagement/chargeQuery', '/view/fundManagement/chargeQuery.html', 'controller/fundManagement/chargeQuery', { directives: [], services: [], filters: [] }))
                .state('fundManagement-withdrawQuery', lazyLoad.config('/fundManagement/withdrawQuery', '/view/fundManagement/withdrawQuery.html', 'controller/fundManagement/withdrawQuery', { directives: [], services: [], filters: [] }))
                .state('fundAccount-fundAccountList', lazyLoad.config('/fundAccount/fundAccountList', '/view/fundAccount/fundAccountList.html', 'controller/fundAccount/fundAccountList', { directives: [], services: [], filters: [] }))
                
            $locationProvider.html5Mode(true);
        }
    ]);
});
