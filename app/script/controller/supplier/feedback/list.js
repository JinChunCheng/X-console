//yucheng, added, for supplier feedback page
//exiaoMgrApp.controller("supplierFeedbackList",['$scope','$http', '$routeParams','$location',
//    function($scope, $http, $routeParams, $location){
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'supService', 'metaService', function($rootScope, $scope, $state, toaster, supService, metaService) {
        ph.mark($rootScope, {
            state: 'supplier.feedback.list',
            title: '反馈列表'
        });

        $scope.condition = {
            pageSize: 10,
            pageNo: 1,
            title: "",
            supplierName: "",
            type: ""
        };
        $scope.queryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        //feedback type
        metaService.getMeta('FBTYPE', function(list) {
            $scope.feedbackType = list;
        });
        $scope.selectedType = '';
        $scope.view = {
            loading: false
        };

        $scope.page = function(pageNum) {
            $scope.view.loading = true;
            $scope.condition.pageNo = pageNum;
            if ($scope.condition.type == null || $scope.condition.type == '' || $scope.condition.type == '全部') {
                $scope.condition.type = '';
            };
            if ($scope.queryResult.PageSize > 0) {
                $scope.condition.pageSize = $scope.queryResult.PageSize > 100 ? 100 : $scope.queryResult.PageSize;
            };
            //URI: {baseUri}/supplier/ getSupplierDetails /{supplierId}
            supService.feedbackList($scope.condition).then(
                function(res) {
                    if (res && res.status == 200) {
                        $scope.queryResult.Items = res.items;
                        $scope.queryResult.PageSize = res.paginate.pageSize;
                        $scope.queryResult.PageAmount = res.paginate.pagesCount;
                        $scope.queryResult.TotalCount = res.paginate.totalItemsCount;
                        $scope.queryResult.PageIndex = res.paginate.pageNumber;
                        //toaster.pop('success',"加载列表成功");
                    } else {
                        toaster.pop('error', res ? ('status ' + res.status + ', msg: ' + res.msg) : 'get product count error !');
                    }
                    $scope.view.productQuantityLoading = false;
                    $scope.view.loading = false;
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    toaster.pop('error', "加载菜单列表失败 " + errResponse.message);
                    $scope.view.productQuantityLoading = false;
                }
            );
        };
        $scope.page(1);

        /**
         * page changed
         */
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        $scope.reset = function() {
            $scope.condition = {
                pageSize: 10,
                pageNo: 1,
                title: '',
                supplierName: '',
                type: ''
            };
        };

        $scope.gotoPage = function(root, feedbackId) {
            $state.go(root, {
                id: feedbackId
            });
        };

        //yucheng.sun, init the page.
        $scope.loading = false;
    }];
});
