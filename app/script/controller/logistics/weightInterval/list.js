define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','$stateParams', '$modal', 'toaster', 'LogisticsService', function($rootScope, $scope, $state, $stateParams,$modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.saleOrder.list',
            title: '物流费率区间列表'
        });

        $scope.isAdding = false;
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
        $scope.queryResult =angular.copy($scope.defualResult);
        $scope.loading = false;
        //供应商信息
        $scope.vendorCode={
            Items:[]
        }

        $scope.condition = {
            vendorCode:'',
            transportMode:'',
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

        //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.condition.pageNo = index || 1;
            $scope.searchWeightInterval();
        };

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.vendorCode = '';
            $scope.condition.transportMode = '';
        };
        var self = this;

        if ($stateParams.condition) {
            $scope.condition=$stateParams.condition;
        };

        //加载物流供应商信息列表
        $scope.loadVendorList=function(){
            LogisticsService.loadVendorList().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.vendorCode.Items = data.items;
                    } else {
                        toaster.pop('error', '加载物流供应商列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error  logistics vendorCode.');
                }
            );
        }

        $scope.searchWeightInterval = function() {
            $scope.loading = true;
            $scope.searching = false;
            LogisticsService.searchWeightInterval($scope.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.loading = false;
                        if (data.items.length>0) 
                        {
                            $scope.queryResult.Items = data.items;
                            $scope.queryResult.PageSize = data.paginate.pageSize;
                            $scope.queryResult.PageAmount = data.paginate.pagesCount;
                            $scope.queryResult.TotalCount = data.paginate.totalItemsCount;
                            $scope.queryResult.PageIndex = data.paginate.pageNumber;
                            $scope.queryResult.pageNo = data.paginate.pageNumber;
                        }
                        $scope.searching = false;
                    } else {
                        toaster.pop('error', '加载物流费率列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while search productWarehouse.');
                }
            );
        };
        // 进入页面第一次查询
        $scope.loadVendorList();
        $scope.searchWeightInterval();

        //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };


        //跳转到编辑页面
        $scope.editWeightInterval=function(wgtIntervalId){
            $state.go('logistics.weightInterval.edit',{
                wgtIntervalId:wgtIntervalId,
                condition:$scope.condition,
                isAdd:false
            });
        };

        //跳转到编辑页面
        $scope.addWeightInterval=function(wgtIntervalId){
            $state.go('logistics.weightInterval.add',{
                condition:$scope.condition,
                isAdd:true
            });
        };

       
    }];
});
