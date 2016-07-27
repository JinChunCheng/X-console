define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'LogisticsService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, LogisticsService, toaster) {
         ph.mark($rootScope, {
            state: 'logistics.waybill.view',
            title: '运单订舱列表'
        });

        $scope.isSaving = false;
        $scope.isConfirming=false;

        $scope.isConfirm=false;

        // 用于判断SO详情页面是否加载过数据
        $scope.soDetailPage = false;
         // 用于判断PO详情页面是否加载过数据
        $scope.poDetailPage = false;
        //用于判断用户日志页面是否加载过
        $scope.opateLogPage=false;

        $scope.orderId=$stateParams.orderId;
        $scope.trackId=$stateParams.trackId;

        $scope.saleOrder={};
         //默认分页配置
        $scope.sodQueryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };

        //子订舱列表 Begin
        //子订舱列表结果
        $scope.subWBQueryResult = {
            Items: []
        };

         //子订舱列表的查询条件
        $scope.subWBCondition = {
            orderId:$stateParams.orderId,
            trackId:$stateParams.trackId
        };

        //加载子订舱列表
        $scope.loadSubWBList=function(){
            $scope.swbLoading = true;
            //alert('$stateParams.trackId=' + $stateParams.trackId);
            LogisticsService.getSubWaybillList($stateParams.trackId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.swbLoading = false;
                        $scope.subWBQueryResult.Items = data.items;                        
                    } else if (data.status == '404'){
                        $scope.swbLoading = false;
                        $scope.subWBQueryResult.Items = '';
                    } else{
                        toaster.pop('error', '加载子订舱列表失败，原因：' + data.msg);
                        $scope.swbLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading subwaybill list.');
                    $scope.swbLoading = true;
                }
            );
        };

        //第一次进行自动加载
        $scope.loadSubWBList();

        //子订舱列表 End

        //SO订单详细  Begin
        // 分页的配置
        // $scope.sodQueryResult = $scope.defualResult;
         $scope.sodQueryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };

         //分页的查询条件
        $scope.sodCondition = {
            orderId:$stateParams.orderId,
            pageNo: $scope.sodQueryResult.PageIndex,
            pageSize: $scope.sodQueryResult.PageSize,
            PageIndex: $scope.sodQueryResult.PageIndex,
            PageSize: $scope.sodQueryResult.PageSize,
            PageAmount: $scope.sodQueryResult.PageAmount,
            TotalCount: $scope.sodQueryResult.TotalCount
        };

        //分页查询
        $scope.sodPageChanged = function() {
            $scope.page($scope.sodQueryResult.PageIndex);
        };

         //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.sodCondition.pageNo = index || 1;
            $scope.loadSaleOrderDetail();
        };
        //  End


        $scope.back=function(){
        	$state.go('logistics.waybill.list', {
                condition: $stateParams.condition
            });
        };

        //加载销售单信息
       $scope.loadSaleOrderInfo=function(){
       		$scope.soLoading = true;
       		LogisticsService.loadSaleOrderInfo($stateParams.orderId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.saleOrder = data.items;
                        $scope.soLoading = false;
                        if ($scope.saleOrder.orderStatus==1) {
                        	$scope.isConfirm=true;
                        };
                    } else {
                        toaster.pop('error', '加载产品库信息失败，原因：' + data.msg);
                        $scope.soLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
                    $scope.soLoading = true;
                }
            );
       };


    	//加载订单明细
    	$scope.loadSaleOrderDetail=function(){
			$scope.sodLoading = true;
    		LogisticsService.loadSaleOrderInfoDeatil($scope.sodCondition).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                    	$scope.sodLoading = false;
                        $scope.sodQueryResult.Items = data.items;
                        $scope.sodQueryResult.PageSize = data.paginate.pageSize;
                        $scope.sodQueryResult.PageAmount = data.paginate.pagesCount;
                        $scope.sodQueryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.sodQueryResult.PageIndex = data.paginate.pageNumber;
                        $scope.sodQueryResult.pageNo = data.paginate.pageNumber;
                        $scope.GoToPage = data.paginate.pageNumber;
                        
                    } else if (data.status == '404'){
                    	$scope.sodLoading = false;

                    } else{
                        toaster.pop('error', '加载销售订单详细息失败，原因：' + data.msg);
                        $scope.sodLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loadSaleOrderInfo.');
                    $scope.sodLoading = true;
                }
            );
    	};
    	
        //$scope.loadSaleOrderInfo();
    	//$scope.loadSaleOrderDetail();
        $scope.loadSOInfo=function(){
            if ($scope.soDetailPage==false) {
                $scope.loadSaleOrderInfo();
                $scope.loadSaleOrderDetail();
                $scope.soDetailPage=true;
            };
       };

    	// SO订单详细 End

    	//PO订单详细  Begin
        // 分页的配置不能调用公用的部分，不然前者会被后者覆盖
        //$scope.poQueryResult = $scope.defualResult;

         $scope.poQueryResult = {
         	PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []};

         //分页的查询条件
        $scope.poCondition = {
            orderId:$stateParams.orderId,
            pageNo: $scope.poQueryResult.PageIndex,
            pageSize: $scope.poQueryResult.PageSize,
            PageIndex: $scope.poQueryResult.PageIndex,
            PageSize: $scope.poQueryResult.PageSize,
            PageAmount: $scope.poQueryResult.PageAmount,
            TotalCount: $scope.poQueryResult.TotalCount
        };

        //分页查询
        $scope.poPageChanged = function() {
            $scope.poPage($scope.poQueryResult.PageIndex);
        };

         //翻页
        $scope.poPage = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.poCondition.pageNo = index || 1;
            $scope.loadPurchaseOrderInfo();
        };

        //加载采购单明细
    	$scope.loadPurchaseOrderInfo=function(){
			$scope.poLoading = true;
    		LogisticsService.loadPurchaseOrderInfo($scope.poCondition).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                    	$scope.poLoading = false;
                        $scope.poQueryResult.Items = data.items;
                        $scope.poQueryResult.PageSize = data.paginate.pageSize;
                        $scope.poQueryResult.PageAmount = data.paginate.pagesCount;
                        $scope.poQueryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.poQueryResult.PageIndex = data.paginate.pageNumber;
                        $scope.poQueryResult.pageNo = data.paginate.pageNumber;
                        //$scope.GoToPage = data.paginate.pageNumber;
                        
                    } else if (data.status == '404'){
                    	$scope.poLoading = false;

                    } else{
                        toaster.pop('error', '加载采购订单信息失败，原因：' + data.msg);
                        $scope.poLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
                    $scope.poLoading = true;
                }
            );
    	};
        //PO订单详细  End

        //POD订单详细  Begin
        // 分页的配置
        $scope.podQueryResult = {
        			PageIndex: 1,
                    PageSize: 10,
                    PageAmount: 0,
                    TotalCount: 0,
                    Items: []};

         //分页的查询条件
        $scope.podCondition = {
            orderId:$stateParams.orderId,
            pageNo: $scope.podQueryResult.PageIndex,
            pageSize: $scope.podQueryResult.PageSize,
            PageIndex: $scope.podQueryResult.PageIndex,
            PageSize: $scope.podQueryResult.PageSize,
            PageAmount: $scope.podQueryResult.PageAmount,
            TotalCount: $scope.podQueryResult.TotalCount
        };

        //分页查询
        $scope.podPageChanged = function() {
            $scope.podPage($scope.podQueryResult.PageIndex);
        };

         //翻页
        $scope.podPage = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.podCondition.pageNo = index || 1;
            $scope.loadPurchaseOrderDetail();
        };

        //加载订单明细
    	$scope.loadPurchaseOrderDetail=function(){
			$scope.podLoading = true;
    		LogisticsService.loadPurchaseOrderDetail($scope.podCondition).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                    	$scope.podLoading = false;
                        $scope.podQueryResult.Items = data.items;
                        $scope.podQueryResult.PageSize = data.paginate.pageSize;
                        $scope.podQueryResult.PageAmount = data.paginate.pagesCount;
                        $scope.podQueryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.podQueryResult.PageIndex = data.paginate.pageNumber;
                        $scope.podQueryResult.pageNo = data.paginate.pageNumber;
                        //$scope.GoToPage = data.paginate.pageNumber;
                        
                    } else if (data.status == '404'){
                    	$scope.podLoading = false;

                    } else{
                        toaster.pop('error', '加载采购订单信息失败，原因：' + data.msg);
                        $scope.podLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
                    $scope.podLoading = true;
                }
            );
    	};
        // POD订单详细  End
       
       $scope.loadPoInfo=function(){
       		if ($scope.poDetailPage==false) {
       			$scope.loadPurchaseOrderInfo();
       			$scope.loadPurchaseOrderDetail();
       			$scope.poDetailPage=true;
       		};
       };

       //用户运单操作日志  Begin
        // 分页的配置
        $scope.logQueryResult = {
        			PageIndex: 1,
                    PageSize: 10,
                    PageAmount: 0,
                    TotalCount: 0,
                    Items: []};

        //加载用户操作日志
    	$scope.loadOperateLogInfo=function(){
			$scope.logLoading = true;
    		LogisticsService.loadWaybillLogs($stateParams.trackId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                    	$scope.logLoading = false;
                        $scope.logQueryResult.Items = data.items;
                        //$scope.GoToPage = data.paginate.pageNumber;
                        
                    } else if (data.status == '404'){
                    	$scope.logLoading = false;

                    } else{
                        toaster.pop('error', '加载用户操作日志信息失败，原因：' + data.msg);
                        $scope.logLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading the waybill operation logs.');
                    $scope.logLoading = true;
                }
            );
    	};

    	$scope.loadOpergteLogPage=function(){
    		if($scope.opateLogPage==false){
    			$scope.loadOperateLogInfo();
    			$scope.opateLogPage=true;
    		}
    	};
        // 用户运单操作日志  End

        //跳转到订舱编辑页面
        $scope.editSubWaybill=function(trackDetailId){
            $state.go('logistics.waybill.edit',{
                trackDetailId:trackDetailId,
                orderId:$stateParams.orderId,
                trackId:$stateParams.trackId,
                condition:$stateParams.condition
            });
        };
        
        //删除一个订舱单
        $scope.removeSubWaybill = function(item) {
            //alert("trackDetailId=" + item.trackDetailId);
            var modalInstance = $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance) {
                    $scope.confirmData = {
                        text: '确定删除 [' + item.vendorCode + ' 订舱单 - ' + item.waybillNo + ']？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        removeSubWaybill(item.trackDetailId, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        /**
         * 移除子运单(单条)
         * @param trackDetailId
         */
        var removeSubWaybill = function(trackDetailId, confirmScope, $modalInstance) {
            LogisticsService.removeSubWaybill(trackDetailId).then(
                function(data) {
                    
                    confirmScope.confirmData.processing = false;
                    toaster.pop('success', '删除成功！');
                    $modalInstance.dismiss();
                    $scope.loadSubWBList();
                    
                },
                function(errResponse) {
                    confirmScope.confirmData.processing = false;
                    toaster.pop('error', '删除失败！');
                    console.error('Error while removing Sub-waybill.');
                }
            );
        };

        //跳转到新增订舱页面
        $scope.addSubWaybill=function(){
            $state.go('logistics.waybill.add',{
                orderId:$stateParams.orderId,
                trackId:$stateParams.trackId,
                trackDetailId:0,
                condition:$stateParams.condition
            });
        };

        //跳转到新增分段页面
        $scope.addSubsection=function(trackDetailId){
            $state.go('logistics.waybill.add',{
                orderId:$stateParams.orderId,
                trackId:$stateParams.trackId,
                trackDetailId:trackDetailId,
                condition:$stateParams.condition
            });
        };

    }];
});
