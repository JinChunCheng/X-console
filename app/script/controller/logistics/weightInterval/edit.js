define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'LogisticsService', 'toaster','$modal', function($rootScope, $scope, $state, $stateParams, LogisticsService, toaster,$modal) {
         ph.mark($rootScope, {
            state: 'logistics.weightInterval.edit',
            title: '物流费率区间信息'
        });
        //判断是否新增
        $scope.isAdd=$stateParams.isAdd;

        $scope.isSaving = false;
        $scope.wgtIntervalId=$stateParams.wgtIntervalId;

        $scope.weightIntervalInfo={};

         //供应商信息
        $scope.vendorCode={
            Items:[]
        }


        $scope.back=function(){
        	$state.go('logistics.weightInterval.list', {
                condition: $stateParams.condition
            });
        };

       
        //加载销售单信息
       $scope.loadWeightIntervalInfo=function(){
       		LogisticsService.loadWeightIntervalInfo($stateParams.wgtIntervalId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.weightIntervalInfo = data.items;
                        $scope.weightIntervalInfo.enabled=$scope.weightIntervalInfo.enabled.toString();
                    } else {
                        toaster.pop('error', '加载物流费率信息失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error logistics vendorCode.');
                }
            );
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
                    console.error('Error while search productWarehouse.');
                }
            );
        };

        $scope.convertToInt = function (id) {
            return parseInt(id);
            };

    	$scope.loadVendorList();
        if(!$scope.isAdd)
        {
            $scope.loadWeightIntervalInfo();
        }

        //保存费率信息
        $scope.saveWeightInterval=function(){
            if($scope.isAdd){
                $scope.addWeightInterval();
            }else{
                $scope.updateWeightInterval();
            }
        }

    	// 修改费率信息
    	$scope.updateWeightInterval=function(){
    		$scope.isSaving = true;
    		$scope.weightIntervalInfo.id=$scope.wgtIntervalId;
    		LogisticsService.updateWeightIntervalInfo($scope.weightIntervalInfo).then(
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
    				 console.error('Error while update weightIntervalInfo.');
                    $scope.isSaving = true;
    			}
    		);
    	};

        //增加费率信息
        $scope.addWeightInterval=function(){
            $scope.isSaving = true;
            LogisticsService.addWeightIntervalInfo($scope.weightIntervalInfo).then(
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
                     console.error('Error while update weightIntervalInfo.');
                    $scope.isSaving = true;
                }
            );
        };

    }];
});
