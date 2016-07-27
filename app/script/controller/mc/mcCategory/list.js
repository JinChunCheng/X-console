define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'toaster', 'McService', function($rootScope, $scope, $state, $stateParams, $timeout, $modal, toaster, McService) {

        ph.mark($rootScope, {
            state: 'mc.mcCategory.list',
            title: '商品品类管理'
        });

        $scope.searching = true;//是否正在查找
        $scope.queryResult = [];//查询结果
        $scope.noChildrenData = false;//查询结果是否为空
        $scope.selectCategory = "";//被选中的品类
        $scope.selectNode = {};

        $scope.treeData1 = {
            showTree: false,
            setting: {
                data: {
                    key: {
                        title: "t"
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function(event, treeId, treeNode, clickFlag) {
                        $timeout(function() {
                            if (!treeNode.isLeaf) {
                                return false;
                            }
                            var paths = treeNode.getPath();
                            var categoryNamePath = '';
                            if (paths && paths.length > 0) {
                                categoryNamePath = paths.map(function(item) {
                                    return item.name;
                                }).join(' - ');
                            }
                            $scope.terminalVM.category = categoryNamePath;
                            $scope.treeData.showTree = false;
                            //toggle有点变态
                            //临时方案，解决关闭toggle层
                            $(document).click();
                        });
                    }
                }
            }
        };

        //左边品类树设置
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
                if(treeNode == undefined){
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    treeObj.expandNode(treeObj.getNodeByParam("id","0",null), true, false, true);
                }
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

        //左侧品类树点击函数
        function afterClick(event, treeId, treeNode) {
            $timeout(function() {
                $scope.queryResult = [];
                $scope.checkCategoryCodes = [];
                if (treeNode.leaf) { //如果是叶子节点

                } else { //如果不是叶子节点
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    treeObj.expandNode(treeNode, true, false, true);

                    $scope.queryList(treeNode.id);
                    $scope.selectCategory = treeNode.id;
                    $scope.selectNode = treeNode;
                }
            });
        };

        //树删除节点
        var reAsync = function(id){
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            treeObj.removeNode(treeObj.getNodeByParam("id",id,null),false);
        }

        //移动树节点
        var addNode = function(parentId, id){
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var parentNode = treeObj.getNodeByParam("id",parentId,null);
            var node = treeObj.getNodeByParam("id",id,null);
            //treeObj.addNodes(parentNode,0,node,true);
            treeObj.reAsyncChildNodes(parentNode, "refresh",false);
        }

        //右侧列表查询函数
        $scope.queryList = function(parameter){
            if(parameter == ''|| parameter==undefined){
                parameter = "0";
            }
            McService.queryMcCategoryListByParentCode(parameter).then(
                function(data) {
                    if(data.status == 200){
                        $scope.queryResult = data.items;
                    }else{
                        console.error('Error while searching mcCategory by ' +  parameter);
                    }
                    $scope.searching = false;
                },
                function(errResponse) {
                    $scope.searching = false;
                    console.error('Error while searching mcCategory by ' +  parameter);
                }
            )
        };

        //选择上级品类弹出框
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: "view/mc/mcCategory/tree.html",
                controller: function($scope, $modalInstance){

                    $scope.selectCode = "";
                    $scope.selectGrade = "";

                    $scope.treeData2 = {
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
                                onAsyncSuccess: onAsyncSuccess2,
                                onAsyncError: onAsyncError2,
                                onClick: afterClick2
                            }
                        }
                    };

                    //异步加载成功
                    function onAsyncSuccess2(event, treeId, treeNode, msg) {

                        $timeout(function() {
                            $scope.treeData2.loading = false;
                            if(treeNode == undefined){
                                var treeObj = $.fn.zTree.getZTreeObj("treeChoice");
                                treeObj.expandNode(treeObj.getNodeByParam("id","0",null), true, false, true);
                            }
                        });
                        return true;
                    };

                    //异步加载失败
                    function onAsyncError2(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                        $timeout(function() {

                            $scope.treeData2.loading = false;
                        });
                        toaster.pop('error', '加载商品品类数据出错，请重试！');
                    };

                    //商品品类树点击函数
                    function afterClick2(event, treeId, treeNode) {
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
                            $scope.categoryName = categoryNamePath;
                            $scope.selectCode = treeNode.id;
                            $scope.selectGrade = treeNode.grade + 1;
                            //toggle有点变态
                            //临时方案，解决关闭toggle层
                            $(document).click();
                        });
                    };

                    $scope.ok = function () {
                        if($scope.selectCode == ""){
                            toaster.pop('error', '上级品类不能为空！');
                            return;
                        }
                        if($scope.selectCode == "0"){
                            $scope.selectCode = null;
                        }
                        moveCategory($scope, $scope.selectCode, $scope.selectGrade);
                        $modalInstance.dismiss();
                        return false;
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                        return false;
                    };
                }
            });
        };

        //根据code删除函数
        var deleteByCode = function(scope,modalInstance,code){
            McService.deleteByCode(code).then(
                function(data) {
                    if(data.status == 200){
                        $scope.queryList($scope.selectCategory);
                        $scope.checkCategoryCodes = [];//清空全选按钮
                        reAsync(code);//刷新左侧树
                        toaster.pop('success', '删除成功！');
                    }else{
                        toaster.pop('error', '删除失败！');
                        console.error('Error while delete mcCategory by ' +  code);
                    }
                    scope.confirmData.processing = false;
                    modalInstance.dismiss();
                    return true;
                },
                function(errResponse) {
                    toaster.pop('error', '删除失败！');
                    console.error('Error while delete mcCategory by ' +  code);
                    scope.confirmData.processing = false;
                    modalInstance.dismiss();
                    return true;
                }
            )
        }

        $scope.deleteByCode = function(item){
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance, McService) {
                    $scope.confirmData = {
                        text: '确定删除品类[' + item.name + ']？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    };
                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        McService.queryMcCategoryListByParentCode(item.code).then(
                            function(data) {
                                if(data.status == 200){
                                    if(data.items.length == 0){
                                        deleteByCode($scope,$modalInstance,item.code);
                                    }else{
                                        toaster.pop('error', '品类有子品类，不允许删除！');
                                        $scope.confirmData.processing = false;
                                        return true;
                                    }
                                }else{
                                    toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                                    console.error('Error while searching mcCategory by ' +  item.code);
                                    $scope.confirmData.processing = false;
                                    $modalInstance.dismiss();
                                    return true;
                                }
                            },
                            function(errResponse) {
                                toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                                console.error('Error while searching mcCategory by ' +  item.code);
                            }
                        )
                    }
                }
            });
        };

        //显示或隐藏品类
        $scope.hideOrDisplay = function(item){
            var data = {"code":item.code,"isValid":!item.isValid}
            McService.updateMcCategory(data).then(
                function(data) {
                    if(data.status == 200){
                        toaster.pop('success', !item.isValid?'显示成功！':'隐藏成功！');
                        item.isValid = !item.isValid;
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                        console.error('Error while hideOrDisplay mcCategory by ' +  item.code);
                    }
                },
                function(errResponse) {
                    toaster.pop('error', '服务器错误！');
                    console.error('Error while hideOrDisplay mcCategory by ' +  item.code);
                }
            )
        };

        //批量隐藏
        $scope.batchHide = function(){
            $scope.checkCategoryCodes.forEach(function(e){
                var data = {"code": e.code,"isValid":false};
                McService.updateMcCategory(data).then(
                    function(data) {
                        if(data.status == 200){
                            e.isValid = false;
                            toaster.pop('error', '隐藏'+ e.name +'成功！');
                        }else{
                            toaster.pop('error', '隐藏'+ e.name +'失败！');
                            console.error('Error while hideOrDisplay mcCategory by ' +  e);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while hideOrDisplay mcCategory by ' +  e);
                    }
                )
            })
        };

        //批量显示
        $scope.batchDisplay = function(){
            $scope.checkCategoryCodes.forEach(function(e){
                var data = {"code": e.code, "isValid":true};
                McService.updateMcCategory(data).then(
                    function(data) {
                        if(data.status == 200){
                            e.isValid = true;
                            toaster.pop('error', '显示'+ e.name +'成功！');
                        }else{
                            toaster.pop('error', '显示'+ e.name +'失败！');
                            console.error('Error while hideOrDisplay mcCategory by ' + e.code);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while hideOrDisplay mcCategory by ' + e.code);
                    }
                )
            })
        };

        //批量移动品类
        var moveCategory = function(scope, parentCode, grade){
            $scope.checkCategoryCodes.forEach(function(e){
                var data = {"code": e.code, "parentCode":parentCode, "grade":grade};
                McService.updateMcCategory(data).then(
                    function(data) {
                        if(data.status == 200){
                            $scope.queryList($scope.selectCategory);
                            $scope.checkCategoryCodes = [];//清空全选按钮

                            if(parentCode == null){
                                parentCode = 0;
                                console.log("gen")
                            }
                            addNode(parentCode,e.code);
                            reAsync(e.code);//刷新左侧树
                            toaster.pop('success', '品类'+ e.name+'操作成功！');
                        }else{
                            toaster.pop('error', (data && data.msg) ? data.msg : '品类'+ e.name+'操作失败！');
                            console.error('Error while move mcCategory by ' + e.code);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while move mcCategory by ' + e.code);
                    }
                )
            })
        };

        //批量删除
        $scope.batchDelete = function(){
            $scope.checkCategoryCodes.forEach(function(e){
                McService.queryMcCategoryListByParentCode(e.code).then(
                    function(data) {
                        if(data.status == 200){
                            if(data.items.length == 0){
                                McService.deleteByCode(e.code).then(
                                    function(data) {
                                        if(data.status == 200){
                                            $scope.queryList($scope.selectCategory);
                                            $scope.checkCategoryCodes = [];//清空全选按钮
                                            reAsync(e.code);//刷新左侧树
                                            toaster.pop('error', '品类'+ e.name +'删除成功！');
                                        }else{
                                            toaster.pop('error', '品类'+ e.name +'删除失败！');
                                            console.error('Error while delete mcCategory by ' +  e.code);
                                        }
                                    },
                                    function(errResponse) {
                                        toaster.pop('error', '品类'+ e.name +'删除失败！');
                                        console.error('Error while delete mcCategory by ' +  e.code);
                                    }
                                )
                            }else{
                                toaster.pop('error', '品类'+ e.name +'有子品类，不允许删除！');
                            }
                        }else{
                            toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                            console.error('Error while searching mcCategory by ' +  e.code);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                        console.error('Error while searching mcCategory by ' +  e.code);
                    }
                )
            })
        }

        $scope.checkCategoryCodes = [];
        //处理是否选中
        var processChecked = function(item) {
            var hasChecked = isItemChecked(item.code);
            if (item.IsChecked && !hasChecked) {
                //当前选中，之前未选，在已选中添加
                $scope.checkCategoryCodes.push(item);
            } else if (!item.IsChecked && hasChecked) {
                //当前未选中，之前已选，在已选中移除
                for (var j = 0; j < $scope.checkCategoryCodes.length; j++) {
                    if ($scope.checkCategoryCodes[j].code == item.code) {
                        $scope.checkCategoryCodes.splice(j, 1);
                        break;
                    }
                }
            }
        };

        //选中、取消事件
        $scope.processCheckedItem = function(item) {
            processChecked(item);
            $scope.isAllChecked = allChecked();
        };

        //是否已选中
        var isItemChecked = function(code) {
            for (var j = 0; j < $scope.checkCategoryCodes.length; j++) {
                if ($scope.checkCategoryCodes[j].code == code) {
                    return true;
                }
            }
            return false;
        };

        //是否已全选
        var allChecked = function() {
            for (var i = 0; i < $scope.queryResult.length; i++) {
                if (!$scope.queryResult[i].IsChecked)
                    return false;
            }
            return true;
        };

        //全选、反选事件
        $scope.selectAll = function() {
            var isSelect = $scope.isAllChecked;
            for (var i = 0; i < $scope.queryResult.length; i++) {
                $scope.queryResult[i].IsChecked = !isSelect;
                processChecked($scope.queryResult[i]);
            }
            $scope.isAllChecked = !isSelect;
        };

        $scope.queryList();

    }];
});
