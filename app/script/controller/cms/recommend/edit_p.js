define(['common/session', 'service/config'], function(session, config) {
    return ['$scope', '$modalInstance', '$timeout', 'itemData','toaster', function($scope, $modalInstance, $timeout, itemData,toaster) {

        $scope.productVM = {
            processing: false,
            title: itemData.title,
            data: itemData.data,
        };

		$scope.parseContent = itemData.parseContent;
		
		$scope.rate = function(price){
			if(price){
				return parseFloat((price)*itemData.rate/100).toFixed(2);
			}
			return price;
		}
		
		$scope.productVM.prefix = config.img_pc_domain,

        // 图片上传
        $scope.fileSuccess = function(file, data, formData) {
        	console.log('上传');
            itemData.uploadFile(formData).then(function(res) {
            	if(res.status == '200'){
            		$scope.productVM.data.imgUrl = res.items;
            	}else{
            		toaster.pop('error', '图片上传失败，请重新选择图片上传！');
            	}
                
            }, function(err) {
                toaster.pop('error', '图片上传失败，请重新选择图片上传！');
            });
        }

        $scope.ok = function() {
            $scope.productVM.processing = true;
            $timeout(function() {
                $scope.productVM.processing = false;
                $modalInstance.close($scope.productVM.data);
            }, 500);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }];
});
