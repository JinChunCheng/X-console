define([],function() {
	return ['$scope','$http','$filter','$timeout','$modal','$state','marketingService','metaService',
		function($scope,$http,$filter,$timeout,$modal,$state,marketingService,metaService) {
			// var defaultCondition = {
			// 	data: {},
			// 	paginate: {
			// 		pageNum: 1,
			// 		pageSize: 10
			// 	}
			// }
			$scope.listVM = {
				condition: {},
				table: null,
				checked: [],
				add: function() { 
					$state.go('marketing.release.add');
				},
				batchDelete: function() {
					batch(2,'批量删除');
				}
			};

			//批量操作
			// function batch(status,title) {
			// 	var text = "确定" + title + "？";
			// 	var ids = $scope.listVM.checked.map(function(itme) {
			// 		return item.id;
			// 	}).join(',');
			// 	$modal.open({
			// 		templateUrl: 'view/shared/confirm.html',
			// 		size: 'sm',
			// 		controller: function($scope,$modalInstance) {
			// 			$scope.confirmData = {
			// 				text: text,
			// 				processing: false
			// 			};
			// 			$scope.cancel = function() {
			// 				$modalInstance.dismiss();
			// 				return false;
			// 			};
			// 			$scope.ok = function() {
			// 				marketingService.deleteCouponRelease({ids: ids, status: status}).then(function(res) {
			// 					if (res.code == 200) {
			// 						toaster.pop('success','批量删除成功！');
			// 						$modalInstance.dismiss();
			// 					}else {
			// 						toaster.pop('error',res.msg);
			// 					}
			// 				},function(err) {
			// 					toaster.pop('error','服务器连接失败！');
			// 				});
			// 				return true;
			// 			}
			// 		}
			// 	})
			// }
			$scope.$on("$viewContentLoaded",function() {
				var table = $('#marketingReleaseTable');
				// table.on('check.bs.table uncheck.bs.table' +'check-all.bs.table uncheck-all.bs.table',
				// 		function() {
				// 			$timeout(function() {
				// 				var checked = table.bootstrapTable('getSelections');
				// 				$scope.listVM.checked = checked||[];
				// 			})
				// 		})
				$scope.listVM.table = table;
			});
			// function search() {
			// 	$scope.listVM.table.bootstrapTable('refresh');
			// }
			//元数据操作
			function initMetaData() {
			}
			initMetaData();
			//获取数据
			var getData = function (params) {
				var paganition  = {
					pageNum: params.paginate.pageNum,
					pageSize: params.paginate.pageSize,
					sort: params.data.sort
				};
				var condition = $scope.listVM.condition;
				var queryCondition = { "data": data, "paginate": paganition };
				marketingService.marketingReleaseTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
			};

			//初始化操作
			(function init() {
				$scope.bsMarketingReleaseTableControl = 
				{
					options: {
						cache: false,
						pagination: true,
						pageSize: 10,
						pageList: [10, 25, 50, 100, 200],
						// ajax: getData,
						slidePagination: "server",
						columns: [{
							field: 'state',
							checkbox: true,
							align: 'center'
						}, {
							field: 'batchNo',//后台给的字段匹配
							title: '批次',
							align: 'center'
						}, {
							field: 'distributeTime',
							title: '发布时间',
							align: 'center'
						}, {
							field: 'name',
							title: '使用模板',
							align: 'center'
						}, {
							field: 'reason',
							title: '推送目的',
							align: 'center'
						}, {
							field: 'userCount',
							title: '发放人数',
							align: 'center'
						}, {
							field: 'status',
							title: '状态',
							align: 'center'
						}, {
							field: 'memo',
							title: '备注',
							align: 'center'
						}, {
							field: '',
							title: '操作',
							align: 'center',
							clickToSelect: false,//是否启用点击选中行
							formatter: flagFormatter,
							events: {
								'click .btn-warning': termination
							}
						}]
					}
				}
				function flagFormatter (value,row,index) {
					var btnHtml = '<button type="button" class="btn btn-xs btn-warning"><i class="fa fa-minus-circle"></i></button>';
					return btnHtml;
				} 
			})();
			function termination(e, value, row, index) {
				var text = "确定终止发放？";
				$modal.open({
					templateUrl: 'view/shared/confirm.html',
					size: 'sm',
					controller: function($scope,$modalInstance) {
						$scope.confirmData = {
							text: text,
							processing: false
						};
						$scope.ok = function () {
							//调用接口，
							// alert(1);
						};
						$scope.cancel = function () {
							$modalInstance.dismiss();
							return false;
						}
					}
				})
			}
		}]
})