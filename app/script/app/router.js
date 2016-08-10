'use strict';
define(['app', 'lazy-load'], function(app, lazyLoad) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {
            $urlRouterProvider.otherwise('/404');
            $stateProvider
                .state('dashboard', lazyLoad.config('', 'view/dashboard/dashboard.html', 'controller/dashboard/dashboard', { directives: [], services: ['service/dashboard'], filters: [] }))
                .state('404', lazyLoad.config('/404', 'view/shared/404.html', '', { directives: [], services: [], filters: [] }))
                .state('login', lazyLoad.config('/login', 'view/login/login.html', 'controller/login/login', { directives: [], services: [], filters: [] }))
                
                // borrower module start
                .state('borrower', lazyLoad.config('/borrower', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('borrower.info', lazyLoad.config('/info', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('borrower.info.list', lazyLoad.config('/list', '/view/borrower/borrower/list.html', 'controller/borrower/borrower/list', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower.info.add', lazyLoad.config('/add', '/view/borrower/borrower/edit.html', 'controller/borrower/borrower/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower.info.edit', lazyLoad.config('/edit/:id', '/view/borrower/borrower/edit.html', 'controller/borrower/borrower/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('borrower.repayment', lazyLoad.config('/repayment', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('borrower.repayment.list', lazyLoad.config('/list', '/view/borrower/repayment/list.html', 'controller/borrower/repayment/list', { directives: [], services: ['service/borrower'], filters: [] }))
                // borrower module end
                
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
                .state('fundAccount-fundRatePreserve', lazyLoad.config('/fundAccount/fundRatePreserve', '/view/fundAccount/fundRatePreserve.html', 'controller/fundAccount/fundRatePreserve', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundAccount-profitDraw', lazyLoad.config('/fundAccount/profitDraw', '/view/fundAccount/profitDraw.html', 'controller/fundAccount/profitDraw', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('fundAccount-profitDrawList', lazyLoad.config('/fundAccount/profitDrawList', '/view/fundAccount/profitDrawList.html', 'controller/fundAccount/profitDrawList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-withdrawCash', lazyLoad.config('/financialManagement/withdrawCash', '/view/financialManagement/withdrawCash.html', 'controller/financialManagement/withdrawCash', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-endBiddingCash', lazyLoad.config('/financialManagement/endBiddingCash', '/view/financialManagement/endBiddingCash.html', 'controller/financialManagement/endBiddingCash', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-cashDirectiveList', lazyLoad.config('/financialManagement/cashDirectiveList', '/view/financialManagement/cashDirectiveList.html', 'controller/financialManagement/cashDirectiveList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-transferCashPrint', lazyLoad.config('/financialManagement/transferCashPrint', '/view/financialManagement/transferCashPrint.html', 'controller/financialManagement/transferCashPrint', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-withdrawCashMonitor', lazyLoad.config('/financialManagement/withdrawCashMonitor', '/view/financialManagement/withdrawCashMonitor.html', 'controller/financialManagement/withdrawCashMonitor', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-promptList', lazyLoad.config('/financialManagement/promptList', '/view/financialManagement/promptList.html', 'controller/financialManagement/promptList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-promptCheck', lazyLoad.config('/financialManagement/promptCheck', '/view/financialManagement/promptCheck.html', 'controller/financialManagement/promptCheck', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-POSchargeRecon', lazyLoad.config('/financialManagement/POSchargeRecon', '/view/financialManagement/POSchargeRecon.html', 'controller/financialManagement/POSchargeRecon', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-withdrawCashRecon', lazyLoad.config('/financialManagement/withdrawCashRecon', '/view/financialManagement/withdrawCashRecon.html', 'controller/financialManagement/withdrawCashRecon', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-fileInterfaceLog', lazyLoad.config('/financialManagement/fileInterfaceLog', '/view/financialManagement/fileInterfaceLog.html', 'controller/financialManagement/fileInterfaceLog', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('financialManagement-ERPinterface', lazyLoad.config('/financialManagement/ERPinterface', '/view/financialManagement/ERPinterface.html', 'controller/financialManagement/ERPinterface', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketingManagement-messageList', lazyLoad.config('/marketingManagement/messageList', '/view/marketingManagement/messageList.html', 'controller/marketingManagement/messageList', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketingManagement-SMSchannel', lazyLoad.config('/marketingManagement/SMSchannel', '/view/marketingManagement/SMSchannel.html', 'controller/marketingManagement/SMSchannel', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketingManagement-mailLog', lazyLoad.config('/marketingManagement/mailLog', '/view/marketingManagement/mailLog.html', 'controller/marketingManagement/mailLog', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketingManagement-systemNoticeList', lazyLoad.config('/marketingManagement/systemNoticeList', '/view/marketingManagement/systemNoticeList.html', 'controller/marketingManagement/systemNoticeList', { directives: [], services: ['service/borrower'], filters: [] }))

                .state('statement-dashboard', lazyLoad.config('/statment/dashboard', '/view/statment/dashboard.html', 'controller/statment/dashboard', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('statement-earnedValue', lazyLoad.config('/statment/earnedValue', '/view/statment/earnedValue.html', 'controller/statment/earnedValue', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('statement-lendingStatement', lazyLoad.config('/statment/lendingStatement', '/view/statment/lendingStatement.html', 'controller/statment/lendingStatement', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('statement-projectStatement', lazyLoad.config('/statment/projectStatement', '/view/statment/projectStatement.html', 'controller/statment/projectStatement', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('statement-dueRepayment', lazyLoad.config('/statment/dueRepayment', '/view/statment/dueRepayment.html', 'controller/statment/dueRepayment', { directives: [], services: ['service/borrower'], filters: [] }))
                

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
