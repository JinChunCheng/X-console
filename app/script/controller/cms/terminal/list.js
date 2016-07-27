define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
	return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'toaster', 'terminalService', function($rootScope, $scope, $state, $stateParams, $timeout, $modal, toaster, terminalService) {
		//面包屑信息
		ph.mark($rootScope, {
			state: 'terminal.list',
			title: '终端管理'
		});

		$scope.listVM = terminalService.default;
		$scope.listVM.condition = $stateParams.condition || {};
		var paging = function(p) {
			$scope.listVM.processing = true;
			var condition = {};
			condition.pageNo = p;
			condition.pageSize = 10;
			terminalService.getTerminals(condition).then(function(data) {
					$scope.loading = false;
					$scope.listVM.processing = false;
					if (data.status == '200') {
						$scope.listVM.items = data.items;
						$scope.listVM.paginate = {
							currentPage: p,
							pageSize: 10,
							totalItems: data.paginate.totalItemsCount
						}
					}else{
						toaster.pop('error', '加载终端列表失败，请重试！');
					}
				},
				function(errCode) {
					$scope.loading = false;
					$scope.listVM.processing = false;
					toaster.pop('error', '加载终端列表失败，请重试！');
					console.error('Error while search terminal.' + errCode);
				});
		};
		paging(1);

		$scope.search = function() {
			$scope.listVM.paginate.currentPage = 1;
			paging(1);
		};


		$scope.pageChanged = function() {
			paging($scope.listVM.paginate.currentPage);
		};

		$scope.reset = function() {
			$scope.listVM.condition = {};
		};

		$scope.add = function() {
			showModal();
		};

		$scope.edit = function(item) {
			showModal(item);
		};

		var showModal = function(item) {
			var title = item ? "修改终端" : "新增终端";
			var isModify = item ? true : false;
			if (isModify) {
				openModal(title, item, isModify);
			} else {
				terminalService.getTMCode().then(function(result) {
					var data;
					if (result.status == '200') {
						data = {
							code: result.items
						};
					} else {
						data = {};
					}
					openModal(title, data, isModify);
				}, function(erroCode) {
					console.error('Error while get terminal code.');
				});
			}
		};

		var openModal = function(title, data, isModify) {
			var modalInstance = $modal.open({
				templateUrl: 'view/cms/terminal/edit.html',
				controller: 'TerminalCtrl',
				//size: 'lg',
				resolve: {
					terminalData: function() {
						return {
							title: title,
							data: data,
							isModify: isModify,
							tmpName: data.name //存储修改前的名称，如果是新增则为undefind
						}
					}
				}
			});

			modalInstance.result.then(function(formData) {
				$scope.selected = formData;
				if(isModify){
					paging($scope.listVM.paginate.currentPage);
				}else{
					paging(1);
				}
				
			}, function() {
				console.info('Modal dismissed at: ' + new Date());
			});
		}
		
		$scope.checkAll = function() {
			if ($scope.listVM.checkedAll)
				$scope.listVM.selectedList = $scope.listVM.items.map(function(item) {
					return item.id;
				});
			else
				$scope.listVM.selectedList = [];
		};
	}];
});