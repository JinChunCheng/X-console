'use strict';
define(['app', 'lazy-load'], function(app, lazyLoad) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {
            $urlRouterProvider.otherwise('/404');
            $stateProvider
                .state('dashboard', lazyLoad.config('', 'view/dashboard/dashboard.html', 'controller/dashboard/dashboard', { services: ['service/dashboard'] }))
                .state('404', lazyLoad.config('/404', 'view/shared/404.html', '', null))
                .state('login', lazyLoad.config('/login', 'view/login/login.html', 'controller/login/login', null))

            //asset module start
            .state('asset', lazyLoad.config('/asset', 'view/shared/blank.html', '', null, true))
                .state('asset.channel', lazyLoad.config('/channel', 'view/shared/blank.html', '', null, true))
                .state('asset.channel.list', lazyLoad.config('/list', 'view/asset/channel/list.html', 'controller/asset/channel/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))

            .state('asset.type', lazyLoad.config('/type', 'view/shared/blank.html', '', null, true))
                .state('asset.type.list', lazyLoad.config('/list', 'view/asset/type/list.html', 'controller/asset/type/list', { directives: [], services: ['service/borrower', 'service/meta'], filters: [] }))

            .state('asset.info', lazyLoad.config('/info', 'view/shared/blank.html', '', null, true))
                .state('asset.info.draft', lazyLoad.config('/draft', 'view/asset/info/list.html', 'controller/asset/info/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.info.todo', lazyLoad.config('/todo', 'view/asset/info/list.html', 'controller/asset/info/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.info.better', lazyLoad.config('/better', 'view/asset/info/list.html', 'controller/asset/info/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.info.risk', lazyLoad.config('/risk', 'view/asset/info/list.html', 'controller/asset/info/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.info.add', lazyLoad.config('/add', 'view/asset/info/edit.html', 'controller/asset/info/edit', { directives: ['directive/fileToBase64'], services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.info.edit', lazyLoad.config('/edit/:id', 'view/asset/info/edit.html', 'controller/asset/info/edit', { directives: ['directive/fileToBase64'], services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))

            .state('asset.platform', lazyLoad.config('/platform', 'view/shared/blank.html', '', null, true))
                .state('asset.platform.list', lazyLoad.config('/list', 'view/asset/platform/list.html', 'controller/asset/platform/list', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))

            .state('asset.release', lazyLoad.config('/release', 'view/shared/blank.html', '', null, true))
                .state('asset.release.todo', lazyLoad.config('/todo', 'view/asset/release/todo.html', 'controller/asset/release/todo', { services: ['service/asset'], filters: ['filter/common'] }))
                .state('asset.release.done', lazyLoad.config('/done', 'view/asset/release/done.html', 'controller/asset/release/done', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                .state('asset.release.edit', lazyLoad.config('/edit/:id', 'view/asset/release/edit.html', 'controller/asset/release/edit', { services: ['service/asset', 'service/meta'], filters: ['filter/common'] }))
                //asset module end 

            // borrower module start

            .state('borrower', lazyLoad.config('/borrower', '/view/shared/blank.html', '', null, true))
                //借款人列表
                .state('borrower.info', lazyLoad.config('/info', '/view/shared/blank.html', '', null, true))
                .state('borrower.info.list', lazyLoad.config('/list', '/view/borrower/borrower/list.html', 'controller/borrower/borrower/list', { directives: [], services: ['service/borrower', 'service/meta'], filters: ['filter/common'] }))
                .state('borrower.info.add', lazyLoad.config('/add', '/view/borrower/borrower/edit.html', 'controller/borrower/borrower/edit', { directives: [], services: ['service/borrower','service/public', 'service/meta'], filters: ['filter/common'] }))
                .state('borrower.info.edit', lazyLoad.config('/edit/:id', '/view/borrower/borrower/edit.html', 'controller/borrower/borrower/edit', { directives: [], services: ['service/borrower', 'service/public','service/meta'], filters: ['filter/common'] }))
                .state('borrower.info.detail', lazyLoad.config('/detail/:id', '/view/borrower/borrower/detail.html', 'controller/borrower/borrower/detail', { directives: [], services: ['service/borrower', 'service/meta'], filters: ['filter/common'] }))

            //借款人还款列表
            .state('borrower.repayment', lazyLoad.config('/repayment', '/view/shared/blank.html', '', null, true))
                .state('borrower.repayment.list', lazyLoad.config('/list', '/view/borrower/repayment/list.html', 'controller/borrower/repayment/list', { directives: [], services: ['service/borrower', 'service/meta'], filters: ['filter/common'] }))
                .state('borrower.repayment.detail', lazyLoad.config('/detail/:id', '/view/borrower/repayment/detail.html', 'controller/borrower/repayment/detail', { directives: [], services: ['service/borrower', 'service/meta'], filters: ['filter/common'] }))

            // borrower module end

            // investor module start

            .state('investor', lazyLoad.config('/investor', '/view/shared/blank.html', '', null, true))
                //投资人列表
                .state('investor.investor', lazyLoad.config('/investor', '/view/shared/blank.html', '', null, true))
                .state('investor.investor.list', lazyLoad.config('/list', '/view/investor/investor/list.html', 'controller/investor/investor/list', { services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.investor.add', lazyLoad.config('/add', '/view/investor/investor/edit.html', 'controller/investor/investor/edit', { services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.investor.edit', lazyLoad.config('/edit/:id', '/view/investor/investor/edit.html', 'controller/investor/investor/edit', { services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.investor.detail', lazyLoad.config('/detail/:id', '/view/investor/investor/detail.html', 'controller/investor/investor/detail', { services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.investor.maintain', lazyLoad.config('/maintain/:id', '/view/investor/investor/maintain.html', 'controller/investor/investor/maintain', { services: ['service/investor','service/public', 'service/meta'], filters: ['filter/common'] }))

                //投资人修改审核列表
                .state('investor.check', lazyLoad.config('/investor', '/view/shared/blank.html', '', null, true))
                .state('investor.check.list', lazyLoad.config('/check', '/view/investor/check/list.html', 'controller/investor/check/list', { directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                //新增投标
                .state('investor.new', lazyLoad.config('/investor', '/view/shared/blank.html', '', { directives: [], services: ['service/investor'], filters: [] }, true))
                .state('investor.new.list', lazyLoad.config('/new', '/view/investor/new/list.html', 'controller/investor/new/list', { directives: [], services: ['service/investor'], filters: [] }))
                //投标列表
                .state('investor.tender', lazyLoad.config('/tender', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('investor.tender.list', lazyLoad.config('/list', '/view/investor/tender/list.html', 'controller/investor/tender/list', { directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.tender.detail',lazyLoad.config('/detail/:id','/view/investor/tender/detail.html','controller/investor/tender/detail',{ directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.tender.cancel',lazyLoad.config('/cancel/:id','/view/investor/tender/cancel.html','controller/investor/tender/cancel',{ directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))

                //投资列表
                .state('investor.info', lazyLoad.config('/info', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('investor.info.list', lazyLoad.config('/list', '/view/investor/info/list.html', 'controller/investor/info/list', { directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))
                .state('investor.info.detail',lazyLoad.config('/detail/:id','/view/investor/info/detail.html','controller/investor/info/detail',{ directives: [], services: ['service/investor', 'service/meta'], filters: ['filter/common'] }))

            // investor module end

            //project module start

            .state('project', lazyLoad.config('/project', '/view/shared/blank.html', '', null, true))
                //项目列表
                .state('project.info', lazyLoad.config('/info', '/view/shared/blank.html', '', null, true))
                .state('project.info.list', lazyLoad.config('/list', '/view/project/info/list.html', 'controller/project/info/list', { services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                .state('project.info.add', lazyLoad.config('/add', '/view/project/info/edit.html', 'controller/project/info/edit', { services: ['service/project', 'service/asset', 'service/borrower', 'service/meta'] }))
                .state('project.info.detail', lazyLoad.config('/detail/:id', '/view/project/info/detail.html', 'controller/project/info/detail', { services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                //发布审核
                .state('project.release', lazyLoad.config('/release', '/view/shared/blank.html', '', null, true))
                .state('project.release.list', lazyLoad.config('/list', '/view/project/release/list.html', 'controller/project/release/list', { services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                .state('project.release.verify', lazyLoad.config('/verify/:id', '/view/project/release/verify.html', 'controller/project/release/verify', { services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                //结标审核
                .state('project.check', lazyLoad.config('/check', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('project.check.list', lazyLoad.config('/list', '/view/project/check/list.html', 'controller/project/check/list', { directives: [], services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                .state('project.check.detail', lazyLoad.config('/detail/:id', '/view/project/check/detail.html', 'controller/project/check/detail', { directives: [], services: ['service/project', 'service/meta'], filters: ['filter/common'] }))
                //项目还款计划
                .state('project.repayment', lazyLoad.config('/repayment', '/view/shared/blank.html', '', null, true))
                .state('project.repayment.list', lazyLoad.config('/list', '/view/project/repayment/list.html', 'controller/project/repayment/list', { services: ['service/project'] }))

            //project module end

            //fund module start
            .state('fund', lazyLoad.config('/fund', '/view/shared/blank.html', '', null, true))
                //充值列表
                .state('fund.charge', lazyLoad.config('/charge', '/view/shared/blank.html', '', null, true))
                .state('fund.charge.charge', lazyLoad.config('/charge', '/view/fund/charge/charge.html', 'controller/fund/charge/charge', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.charge.detail', lazyLoad.config('/detail/:id', '/view/fund/charge/detail.html', 'controller/fund/charge/detail', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))

            //提现列表

                .state('fund.withdrawlist', lazyLoad.config('/withdrawlist', '/view/shared/blank.html', '', null, true))
                .state('fund.withdrawlist.withdrawlist', lazyLoad.config('/withdrawlist', '/view/fund/withdrawlist/withdrawlist.html', 'controller/fund/withdrawlist/withdrawlist', { directives: [], services: ['service/fund', 'service/public','service/meta'], filters: ['filter/common'] }))
                .state('fund.withdrawlist.detail', lazyLoad.config('/detail/:id', '/view/fund/withdrawlist/detail.html', 'controller/fund/withdrawlist/detail', { directives: [], services: ['service/fund','service/public', 'service/meta'], filters: ['filter/common'] }))

                //提现
                .state('fund.withdraw', lazyLoad.config('/withdraw', '/view/shared/blank.html', '', null, true))
                .state('fund.withdraw.withdraw', lazyLoad.config('/withdraw', '/view/fund/withdraw/withdraw.html', 'controller/fund/withdraw/withdraw', { directives: [], services: ['service/fund', 'service/meta'], filters: [] }))
                //提现审核
                .state('fund.withdrawCheck', lazyLoad.config('/withdrawCheck', '/view/shared/blank.html', '', null, true))
                .state('fund.withdrawCheck.withdrawCheck', lazyLoad.config('/withdrawCheck', '/view/fund/withdrawCheck/withdrawCheck.html', 'controller/fund/withdrawCheck/withdrawCheck', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.withdrawCheck.check', lazyLoad.config('/check', '/view/fund/withdrawCheck/check.html', 'controller/fund/withdrawCheck/check', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))

                //费率维护
                .state('fund.rate', lazyLoad.config('/rate', '/view/shared/blank.html', '', null, true))
                .state('fund.rate.rate', lazyLoad.config('/rate', '/view/fund/rate/rate.html', 'controller/fund/rate/rate', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.rate.add', lazyLoad.config('/add', '/view/fund/rate/edit.html', 'controller/fund/rate/edit', { directives: [], services: ['service/fund', 'service/meta', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.rate.edit', lazyLoad.config('/edit/:id', '/view/fund/rate/edit.html', 'controller/fund/rate/edit', { directives: [], services: ['service/fund', 'service/meta', 'service/meta'], filters: ['filter/common'] }))
                //提现回退
                .state('fund.wfallback', lazyLoad.config('/wfallback', '/view/shared/blank.html', '', null, true))
                .state('fund.wfallback.wfallback', lazyLoad.config('/wfallback', '/view/fund/wfallback/wfallback.html', 'controller/fund/wfallback/wfallback', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                //回退审核
                .state('fund.fallback', lazyLoad.config('/fallback', '/view/shared/blank.html', '', null, true))
                .state('fund.fallback.fallback', lazyLoad.config('/fallback', '/view/fund/fallback/fallback.html', 'controller/fund/fallback/fallback', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.fallback.check', lazyLoad.config('/check', '/view/fund/fallback/check.html', 'controller/fund/fallback/fallback', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                .state('fund.fallback.checkOne', lazyLoad.config('/checkOne', '/view/fund/fallback/checkOne.html', 'controller/fund/fallback/fallback', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))

                //充值查询
                .state('fund.query', lazyLoad.config('/query', '/view/shared/blank.html', '', null, true))
                .state('fund.query.query', lazyLoad.config('/query', '/view/fund/query/query.html', 'controller/fund/query/query', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))
                //提现查询
                .state('fund.wquery', lazyLoad.config('/wquery', '/view/shared/blank.html', '', null, true))
                .state('fund.wquery.wquery', lazyLoad.config('/wquery', '/view/fund/wquery/wquery.html', 'controller/fund/wquery/wquery', { directives: [], services: ['service/fund', 'service/meta'], filters: ['filter/common'] }))

            //fund module end

            //account module start

                .state('account', lazyLoad.config('/account', '/view/shared/blank.html', '', null, true))
                //资金账户列表
                .state('account.list', lazyLoad.config('/list', '/view/shared/blank.html', '', null, true))
                .state('account.list.list', lazyLoad.config('/list', '/view/account/list/list.html', 'controller/account/list/list', { directives: [], services: ['service/account', 'service/public','service/meta'], filters: ['filter/common'] }))
                .state('account.list.edit', lazyLoad.config('/edit/:id', '/view/account/list/edit.html', 'controller/account/list/edit', { directives: [], services: ['service/account', 'service/public','service/meta'], filters: ['filter/common'] }))
                .state('account.list.detail', lazyLoad.config('/detail/:id', '/view/account/list/detail.html', 'controller/account/list/detail', { directives: [], services: ['service/account','service/public', 'service/meta'], filters: ['filter/common'] }))

                //资金账户流水查询
                .state('account.query', lazyLoad.config('/query', '/view/shared/blank.html', '', null, true))
                .state('account.query.query', lazyLoad.config('/query', '/view/account/query/query.html', 'controller/account/query/query', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                //资金费率维护
                .state('account.rate', lazyLoad.config('/rate', '/view/shared/blank.html', '', null, true))
                .state('account.rate.rate', lazyLoad.config('/rate', '/view/account/rate/rate.html', 'controller/account/rate/rate', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                .state('account.rate.add', lazyLoad.config('/rate', '/view/account/rate/edit.html', 'controller/account/rate/edit', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                .state('account.rate.edit', lazyLoad.config('/edit/:id', '/view/account/rate/edit.html', 'controller/account/rate/edit', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                //利润提取
                .state('account.withdraw', lazyLoad.config('/withdraw', '/view/shared/blank.html', '', null, true))
                .state('account.withdraw.withdraw', lazyLoad.config('/withdraw', '/view/account/withdraw/withdraw.html', 'controller/account/withdraw/withdraw', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                //利润提取列表
                .state('account.profitlist', lazyLoad.config('/profitlist', '/view/shared/blank.html', '', null, true))
                .state('account.profitlist.profitlist', lazyLoad.config('/profitlist', '/view/account/profitlist/profitlist.html', 'controller/account/profitlist/profitlist', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))
                .state('account.profitlist.detail', lazyLoad.config('/detail/:id', '/view/account/profitlist/detail.html', 'controller/account/profitlist/detail', { directives: [], services: ['service/account', 'service/meta'], filters: ['filter/common'] }))

            //account module end

            //financial module start

            .state('financial', lazyLoad.config('/financial', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                ////催款单列表
                //.state('financial.list', lazyLoad.config('/list', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                //.state('financial.list.list', lazyLoad.config('/list', '/view/financial/list/list.html', 'controller/financial/list/list', { directives: [], services: ['service/borrower'], filters: [] }))
                //.state('financial.list.edit', lazyLoad.config('/edit/:id', '/view/financial/list/edit.html', 'controller/financial/list/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                //提现出款
                .state('financial.withdraw', lazyLoad.config('/withdraw', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.withdraw.withdraw', lazyLoad.config('/withdraw', '/view/financial/withdraw/withdraw.html', 'controller/financial/withdraw/withdraw', { services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //满标出款
                .state('financial.full', lazyLoad.config('/full', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.full.full', lazyLoad.config('/full', '/view/financial/full/full.html', 'controller/financial/full/full', { services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //出款指令列表
                .state('financial.directive', lazyLoad.config('/directive', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.directive.directive', lazyLoad.config('/directive', '/view/financial/directive/directive.html', 'controller/financial/directive/directive', { directives: [], services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                .state('financial.directive.detail', lazyLoad.config('/directive/:id', '/view/financial/directive/detail.html', 'controller/financial/directive/detail', { services: ['service/financial'], filters: ['filter/common'] }))
                //划款打印
                .state('financial.print', lazyLoad.config('/print', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.print.print', lazyLoad.config('/print', '/view/financial/print/print.html', 'controller/financial/print/print', { services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //提现出款监控
                .state('financial.monitor', lazyLoad.config('/monitor', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.monitor.monitor', lazyLoad.config('/monitor', '/view/financial/monitor/monitor.html', 'controller/financial/monitor/monitor', { directives: [], services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                .state('financial.monitor.detail', lazyLoad.config('/detail/:id', '/view/financial/monitor/detail.html', 'controller/financial/monitor/detail', { directives: [], services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //催款单列表
                .state('financial.list', lazyLoad.config('/list', '/view/shared/blank.html', '', null, true))
                .state('financial.list.list', lazyLoad.config('/list', '/view/financial/list/list.html', 'controller/financial/list/list', { directives: [], services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))

                //催款单审核
                .state('financial.check', lazyLoad.config('/check', '/view/shared/blank.html', '', null, true))
                .state('financial.check.check', lazyLoad.config('/check', '/view/financial/check/check.html', 'controller/financial/check/check', { directives: [], services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //POS充值对账
                .state('financial.POS', lazyLoad.config('/POS', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.POS.POS', lazyLoad.config('/POS', '/view/financial/POS/POS.html', 'controller/financial/POS/POS', {services: ['service/financial', 'service/meta'], filters: ['filter/common']  }))
                .state('financial.POS.detail', lazyLoad.config('/detail/:id', '/view/financial/POS/detail.html', 'controller/financial/POS/detail', {  services: ['service/financial', 'service/meta'], filters: ['filter/common']  }))
                //提现出款对账
                .state('financial.recon', lazyLoad.config('/recon', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.recon.recon', lazyLoad.config('/recon', '/view/financial/recon/recon.html', 'controller/financial/recon/recon', { directives: [], services: ['service/borrower'], filters: [] }))
                //文件接口日志
                .state('financial.file', lazyLoad.config('/file', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.file.file', lazyLoad.config('/file', '/view/financial/file/file.html', 'controller/financial/file/file', { services: ['service/financial', 'service/meta'], filters: ['filter/common'] }))
                //ERP接口
                .state('financial.ERP', lazyLoad.config('/ERP', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('financial.ERP.ERP', lazyLoad.config('/ERP', '/view/financial/ERP/ERP.html', 'controller/financial/ERP/ERP', { directives: [], services: ['service/borrower'], filters: [] }))

            //financial module end

            //marketing module start

            .state('marketing', lazyLoad.config('/marketing', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                //系统公告列表
                .state('marketing.notice', lazyLoad.config('/notice', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('marketing.notice.notice', lazyLoad.config('/notice', '/view/marketing/notice/notice.html', 'controller/marketing/notice/notice', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketing.notice.edit', lazyLoad.config('/edit/:id', '/view/marketing/notice/edit.html', 'controller/marketing/notice/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                .state('marketing.notice.add', lazyLoad.config('/add', '/view/marketing/notice/edit.html', 'controller/marketing/notice/edit', { directives: [], services: ['service/borrower'], filters: [] }))
                //短信列表
                .state('marketing.message', lazyLoad.config('/message', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('marketing.message.message', lazyLoad.config('/message', '/view/marketing/message/message.html', 'controller/marketing/message/message', { directives: [], services: ['service/borrower'], filters: [] }))
                //短信渠道
                .state('marketing.channel', lazyLoad.config('/channel', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('marketing.channel.channel', lazyLoad.config('/channel', '/view/marketing/channel/channel.html', 'controller/marketing/channel/channel', { directives: [], services: ['service/borrower'], filters: [] }))
                //邮件日志
                .state('marketing.mail', lazyLoad.config('/mail', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
                .state('marketing.mail.mail', lazyLoad.config('/mail', '/view/marketing/mail/mail.html', 'controller/marketing/mail/mail', { directives: [], services: ['service/borrower'], filters: [] }))

            //marketing module end


            //statement module start
            //.state('statement-dashboard', lazyLoad.config('/statment/dashboard', '/view/statment/dashboard.html', 'controller/statment/dashboard', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-earnedValue', lazyLoad.config('/statment/earnedValue', '/view/statment/earnedValue.html', 'controller/statment/earnedValue', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-lendingStatement', lazyLoad.config('/statment/lendingStatement', '/view/statment/lendingStatement.html', 'controller/statment/lendingStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-projectStatement', lazyLoad.config('/statment/projectStatement', '/view/statment/projectStatement.html', 'controller/statment/projectStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-dueRepayment', lazyLoad.config('/statment/dueRepayment', '/view/statment/dueRepayment.html', 'controller/statment/dueRepayment', { directives: [], services: ['service/borrower'], filters: [] }))
            //statement module end

            //// system module start
            //.state('system', lazyLoad.config('/system', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.user', lazyLoad.config('/user', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.user.list', lazyLoad.config('/list', '/view/system/user/list.html', 'controller/system/user/list', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.user.add', lazyLoad.config('/add', '/view/system/user/edit.html', 'controller/system/user/edit', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.user.edit', lazyLoad.config('/edit/:id', '/view/system/user/edit.html', 'controller/system/user/edit', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.role', lazyLoad.config('/role', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.role.list', lazyLoad.config('/list', '/view/system/role/list.html', 'controller/system/role/list', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-departmentMaintains', lazyLoad.config('/system/departmentMaintains', '/view/system/departmentMaintains.html', 'controller/system/departmentMaintains', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-regularJobLog', lazyLoad.config('/system/regularJobLog', '/view/system/regularJobLog.html', 'controller/system/regularJobLog', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-onlineMonitoring', lazyLoad.config('/system/onlineMonitoring', '/view/system/onlineMonitoring.html', 'controller/system/onlineMonitoring', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-staticParameters', lazyLoad.config('/system/staticParameters', '/view/system/staticParameters.html', 'controller/system/staticParameters', { directives: [], services: ['service/borrower'], filters: [] }))
            //// system module end

            //marketing module end

            //marketing module end

            //statistics module start
            .state('statistics', lazyLoad.config('/statistics', '/view/shared/blank.html', '', null, true))
                .state('statistics.user', lazyLoad.config('/user', '/view/statistics/user.html', 'controller/statistics/user', null))
                .state('statistics.profit', lazyLoad.config('/profit', '/view/statistics/profit.html', 'controller/statistics/profit', { services: ['service/statistics'], filters: ['filter/common']}))
                //statistics module end


            //statement module start
            //.state('statement-dashboard', lazyLoad.config('/statment/dashboard', '/view/statment/dashboard.html', 'controller/statment/dashboard', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-earnedValue', lazyLoad.config('/statment/earnedValue', '/view/statment/earnedValue.html', 'controller/statment/earnedValue', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-lendingStatement', lazyLoad.config('/statment/lendingStatement', '/view/statment/lendingStatement.html', 'controller/statment/lendingStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-projectStatement', lazyLoad.config('/statment/projectStatement', '/view/statment/projectStatement.html', 'controller/statment/projectStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-dueRepayment', lazyLoad.config('/statment/dueRepayment', '/view/statment/dueRepayment.html', 'controller/statment/dueRepayment', { directives: [], services: ['service/borrower'], filters: [] }))
            //statement module end

            // system module start
            .state('system', lazyLoad.config('/system', '/view/shared/blank.html', '', null, true))
            .state('system.user', lazyLoad.config('/user', '/view/shared/blank.html', '', null, true))
            .state('system.user.list', lazyLoad.config('/list', '/view/system/user/list.html', 'controller/system/user/list', { services: ['service/system', 'service/meta'], filters: ['filter/common'] }))
                .state('system.user.detail',lazyLoad.config('/detail/:id','/view/system/user/detail.html','controller/system/user/detail',{ directives: [], services: ['service/system', 'service/meta'], filters: ['filter/common'] }))
                .state('system.user.add', lazyLoad.config('/add', '/view/system/user/add.html', 'controller/system/user/edit', { services: ['service/system', 'service/meta'], filters: ['filter/common'] }))
            .state('system.user.edit', lazyLoad.config('/edit/:id', '/view/system/user/edit.html', 'controller/system/user/edit', { services: ['service/system', 'service/meta'], filters: ['filter/common'] }))
            //.state('system.role', lazyLoad.config('/role', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.role.list', lazyLoad.config('/list', '/view/system/role/list.html', 'controller/system/role/list', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-departmentMaintains', lazyLoad.config('/system/departmentMaintains', '/view/system/departmentMaintains.html', 'controller/system/departmentMaintains', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-regularJobLog', lazyLoad.config('/system/regularJobLog', '/view/system/regularJobLog.html', 'controller/system/regularJobLog', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-onlineMonitoring', lazyLoad.config('/system/onlineMonitoring', '/view/system/onlineMonitoring.html', 'controller/system/onlineMonitoring', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-staticParameters', lazyLoad.config('/system/staticParameters', '/view/system/staticParameters.html', 'controller/system/staticParameters', { directives: [], services: ['service/borrower'], filters: [] }))
            //// system module end

            //statistics module end


            //statement module start
            //.state('statement-dashboard', lazyLoad.config('/statment/dashboard', '/view/statment/dashboard.html', 'controller/statment/dashboard', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-earnedValue', lazyLoad.config('/statment/earnedValue', '/view/statment/earnedValue.html', 'controller/statment/earnedValue', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-lendingStatement', lazyLoad.config('/statment/lendingStatement', '/view/statment/lendingStatement.html', 'controller/statment/lendingStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-projectStatement', lazyLoad.config('/statment/projectStatement', '/view/statment/projectStatement.html', 'controller/statment/projectStatement', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('statement-dueRepayment', lazyLoad.config('/statment/dueRepayment', '/view/statment/dueRepayment.html', 'controller/statment/dueRepayment', { directives: [], services: ['service/borrower'], filters: [] }))
            //statement module end

            //// system module start
            //.state('system', lazyLoad.config('/system', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.user', lazyLoad.config('/user', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.user.list', lazyLoad.config('/list', '/view/system/user/list.html', 'controller/system/user/list', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.user.add', lazyLoad.config('/add', '/view/system/user/edit.html', 'controller/system/user/edit', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.user.edit', lazyLoad.config('/edit/:id', '/view/system/user/edit.html', 'controller/system/user/edit', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system.role', lazyLoad.config('/role', '/view/shared/blank.html', '', { directives: [], services: ['service/borrower'], filters: [] }, true))
            //.state('system.role.list', lazyLoad.config('/list', '/view/system/role/list.html', 'controller/system/role/list', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-departmentMaintains', lazyLoad.config('/system/departmentMaintains', '/view/system/departmentMaintains.html', 'controller/system/departmentMaintains', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-regularJobLog', lazyLoad.config('/system/regularJobLog', '/view/system/regularJobLog.html', 'controller/system/regularJobLog', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-onlineMonitoring', lazyLoad.config('/system/onlineMonitoring', '/view/system/onlineMonitoring.html', 'controller/system/onlineMonitoring', { directives: [], services: ['service/borrower'], filters: [] }))
            //.state('system-staticParameters', lazyLoad.config('/system/staticParameters', '/view/system/staticParameters.html', 'controller/system/staticParameters', { directives: [], services: ['service/borrower'], filters: [] }))
            //// system module end
            ;
            $locationProvider.html5Mode(true);
        }
    ]);
});
