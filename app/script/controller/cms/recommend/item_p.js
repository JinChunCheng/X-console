define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
	return ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$modal', 'defaultService', 'metaService', 'recommendItemService', 'recommendService','toaster', function($rootScope, $scope, $state, $timeout, $stateParams, $modal, defaultService, metaService, recommendItemService, recommendService, toaster) {

		//必须传入推荐位id参数
		console.log($stateParams.r);
		console.log($stateParams.p);
		if (!$stateParams.r || !$stateParams.p)
			$state.go('error');

		$scope.listVM = recommendItemService.default;
		$scope.listVM.condition = $stateParams.condition || {};
		$scope.listVM.condition.recommendCode = $stateParams.r;
		$scope.listVM.condition.pageCode = $stateParams.p;
        $scope.listVM.positionList = {};

        var getPositionList = function(pageCode){
            recommendService.getListByPageCode(pageCode).then(function(data) {
                    if (data.status == '200') {
                        $scope.listVM.positionList = data.items;
                    }
                },
                function(errCode) {
                    console.error('Error while getListByPageId' + pageId);
                });
        };
        getPositionList($stateParams.p);

        // 面包屑
        ph.mark($rootScope, {
            state: 'recommend.list',
            title: '推荐位商品管理',
            params: { r: $stateParams.r, p: $stateParams.p }
        });

        //状态
		metaService.getMeta('YMZT', function(data) {
			$scope.listVM.statusList = data;
		});

		//加载item列表
		var paging = function(pageNo) {
			$scope.listVM.processing = true;
			$scope.listVM.condition.pageNo = pageNo;
			$scope.listVM.condition.pageSize = $scope.listVM.paginate.pageSize;
			recommendItemService.getList($scope.listVM.condition).then(function(data) {
					$scope.loading = false;
					$scope.listVM.processing = false;
					if (data.status == '200') {
						$scope.listVM.items = data.items;
						$scope.listVM.paginate = {
							currentPage: pageNo,
							pageSize: 10,
							totalItems: data.paginate.totalItemsCount
						}
					}
				},
				function(errCode) {
					$scope.loading = false;
					$scope.listVM.processing = false;
					console.error('Error while search terminal.');
				});
		};

		paging(1);

		//跳转页面
		$scope.pageChanged = function() {
			paging($scope.listVM.paginate.currentPage);
		};

		$scope.importPage = function() {
			$state.go('recommend.import', {
				p: $stateParams.p, //页面ID
				r: $stateParams.r //推荐位ID
			});
		}

		$scope.parseContent = function(content) {
			return JSON.parse(content);
		}

		//修改
		$scope.editPic = function(item) {
			var readOnly = false;
			showModal(item, readOnly);
		}

		var showModal = function(item, readOnly) {
			var title = readOnly ? "查看" : "修改";
			var templateUrl = 'view/cms/recommend/product/edit.html';
			if (readOnly) templateUrl = 'view/cms/recommend/product/show.html';
			var modalInstance = $modal.open({
				templateUrl: templateUrl,
				size: 'lg',
				controller: 'RecommendCtrl',
				resolve: {
					itemData: function() {
						return {
							title: title,
							data: item,
							parseContent: $scope.parseContent,
							rate: $scope.rate.val,
							uploadFile: recommendItemService.uploadFile
						}
					}
				}
			});
				
			//处理完成后回调
			modalInstance.result.then(function(result) {
				recommendItemService.update(result).then(function(resp){
					if(resp.status == '200'){
						toaster.pop('success', '修改成功');
					}else{
						toaster.pop('error', '修改失败');
					}
				}, function(errCode){
					toaster.pop('error', '修改失败');
				});
			}, function() {
				console.info('Modal dismissed at: ' + new Date());
			});				
		}
			//查看
		$scope.showPic = function(item) {
			var readOnly = true;
			showModal(item, readOnly);
		}

		//置顶
		$scope.setTop = function(itemId, isTop) {
			recommendItemService.setTop(itemId, isTop).then(
				function(data) {
					if (data.status == '200' && data.items == true) {
						paging(1);
					} else {
						alert(data.msg);
					}
				},
				function(errCode) {
					console.error('Error while setTop itemId:' + itemId);
					$state.go('error');
				}
			);
		};

		$scope.deletePic = function(item) {

			$modal.open({
				templateUrl: 'view/shared/confirm.html',
				size: 'sm',
				controller: function($scope, $modalInstance) {
					$scope.confirmData = {
						text: '确定要删除吗？',
						processing: false
					};
					$scope.cancel = function() {
						$modalInstance.dismiss();
						return false;
					}

					$scope.ok = function() {
						$scope.confirmData.processing = true;
						recommendItemService.deleteById(item.id).then(function(data) {
								if (data.status == '200' && data.items == true) {
									paging(1);
								}
								$scope.confirmData.processing = false;
							},
							function(errCode) {
								$scope.confirmData.processing = false;
								console.error('Error while delete positionItem.' + errCode);
								toaster.pop('error', data.msg);
							});

						$timeout(function() {
							//$scope.confirmData.processing = false;
							$modalInstance.dismiss();
						}, 500);
						return true;
					}
				}
			});
		}

		//对比价格系数设置
		$scope.setRate = function() {
			var title = "对比价格设置";
			console.log($scope.rate);
			var modalInstance = $modal.open({
				templateUrl: 'view/cms/recommend/product/rate.html',
				size: 'sm',
				controller: 'RateCtrl',
				resolve: {
					rateData: function() {
						return {
							title: title,
							data: $scope.rate
						}
					}
				}
			});
			//处理完成后回调
			modalInstance.result.then(function(data) {
				recommendItemService.modifyRate(data).then(function(result) {
					if (result.status != 200) {
						console.log("Error while modify rate.");
					}
				}, function(errCode) {
					console.log("Error while modify rate.");
				});
			}, function() {
				console.info('Modal dismissed at: ' + new Date());
			});
		}

		var getRate = function() {
			$scope.listVM.processing = true;
			recommendItemService.getRate().then(function(result) {
				$scope.loading = false;
				if (result.status == '200') {
					$scope.rate = result.items;
				}
			}, function(errCode) {
				$scope.loading = false;
				console.log('Error while get rate val.');
			});
		}
		getRate();

		$scope.checkAll = function() {
			if ($scope.listVM.checkedAll) {
				$scope.listVM.selectedList = $scope.listVM.items.map(function(item) {
					return item.id;
				});
			} else {
				$scope.listVM.selectedList = [];
			}
		};

		// 操作按钮状态
		$scope.operating = {};
		$scope.operating.publish = false;
		$scope.operating.offline = false;
		// 上线或下线
		$scope.publish = function(status) {
			status == 0 ? $scope.operating.publish = true : $scope.operating.offline = true;
			var items = $scope.listVM.selectedList.map(function(selectedId) {
				var temp;
				$scope.listVM.items.forEach(function(item) {
					if (item.id == selectedId) {
						temp = item;
					}
				});
				return temp;
			});

			recommendItemService.publish($stateParams.r, items, status).then(
				function(data) {
					if (data.status == '200' && data.items == true) {
						$scope.listVM.selectedList = [];
						$scope.listVM.checkedAll = false;
						$scope.operating.publish = false;
						$scope.operating.offline = false;
						paging(1);

					} else {
						$scope.operating.publish = false;
						$scope.operating.offline = false;
						alert(data.msg);
					}
				},
				function(errCode) {
					alert('服务器内部错误!');
					$scope.operating.publish = false;
					$scope.operating.offline = false;
					console.error('Error while publishing positionId:' + positionId);
				}
			);
		};
	}];
});