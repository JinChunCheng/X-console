define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http','$timeout', 'McService', 'toaster', function($rootScope, $scope, $state, $stateParams, $http, $timeout, McService, toaster) {

        ph.mark($rootScope, {
            state: 'mc.goods.edit',
            title: "修改商品"
        });

        $scope.goods = {};//商品详情
        $scope.isSaving = false;
        //商品品类树设置
        $scope.treeData = {
            loading: true,
            settings: {
                async: {
                    enable: true,
                    url: config.mc_domain + "/mcTreeByParent",
                    autoParam: ["id"],
                    type: 'POST',
                    dataFilter:function(treeId, parentNode, responseData){

                        if(responseData.status == 200){
                            return responseData.items;
                        }
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
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
        };

        //异步加载失败
        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            $timeout(function() {

                $scope.treeData.loading = false;
            });
            toaster.pop('error', '加载商品品类数据出错，请重试！');
        };

        //商品品类树点击函数
        function afterClick(event, treeId, treeNode) {
            $timeout(function() {
                if (treeNode.leaf) {
                    return false;
                }
                var paths = treeNode.getPath();
                var categoryNamePath = '';
                if (paths && paths.length > 0) {
                    categoryNamePath = paths.map(function(item) {
                        return item.name;
                    }).join(' - ');
                }
                if(treeId.substring(0,8) == "mainTree"){
                    $scope.goods.mainCategoryName = categoryNamePath;
                    $scope.goods.mainCategoryCode = treeNode.id;
                }else{

                    var num = treeId.substring("subTree".length,treeId.length);
                    var obj = {"pcCategoryName":categoryNamePath,"pcCategoryCode":treeNode.id};
                    $scope.goods.subCategoryCodes[num] = obj;

                }
                //toggle有点变态
                //临时方案，解决关闭toggle层
                $(document).click();
            });
        };

        //添加附属品类
        $scope.addAttachedCategories = function(){
            var obj = {"pcCategoryName":"","pcCategoryCode":""};
            $scope.goods.subCategoryCodes.push(obj);
        };

        //删除附属品类
        $scope.delAttachedCategories = function(n){
            $scope.goods.subCategoryCodes.splice(n, 1)
        };

        //根据code加载商品
        $scope.load = function(){
            McService.queryGoodsByCode($stateParams.code).then(
                function(data) {
                    if(data.status == 200){
                        $scope.goods = data.items;
                        if($scope.goods.subCategoryCodes.length == 0){//无附属品类时添加一个选择框
                            $scope.addAttachedCategories();
                        };
                        $scope.goods.autoPrice = angular.fromJson($scope.goods.autoPrice);//自动价格转json
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '出错！');
                        console.error('Error while query mcCategory by '+ $stateParams.code);
                    }
                },
                function(errResponse) {
                    toaster.pop('error', '服务器请求异常！');
                    console.error('Error while query mcCategory by '+ $stateParams.code);
                }
            )
        };

        $scope.load();

        //修改商品
        $scope.update = function(type){
            $scope.isSaving = true;
            $scope.goods.autoPrice = JSON.stringify($scope.goods.autoPrice);
            $scope.goods.updateType = type;
            McService.updateGoods($scope.goods).then(
                function(data) {
                    if(data.status == 200){
                        $scope.back();
                    }else{
                        $scope.isSaving = false;
                        toaster.pop('error', (data && data.msg) ? data.msg : '出错！');
                        console.error('Error while update mcCategory by '+ $stateParams.code);
                    }
                },
                function(errResponse) {
                    $scope.isSaving = false;
                    toaster.pop('error', '服务器请求异常！');
                    console.error('Error while update mcCategory by '+ $stateParams.code);
                }
            )
        };

        //返回列表页
        $scope.back = function(){
            var fromState = $stateParams.from || 'mc.goods.list';
            $state.go(fromState, {
                listVM: $stateParams.listVM
            }, {
                reload: true
            });
        }

        $scope.checkHasStep = function(){
            if($scope.goods.stepPrice==null||$scope.goods.stepPrice.length==0){
                $scope.addPice();
            }
            console.log($scope.goods.hasStep)
        }
        //添加价格梯度
        $scope.addPice = function(){
            var obj = {};
            if($scope.goods.stepPrice==null){
                $scope.goods.stepPrice=[];
            }
            $scope.goods.stepPrice.push(obj);
        }

        //删除价格梯度
        $scope.delPice = function(index){
            $scope.goods.stepPrice.splice(index, 1);
        }

    }];
});
