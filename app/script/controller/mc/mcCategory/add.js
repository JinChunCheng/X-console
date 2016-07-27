define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http','$timeout', 'McService', 'toaster', function($rootScope, $scope, $state, $stateParams, $http, $timeout, McService, toaster) {
        ph.mark($rootScope, {
            state: 'mc.mcCategory.add',
            title: '添加品类'
        });

        $scope.loading = false;
        $scope.saving = false;
        $scope.category = {};
        $scope.categoryName = "";
        $scope.mainImgs = [];
        $scope.proCategorys = [];
        $scope.category.parentCode = "";

        //上传图片
        var uploadFile = function(formData, imgSources) {
            McService.uploadFile(formData).then(function(res) {
                imgSources.push({
                    picIndex: imgSources.length + 1,
                    url: config.img_pc_domain +"/"+ res.items,
                    picUrl:res.items
                });
            }, function(err) {
                toaster.pop('error', '图片上传失败！');
            });
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
                $scope.categoryName = categoryNamePath;
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

        //产品品类树设置
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
            toaster.pop('error', '加载品品类数据出错，请重试！');
        };

        //商品品类树点击函数
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

        $timeout(function() {
            $scope.addProCategory();
        },500);

        //保存品类
        $scope.save = function(){
            if($scope.categoryForm.$invalid){
                toaster.pop('error', '校验不通过！');
                return;
            }

            if($scope.categoryName == ""){
                toaster.pop('error', '上级品类不能为空！');
                return;
            }

            //if($scope.proCategorys[0].code == ""){
            //    toaster.pop('error', '关联产品品类不能为空！');
            //    return;
            //}

            $scope.saving = true;

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

            McService.saveMcCategory($scope.category).then(
                function(data) {
                    if(data.status == 200){
                        $scope.back();
                    }else{
                        $scope.saving = false;
                        toaster.pop('error', (data && data.msg) ? data.msg : '服务器错误！');
                        console.error('Error while save mcCategory by '+ $scope.category.name);
                    }
                },
                function(errResponse) {
                    $scope.saving = false;
                    toaster.pop('error', '保存商品品类失败！');
                    console.error('Error while save mcCategory by ');
                }
            )
        };

        $scope.back = function(){
            $state.go('mc.mcCategory.list', {
                reload: true
            });
        }
    }];
});
