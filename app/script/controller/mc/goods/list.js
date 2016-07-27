define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'toaster', 'McService', '$window', function($rootScope, $scope, $state, $stateParams, $timeout, $modal, toaster, McService, $window) {

        ph.mark($rootScope, {
            state: 'mc.goods.list',
            title: '商品列表'
        });

        var defaultCondition = {
            sorting: 'update_time desc',
            statusList: [1,2,3,4],
            pageNo: 1,
            pageSize: 10
        };

        /**
         * common data
         * @type {Object}
         */
        $scope.listVM = $stateParams.listVM || {
            condition: angular.copy(defaultCondition),
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: [],
            goodsStatusList: [{
                value: 1,
                text: '已上架'
            }, {
                value: 2,
                text: '下架'
            }, {
                value: 3,
                text: '锁定上架'
            }, {
                value: 4,
                text: '暂停销售'
            }]
        };

        //商品品类
        $scope.treeData = {
            initializing: true,
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
                callback: {
                    onAsyncSuccess: onAsyncSuccess,
                    onAsyncError: onAsyncError,
                    onClick: onClick
                }
            }
        };

        /**
         * 异步加载成功
         * @param  {event} event    [event type]
         * @param  {type} treeId   [category id]
         * @param  {type} treeNode [category node data]
         * @param  {type} msg      [message]
         */
        function onAsyncSuccess(event, treeId, treeNode, msg) {
            $timeout(function() {
                $scope.treeData.initializing = false;
                if(treeNode == undefined){
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    treeObj.expandNode(treeObj.getNodeByParam("id","0",null), true, false, true);
                }
            });
            return true;
        }

        /**
         * do sth when async error
         */
        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            $timeout(function() {
                $scope.treeData.initializing = false;
            });
            toaster.pop('error', '加载商品品类数据出错，请重试！');
        }

        /**
         * click tree node action
         * @param  {type} event     [click event source]
         * @param  {type} treeId    [category id]
         * @param  {type} treeNode  [category node data]
         * @param  {type} clickFlag [description]
         * @return {void}
         */
        function onClick(event, treeId, treeNode, clickFlag) {
            $timeout(function() {
                if (!treeNode.leaf) {
                    return false;
                }
                var paths = treeNode.getPath();
                var categoryNamePath = '';
                if (paths && paths.length > 0) {
                    categoryNamePath = paths.map(function(item) {
                        return item.name;
                    }).join(' - ');
                }
                $scope.listVM.condition.categoryName = categoryNamePath;
                $scope.listVM.condition.categoryCode = treeNode.id;
                //var treeObj = $.fn.zTree.getZTreeObj("tree");
                //treeObj.expandNode(treeNode, true, true, true);
                //toggle有点变态
                //临时方案，解决关闭toggle层
                $(document).click();
            });
        };

        /**
         * 清空已选品类
         * @return {void} [description]
         */
        $scope.clearCategory = function() {
            $scope.listVM.condition.categoryName = undefined;
            $scope.listVM.condition.categoryCode = undefined;
        };

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

        //查询商品
        var search = function(page) {
            if($scope.listVM.condition.statusList.length > 0){
                var str = "";
                $scope.listVM.condition.statusList.forEach(function(e){
                    str = str + e +",";
                })
                $scope.listVM.condition.itemStatus = str;
            }
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            McService.queryGoods($scope.listVM.condition).then(
                function(res) {
                    if (res && res.status == 200) {

                        $scope.listVM.items = res.items;
                        $scope.listVM.paginate = res.paginate;
                        if (res.items && res.items.length > 0) {
                            $scope.listVM.items.forEach(function(e){
                                //阶梯价格
                                e.text = '<table><thead><tr><th class="text-center w60">数量</th><th class="text-center w60">价格</th><th></th></tr></thead><tbody>';
                                if(e.priceInfo.prices != null && e.priceInfo.prices.length > 0){
                                    e.priceInfo.prices.forEach(function(p){
                                        e.text = e.text +'<tr><td class="text-center">'+ p.count +'</td><td class="text-center">'+ p.fobPrice +'</td></tr>';
                                    })
                                }else{
                                    e.text = e.text +'<tr><td class="text-center" colspan="2">无</td></tr>';
                                }
                                e.text = e.text+ '</tbody></table>';

                                //图片路径
                                e.picUrl = config.img_pc_domain +"/"+ e.pic;
                            })
                        }
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '查询出错！');
                    }
                    $scope.listVM.loading = false;
                },
                function(err) {
                    $scope.listVM.loading = false;
                    toaster.pop('error', '服务器请求异常！');
                }
            );
        };

        search();

        //绑定气泡提示
        $scope.showPopver = function () {
            $timeout(function () {
                $('div[name = popovers-demo1]').popover({"title": "阶梯价格"});
            }, 0)
        }

        /**
         * 分页控件翻页事件
         */
        $scope.pageChanged = function() {
            $scope.page($scope.listVM.paginate.pageNumber);
        };

        /**
         * search
         * @param  {[int]} index [description]
         */
        $scope.page = function(index) {
            $scope.listVM.condition.pageNo = index || 1;
            search();
        };

        //全选事件
        $scope.listVM.checkedGoodsCodes = [];
        //处理是否选中
        var processChecked = function(item) {
            var hasChecked = isItemChecked(item.code);
            if (item.IsChecked && !hasChecked) {
                //当前选中，之前未选，在已选中添加
                $scope.listVM.checkedGoodsCodes.push(item.code);
            } else if (!item.IsChecked && hasChecked) {
                //当前未选中，之前已选，在已选中移除
                for (var j = 0; j < $scope.listVM.checkedGoodsCodes.length; j++) {
                    if ($scope.listVM.checkedGoodsCodes[j] == item.code) {
                        $scope.listVM.checkedGoodsCodes.splice(j, 1);
                        break;
                    }
                }
            }
        };

        //选中、取消事件
        $scope.processCheckedItem = function(item) {
            processChecked(item);
            $scope.listVM.isAllChecked = allChecked();
        };

        //是否已选中
        var isItemChecked = function(code) {
            for (var j = 0; j < $scope.listVM.checkedGoodsCodes.length; j++) {
                if ($scope.listVM.checkedGoodsCodes[j] == code) {
                    return true;
                }
            }
            return false;
        };

        //是否已全选
        var allChecked = function() {
            for (var i = 0; i < $scope.listVM.items.length; i++) {
                if (!$scope.listVM.items[i].IsChecked)
                    return false;
            }
            return true;
        };

        //全选、反选事件
        $scope.selectAll = function() {
            var isSelect = $scope.listVM.isAllChecked;
            for (var i = 0; i < $scope.listVM.items.length; i++) {
                $scope.listVM.items[i].IsChecked = !isSelect;
                processChecked($scope.listVM.items[i]);
            }
            $scope.listVM.isAllChecked = !isSelect;
        };

        // 1.上架，2.下架，3.暂停销售，4.恢复销售，5.锁定上架，6.取消锁定
        $scope.batchUpdate = function(type){
            var codes = "";
            $scope.listVM.checkedGoodsCodes.forEach(function(e){
                codes = codes + e +",";
            })
            var object = {"itemCodes":codes,"operationType":type};
            McService.batchUpdateGoods(object).then(
                function(res) {
                    if (res && res.status == 200) {
                        $scope.listVM.checkedGoodsCodes = [];
                        search();
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '修改出错！');
                    }
                },
                function(err) {
                    toaster.pop('error', '服务器请求异常！');
                }
            )
        };

        //打开新窗口
        $scope.openNewWin = function(name, code){
            var newName = name.replace(/-/g,'_');
            newName = name.replace(/[&\|\\\*^%$#@\\/()+=]/g,'');
            newName = newName.replace(/\s+/g,"-");
            //var address = "test-goexw-www-public-1629083118.us-west-2.elb.amazonaws.com/products/wholesale-"+newName+"-"+code+"-from-china-suppliers-distributors";
            var address = "goexw.com/products/wholesale-"+newName+"-"+code+"-from-china-suppliers-distributors";
            $window.open("//"+address);
        }

        $scope.dealHistroy = [];
        $scope.dealHistroySearching = true;
        //商品修改历史弹出框
        $scope.open = function (code) {
            var modalInstance = $modal.open({
                templateUrl: "view/mc/goods/dealHistroy.html",
                controller: function($scope, $modalInstance){

                    McService.queryDealByCode(code).then(
                        function(res) {
                            $scope.dealHistroySearching = false;
                            if (res && res.status == 200) {
                                $scope.dealHistroy = res.items;
                            } else {
                                toaster.pop('error', (res && res.msg) ? res.msg : '修改出错！');
                            }
                        },
                        function(err) {
                            $scope.dealHistroySearching = false;
                            toaster.pop('error', '服务器请求异常！');
                        }
                    )

                    $scope.ok = function () {
                        $modalInstance.close('cancel');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: "lg"
            });
        };
    }];
});
