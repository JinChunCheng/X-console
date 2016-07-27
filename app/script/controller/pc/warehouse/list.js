define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$modal', 'toaster', 'PcService', function($rootScope, $scope, $state, $modal, toaster, PcService) {

        ph.mark($rootScope, {
            state: 'pc.warehouse.list',
            title: '产品库管理'
        });

        $scope.isSaving = false;
        $scope.defualResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        $scope.isAdd = true;
        //added by eric.gao
        var self = this;
        $scope.queryResult = $scope.defualResult;
        $scope.loading = false;
        $scope.warehouse = {};

        $scope.condition = {
            name: '',
            code: '',
            id: '',
            des: '',
            isValid: '',
            tradeMode: '',
            sorting: 'update_time desc',
            pageNo: $scope.queryResult.PageIndex,
            pageSize: $scope.queryResult.PageSize,
            PageIndex: $scope.queryResult.PageIndex,
            PageSize: $scope.queryResult.PageSize,
            PageAmount: $scope.queryResult.PageAmount,
            TotalCount: $scope.queryResult.TotalCount,
            Items: []
        };
        //跳转到第n页
        $scope.GoToPage = $scope.queryResult.PageIndex;

        //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.condition.pageNo = index || 1;
            $scope.searchProductWarehouse();
        };
        //重置查询条件
        $scope.reset = function() {
            $scope.condition.name = '';
            $scope.condition.code = '';
            $scope.condition.des = '';
            $scope.condition.isValid = '';
        };
        $scope.doSort = function(sortType, field) {
            $scope.condition.sorting = field + "  " + sortType;
            $scope.searchProductWarehouse();
        };
        var self = this;
        $scope.searchProductWarehouse = function() {
            $scope.loading = true;
            $scope.searching = false;
            PcService.searchProductWarehouse($scope.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.loading = false;
                        $scope.queryResult.Items = data.items;
                        $scope.queryResult.PageSize = data.paginate.pageSize;
                        $scope.queryResult.PageAmount = data.paginate.pagesCount;
                        $scope.queryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.queryResult.PageIndex = data.paginate.pageNumber;
                        $scope.queryResult.pageNo = data.paginate.pageNumber;
                        $scope.GoToPage = data.paginate.pageNumber;
                        $scope.searching = false;
                    } else {
                        toaster.pop('error', '加载产品库列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while search productWarehouse.');
                }
            );
        };
        //进入页面第一次查询
        $scope.searchProductWarehouse();

        //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };
        /**
         * reSort search list
         * @param  {string} field database field name
         */
        $scope.reSort = function(field) {
            if ($scope.loading)
                return false;
            var sortingArr = $scope.condition.sorting.split(' ');
            var preField = sortingArr[0];
            var preOrderMode = sortingArr[1];

            var newOrderMode = 'desc';
            if (field == preField) {
                newOrderMode = (preOrderMode == 'asc' ? 'desc' : 'asc');
            }

            $scope.condition.sorting = field + ' ' + newOrderMode;
            $scope.page(1);
        };
        $scope.sortClass = function(field) {
            if ($scope.condition.sorting) {
                var sortArr = $scope.condition.sorting.split(' ');
                if (field == sortArr[0]) {
                    var cls = 'text-success ';
                    switch (sortArr[1]) {
                        case 'asc':
                            cls += 'fa-caret-up';
                            break;
                        case 'desc':
                        default:
                            cls += 'fa-caret-down';
                            break;
                    }
                    return cls;
                }
            }
            return 'fa-unsorted';
        };
        $scope.delWarehouse = function(item) {
            var listScope = $scope;
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance) {
                    $scope.confirmData = {
                        text: '确定删除[' + item.name + ']？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        PcService.deleteWarehouse(item.code).then(
                            function(data) {
                                if (data.status == '200') {
                                    $modalInstance.dismiss();
                                    listScope.pageChanged();
                                } else {
                                    toaster.pop('success', '删除失败，原因：' + data.msg);
                                }
                                $scope.confirmData.processing = false;
                            },
                            function(errResponse) {
                                console.error('Error while creatting attribute.');
                                $scope.confirmData.processing = false;
                            }
                        );
                        return true;
                    }
                }
            });
        };
    }];
});
