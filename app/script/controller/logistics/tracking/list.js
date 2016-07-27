define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'toaster', 'LogisticsService', function($rootScope, $scope, $state, $stateParams, $modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.tracking.list',
            title: '运单跟踪列表'
        });

        
        $scope.isSaving = false;
        $scope.vendorList={};
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
            waybillNo:'',
            trackNo:'',
            vendorCode:'',
            transportMode:'',
            blNo:'',
            bookingDateFrom:'',
            bookingDateTo:'',
            intendedVFNo:'',
            containerNo:'',
            originCity:'',
            destCity:'',
            completeStatus:'0',
            sorting:'trackno',
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
            $scope.searchWBTracking();
        };

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.waybillNo = '';
            $scope.condition.trackNo = '';
            $scope.condition.vendorCode='';
            $scope.condition.transportMode='';
            $scope.condition.blNo = '';
            $scope.condition.bookingDateFrom = '';
            $scope.condition.bookingDateTo='';
            $scope.condition.intendedVFNo='';
            $scope.condition.containerNo='';
            $scope.condition.destCity='';
            $scope.condition.completeStatus='0';
        };
        $scope.doSort = function(sortType, field) {
            $scope.condition.sorting = field + "  " + sortType;
            $scope.searchWBTracking();
        };
        

        
        var self = this;
        $scope.searchWBTracking = function() {
            $scope.loading = true;
            $scope.searching = false;
            LogisticsService.searchTrackings($scope.condition).then(
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
                        toaster.pop('error', '加载物流运单跟踪列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while searching trackings.');
                }
            );
        };

        //加载物流供应商列表
        $scope.loadVendorList=function(){
            LogisticsService.loadVendorList().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.vendorList = data.items;
                    } else if (data.status == '404'){
                        $scope.vendorList = false;
                    } else{
                        toaster.pop('error', '加载物流供应商列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading logistics vendor information.');
                }
            );
        };

        // 进入页面第一次查询
        $scope.searchWBTracking();
        $scope.loadVendorList();
        


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

        //跳转到运单订舱列表浏览页面
        $scope.editTracking=function(trackDetailId){
            $state.go('logistics.tracking.edit',{
                trackDetailId:trackDetailId,
                condition:$scope.condition
            });
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
    }];
});