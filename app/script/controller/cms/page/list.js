define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
	return ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$modal', 'defaultService', 'toaster', 'metaService', 'pageService', function($rootScope, $scope, $state, $timeout, $stateParams, $modal, defaultService, toaster, metaService, pageService) {

		//必须传入终端编号
		if (!$stateParams.t)
			$state.go('error');

        // 面包屑
        ph.mark($rootScope, {
            state: 'page.list',
            title: '页面管理',
            params: { t: $stateParams.t }
        });

		$scope.listVM = {
			condition: $stateParams.condition || {},
			processing: false,
			statusList: [],
			items: []
		};

		//状态
		metaService.getMeta('YMZT', function(data) {
			$scope.listVM.statusList = data;
		});

		/**
		 * 查询列表数据
		 * @param {Object} p 页码
		 */
		var paging = function(p) {
			$scope.listVM.processing = true;
			var condition = {
				terminalId: $stateParams.t,
				pageNo: p,
				pageSize: 10
			}
			pageService.getPagesByTerminalId(condition).then(function(result) {
				if (result.status == '200') {
					$scope.listVM.items = result.items;
					$scope.listVM.paginate = {
						currentPage: p,
						pageSize: result.paginate.pageSize,
						totalItems: result.paginate.totalItemsCount
					};
				}else{
					toaster.pop('error', '加载页面列表失败，请重试！');
					console.log('Error while get pages by terminalId.');
				}
			}, function(errCode) {
				toaster.pop('error', '加载页面列表失败，请重试！');
				console.log('Error while get pages by terminalId.' + errCode);
			});
			$timeout(function() {
				$scope.listVM.processing = false;
			}, 500)
		};
		paging(1);

		$scope.search = function() {
			$scope.listVM.paginate.currentPage = 1;
			paging(1);
		};

		$scope.pageChanged = function() {
			paging($scope.listVM.paginate.currentPage);
		};
		//重置查询表单
		$scope.reset = function() {
			$scope.listVM.condition = {};
		};

		//新增
		$scope.add = function() {
			loadModalData();
		};

		//修改
		$scope.edit = function(item) {
			loadModalData(item);
		};

		//弹出新增修改表单
		var loadModalData = function(item) {
			var title = item ? "修改页面" : "新增页面";
			var isModify = item ? true : false;
			if (isModify) {
				showModal(title, item, isModify);
			} else {
				getPageCode(title);
			}
		};

		var showModal = function(title, data, isModify) {
			var modalInstance = $modal.open({
				templateUrl: 'view/cms/page/edit.html',
				controller: 'PageCtrl',
				resolve: {
					pageData: function() {
						return {
							title: title,
							data: data,
							statusList: $scope.listVM.statusList,
							categoryCodeList: getCategoryCodeList,
							getPageById: getPageById,
							validName: validName,
							tmpName: data.name //存储修改前的名称，如果是新增则为undefind							
						}
					}
				}
			});

			//处理完成后回调
			modalInstance.result.then(function(result) {
				result.createUser = $scope.curUser.id;
				result.terminalCode = $stateParams.t;
				$scope.selected = result;
				if (isModify) {
					modify(result);
				} else {
					create(result);
				}
			}, function() {
				console.info('Modal dismissed at: ' + new Date());
			});
		}

		//获取页面编码
		var getPageCode = function(title) {
			pageService.getPageCode().then(function(result) {
				var data = {};
				if (result.status == '200') {
					data.code = result.items;
				} else {
					data.code = '';
				}
				showModal(title, data);
			}, function(errCode) {
				console.log('Error while get page code.');
			});
		}

		//获取一级品类列表
		var getCategoryCodeList = function() {
			return pageService.supplierCategory();
		};

		var getPageById = function(id, title) {
			return pageService.getPageById(id);
			/*pageService.getPageById(id).then(function(result) {
				var data = {};
				if (result.status == '200') {
					data = result.items;
				} else {
					data.code = '';
				}
				showModal(title, data, id);
			}, function(errCode) {
				console.log('Error while get page by id.');
			});*/
		}

		var validName = function(name){
			return pageService.validName(name);
		}

		var modify = function(data) {
			pageService.modifyPage(data).then(function(result) {
				if (result.status == '200') {
					paging($scope.listVM.paginate.currentPage);
				}else {
					toaster.pop('error', result.msg);
				}
			}, function(errCode) {
				console.log('Error while modify page.');
			});
		}

		var create = function(data) {
			console.log(data);
			pageService.createPage(data).then(function(result) {
				if (result.status == '200') {
					paging(1);
				}else {
					toaster.pop('error', result.msg);
				}
			}, function(errCode) {
				console.log('Error while modify page.');
			});
		}

		/**
		 * 上下线按钮绑定事件
		 * @param {Object} text
		 * @param {Object} status
		 * @param {Object} id
		 */
		$scope.confirm = function(text, status, id) {
			var currentPage = $scope.listVM.paginate.currentPage;
			$modal.open({
				templateUrl: 'view/shared/confirm.html',
				size: 'sm',
				controller: function($scope, $modalInstance) {
					$scope.confirmData = {
						text: text,
						processing: false
					};
					$scope.cancel = function() {
						$modalInstance.dismiss();
						return false;
					}

					$scope.ok = function() {
						$scope.confirmData.processing = true;
						if (status == 0) {
							pageService.offline(id).then(function(result) {
								if (result.status == 200) {
									paging(currentPage);
								}else {
					toaster.pop('error', result.msg);
				}
							}, function(errCode) {

							});
						} else {
							pageService.publish(id).then(function(result) {
								if (result.status == 200) {
									paging(currentPage);
								}else{
					toaster.pop('error', result.msg);
				}
							}, function(errCode) {

							});
						}

						$timeout(function() {
							//$scope.confirmData.processing = false;
							$modalInstance.dismiss();
						}, 500);
						return true;
					}
				}
			});
		}

		/**
		 * 跳转到页面对应的推荐位页面
		 * @param {Object} item
		 */
		$scope.goToRecommend = function(item) {
			$state.go('recommend.list', {
				t: $stateParams.t,
				p: item.code, //页面ID
				pn: item.name //页面名称
			});
		};
	}];
});