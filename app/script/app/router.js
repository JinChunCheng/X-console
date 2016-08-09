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
                .state('borrower-add', lazyLoad.config('/borrower/add', '/view/borrower/edit.html', 'controller/borrower/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower-edit', lazyLoad.config('/borrower/edit/:id', '/view/borrower/edit.html', 'controller/borrower/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower-repayments', lazyLoad.config('/borrower/repayments', '/view/borrower/repayments.html', 'controller/borrower/repayments', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('investor-investorList', lazyLoad.config('/investor/investorList', '/view/investor/investorList.html', 'controller/investor/investorList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('investor-investorCheck', lazyLoad.config('/investor/investorCheck', '/view/investor/investorCheck.html', 'controller/investor/investorCheck', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('investor-newTender', lazyLoad.config('/investor/newTender', '/view/investor/newTender.html', 'controller/investor/newTender', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('investor-tenderList', lazyLoad.config('/investor/tenderList', '/view/investor/tenderList.html', 'controller/investor/tenderList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('investor-investmentList', lazyLoad.config('/investor/investmentList', '/view/investor/investmentList.html', 'controller/investor/investmentList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('projectManagement-projectList', lazyLoad.config('/projectManagement/projectList', '/view/projectManagement/projectList.html', 'controller/projectManagement/projectList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('projectManagement-newProject', lazyLoad.config('/projectManagement/newProject', '/view/projectManagement/newProject.html', 'controller/projectManagement/newProject', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('projectManagement-releaseCheck', lazyLoad.config('/projectManagement/releaseCheck', '/view/projectManagement/releaseCheck.html', 'controller/projectManagement/releaseCheck', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('projectManagement-endTenderCheck', lazyLoad.config('/projectManagement/endTenderCheck', '/view/projectManagement/endTenderCheck.html', 'controller/projectManagement/endTenderCheck', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('projectManagement-repaymentList', lazyLoad.config('/projectManagement/repaymentList', '/view/projectManagement/repaymentList.html', 'controller/projectManagement/repaymentList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-chargeList', lazyLoad.config('/fundManagement/chargeList', '/view/fundManagement/chargeList.html', 'controller/fundManagement/chargeList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-withdrawCheck', lazyLoad.config('/fundManagement/withdrawCheck', '/view/fundManagement/withdrawCheck.html', 'controller/fundManagement/withdrawCheck', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-withdrawList', lazyLoad.config('/fundManagement/withdrawList', '/view/fundManagement/withdrawList.html', 'controller/fundManagement/withdrawList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-ratePreserve', lazyLoad.config('/fundManagement/ratePreserve', '/view/fundManagement/ratePreserve.html', 'controller/fundManagement/ratePreserve', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-fallbackCheck', lazyLoad.config('/fundManagement/fallbackCheck', '/view/fundManagement/fallbackCheck.html', 'controller/fundManagement/ratePreserve', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-chargeQuery', lazyLoad.config('/fundManagement/chargeQuery', '/view/fundManagement/chargeQuery.html', 'controller/fundManagement/chargeQuery', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundManagement-withdrawQuery', lazyLoad.config('/fundManagement/withdrawQuery', '/view/fundManagement/withdrawQuery.html', 'controller/fundManagement/withdrawQuery', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundAccount-fundAccountList', lazyLoad.config('/fundAccount/fundAccountList', '/view/fundAccount/fundAccountList.html', 'controller/fundAccount/fundAccountList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundAccount-fundAccountQuery', lazyLoad.config('/fundAccount/fundAccountQuery', '/view/fundAccount/fundAccountQuery.html', 'controller/fundAccount/fundAccountQuery', { directives: [], services: ['service/borrower'], filters: [] }))
                

                .state('statement-dashboard', lazyLoad.config('/statment/dashboard', '/view/statment/dashboard.html', 'controller/statment/dashboard', { directives: [], services: ['service/borrower'], filters: [] }))
                

                .state('systemManagement-usersList', lazyLoad.config('/systemManagement/usersList', '/view/systemManagement/usersList.html', 'controller/systemManagement/usersList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('systemManagement-roleList', lazyLoad.config('/systemManagement/roleList', '/view/systemManagement/roleList.html', 'controller/systemManagement/roleList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('systemManagement-departmentMaintains', lazyLoad.config('/systemManagement/departmentMaintains', '/view/systemManagement/departmentMaintains.html', 'controller/systemManagement/departmentMaintains', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('systemManagement-regularJobLog', lazyLoad.config('/systemManagement/regularJobLog', '/view/systemManagement/regularJobLog.html', 'controller/systemManagement/regularJobLog', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('systemManagement-onlineMonitoring', lazyLoad.config('/systemManagement/onlineMonitoring', '/view/systemManagement/onlineMonitoring.html', 'controller/systemManagement/onlineMonitoring', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('systemManagement-staticParameters', lazyLoad.config('/systemManagement/staticParameters', '/view/systemManagement/staticParameters.html', 'controller/systemManagement/staticParameters', { directives: [], services: ['service/borrower'], filters: [] }))


            $locationProvider.html5Mode(true);
        }
    ]);
});
