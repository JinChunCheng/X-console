define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
	return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modalInstance', 'toaster', 'terminalData', 'terminalService', function($rootScope, $scope, $state, $stateParams, $timeout, $modalInstance, toaster, terminalData, terminalService) {
		
		//弹框忽略面包屑的修改
		$scope.terminalVM = {
			processing: false,
			title: terminalData.title,
			data: terminalData.data,
			isModify: terminalData.isModify,
			channelList: [{
				value: 1,
				text: 'goexw'
			}, {
				value: 2,
				text: 'exiao'
			}]
		};
		
		$scope.validName = function(name){
			$scope.nameInValid = false;
			if(name == terminalData.tmpName){
				return;
			}
			terminalService.validName(name).then(function(result){
				if(result.status == '200' && result.items == true){
					$scope.nameInValid = true;
				}
			}, function(errCode){
				console.log('Error while valid name.' + errCode);
			})
		}

		$scope.ok = function(valid) {
			if(!valid) return;
			$scope.terminalVM.data.createUser = $scope.curUser.id;
			if($scope.terminalVM.isModify){
				//修改
				terminalService.modifyTerminal($scope.terminalVM.data).then(function(result){
					if(result.status == '200'){
						$modalInstance.close($scope.terminalVM.data);
					}else{
						toaster.pop('error', '修改终端失败，请联系管理员!');
						console.log('Error while add terminal, response code is : ' + result.status + ' and response msg is: ' + result.msg);	
					}
				}, function(errCode){
					toaster.pop('error', '修改终端失败，请重试！');
					console.log('Error while modify terminal.');
				});
			}else{
				//新增
				terminalService.addTerminal($scope.terminalVM.data).then(function(result){
					if(result.status == '200'){
						$modalInstance.close($scope.terminalVM.data);
					}else{
						toaster.pop('error', '添加终端失败，请联系管理员!');
						console.log('Error while add terminal, response code is : ' + result.status + ' and response msg is: ' + result.msg);
					}
				}, function(errCode){
					toaster.pop('error', '添加终端失败，请重试!');
					console.log('Error while add terminal.');
				})
			}			
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}];
});