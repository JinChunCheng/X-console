'use strict';
define(['app', 'lazy-load'], function(app, lazyLoad) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {
            $urlRouterProvider.otherwise('/404');
            $stateProvider
            .state('home', lazyLoad.config('', 'view/home/index.html', 'controller/home/index', { directives: [], services: [], filters:[] }))
            .state('login', lazyLoad.config('/login?r', 'view/login/login.html', 'controller/login/login', { directives: [], services: [], filters:[] }))

            // pc路由 begin
            .state('pc', lazyLoad.config('/pc', 'view/shared/blank.html', 'controller/pc/pc', { directives: [], services: [], filters:[] }, true))
            .state('pc.warehouse', lazyLoad.config('/warehosue', 'view/shared/blank.html', 'controller/pc/warehouse/index', { directives: [], services: [], filters:[] }, true))
            .state('pc.warehouse.list', lazyLoad.config('/list', 'view/pc/warehouse/list.html', 'controller/pc/warehouse/list', { directives: [], services: ['service/pcService'], filters:[] }))
            .state('pc.warehouse.add', lazyLoad.config('/add', 'view/pc/warehouse/edit.html', 'controller/pc/warehouse/edit', { directives: [], services: ['service/pcService'], filters:[] }))
            .state('pc.warehouse.edit', lazyLoad.config('/edit/:code', 'view/pc/warehouse/edit.html', 'controller/pc/warehouse/edit', { directives: [], services: ['service/pcService'], filters:[] }))

            .state('pc.category', lazyLoad.config('/category', 'view/shared/blank.html', 'controller/pc/category/category', { directives: [], services: [], filters:[] }, true))
            .state('pc.category.index', lazyLoad.config('/index', 'view/pc/category/index.html', 'controller/pc/category/index', { directives: ['directive/ztree', 'directive/fullHeight'], services: ['service/pcService'], filters:[] }))
            .state('pc.category.add', lazyLoad.config('/add', 'view/pc/category/edit.html', 'controller/pc/category/edit', { directives: [], services: ['service/pcService'], filters:[] }))
            .state('pc.category.edit', lazyLoad.config('/edit/:code', 'view/pc/category/edit.html', 'controller/pc/category/edit', { directives: [], services: ['service/pcService'], filters:[] }))

            .state('pc.product', lazyLoad.config('/product', 'view/shared/blank.html', 'controller/pc/product/product', {directives: [], services: [], filters: []}, true))
            .state('pc.product.list', lazyLoad.config('/list', 'view/pc/product/list.html', 'controller/pc/product/list', {directives: ['directive/checkList', 'directive/ztree', 'directive/stopPropagation', 'directive/errorSrc'], services: ['service/supService', 'service/pcService'], filters: ['filter/common'], params:{listVM: null}}))
            .state('pc.product.skus', lazyLoad.config('/skus/:code', 'view/pc/product/skus.html', 'controller/pc/product/skus', {directives: ['directive/errorSrc'], services: ['service/pcService'], filters: ['filter/common'], params:{listVM: null}}))
            .state('pc.product.view', lazyLoad.config('/view/:code?from', 'view/pc/product/view.html', 'controller/pc/product/view', {directives: ['directive/errorSrc'], services: ['service/supService', 'service/meta', 'service/pcService','service/auditService'], filters: ['filter/common'], params:{listVM: null}}))
            .state('pc.product.add', lazyLoad.config('/add', 'view/pc/product/add.html', 'controller/pc/product/edit', {directives: ['directive/checkList', 'directive/fileToBase64', 'directive/ztree', 'directive/stopPropagation', 'directive/errorSrc'], services: ['service/supService', 'service/meta', 'service/pcService', 'service/areaService'], filters: ['filter/common'], params:{listVM: null}}))
            .state('pc.product.edit', lazyLoad.config('/edit/:code?from', 'view/pc/product/add.html', 'controller/pc/product/edit', {directives: ['directive/checkList', 'directive/fileToBase64', 'directive/ztree', 'directive/stopPropagation', 'directive/errorSrc'], services: ['service/supService', 'service/meta', 'service/pcService', 'service/areaService'], filters: ['filter/common'], params:{listVM: null}}))
            //batch upload
            .state('pc.product.batch-upload', lazyLoad.config('/batch-upload', 'view/pc/product/batch-upload.html', 'controller/pc/product/batch-upload', {directives: [], services: [], filters: []}))

            .state('pc.supplierfiles', lazyLoad.config('/supplierfiles', 'view/shared/blank.html', 'controller/pc/supplierfiles/supplierfiles', {directives: [], services: [], filters: []}, true))
            .state('pc.supplierfiles.list', lazyLoad.config('/list', 'view/pc/supplierfiles/list.html', 'controller/pc/supplierfiles/list', {directives: [], services: ['service/pcService'], filters: ['filter/common']}))
            
            .state('pc.attribute', lazyLoad.config('/attribute', 'view/shared/blank.html', 'controller/pc/attribute/attribute', {directives: [], services: [], filters: []}, true))
            .state('pc.attribute.list', lazyLoad.config('/list', 'view/pc/attribute/list.html', 'controller/pc/attribute/list', {directives: ['directive/validFile'], services: ['service/pcService'], filters: [], params:{listVM:null}}))
            .state('pc.attribute.add', lazyLoad.config('/add', 'view/pc/attribute/edit.html', 'controller/pc/attribute/edit', {directives: ['directive/checkList'], services: ['service/pcService', 'service/meta'], filters: [], params:{listVM:null}}))
            .state('pc.attribute.edit', lazyLoad.config('/edit/:code', 'view/pc/attribute/edit.html', 'controller/pc/attribute/edit', {directives: ['directive/checkList'], services: ['service/pcService', 'service/meta'], filters: [], params:{listVM:null}}))
            //add by xxg
            .state('pc.product.auditList', lazyLoad.config('/auditList', 'view/pc/product/auditList.html', 'controller/pc/product/auditList', {directives: ['directive/ztree', 'directive/stopPropagation', 'directive/checkList', 'directive/errorSrc'], services: ['service/auditService','service/supService','service/meta'], filters: ['filter/common'], params:{listVM: null}}))
            .state('pc.product.newProductList', lazyLoad.config('/newProductList', 'view/pc/product/newProductList.html', 'controller/pc/product/newProductList', {directives: ['directive/ztree', 'directive/stopPropagation', 'directive/checkList', 'directive/errorSrc'], services: ['service/auditService','service/supService','service/meta'], filters: ['filter/common'], params:{listVM: null}}))
            // pc路由 end
            
             //logistics路由Begin
            .state('logistics', lazyLoad.config('/logistics', 'view/shared/blank.html', 'controller/logistics/logistics', { directives: [], services: [], filters:[] }, true))
            .state('logistics.saleOrder', lazyLoad.config('/saleOrder', 'view/shared/blank.html', 'controller/logistics/saleOrder/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.saleOrder.list', lazyLoad.config('/list', 'view/logistics/saleOrder/list.html', 'controller/logistics/saleOrder/list', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.saleOrder.edit', lazyLoad.config('/view/:orderId', 'view/logistics/saleOrder/edit.html', 'controller/logistics/saleOrder/edit', {directives: [], services: ['service/logisticsService'], filters: ['filter/common'],params:{condition: null}}))
            .state('logistics.waybill', lazyLoad.config('/waybill', 'view/shared/blank.html', 'controller/logistics/waybill/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.waybill.list', lazyLoad.config('/list', 'view/logistics/waybill/list.html', 'controller/logistics/waybill/list', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.waybill.view', lazyLoad.config('/view/:trackId/:orderId', 'view/logistics/waybill/view.html', 'controller/logistics/waybill/view', {directives: [], services: ['service/logisticsService'], filters: ['filter/common'],params:{orderId:null, trackId:null, condition: null}}))
            .state('logistics.waybill.edit', lazyLoad.config('/edit/:trackDetailId', 'view/logistics/waybill/edit.html', 'controller/logistics/waybill/edit', {directives: [], services: ['service/logisticsService'], filters: [],params:{orderId:null, trackId:null, condition: null}}))
            .state('logistics.waybill.add', lazyLoad.config('/add/:orderId/:trackId/:trackDetailId', 'view/logistics/waybill/add.html', 'controller/logistics/waybill/add', {directives: [], services: ['service/logisticsService'], filters: [],params:{orderId:null, trackId:null, condition: null}}))
            .state('logistics.tracking', lazyLoad.config('/tracking', 'view/shared/blank.html', 'controller/logistics/tracking/tracking', { directives: [], services: [], filters:[] }, true))
            .state('logistics.tracking.list', lazyLoad.config('/list', 'view/logistics/tracking/list.html', 'controller/logistics/tracking/list', {directives: [], services: ['service/logisticsService'], filters: [], params:{condition: null}}))
            .state('logistics.tracking.edit', lazyLoad.config('/edit/:trackDetailId', 'view/logistics/tracking/edit.html', 'controller/logistics/tracking/edit', {directives: [], services: ['service/logisticsService'], filters: [], params:{condition: null}}))
            .state('logistics.trackDocument', lazyLoad.config('/trackDocument', 'view/shared/blank.html', 'controller/logistics/trackDocument/index', {directives: [], services: [], filters: []}))
            .state('logistics.trackDocument.list', lazyLoad.config('/list', 'view/logistics/trackDocument/list.html', 'controller/logistics/trackDocument/list', {directives: [], services: ['service/logisticsService'], filters: ['filter/common']}))
            .state('logistics.logisticsTrack', lazyLoad.config('/logisticsTrack', 'view/shared/blank.html', 'controller/logistics/logisticsTrack/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.logisticsTrack.list', lazyLoad.config('/list', 'view/logistics/logisticsTrack/list.html', 'controller/logistics/logisticsTrack/list', {directives: [], services: ['service/logisticsService'], filters: [], params:{condition: null}}))
            .state('logistics.logisticsTrack.detail', lazyLoad.config('/detail/:trackId', 'view/logistics/logisticsTrack/detail.html', 'controller/logistics/logisticsTrack/detail', {directives: [], services: ['service/logisticsService'], filters: [], params:{condition: null}}))
            .state('logistics.weightInterval', lazyLoad.config('/weightInterval', 'view/shared/blank.html', 'controller/logistics/weightInterval/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.weightInterval.list', lazyLoad.config('/list', 'view/logistics/weightInterval/list.html', 'controller/logistics/weightInterval/list', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.weightInterval.add', lazyLoad.config('/add', 'view/logistics/weightInterval/edit.html', 'controller/logistics/weightInterval/edit', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null,isAdd:null}}))
            .state('logistics.weightInterval.edit', lazyLoad.config('/edit/:wgtIntervalId', 'view/logistics/weightInterval/edit.html', 'controller/logistics/weightInterval/edit', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null,isAdd:null}}))
            .state('logistics.vendor', lazyLoad.config('/vendor', 'view/shared/blank.html', 'controller/logistics/vendor/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.vendor.list', lazyLoad.config('/list', 'view/logistics/vendor/list.html', 'controller/logistics/vendor/list', {directives: [], services: ['service/logisticsService'], filters: [], params:{condition: null}}))
            .state('logistics.vendor.add', lazyLoad.config('/add', 'view/logistics/vendor/edit.html', 'controller/logistics/vendor/edit', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null,isAdd:null}}))
            .state('logistics.vendor.edit', lazyLoad.config('/edit/:vendorId', 'view/logistics/vendor/edit.html', 'controller/logistics/vendor/edit', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null,isAdd:null}}))
            .state('logistics.InterTransportRate', lazyLoad.config('/InterTransportRate', 'view/shared/blank.html', 'controller/logistics/InterTransportRate/index', { directives: [], services: [], filters:[] }, true))
            .state('logistics.InterTransportRate.oceanAirList', lazyLoad.config('/oceanAirList', 'view/logistics/InterTransportRate/oceanAirList.html', 'controller/logistics/InterTransportRate/oceanAirList', {directives: ['directive/checkList'], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.InterTransportRate.oceanAirAdd', lazyLoad.config('/oceanAirAdd', 'view/logistics/InterTransportRate/oceanAdd.html', 'controller/logistics/InterTransportRate/oceanAdd', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition:null}}))          
            .state('logistics.InterTransportRate.oceanAirEdit', lazyLoad.config('/oceanAirEdit/:freightChargeId', 'view/logistics/InterTransportRate/oceanEdit.html', 'controller/logistics/InterTransportRate/oceanEdit', {directives: [], services: ['service/logisticsService'], filters: [],params:{freightChargeId:null,serviceType:null,condition:null}}))          
            .state('logistics.InterTransportRate.expressList', lazyLoad.config('/expressList', 'view/logistics/InterTransportRate/expressList.html', 'controller/logistics/InterTransportRate/expressList', {directives: ['directive/checkList'], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.InterTransportRate.expressAdd', lazyLoad.config('/expressAdd', 'view/logistics/InterTransportRate/expressAdd.html', 'controller/logistics/InterTransportRate/expressAdd', {directives: [], services: ['service/logisticsService'], filters: [],params:{condition: null}}))
            .state('logistics.InterTransportRate.expressEdit', lazyLoad.config('/expressEdit/:expresschargeId', 'view/logistics/InterTransportRate/expressEdit.html', 'controller/logistics/InterTransportRate/expressEdit', {directives: [], services: ['service/logisticsService'], filters: [],params:{expresschargeId:null,condition: null}}))
            //logistics路由End
            //mc start
            .state('mc', lazyLoad.config('/mc', 'view/shared/blank.html', 'controller/mc/mc', { directives: [], services: [], filters:[] }, true))

            .state('mc.mcCategory', lazyLoad.config('/mcCategory', 'view/shared/blank.html', 'controller/mc/mcCategory/index', { directives: [], services: [], filters:[] }, true))
            .state('mc.mcCategory.list', lazyLoad.config('/list', 'view/mc/mcCategory/list.html', 'controller/mc/mcCategory/list', { directives: ['directive/ztree', 'directive/fullHeight'], services: ['service/mcService'], filters:[] }))
            .state('mc.mcCategory.add', lazyLoad.config('/add', 'view/mc/mcCategory/add.html', 'controller/mc/mcCategory/add', { directives: ['directive/ztree', 'directive/fileToBase64', 'directive/stopPropagation'], services: ['service/mcService'], filters:[], params:{condition: null}}))
            .state('mc.mcCategory.edit', lazyLoad.config('/edit/:code', 'view/mc/mcCategory/edit.html', 'controller/mc/mcCategory/edit', { directives: ['directive/ztree', 'directive/fileToBase64', 'directive/stopPropagation'], services: ['service/mcService'], filters:[], params:{condition: null}}))

            .state('mc.goods', lazyLoad.config('/goods', 'view/shared/blank.html', 'controller/mc/goods/index', { directives: [], services: [], filters:[] }, true))
            .state('mc.goods.list', lazyLoad.config('/list', 'view/mc/goods/list.html', 'controller/mc/goods/list', { directives: ['directive/checkList', 'directive/ztree', 'directive/repeatDone'], services: ['service/mcService'], filters:['filter/common'], params:{listVM: null} }))
            .state('mc.goods.edit', lazyLoad.config('/edit/:code', 'view/mc/goods/edit.html', 'controller/mc/goods/edit', { directives: ['directive/ztree', 'directive/stopPropagation'], services: ['service/mcService'], filters:[], params:{listVM: null}}))

            .state('mc.active', lazyLoad.config('/active', 'view/shared/blank.html', 'controller/mc/active/index', { directives: [], services: [], filters:[] }, true))
            .state('mc.active.list', lazyLoad.config('/list', 'view/mc/active/list.html', 'controller/mc/active/list', { directives: [], services: ['service/mcService'], filters:['filter/common'], params:{condition: null}}))
            .state('mc.active.add', lazyLoad.config('/add', 'view/mc/active/add.html', 'controller/mc/active/add', { directives: ['directive/ztree', 'directive/repeatDone'], services: ['service/mcService'], filters:[], params:{condition: null}}))
            .state('mc.active.edit', lazyLoad.config('/edit/:id', 'view/mc/active/edit.html', 'controller/mc/active/edit', { directives: ['directive/ztree', 'directive/repeatDone'], services: ['service/mcService'], filters:[], params:{condition: null}}))

            .state('mc.campaign', lazyLoad.config('/campaign', 'view/shared/blank.html', 'controller/mc/campaign/index', { directives: [], services: [], filters:[] }, true))
            .state('mc.campaign.list', lazyLoad.config('/list', 'view/mc/campaign/list.html', 'controller/mc/campaign/list', { directives: [], services: ['service/mcService', 'service/meta'], filters:['filter/common'], params:{condition: null}}))
            .state('mc.campaign.add', lazyLoad.config('/add', 'view/mc/campaign/add.html', 'controller/mc/campaign/add', { directives: [], services: ['service/mcService', 'service/meta'], filters:[], params:{condition: null}}))
            .state('mc.campaign.edit', lazyLoad.config('/edit/:id', 'view/mc/campaign/edit.html', 'controller/mc/campaign/edit', { directives: [], services: ['service/mcService', 'service/meta'], filters:[], params:{condition: null}}))

            //mc end

            //setting start
            .state('setting', lazyLoad.config('/setting', 'view/shared/blank.html', 'controller/setting/setting', { directives: [], services: [], filters:[] }, true))
            //物流设置
            .state('setting.logistics', lazyLoad.config('/active', 'view/shared/blank.html', 'controller/setting/logistics/index', { directives: [], services: [], filters:[] }, true))
            .state('setting.logistics.logistics', lazyLoad.config('/list', 'view/setting/logistics/logistics.html', 'controller/setting/logistics/logistics', { directives: [], services: ['service/settingService'], filters:[], params:{condition: null}}))
            //财务设置
            .state('setting.finance', lazyLoad.config('/active', 'view/shared/blank.html', 'controller/setting/finance/index', { directives: [], services: [], filters:[] }, true))
            .state('setting.finance.finance', lazyLoad.config('/list', 'view/setting/finance/finance.html', 'controller/setting/finance/finance', { directives: [], services: ['service/settingService'], filters:[], params:{condition: null}}))

             //setting end

	      .state('404', lazyLoad.config('/404', 'view/error/404.html', 'controller/error/index', { directives: [], services: [], filters:[] }))
	      .state('error', lazyLoad.config('/error', 'view/error/error.html', 'controller/error/index', { directives: [], services: [], filters:[] }))
            
            .state('test', lazyLoad.config('/test', 'view/shared/blank.html', 'controller/test/index', { directives: [], services: [], filters:[] }, true))
            //.state('test.list', lazyLoad.config('/list', 'view/test/list.html', 'controller/test/list', { directives: ['directive/ztree', 'directive/stopPropagation'], services: [], filters:['filter/common'], params:{condition: null}}))
            .state('test.add', lazyLoad.config('/add', 'view/test/edit.html', 'controller/test/edit', { directives: ['components/angular-ueditor.min', 'directive/ztree', 'directive/stopPropagation'], services: [], filters:[], params:{condition: null} }))
            .state('test.edit', lazyLoad.config('/edit/:id', 'view/test/edit.html', 'controller/test/edit', { directives: ['components/angular-ueditor.min', 'directive/ztree', 'directive/stopPropagation'], services: [], filters:[], params:{condition: null} }))
            .state('terminal', lazyLoad.config('/terminal', 'view/shared/blank.html', 'controller/cms/terminal/index', { directives: [], services: [], filters:[] }, true))
            .state('terminal.list', lazyLoad.config('/list', 'view/cms/terminal/list.html', 'controller/cms/terminal/list', { directives: ['directive/checkList'], services: ['service/meta','service/terminal'], filters:['filter/common'], params:{condition: null}}))

            .state('page', lazyLoad.config('/page', 'view/shared/blank.html', 'controller/cms/page/index', { directives: [], services: [], filters:[] }, true))
            .state('page.list', lazyLoad.config('/list?t', 'view/cms/page/list.html', 'controller/cms/page/list', { directives: ['directive/checkList'], services: ['service/meta', 'service/pageService'], filters:['filter/common'] }))
            
            .state('recommend', lazyLoad.config('/recommend', 'view/shared/blank.html', 'controller/cms/recommend/index', { directives: ['directive/checkList'], services: ['service/meta','service/recommend'], filters:['filter/common'] }, true))

            .state('recommend.list', lazyLoad.config('/list?t&p&pn', 'view/cms/recommend/list.html', 'controller/cms/recommend/list', { directives: [], services: ['service/pageService'], filters:[] }))

		.state('recommend.picture', lazyLoad.config('/picture/list?r&p', 'view/cms/recommend/picture/list.html', 'controller/cms/recommend/item', { directives: ['directive/fileToBase64'], services: ['service/recommendItem'], filters:[] }))
            .state('recommend.product', lazyLoad.config('/product/list?r&p', 'view/cms/recommend/product/list.html', 'controller/cms/recommend/item_p', { directives: ['directive/fileToBase64'], services: ['service/recommendItem'], filters:[] }))
		.state('recommend.import', lazyLoad.config('/import?t&p&r', 'view/cms/recommend/product/import.html', 'controller/cms/recommend/importPage', { directives: ['directive/ztree', 'directive/stopPropagation','directive/checkList'], services: ['service/meta','service/recommend', 'service/recommendImport'], filters:['filter/common'] }))
			
            .state('supplier', lazyLoad.config('/supplier', 'view/shared/blank.html', 'controller/supplier/supplier', { directives: [], services: [], filters:[] }, true))
            .state('supplier.info', lazyLoad.config('/info', 'view/shared/blank.html', 'controller/supplier/info/index', { directives: [], services: [], filters:[] }))
            .state('supplier.info.list', lazyLoad.config('/list', 'view/supplier/info/list.html', 'controller/supplier/info/list', { directives: [], services: ['service/meta','service/supService'], filters:[] }))
            .state('supplier.info.edit', lazyLoad.config('/edit/:id/:edit', 'view/supplier/info/edit.html', 'controller/supplier/info/edit', { directives: ['directive/fileToBase64','directive/checkList','directive/clicktransfer'], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.info.view', lazyLoad.config('/view/:id', 'view/supplier/info/view.html', 'controller/supplier/info/edit', { directives: [], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.audit', lazyLoad.config('/audit', 'view/shared/blank.html', 'controller/supplier/audit/index', { directives: [], services: [], filters:[] }))
            .state('supplier.audit.list', lazyLoad.config('/list', 'view/supplier/audit/list.html', 'controller/supplier/audit/list', { directives: [], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.audit.detail', lazyLoad.config('/detail/:id', 'view/supplier/audit/audit.html', 'controller/supplier/audit/detail', { directives: ['service/meta','service/supService','directive/checkList'], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.feedback', lazyLoad.config('/feedback', 'view/shared/blank.html', 'controller/supplier/feedback/index', { directives: [], services: [], filters:[] }))
            .state('supplier.feedback.list', lazyLoad.config('/list', 'view/supplier/feedback/list.html', 'controller/supplier/feedback/list', { directives: [], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.feedback.detail', lazyLoad.config('/detail/:id', 'view/supplier/feedback/detail.html', 'controller/supplier/feedback/detail', { directives: [], services: ['service/meta','service/supService'], filters:[] }))
            .state('supplier.order', lazyLoad.config('/order', 'view/shared/blank.html', 'controller/supplier/order/index', { directives: [], services: [], filters:[] }))
            .state('supplier.order.list', lazyLoad.config('/list/:id', 'view/supplier/order/list.html', 'controller/supplier/order/list', { directives: [], services: ['service/meta', 'service/supService'], filters: ['filter/common'] }))
            .state('supplier.order.detail', lazyLoad.config('/detail/:id', 'view/supplier/order/detail.html', 'controller/supplier/order/detail', { directives: [], services: ['service/meta','service/supService'], filters:['filter/common'] }))
            .state('supplier.product', lazyLoad.config('/product', 'view/shared/blank.html', 'controller/supplier/product/index', { directives: [], services: [], filters:[] }))
            .state('supplier.product.list', lazyLoad.config('/list/:id', 'view/supplier/product/list.html', 'controller/supplier/product/list', { directives: [], services: ['service/meta','service/supService'], filters:[] }))

            // system management router begin
            .state('sys', lazyLoad.config('/sys', 'view/shared/blank.html', 'controller/sys/sys', { directives: [], services: [], filters:[] }, true))
            .state('sys.role', lazyLoad.config('/role', 'view/shared/blank.html', 'controller/sys/role/role', { directives: [], services: [], filters:[] }, true))
            .state('sys.role.list', lazyLoad.config('/list', 'view/sys/role/list.html', 'controller/sys/role/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
            .state('sys.user', lazyLoad.config('/user', 'view/shared/blank.html', 'controller/sys/user/user', { directives: [], services: [], filters:[] }, true))
                .state('sys.user.password', lazyLoad.config('/password/:id', 'view/sys/user/password.html', 'controller/sys/user/password', { directives: [], services: ['service/sysService'], filters:[] }))

                .state('sys.user.list', lazyLoad.config('/list', 'view/sys/user/list.html', 'controller/sys/user/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
            .state('sys.log', lazyLoad.config('/log', 'view/shared/blank.html', 'controller/sys/log/log', { directives: [], services: [], filters:[] }, true))
            .state('sys.log.list', lazyLoad.config('/list', 'view/sys/log/list.html', 'controller/sys/log/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
            .state('sys.meta', lazyLoad.config('/meta', 'view/shared/blank.html', 'controller/sys/meta/meta', { directives: [], services: [], filters:[] }, true))
            .state('sys.meta.list', lazyLoad.config('/list', 'view/sys/meta/list.html', 'controller/sys/meta/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
            .state('sys.permission', lazyLoad.config('/permission', 'view/shared/blank.html', 'controller/sys/permission/permission', { directives: [], services: [], filters:[] }, true))
            .state('sys.permission.list', lazyLoad.config('/list', 'view/sys/permission/list.html', 'controller/sys/permission/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
            .state('sys.permission.add', lazyLoad.config('/add', 'view/sys/permission/add.html', 'controller/sys/permission/edit', { directives: [], services: [], filters:[] }))
            .state('sys.permission.edit', lazyLoad.config('/edit/:id', 'view/sys/permission/edit.html', 'controller/sys/permission/edit', { directives: [], services: [], filters:[] }))
            .state('sys.permission.view', lazyLoad.config('/view/:id', 'view/sys/permission/view.html', 'controller/sys/permission/edit', { directives: [], services: [], filters:[] }))
            .state('sys.authorize', lazyLoad.config('/authorize', 'view/shared/blank.html', 'controller/sys/authorize/authorize', { directives: [], services: [], filters:[] }, true))
            .state('sys.authorize.list', lazyLoad.config('/list', 'view/sys/authorize/list.html', 'controller/sys/authorize/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))

                .state('sys.schedule', lazyLoad.config('/schedule', 'view/shared/blank.html', 'controller/sys/schedule/schedule', { directives: [], services: [], filters:[] }, true))
                .state('sys.schedule.edit', lazyLoad.config('/edit/:id', 'view/sys/schedule/edit.html', 'controller/sys/schedule/edit', { directives: [], services: ['service/sysService'], filters:[] }))
                .state('sys.schedule.list', lazyLoad.config('/list', 'view/sys/schedule/list.html', 'controller/sys/schedule/list', { directives: [], services: ['service/sysService'], filters:['filter/common'] }))
                // system management router end
            .state('my', lazyLoad.config('/my', 'view/shared/blank.html', 'controller/my/my', { directives: [], services: [], filters:[] }, true))
            .state('my.password', lazyLoad.config('/password', 'view/my/password.html', 'controller/my/password', { directives: [], services: ['service/sysService'], filters:[] }))

            //buyer router begin
            .state('buyer', lazyLoad.config('/buyer', 'view/shared/blank.html', 'controller/buyer/buyer', { directives: [], services: [], filters:[] }, true))
            .state('buyer.info', lazyLoad.config('/info', 'view/shared/blank.html', 'controller/buyer/info/index', { directives: [], services: [], filters:[] }))
            .state('buyer.info.list', lazyLoad.config('/list', 'view/buyer/info/list.html', 'controller/buyer/info/list', { directives: [], services: ['service/meta','service/buyerService'], filters:['filter/common'], params:{listVM: null} }))
            .state('buyer.info.edit', lazyLoad.config('/edit/:id', 'view/buyer/info/edit.html', 'controller/buyer/info/edit', { directives: ['directive/fileToBase64'], services: ['service/meta','service/buyerService'], filters:['filter/common'], params:{listVM: null} }))
            .state('buyer.freeSourcing', lazyLoad.config('/freeSourcing', 'view/shared/blank.html', 'controller/buyer/freeSourcing/index', { directives: [], services: [], filters:[] }))
            .state('buyer.freeSourcing.list', lazyLoad.config('/list', 'view/buyer/freeSourcing/list.html', 'controller/buyer/freeSourcing/list', { directives: [], services: ['service/meta','service/buyerService'], filters:['filter/common'] }))
            .state('buyer.freeSourcing.view', lazyLoad.config('/view/:id', 'view/buyer/freeSourcing/view.html', 'controller/buyer/freeSourcing/edit', { directives: ['directive/fileToBase64'], services: ['service/meta','service/buyerService'], filters:['filter/common'] }))
            .state('buyer.quote', lazyLoad.config('/quote', 'view/shared/blank.html', 'controller/buyer/quote/index', { directives: [], services: [], filters:[] }))
            .state('buyer.quote.list', lazyLoad.config('/list', 'view/buyer/quote/list.html', 'controller/buyer/quote/list', { directives: [], services: ['service/meta','service/buyerService'], filters:['filter/common'], params:{listVM: null} }))
            .state('buyer.quote.edit', lazyLoad.config('/edit/:id', 'view/buyer/quote/edit.html', 'controller/buyer/quote/edit', { directives: ['directive/fileToBase64'], services: ['service/meta','service/buyerService'], filters:['filter/common'], params:{listVM: null} }))
            //buyer router end

            //so router begin
            .state('so', lazyLoad.config('/so', 'view/shared/blank.html', 'controller/so/order', { directives: [], services: [], filters:[] }, true))
            .state('so.info', lazyLoad.config('/info', 'view/shared/blank.html', 'controller/so/info/index', { directives: [], services: [], filters:[] }))
            .state('so.info.list', lazyLoad.config('/list', 'view/so/info/list.html', 'controller/so/info/list', { directives: ['directive/checkList'], services: ['service/meta','service/soService'], filters:['filter/common','filter/soCommon'] }))
            .state('so.info.view', lazyLoad.config('/view/:id', 'view/so/info/view.html', 'controller/so/info/view', { directives: ['directive/fileToBase64'], services: ['service/meta','service/soService'], filters:['filter/common','filter/soCommon'] }))
            //so router end


            ;

            //单独配置控制器
            lazyLoad.configCtrls([
                {name: 'PageCtrl', path:'controller/cms/page/edit'},
                {name: 'TerminalCtrl', path:'controller/cms/terminal/edit'},
                {name: 'RecommendCtrl', path: 'controller/cms/recommend/edit_p'},
                {name: 'RateCtrl', path: 'controller/cms/recommend/rate'},
                {name: 'LoadingCtrl', path:'controller/shared/loading'}
            ]);
        }
    ]);
});
