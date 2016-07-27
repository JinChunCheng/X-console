define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'toaster', 'LogisticsService', function($rootScope, $scope, $state, $stateParams, $modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.vendor.list',
            title: '物流供应商列表'
        });

        
        $scope.isSaving = false;
        
        //默认分页配置
        $scope.defualResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        $scope.isAdd = true;
        
        var self = this;
        $scope.queryResult = $scope.defualResult;
        $scope.loading = false;

        $scope.condition = {
            vendorCode:'',
            vendorName:'',
            vendorAddr:'',
            sorting:'vendorcode',
            pageNo: $scope.queryResult.PageIndex,
            pageSize: $scope.queryResult.PageSize,
            PageIndex: $scope.queryResult.PageIndex,
            PageSize: $scope.queryResult.PageSize,
            PageAmount: $scope.queryResult.PageAmount,
            TotalCount: $scope.queryResult.TotalCount,
            Items: []
        };

        
       // 跳转到第n页
        $scope.GoToPage = $scope.queryResult.PageIndex;
        
        if ($stateParams.condition) {
            $scope.condition=$stateParams.condition;
        };
        
        //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.condition.pageNo = index || 1;
            $scope.searchVendorList();
        };

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.vendorCode='';
            $scope.condition.vendorName='';
            $scope.condition.vendorAddr = '';
        };
        $scope.doSort = function(sortType, field) {
            $scope.condition.sorting = field + "  " + sortType;
            $scope.searchVendorList();
        };
        

        
        var self = this;
        $scope.searchVendorList = function() {
            $scope.loading = true;
            $scope.searching = false;
            LogisticsService.searchVendorList($scope.condition).then(
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
                        toaster.pop('error', '加载物流供应商列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while searching logistics vendor list.');
                }
            );
        };

        // 进入页面第一次查询
        $scope.searchVendorList();        


        //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        //
        $scope.openBegin = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };

        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openE = true;
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

        //编辑时跳转到编辑页面
        $scope.editVendor=function(vendorId){
            $state.go('logistics.vendor.edit',{
                vendorId:vendorId,
                condition:$scope.condition,
                isAdd:false
            });
        };

        //新增时跳转到编辑页面
        $scope.addVendor=function(){
            $state.go('logistics.vendor.add',{
                condition:$scope.condition,
                isAdd:true
            });
        };

        //删除一个供应商
        $scope.deleteVendor= function(item) {
            var modalInstance = $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance) {
                    $scope.confirmData = {
                        text: '确定删除供应商 [' + item.vendorCode + ']？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        removeVendor(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        /**
         * 移除物流供应商
         */
        var removeVendor = function(id, confirmScope, $modalInstance) {
            LogisticsService.deleteVendor(id).then(
                function(data) {
                    
                    confirmScope.confirmData.processing = false;
                    toaster.pop('success', '删除成功！');
                    $modalInstance.dismiss();
                    $scope.searchVendorList();                    
                },
                function(errResponse) {
                    confirmScope.confirmData.processing = false;
                    toaster.pop('error', '删除失败！');
                    console.error('Error while removing vendor.');
                }
            );
        };

    }];
});