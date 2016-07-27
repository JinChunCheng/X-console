define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'LogisticsService', 'toaster','$modal', function($rootScope, $scope, $state, $stateParams, LogisticsService, toaster,$modal) {
         ph.mark($rootScope, {
            state: 'logistics.vendor.edit',
            title: '供应商信息'
        });
        //判断是否新增
        $scope.isAdd=$stateParams.isAdd;

        $scope.isSaving = false;
        $scope.vendorId=$stateParams.vendorId;

        $scope.vendorDetail={};

         //供应商信息
        $scope.vendorCode={
            Items:[]
        }


        $scope.back=function(){
        	$state.go('logistics.vendor.list', {
                condition: $stateParams.condition
            });
        };

       
        //加载供应商明细信息
        $scope.loadVendorDetailInfo=function(){
       		LogisticsService.loadVendorDetail($stateParams.vendorId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.vendorDetail = data.items;
                        //$scope.weightIntervalInfo.enabled=$scope.weightIntervalInfo.enabled.toString();
                    } else {
                        toaster.pop('error', '加载物流费率信息失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading logistics vendor detail.');
                }
            );
        };


        $scope.convertToInt = function (id) {
            return parseInt(id);
        };

    	
        if(!$scope.isAdd)
        {
            $scope.loadVendorDetailInfo();
        }
                
        //保存供应商信息
        $scope.saveVendor=function(invalid){
            $scope.submitted = true;
            if(invalid){
                toaster.pop('error', '请填写必填信息!');
                return false;
            }

            if($scope.isAdd){
                $scope.addVendor();
            }else{
                $scope.updateVendor();
            }
        }

    	// 修改费率信息
    	$scope.updateVendor=function(){
    		$scope.isSaving = true;
    		$scope.vendorDetail.id=$scope.vendorId;
    		LogisticsService.updateVendor($scope.vendorDetail).then(
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
    				 console.error('Error while updating vendor.');
                    $scope.isSaving = true;
    			}
    		);
    	};

        //增加费率信息
        $scope.addVendor=function(){
            $scope.isSaving = true;
            LogisticsService.addVendor($scope.vendorDetail).then(
                function(data){
                    if (data.status=='200') {
                         toaster.pop('success', '添加成功！');
                         $scope.isSaving = false;
                         $scope.back();
                    }else{
                        toaster.pop('error', '添加供应商失败，原因：' + data.msg);
                        $scope.isSaving = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while adding vendor.');
                    $scope.isSaving = true;
                }
            );
        };
        

    }];
});
