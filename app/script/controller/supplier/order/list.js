//供应商列表控制器
//exiaoMgrApp.controller('SupplierOrderListCtrl', ['$scope', '$http','$routeParams', function ($scope, $http,$routeParams) {
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','$stateParams', 'toaster', 'supService', 'metaService',
        function($rootScope, $scope, $state, $stateParams, toaster, supService, metaService) {

            ph.mark($rootScope, {
                state: 'supplier.order.list',
                title: '列表'
            });

            $scope.supplier = {
                id: $stateParams.id
            };
            $scope.view={};
            //数据查询中
            $scope.searching = false;
            //order status
            metaService.getMeta('DDZT', function(list) {
                $scope.orderStatus = list;
            });

            $scope.defualResult = {
                PageIndex: 1,
                PageSize: 10,
                PageAmount: 0,
                TotalCount: 0,
                Items: []
            };

            $scope.queryResult = $scope.defualResult;
            $scope.condition = {
                orderStatus: '',
                PageInfo: {
                    PageIndex: $scope.queryResult.PageIndex,
                    PageSize: $scope.queryResult.PageSize
                }
            };

            //跳转到第n页
            $scope.GoToPage = $scope.queryResult.PageIndex;

            var search = function() {
                $scope.view.loading = true;

                var critera = "";
                if ($scope.condition.orderStatus != null && $scope.condition.orderStatus.length > 0) {
                    critera = '&orderStatus=' + $scope.condition.orderStatus;
                };

                //自定义每页条数
                $scope.condition.PageInfo.PageSize = $scope.queryResult.PageSize;

                supService.getPoList($scope.condition, $scope.supplier.id, critera).then(
                    function(data) {
                        if (data && data.status == 200) {
                            $scope.queryResult.Items = data.items;
                            $scope.queryResult.PageSize = data.paginate.pageSize;
                            $scope.queryResult.PageAmount = data.paginate.pagesCount;
                            $scope.queryResult.TotalCount = data.paginate.totalItemsCount;
                            $scope.queryResult.PageIndex = data.paginate.pageNumber;
                            $scope.GoToPage = data.paginate.pageNumber;

                        } else {
                            toaster.pop('error', '加载失败，原因：' + data.msg);

                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        toaster.pop('error', '加载产品品类列表失败，原因：' + data.msg);
                        $scope.view.loading = false;
                    }
                );

            };
            //进入页面第一次查询
            search();

            //翻页
            $scope.page = function(index) {
                $scope.condition.PageInfo.PageIndex = index || 1;
                search();
            };
            /**
             * page changed
             */
            $scope.pageChanged = function() {
                $scope.page($scope.queryResult.PageIndex);
            };

            //重置查询条件
            $scope.reset = function() {
                $scope.condition.orderStatus = '';
            };

            //link to detail page
            $scope.gotoPage = function(pageState, supplierId) {
                if (pageState) {
                    $state.go(pageState, {
                        id: supplierId
                    });
                };
            }

        }
    ];
});
