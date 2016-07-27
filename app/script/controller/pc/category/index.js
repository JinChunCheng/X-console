define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'toaster', 'PcService', function($rootScope, $scope, $state, $stateParams, $timeout, $modal, toaster, PcService) {

        ph.mark($rootScope, {
            state: 'pc.category.index',
            title: '产品品类管理'
        });

        $scope.treeData = {
            loading: true,
            settings: {
                async: {
                    enable: true,
                    url: config.pc_domain + '/catmenus/',
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
                    removeTitle: "删除",
                    renameTitle: "修改",
                    showRemoveBtn: function(treeId, treeNode) {
                        return true;
                    }
                },
                callback: {
                    onAsyncSuccess: onAsyncSuccess,
                    onAsyncError: onAsyncError,
                    onCheck: onCheck,
                    beforeEditName: beforeEdit,
                    beforeRemove: beforeRemove,
                    beforeEdit: beforeEdit,
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

        /**
         * 删除节点
         * @param treeId
         * @param treeNode
         * @author:eric.gao
         */
        function beforeRemove(treeId, treeNode) {
            //var treeId = $(element).attr('id');
            //var zTree = $.fn.zTree.getZTreeObj(treeId);
            //zTree.selectNode(treeNode);
            var text = '确定删除分类[' +treeNode.name + ']？';
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
                        PcService.deleteCategory(treeNode.id).then(
                            function(data) {
                                //alert(data.msg);
                                toaster.pop('success', data.msg);
                                $state.go('pc.category.index', null, {reload: true});
                                $modalInstance.dismiss();
                            },
                            function(errResponse) {
                                toaster.pop('success', '删除失败！');
                                console.error('Error while deleting Category.');
                            }
                        );
                        return true;
                    }
                }
            });

            return false;
        }

        //设置选中值
        function onCheck(e, treeId, treeNode) {
            var treeId = $(element).attr('id');
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var checkedIds = [];
            var checkedNodes = zTree.getCheckedNodes(true);
            $.each(checkedNodes, function(index, value) {
                checkedIds.push(value.id);
            });
            //设置angular对象中的选中值
            scope.checkedNodes = checkedIds.join(',');
        }

        $scope.searching = false;
        $scope.loading = false;
        $scope.isAllChecked = false;

        // if ($routeParams.section == 'category' && ($routeParams.action == 'index')) { //需要菜单的action加在这里
        //     $scope.hasMenu = true;
        // } else {
        //     $scope.hasMenu = false;
        // }

        // if ($routeParams.section == 'category' && ($routeParams.action == 'edit')) { //需要预加载一条品类信息
        //     $scope.showCategoryInfo = true;
        // } else {
        //     $scope.showCategoryInfo = false;
        // }

        $scope.back = function() {
            $state.go('pc.category.index', {
                reload: true
            });
        };

        /**
         * 将以base64的图片url数据转换为Blob
         * @param urlData
         * 用url方式表示的base64图片数据
         */
        function convertBase64UrlToBlob(urlData) {
            //console.log(urlData);
            var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            return new Blob([ab], {
                type: 'image/png'
            });
        }

        /**
         * 品类-删除品类
         * @param isValid
         * @author eric.gao
         */
        $scope.deleteCategory = function(treeNode) {
            console.log(treeNode);
            //查询属性列表
            PcService.deleteCategory(treeNode.id).then(
                function(data) {
                    alert(data.msg);
                },
                function(errResponse) {
                    console.error('Error while deleting Category.');
                }
            );

            $scope.isSaving = false;
        };

        /**
         * 弹框: 为品类添加属性时
         * @author:eric.gao
         */
        $scope.toggleDialog = function(isToggle) {
            //TODO:清理之前的数据
            var categoryCode = $scope.categoryCode;
            var modalInstance = $modal.open({
                size: 'lg',
                templateUrl: 'view/pc/category/attributes.html',
                controller: function($scope, $modalInstance) {
                    resetDialog($scope);
                    $scope.attrVM = {
                        title: '属性列表'
                    };
                    $scope.categoryCode = categoryCode;
                    $scope.selectedAttrs = []; //被选中的属性
                    $scope.checkedAttrList = [];
                    $scope.toggleAttr = function(attr) {
                        toggleAttr($scope, attr);
                    };
                    $scope.removeSelectedAttr = function(attr) {
                        removeSelectedAttr($scope, attr);
                    };
                    $scope.doSort = function(sortType, field) {
                        doSort($scope, sortType, field);
                    };

                    /**
                     * 为品类添加属性时的过滤属性条件数组
                     * @author:eric.gao
                     */
                    $scope.attrCondition = {
                        name: '',
                        code: '',
                        attributeVal: '',
                        fieldType: '',
                        standard: '',
                        required: '',
                        tags: '',
                        sorting: 'id asc',
                        pageNo: 1,
                        pageSize: 10,
                        Items: []
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        bindAttrs2Category($scope, $modalInstance);
                        return false;
                    }

                    findAttrs($scope);

                    $scope.findAttrs = function() {
                        findAttrs($scope);
                    };
                }
            });
        };


        /**
         * 弹框时自动加载属性list --- 自动排除该品类已绑定的属性
         * @param isToggle
         */
        var findAttrs = function($scope) {
            $scope.loading = true;
            //查询属性列表
            PcService.searchAttributeByCategoryCode($scope.attrCondition, $scope.categoryCode).then(
                function(data) {
                    $scope.attrList = data.items;
                    $scope.loading = false;
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while searching Attributes by conditions.');
                }
            );
        };

        /**
         * attrsDialog里动态显示选中的属性
         */
        var toggleAttr = function($scope, attr) {
            var isChecked = $scope.checkedAttrList[attr.code];
            if (isChecked) {
                $scope.selectedAttrs.push(attr);
            } else {
                //$scope.selectedAttrs.pop(attr);
                for (var i = 0; i < $scope.selectedAttrs.length; i++) {
                    var curAttr = $scope.selectedAttrs[i];
                    if (curAttr.code == attr.code) {
                        $scope.selectedAttrs.splice(i, 1);
                        return;
                    }
                }
            }
        };

        var removeSelectedAttr = function($scope, attr) {
            for (var i = 0; i < $scope.selectedAttrs.length; i++) {
                var curAttr = $scope.selectedAttrs[i];
                if (curAttr.code == attr.code) {
                    $scope.selectedAttrs.splice(i, 1);
                    return;
                }
            }
            //$scope.selectedAttrs.pop(attr);
        };

        /**
         * 清理之前的数据
         * @param attr
         */
        var resetDialog = function($scope) {
            $scope.selectedAttrs = []; //被选中的属性
            $scope.attrCondition = {
                name: '',
                code: '',
                attributeVal: '',
                fieldType: '',
                standard: '',
                required: '',
                tags: '',
                sorting: 'id asc',
                pageNo: 1,
                pageSize: 10,
                Items: []
            };
        };

        /**
         * 将选中的属性绑定到品类上
         * @returns {boolean}
         */
        var bindAttrs2Category = function(attrScope, $modalInstance) {

            attrScope.attrVM.processing = true;
            //查询属性列表
            attrScope.categoryAttrs = {};
            attrScope.categoryAttrs.attributes = [];
            for (var i = 0; i < attrScope.selectedAttrs.length; i++) {
                var obj = {};
                obj.code = attrScope.selectedAttrs[i].code;
                attrScope.categoryAttrs.attributes[i] = obj;
            }

            attrScope.categoryAttrs.categoryCode = attrScope.categoryCode;
            PcService.bindAttrs2Cat(attrScope.categoryAttrs).then(
                function(data) {
                    // attrScope.attrList = data.items;
                    $modalInstance.dismiss();
                    //绑定后更新加载属性列表
                    queryAttributes(attrScope.categoryCode);
                    // PcService.findAttrsByCat(attrScope.categoryCode).then(
                    //     function(data) {
                    //         $scope.queryResult.items = data;
                    //     },
                    //     function(errResponse) {
                    //         console.error('Error while loading Attributes by category.');
                    //     }
                    // );
                    attrScope.attrVM.processing = false;
                },
                function(errResponse) {
                    console.error('Error while binding Attributes to category.');
                    attrScope.attrVM.processing = false;
                }
            );
        };

        /**
         * attrsDialog里属性的排序
         * @param catAttrId
         * @author eric.gao
         */
        var doSort = function($scope, sortType, field) {
            $scope.attrCondition.sorting = field + "  " + sortType;
            findAttrs($scope);
        };

        /**
         * 移除品类的属性(单条)
         * @param catAttrId
         * @author eric.gao
         */
        var removeCatAttr = function(catAttrId, confirmScope, $modalInstance) {
            PcService.removeCatAttr(catAttrId).then(
                function(data) {
                    confirmScope.confirmData.processing = false;
                    toaster.pop('success', '删除成功！');
                    $modalInstance.dismiss();
                    queryAttributes($scope.categoryCode);
                },
                function(errResponse) {
                    confirmScope.confirmData.processing = false;
                    toaster.pop('error', '删除失败！');
                    console.error('Error while removing Category Attribute.');
                }
            );
        };

        /**
         * 品类-属性 修改[修改<规格属性><必填>]
         * @author eric.gao
         */
        $scope.modifyCatAttr = function(catAttr) {
            $scope.catAttr = catAttr;
            //console.log($scope.catAttr.standard);
            if ($scope.catAttr.standard == true) {
                $scope.catAttr.standard == 1;
            } else {
                $scope.catAttr.standard == 0;
            }
            if ($scope.catAttr.required == true) {
                $scope.catAttr.required == 1;
            } else {
                $scope.catAttr.required == 0;
            }

            //查询属性列表
            PcService.modifyCatAttr($scope.catAttr).then(
                function(data) {
                    alert(data.msg);
                },
                function(errResponse) {
                    console.error('Error while modifying Category Attribute.');
                }
            );

            $scope.isSaving = true;
        };

        /**
         * 处理属性列表的多选值情况
         * @author eric.gao
         */
        $scope.seletctedCatAttrs = [];
        //处理是否选中
        var processItemsChecked = function(items) {
            var isAll = true;
            if (items && $scope.seletctedCatAttrs) {
                for (var i = 0; i < items.length; i++) {
                    if (isItemChecked(items[i].id)) {
                        items[i].checked = true;
                    } else
                        isAll = false;
                }
            }
            $scope.isAllChecked = isAll;
        };

        var processChecked = function(item) {
            var hasChecked = isItemChecked(item.id);
            if (item.checked && !hasChecked) {
                //当前选中，之前未选，在已选中添加
                $scope.seletctedCatAttrs.push(item.id);
            } else if (!item.checked && hasChecked) {
                //当前未选中，之前已选，在已选中移除
                for (var j = 0; j < $scope.seletctedCatAttrs.length; j++) {
                    if ($scope.seletctedCatAttrs[j] == item.id) {
                        $scope.seletctedCatAttrs.splice(j, 1);
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
        var isItemChecked = function(id) {
            for (var j = 0; j < $scope.seletctedCatAttrs.length; j++) {
                if ($scope.seletctedCatAttrs[j] == id) {
                    return true;
                }
            }
            return false;
        };

        //是否已全选
        var allChecked = function() {
            for (var i = 0; i < $scope.queryResult.items.length; i++) {
                if (!$scope.queryResult.items[i].checked)
                    return false;
            }
            return true;
        };
        $scope.isAllChecked = false;
        //全选、反选事件
        $scope.selectAll = function() {
            var isSelect = $scope.isAllChecked;
            for (var i = 0; i < $scope.queryResult.items.length; i++) {
                $scope.queryResult.items[i].checked = !isSelect;
                processChecked($scope.queryResult.items[i]);
            }
            $scope.isAllChecked = !isSelect;
        };
        /**
         * 品类-属性 批量删除某个品类下的属性s
         * @author eric.gao
         */
        var batchDelCatAttr = function(confirmScope, $modalInstance) {
            console.log($scope.seletctedCatAttrs);

            //批量删除某个品类下的属性s
            PcService.batchDelCatAttr($scope.seletctedCatAttrs).then(
                function(data) {
                    confirmScope.confirmData.processing = false;
                    toaster.pop('success', '属性移除成功！');
                    $modalInstance.dismiss();
                    queryAttributes($scope.categoryCode);
                    // //移除后更新加载属性列表
                    // PcService.findAttrsByCat($scope.categoryCode).then(
                    //     function(data) {
                    //         $scope.queryResult.items = data;
                    //     },
                    //     function(errResponse) {
                    //         console.error('Error while loading Attributes by category.');
                    //     }
                    // );
                },
                function(errResponse) {
                    toaster.pop('error', '属性移除失败！');
                    confirmScope.confirmData.processing = false;
                    console.error('Error while Batch Deleting Category Attributes.');
                }
            );

            $scope.isSaving = true;
        };

        $scope.beforeDelete = function() {};

        /**
         * 菜单点击时加载其下所有属性
         * @author:eric.gao
         */
        $scope.showMore = false;
        $scope.queryResult = [];
        $scope.queryResult.items = [];

        function afterClick(event, treeId, treeNode) {
            $timeout(function() {
                $scope.categoryCode = treeNode.id;
                $scope.cateAttrs = [];
                if (treeNode.leaf) { //如果是叶子节点
                    queryAttributes(treeNode.id);
                } else { //如果不是叶子节点
                    $scope.showMore = false;
                    $scope.queryResult.items = [];
                }
            });
        };

        var queryAttributes = function(categoryCode) {
            $scope.searching = true;
            $scope.showMore = true;
            //查询属性列表
            PcService.findAttrsByCat(categoryCode).then(

                function(data) {
                    $scope.searching = false;
                    //$scope.cateAttrs = data;
                    $scope.queryResult.items = data;
                    for (var i = 0; i < data.length; i++) {
                        var attributeVal = data[i].attributeVal;
                        if (attributeVal) {
                            //$scope.queryResult.Items[i].attributeVal= eval('(' +  data.items[i].attributeVal + ')');
                            //判断返回值不是 json 格式
                            try {
                                $scope.queryResult.items[i].attributeVal = jQuery.parseJSON(attributeVal);
                            } catch (err) {
                                $scope.queryResult.items[i].attributeVal = '';
                            }
                        }
                    }
                },
                function(errResponse) {
                    $scope.searching = false;
                    console.error('Error while searching Attributes by category.');
                }
            );
        };

        /**
         * beforeEdit
         * 点击品类菜单紧邻右侧的'编辑'按钮时
         */
        function beforeEdit(treeId, treeNode) {
            $state.go('pc.category.edit', {
                code: treeNode.id
            });
            return false;
        };

        //存储各个级别menu的data
        $scope.selectDatas = [];
        $scope.getOptions = function(gradeIndex) {
            return $scope.selectDatas[gradeIndex].options;
        };

        $scope.removeCatAttr = function(item) {
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance) {
                    $scope.confirmData = {
                        text: '确定删除[' + item.attributeCode + ' - ' + item.attributeName + ']？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        removeCatAttr(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        }

        $scope.batchDelCatAttr = function() {
            var attrs = $scope.seletctedCatAttrs;
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function($scope, $modalInstance) {
                    $scope.confirmData = {
                        text: '确定批量删除这'+attrs.length+'条属性？',
                        processing: false
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        batchDelCatAttr($scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

    }];
});
