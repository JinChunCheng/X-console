define([],function() {
	return ['$scope','toaster','$timeout','$state','$filter','$stateParams','marketingService',
		function($scope,toaster,$timeout,$state,$filter,$stateParams,marketingService) {
			$scope.vm = {
				data: {},
				cancel: function() {
					$state.go('marketing.release.list');
				},
				submit: submit
			}

			function submit(invalid) {
				$scope.vm.submitted = true;
				if (invalid) {
					return;
				};
				save();
				return true;
			}

			function save () {
				marketingService.createRelease.save($scope.vm.data).$promise.then(function(res) {
					if (res.code == 200) {
						toaster.pop('success','加息劵发布成功！');
						$state.go(marketing.release.list);
					}else {
						toaster.pop("error",res.msg);
					}
				},function(err) {
					toaster.pop('error','服务器连接失败！');
				})
			}
		}
	]
})