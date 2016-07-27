define(['common/session', 'service/config'], function(session, config) {
    return ['$scope', '$modalInstance', '$timeout', 'pageData', function($scope, $modalInstance, $timeout, pageData) {

        $scope.pageVM = {
            processing: false,
            title: pageData.title,
            data: pageData.data,
            statusList: pageData.statusList,
            pageTypeList: [
            	{text:'首页', value:0},
            	{text:'品类', value:1},
            	{text:'专题页', value:2}
            ]
        };
		
		var getCategoryCodeList = function(){
			$scope.getCategoryCodeListError = false;
			$scope.pageVM.tagListLoading = true;
			pageData.categoryCodeList().then(function(result){
				$scope.pageVM.categoryCodeList = result.items;
				//如果是品类页，需要获取对应品类
				if(pageData.data.type == 1){
					getPageById();
				}
				$scope.pageVM.tagListLoading = false;
			}, function(errCode){
				$scope.getCategoryCodeListError = true;
				$scope.pageVM.tagListLoading = false;
				console.log('Error while get categoryCodes.');
			});
		}
		getCategoryCodeList();
		
		var getPageById = function(){
			pageData.getPageById(pageData.data.id).then(function(resp){
				if(resp.status == '200'){
					$scope.pageVM.tagListLoading = false;
					$scope.pageVM.data = resp.items;
				}
			}, function(err){
				console.log('Get page information error.');
			});
		}
		
		$scope.validName = function(name){
			$scope.nameInValid = false;
			if(name == pageData.tmpName){
				return;
			}
			pageData.validName(name).then(function(result){
				if(result.status == '200' && result.items == true){
					$scope.nameInValid = true;
				}
			}, function(errCode){
				console.log('Error while valid name.' + errCode);
			})
		}

        $scope.ok = function() {
            $scope.pageVM.processing = true;
            $timeout(function() {
                $scope.pageVM.processing = false;
                $modalInstance.close($scope.pageVM.data);
            }, 500);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }];
});
