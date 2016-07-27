//yucheng, added, for supplier list page
//
//return ['$scope','$http', '$routeParams','$location','metaService',
//    function($scope, $http, $routeParams, $location,metaService){

define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'supService', 'metaService', function($rootScope, $scope, $state, toaster, supService, metaService) {

        ph.mark($rootScope, {
            state: 'supplier.info.list',
            title: '供应商列表'
        });

        $scope.GoToPage = 1;
        $scope.condition = {
            pageSize: 10,
            pageNo: 1,
            companyName: '',
            email: ''
        };
        $scope.supplierList = [];
        $scope.paginate = {};
        $scope.queryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        var hostname = config.supplier_domain; //supplier_domain;

        //YES NO
        metaService.getMeta('YESORNOT', function(list) {
            $scope.defaultYesNoMapping = list;
        });
        //audit category
        metaService.getMeta('RZZT', function(list) {
            $scope.defaultAuditStatus = list;
        });

        $scope.view = {
            loading: false
        };

        $scope.page = function(pageNum) {
            $scope.condition.pageNo = pageNum;
            if ($scope.queryResult.PageSize > 0) {
                $scope.condition.pageSize = $scope.queryResult.PageSize > 100 ? 100 : $scope.queryResult.PageSize;
            };

            //URI: {baseUri}/supplier/ getSupplierDetails /{supplierId}
            $scope.view.loading = true;
            supService.supplierList($scope).then(
                function(data) {
                    if (data.status == '200') {
                        var res = data;
                        $scope.supplierList = res.items;
                        $scope.queryResult.Items = $scope.supplierList;
                        $scope.queryResult.PageSize = res.paginate.pageSize;
                        $scope.queryResult.PageAmount = res.paginate.pagesCount;
                        $scope.queryResult.TotalCount = res.paginate.totalItemsCount;
                        $scope.queryResult.PageIndex = res.paginate.pageNumber;
                        $scope.GoToPage = res.paginate.pageNumber;
                        //toaster.pop('success',"加载列表成功");
                    } else {
                        toaster.pop('error', '加载产品库列表失败，原因：' + data.msg);
                    }
                    $scope.view.loading = false;
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    console.error('Error while search productWarehouse.');
                }
            );
        };

        /**
         * page changed
         */
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        $scope.reset = function() {
            $scope.condition.companyName = "";
            $scope.condition.email = "";
            $scope.condition.pageNo = 1;
        };

        //yucheng.sun, init the page.
        $scope.page(1);
        $scope.loading = false;

        //link to detail page
        $scope.gotoPage = function(pageState, supplierId) {
            if (pageState) {
                $state.go(pageState, {
                    id: supplierId
                });
            };
        }

    }];
});
