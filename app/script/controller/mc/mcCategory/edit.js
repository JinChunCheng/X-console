define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http','$timeout', 'McService', 'toaster', function($rootScope, $scope, $state, $stateParams, $http, $timeout, McService, toaster) {
        ph.mark($rootScope, {
            state: 'mc.mcCategory.edit',
            title: '修改品类'
        });

        $scope.loading = false;
        $scope.isSaving = false;
        $scope.category = {};
        $scope.mainImgs = [];
        $scope.proCategorys = [];
        $scope.category.parentCode = "";

        //上传图片
        var uploadFile = function(formData, imgSources) {
            McService.uploadFile(formData).then(
                function(res) {
                    imgSources.push({
                        picIndex: imgSources.length + 1,
                        url: config.img_pc_domain +"/"+ res.items,
                        picUrl:res.items
                    });
                },
                function(err) {
                    toaster.pop('error', '图片上传失败！');
                }
            );
        };

        $scope.mainImgSuccess = function(file, data, formData) {
            uploadFile(formData, $scope.mainImgs);
        };

        //更改图片顺序
        $scope.editIndex = function(n) {
            var obj = $scope.mainImgs[n];
            $scope.mainImgs[n] = $scope.mainImgs[0];
            $scope.mainImgs[0] = obj;
            $scope.mainImgs[0].index = 0;
            $scope.mainImgs[n].index = n;
        }

        //删除图片
        $scope.delImg = function(n) {
            $scope.mainImgs.splice(n, 1)
        }

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
                if(treeNode == undefined){
                    var treeObj = $.fn.zTree.getZTreeObj("parentTree");
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

                $scope.category.parentName = categoryNamePath;
                if(treeNode.id != '0'){
                    $scope.category.parentCode = treeNode.id;
                }else{
                    $scope.category.parentCode = null;
                }

                $scope.category.grade = treeNode.grade + 1;

                //toggle有点变态
                //临时方案，解决关闭toggle层
                $(document).click();
            });
        };

        //商品品类树设置
        $scope.proTreeData = {
            loading: true,
            settings: {
                async: {
                    enable: true,
                    url: config.pc_domain + "/catmenus/",
                    autoParam: ["id"],
                    type: 'POST'
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
                    onAsyncSuccess: proAsyncSuccess,
                    onAsyncError: proAsyncError,
                    onClick: onClick
                }
            }
        };

        //异步加载成功
        function proAsyncSuccess(event, treeId, treeNode, msg) {
            $timeout(function() {
                $scope.proTreeData.loading = false;
            });
            return true;
        };

        //异步加载失败
        function proAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            $timeout(function() {
                $scope.proTreeData.loading = false;
            });
            toaster.pop('error', '加载商品品类数据出错，请重试！');
        };

        //产品品类树点击函数
        function onClick(event, treeId, treeNode) {
            $timeout(function() {
                //if (!treeNode.leaf) {
                //    return false;
                //}
                var num = treeId.substring("pcTree".length,treeId.length);
                var paths = treeNode.getPath();
                var categoryNamePath = '';
                if (paths && paths.length > 0) {
                    categoryNamePath = paths.map(function(item) {
                        return item.name;
                    }).join(' - ');
                }
                $scope.proCategorys[num].name = categoryNamePath;
                $scope.proCategorys[num].code = treeNode.id;
                //toggle有点变态
                //临时方案，解决关闭toggle层
                $(document).click();
            });
        };

        //添加关联产品
        $scope.addProCategory = function(){
            var obj = {"name":"","code":""};
            $scope.proCategorys.push(obj);
        }

        //删除关联产品
        $scope.delProCategory = function(n){
            $scope.proCategorys.splice(n, 1)
        }

        //修改品类
        $scope.update = function(){
            if($scope.categoryForm.$invalid){
                toaster.pop('error', '校验不通过！');
                return;
            }

            if($scope.category.parentName == ""){
                toaster.pop('error', '上级品类不能为空！');
                return;
            }

            //if($scope.proCategorys[0].code == ""){
            //    toaster.pop('error', '关联产品品类不能为空！');
            //    return;
            //}

            $scope.isSaving = true;
            if($scope.proCategorys.length > 0){
                $scope.proCategorys.forEach(function(e){
                    if(e.code != ""){
                        $scope.category.children = $scope.proCategorys;
                    }
                })
            }
            if($scope.mainImgs.length>0){
                var str = "";
                $scope.mainImgs.forEach(function(e){
                    str = str + e.picUrl +";";
                })
                $scope.category.picUrl = str;
            };

            McService.updateMcCategory($scope.category).then(
                function(data) {
                    if(data.status == 200){
                        $scope.back();
                    }else{
                        $scope.isSaving = false;
                        toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                        console.error('Error while update mcCategory by ');
                    }
                },
                function(errResponse) {
                    $scope.isSaving = false;
                    toaster.pop('error', '修改品类数据出错！');
                    console.error('Error while update mcCategory by ');
                }
            )
        };

        //加载数据
        $scope.load = function(){
            McService.queryMcCategoryByCode($stateParams.code).then(
                function(data) {
                    if(data.status == 200){
                        $scope.category = data.items;

                        if(data.items.children == null){
                            $scope.addProCategory();
                        }else{
                            $scope.proCategorys = data.items.children;
                        }

                        if($scope.category.picUrl != null){
                            var pics = $scope.category.picUrl.split(";");
                            pics.forEach(function(e){
                                if(e != ""){
                                    var obj = {
                                        url: config.img_pc_domain +"/"+ e,
                                        picUrl:e
                                    }
                                    $scope.mainImgs.push(obj);
                                }
                            })
                        }
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                        console.error('Error while load mcCategory by '+ $stateParams.code);
                    }
                },
                function(errResponse) {
                    toaster.pop('error', '加载品类数据出错！');
                    console.error('Error while load mcCategory by '+ $stateParams.code);
                }
            )
        }

        $scope.load();//进入页面根据code加载数据

        //返回列表页面
        $scope.back = function(){
            $state.go('mc.mcCategory.list', {
                reload: true
            });
        }
    }];
});
