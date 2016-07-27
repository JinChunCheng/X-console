define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'recommendImportService' ,'toaster', function($rootScope, $scope, $state, $stateParams, $timeout, recommendImportService, toaster) {
        
        //必须传入推荐位id参数
		if (!$stateParams.r || !$stateParams.p)
			$state.go('error');
		
        ph.mark($rootScope, {
            state: 'recommend.list',
            title: '商品导入',
            params:{
            	p:$stateParams.p,
            	r:$stateParams.r
            }
        });

        $scope.listVM = {
            condition: $stateParams.condition || {},
            processing: false,
            imagePrefix: config.img_pc_domain,
            statusList: [{
                value: 1,
                text: '开发测试'
            }, {
                value: 2,
                text: '试运营'
            }, {
                value: 3,
                text: '正式运营'
            }, {
                value: 4,
                text: '已下线'
            }],
            paginate: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 0
            }
        };
        
        // 品类数据
        $scope.treeData = {
            loading: true,
            settings: {
                async: {
                    enable: true,
                    url: config.mc_domain + '/mcTreeByParent/',
                    autoParam: ["id"],
                    type: 'POST',
                    dataFilter: function(treeId, parentNode, responseData){
                    	return responseData.items;
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onAsyncSuccess: onAsyncSuccess,
                    onAsyncError: onAsyncError,
                    onClick: afterClick
                }
            }
        };

        //异步加载成功
        function onAsyncSuccess(event, treeId, treeNode, msg) {
            $timeout(function() {
                $scope.treeData.loading = false;
            });
            return true;
        }

        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            $timeout(function() {
                $scope.treeData.loading = false;
            });
            toaster.pop('error', '加载产品品类数据出错，请重试！');
        }

        function afterClick(event, treeId, treeNode) {
            $timeout(function(){
                // 获取品类名称
                var paths = treeNode.getPath();
                var categoryNamePath = '';
                if (paths && paths.length > 0) {
                    categoryNamePath = paths.map(function(item) {
                        return item.name;
                    }).join(' - ');
                }
                $scope.listVM.condition.categoryName = categoryNamePath;
                $scope.listVM.condition.categoryCode = treeNode.id;
                //toggle有点变态
                //临时方案，解决关闭toggle层
                $(document).click();
            });
        };

		(function(){
			recommendImportService.getPromotions().then(function(result){
				if(result.status == '200')
				$scope.listVM.promotions = result.items;
			},function(err){
				
			});
		})();
        var paging = function(p) {
            $scope.listVM.processing = true;
            $scope.listVM.condition.pageSize = 10
            $scope.listVM.condition.pageNo = p;
			console.log($scope.listVM.condition);
			//查询
			recommendImportService.getProductsByCondition($scope.listVM.condition).then(
				function(result){
					$scope.listVM.items = result.items;
					$scope.listVM.paginate = {
						currentPage: p,
						pageSize: result.paginate.pageSize,
						totalItems: result.paginate.totalItemsCount
					};
                    $scope.listVM.processing = false;
				},
				function(errCode){
					console.log('');
				}
			)
        };

        $scope.search = function() {
            $scope.listVM.paginate.currentPage = 1;
            paging(1);
        };

		$scope.clearCategory = function(){
			$scope.listVM.condition.categoryName = "";
			$scope.listVM.condition.categoryCode = "";
		};

        $scope.pageChanged = function() {
            paging($scope.listVM.paginate.currentPage);
        };

        $scope.reset = function() {
        	$scope.listVM.categoryName = "";
            $scope.listVM.condition = {};
        };

        //
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

		$scope.importProduct = function(){
			var products = [];
			for(var i=0; i<$scope.listVM.selectedList.length; i++){
				var tmpProduct = $scope.listVM.selectedList[i];
				var product = {};
				var content = {};
				if(!tmpProduct.realAwsPic){
					continue;
				}
				product.title = tmpProduct.name;
				content.code = tmpProduct.code;
				content.price = tmpProduct.priceInfo.fobPrice;
				content.moq = tmpProduct.moq;
				product.content = JSON.stringify(content);
				product.mcCode = tmpProduct.code;
				product.positionCode = $stateParams.r;
				product.usImgUrl = tmpProduct.realAwsPic;
				product.createUser = $scope.curUser.id;
				products[i] = product;
			}
			if(products.length == 0){
				toaster.pop('error', 'Aws Url 为空，无法导入，请查询MC数据是否正确！');
				return ;
			}
			recommendImportService.importRecommend(products).then(function(result){
				if(result.status == '200'){
					paging($scope.listVM.paginate.currentPage);
					$scope.listVM.checkedAll = false;
					$scope.listVM.selectedList = [];
					toaster.pop('success', '产品导入成功!');	
				}else{
					console.log('产品导入失败:' + result.status);
					toaster.pop('error', '产品导入出错，请重试！');
				}

			},function(errCode){
				console.log('------------' + errCode);
				toaster.pop('error', '产品导入出错，请重试！');
			})
		}
		
        $scope.checkAll = function() {
            if ($scope.listVM.checkedAll){
                $scope.listVM.selectedList = $scope.listVM.items.map(function(item) {
                    return item;
                });
            }else{
                $scope.listVM.selectedList = [];
            }
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        
        $scope.back = function(){
        	$state.go("recommend.product",
        	{
        		p: $stateParams.p, //页面ID
				r: $stateParams.r //推荐位ID
        	});
        }
    }];
});
