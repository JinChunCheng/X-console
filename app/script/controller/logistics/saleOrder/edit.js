define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'LogisticsService', 'toaster','$modal', function($rootScope, $scope, $state, $stateParams, LogisticsService, toaster,$modal) {
         ph.mark($rootScope, {
            state: 'logistics.saleOrder.view',
            title: '销售订单详情'
        });

        $scope.isSaving = false;
        $scope.isConfirming=false;

        $scope.isConfirm=false;

         // 用于判断PO详情页面是否加载过数据
        $scope.poDetailPage = false;
        //用于判断用户日志页面是否加载过
        $scope.opateLogPage=false;

        $scope.orderId=$stateParams.orderId;


        $scope.saleOrder={};
         //默认分页配置
        $scope.sodQueryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };

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
        	$state.go('logistics.saleOrder.list', {
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
                        if ($scope.saleOrder.orderStatus>=1) {
                        	$scope.isConfirm=true;
                        };
                    } else {
                        toaster.pop('error', '加载订单信息失败，原因：'+ data.msg);
                        $scope.soLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
                    $scope.soLoading = false;
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
                        toaster.pop('error',  '加载订单明细失败，原因：'+data.msg);
                        $scope.sodLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loadSaleOrderInfo.');
                    $scope.sodLoading = true;
                }
            );
    	};
    	$scope.loadSaleOrderInfo();
    	$scope.loadSaleOrderDetail();

    	// 修改销售单据信息
    	$scope.updateSaleOrder=function(){
    		$scope.isSaving = true;
    		$scope.saleOrder.orderId=$scope.orderId;
    		LogisticsService.editSaleOrdersInfo($scope.saleOrder).then(
    			function(data){
    				if (data.status=='200') {
    					 toaster.pop('success', '修改成功！');
    					 $scope.isSaving = false;
    					 $scope.back();
    				}else{
    					toaster.pop('error', '修改失败，原因：' + data.msg);
    					$scope.isSaving = false;
    				}
    				
    			},
    			function(errResponse){
    				 console.error('Error while update saleOrder.');
                    $scope.isSaving = true;
    			}
    		);

    	};

    	//确认销售订单
    	$scope.comfirmSaleOrder=function(){
    		$scope.isConfirming = true;
    		$scope.saleOrder.orderId=$scope.orderId;
    		$scope.saleOrder.orderStatus='1';
    		LogisticsService.comfirmSaleOrders($scope.saleOrder).then(
    			function(data){
    				if (data.status=='200') {
    					 toaster.pop('success', '确认成功');
    					 $scope.isConfirming = false;
    					 $scope.back();
    				}else{
    					toaster.pop('error', '确认失败，原因：' + data.msg);
    					$scope.isConfirming = false;
    				}
    				
    			},
    			function(errResponse){
    				 console.error('Error while update saleOrder.');
                    $scope.isConfirming = true;
    			}
    		);

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

        //加载订单明细
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

       //用户操作日志  Begin
        // 分页的配置
        $scope.logQueryResult = {
        			PageIndex: 1,
                    PageSize: 10,
                    PageAmount: 0,
                    TotalCount: 0,
                    Items: []};

         //分页的查询条件
        $scope.logCondition = {
            orderId:$stateParams.orderId,
            pageNo: $scope.logQueryResult.PageIndex,
            pageSize: $scope.logQueryResult.PageSize,
            PageIndex: $scope.logQueryResult.PageIndex,
            PageSize: $scope.logQueryResult.PageSize,
            PageAmount: $scope.logQueryResult.PageAmount,
            TotalCount: $scope.logQueryResult.TotalCount
        };

        //分页查询
        $scope.logPageChanged = function() {
            $scope.logPage($scope.logQueryResult.PageIndex);
        };

         //翻页
        $scope.logPage = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.logCondition.pageNo = index || 1;
            $scope.loadOperateLogInfo();
        };

        //加载用户日志
    	$scope.loadOperateLogInfo=function(){
			$scope.logLoading = true;
    		LogisticsService.loadOperateLogDetail($scope.logCondition).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                    	$scope.logLoading = false;
                        $scope.logQueryResult.Items = data.items;
                        $scope.logQueryResult.PageSize = data.paginate.pageSize;
                        $scope.logQueryResult.PageAmount = data.paginate.pagesCount;
                        $scope.logQueryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.logQueryResult.PageIndex = data.paginate.pageNumber;
                        $scope.logQueryResult.pageNo = data.paginate.pageNumber;
                        //$scope.GoToPage = data.paginate.pageNumber;
                        
                    } else if (data.status == '404'){
                    	$scope.logLoading = false;

                    } else{
                        toaster.pop('error', '加载用户日志信息失败，原因：' + data.msg);
                        $scope.logLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
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
        // 用户操作日志  End

        $scope.openPoDetailDate=function(poDetail){

            $modal.open({
                templateUrl: 'view/logistics/saleOrder/poDetailDate.html',
                size: 'md',
                controller: function($scope, $modalInstance) {
                    $scope.poDetailtitle =  '编辑采购单明细日期';
                    var refreshFlag=false;

                    $scope.poDetailInfo={
                        actualPreparedDate:'',
                        actualQaDate:'',
                        actualPickUpDate:'',
                        poDetailId:''
                    };
                     $scope.poDetailInfo=angular.copy(poDetail);


                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }



                    $scope.ok = function() {
                        if($scope.poDetailInfo.actualPickUpDate!= null && $scope.poDetailInfo.actualPickUpDate!= '')
                        {
                            refreshFlag=true;
                        }
                       if(($scope.poDetailInfo.actualPreparedDate !=null && $scope.poDetailInfo.actualPreparedDate !='' )
                          || ($scope.poDetailInfo.actualQaDate !=null && $scope.poDetailInfo.actualQaDate!= '')
                          || ($scope.poDetailInfo.actualPickUpDate !=null && $scope.poDetailInfo.actualPickUpDate!= '')){
                            updatePoDetailDates($scope,$modalInstance,$scope.poDetailInfo,refreshFlag);
                            $scope.saving=true;

                       }else{
                        toaster.pop('error','请填写上日期信息');
                       }
                       
                        return true;
                    }

                    //实际准备日期控件打开
                     $scope.openApDate = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openAp = true;
                    }

                     //实际质检日期控件打开
                    $scope.openAqDate = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openAq = true;
                    }
                    //实际发货日期控件打开
                    $scope.openApuDate = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openApu = true;
                    }
                }
            });
        };


        var updatePoDetailDates=function(scope,modalInstance,poDetailInfo,refreshFlag){
            LogisticsService.updatePoDetailDates(poDetailInfo).then(
            function(data){
                if (data.status == 200) {
                    toaster.pop('success', '成功保存！')
                    scope.saving=false;
                    modalInstance.dismiss();
                    $scope.loadPurchaseOrderDetail();
                    if(refreshFlag){
                        $scope.loadSaleOrderDetail();
                    }
                } else {
                    if (data.status == 125308) {
                         toaster.pop('error', '操作错误')
                         scope.saving=false;
                         modalInstance.dismiss();
                    } else {
                        toaster.pop('error','保存失败，原因'+data.msg)
                        scope.saving=false;
                        modalInstance.dismiss();
                    }
                }
            }, function(err) {
                toaster.pop('error', '服务器请求异常！')
                scope.saving=false;
                modalInstance.dismiss();
            });
        };

    }];
});
