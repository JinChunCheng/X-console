define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http', '$timeout', 'McService', 'toaster', '$modal', function($rootScope, $scope, $state, $stateParams, $http, $timeout, McService, toaster, $modal) {

        ph.mark($rootScope, {
            state: 'mc.active.edit',
            title: "修改活动"
        });

        $scope.isSaving = false;//是否正在保存
        $scope.active = {};//活动
        $scope.goodsList = [];//样品包邮包含的商品

        //返回列表
        $scope.back = function(){
            $state.go('mc.active.list', {
                reload: true
            });
        };

        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.active.beginDateOpened = true;
            $scope.active.endDateOpened = false;
        };
        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.active.endDateOpened = true;
            $scope.active.beginDateOpened = false;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        //保存活动
        $scope.update = function(){

            if($scope.form.$invalid){
                toaster.pop('error', '校验不通过！');
                return false;
            }

            if(Date.parse($scope.active.startTime) > Date.parse($scope.active.endTime)){
                toaster.pop('error', '开始时间不能晚于结束时间！');
                return false;
            }

            if($scope.active.type == 3){
                if($scope.active.items == null){
                    toaster.pop('error', '请选择SKU！');
                    return;
                }
                if($scope.active.items.length > 0){
                    var str = "";
                    $scope.active.items.forEach(function(e){
                        str = str + e.itemCode +",";
                    });
                    $scope.active.itemCodes = str;
                }else{
                    toaster.pop('error', '请选择SKU！');
                    return;
                }
            }

            McService.updateActives($scope.active).then(
                function(data) {
                    if(data.status == 200){
                        $scope.back();
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '保存出错！');
                    }
                },
                function(errResponse) {
                    console.error('Error while save active ');
                    toaster.pop('error', '服务器请求异常！');
                }
            )
        };

        //加载活动
        $scope.load = function(){
            McService.getActiveById($stateParams.id).then(
                function(data) {
                    if(data.status == 200){
                        $scope.active = data.items;
                        var obj = JSON.parse($scope.active.favourable);
                        if($scope.active.type == 1){
                            $scope.active.reducePrice=obj.reducePrice;
                        }
                        if($scope.active.type == 2){
                            $scope.active.discount=obj.discount;
                            $scope.active.maxAmount=obj.maxAmount;
                        }
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '保存出错！');
                    }
                },
                function(errResponse) {
                    console.error('Error while save active ');
                    toaster.pop('error', '服务器请求异常！');
                }
            )
        };

        $scope.load();

        //弹出添加商品模态框
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: "view/mc/active/goodsList.html",
                controller: function($scope, $modalInstance){

                    var defaultCondition = {
                        sorting: 'update_time desc',
                        statusList: [],
                        pageNo: 1,
                        pageSize: 10
                    };

                    /**
                     * common data
                     * @type {Object}
                     */
                    $scope.listVM = {
                        condition: angular.copy(defaultCondition),
                        paginate: {
                            pageSize: 10,
                            pageNumber: 1,
                            pagesCount: 0,
                            totalItemsCount: 0
                        },
                        items: []
                    };

                    //商品品类树
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
                                            e.text = '<table><thead><tr><th class="text-center w60">数量</th><th class="text-center w60">价格</th><th></th></tr></thead><tbody>';

                                            if(e.priceInfo.prices != null && e.priceInfo.prices.length > 0){
                                                e.priceInfo.prices.forEach(function(p){
                                                    e.text = e.text +'<tr><td class="text-center">'+ p.count +'</td><td class="text-center">'+ p.fobPrice +'</td></tr>';
                                                })
                                            }else{
                                                e.text = e.text +'<tr><td class="text-center" colspan="2">无</td></tr>';
                                            }

                                            e.text = e.text+ '</tbody></table>';
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
                    var processItemsChecked = function(items) {
                        var isAll = true;
                        if (items && $scope.listVM.checkedGoodsCodes) {
                            for (var i = 0; i < items.length; i++) {
                                if (isItemChecked(items[i].code)) {
                                    items[i].IsChecked = true;
                                } else
                                    isAll = false;
                            }
                        }
                        $scope.listVM.isAllChecked = isAll;
                    };

                    var processChecked = function(item) {
                        var hasChecked = isItemChecked(item.code);
                        if (item.IsChecked && !hasChecked) {
                            //当前选中，之前未选，在已选中添加
                            $scope.listVM.checkedGoodsCodes.push(item);
                        } else if (!item.IsChecked && hasChecked) {
                            //当前未选中，之前已选，在已选中移除
                            for (var j = 0; j < $scope.listVM.checkedGoodsCodes.length; j++) {
                                if ($scope.listVM.checkedGoodsCodes[j].code == item.code) {
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
                            if ($scope.listVM.checkedGoodsCodes[j].code == code) {
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

                    $scope.ok = function () {
                        selectGoods($scope,$scope.listVM.checkedGoodsCodes);
                        $modalInstance.close('cancel');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    //绑定气泡提示
                    $scope.showPopver = function () {
                        console.log("test")
                        $timeout(function () {
                            $('div[name = popovers-demo1]').popover({"title": "阶梯价格"});
                        }, 0)
                    }
                },
                size: "lg",
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

        var selectGoods = function(scope,data){

            if($scope.active.items == null){
                $scope.active.items = [];
            }

            if(data.length != 0){
                data.forEach(function(e){
                    e.itemName = e.name;
                    e.itemCode = e.code;
                    e.itemSpecAttr = e.categoryName;
                    $scope.active.items.push(e);
                })
            }
        }

        //删除样品包邮的商品
        $scope.deleteGoods = function(num){
            $scope.active.items.splice(num, 1);
        }

    }];
});
