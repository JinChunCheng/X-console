define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', '$filter', 'auditService', '$timeout', 'toaster', 'supService', 'metaService', function($rootScope, $scope, $state, $stateParams, $modal, $filter, auditService, $timeout, toaster, supService, metaService) {

        ph.mark($rootScope, {
            state: 'pc.product.newProductList',
            title: '新品列表'
        });

        //already have listVM data or not
        var hasCache = $stateParams.listVM ? true : false;
        var defaultCondition = {
            sorting: 'update_time desc',
            statusList: [1, 2],
            pageNo: 1,
            pageSize: 10
        };
        /**
         * common data
         * @type {Object}
         * 产品状态(esin的状态枚举：0：新添加，即暂存；1：待审核；2：审核通过-齐全上架；
         * 3：审核失败；4：部分上架；5：无上架）(sku的状态枚举：10：新添加；11：上架；12：锁定上架；13：下架；14：暂停销售)
         */
        $scope.listVM = $stateParams.listVM || {
            condition: angular.copy(defaultCondition),
            pagination: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            //statusList:[1,2],
            items: [],
            esinStatusList: [{
                value: 0,
                text: '待提交'
            }, {
                value: 3,
                text: '新品审核未通过'
            }]

        };
        /**
         * z-tree config
         * @type {Object}
         */
        $scope.treeData = {
            initializing: true,
            settings: {
                async: {
                    enable: true,
                    url: config.pc_domain + '/catmenus/',
                    autoParam: ["id"],
                    type: 'POST'
                },
                callback: {
                    onAsyncSuccess: onAsyncSuccess,
                    onAsyncError: onAsyncError,
                    onClick: onClick
                }
            }
        };

        $scope.sortClass = function(field) {
            if ($scope.listVM.condition.sorting) {
                var sortArr = $scope.listVM.condition.sorting.split(' ');
                if (field == sortArr[0]) {
                    var cls = 'text-success ';
                    switch (sortArr[1]) {
                        case 'asc':
                            cls += 'fa-caret-up';
                            break;
                        case 'desc':
                        default:
                            cls += 'fa-caret-down';
                            break;
                    }
                    return cls;
                }
            }
            return 'fa-unsorted';
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
            toaster.pop('error', '加载产品品类数据出错，请重试！');
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
        }
        /**
         * reSort search list
         * @param  {string} field database field name
         */
        $scope.reSort = function(field) {
            if ($scope.listVM.loading)
                return false;
            var sortingArr = $scope.listVM.condition.sorting.split(' ');
            var preField = sortingArr[0];
            var preOrderMode = sortingArr[1];

            var newOrderMode = 'desc';
            if (field == preField) {
                newOrderMode = (preOrderMode == 'asc' ? 'desc' : 'asc');
            }

            $scope.listVM.condition.sorting = field + ' ' + newOrderMode;
            $scope.page(1);
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
         * 异步加载supplier下拉查询控件
         * @param  {string} sup [supplier name or email]
         * @return {void}     [description]
         */
        $scope.refreshSupplier = function(sup) {
            if (!sup)
                return false;

            $scope.listVM.supplierLoading = true;

            var params = {
                email: sup,
                companyName: sup
            }
            supService.filterSupplier(params).then(function(res) {
                if (res.status == 200) {
                    $scope.listVM.suppliers = res.items;
                }
                $scope.listVM.supplierLoading = false;
            });
        };
        $scope.pageChanged = function() {
            search($scope.view.pagination.pageNumber);
        };
        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };
        $scope.listVM.checkedProductCodes = [];
        var search = function() {
            $scope.listVM.searching = true;
            $scope.listVM.checkedProductCodes = [];
            var selectedSupplier = $scope.listVM.condition.selectedSupplier;
            $scope.listVM.condition.supplierId = selectedSupplier ? selectedSupplier.supplierId : null;
            auditService.searchNewproductList($scope.listVM.condition).then(function(data) {
                if (data && data.status === 200) {
                    $scope.listVM.items = data.items;
                    $scope.listVM.paginate = data.paginate;
                } else {
                    toaster.pop('error', data.msg);
                }
                $scope.listVM.searching = false;
            }, function(err) {
                $scope.listVM.searching = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
        //进入页面第一次查询
        if (!hasCache)
            search();

        /**
         * 分页控件翻页事件
         * @return {[type]} [description]
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

        $scope.doSort = function(sortType, field) {
            $scope.listVM.condition.sorting = field + "  " + sortType;
            $scope.page(1);
        };

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = {
                pageNo: 1,
                pageSize: 10
            }
        };

        //处理是否选中
        var processItemsChecked = function(items) {
            var isAll = true;
            if (items && $scope.listVM.checkedProductCodes) {
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
                $scope.listVM.checkedProductCodes.push(item.code);
            } else if (!item.IsChecked && hasChecked) {
                //当前未选中，之前已选，在已选中移除
                for (var j = 0; j < $scope.listVM.checkedProductCodes.length; j++) {
                    if ($scope.listVM.checkedProductCodes[j] == item.code) {
                        $scope.listVM.checkedProductCodes.splice(j, 1);
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
            for (var j = 0; j < $scope.listVM.checkedProductCodes.length; j++) {
                if ($scope.listVM.checkedProductCodes[j] == code) {
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
        $scope.submitButton = true;
        /**
         * batch process attribute data
         * @param  {int} status [attribute status]
         */
        $scope.batchProcess = function(status) {
            var text = text = "新品提交待审核";
            var codes = $scope.listVM.checkedProductCodes;
            $scope.listVM.checkedProductCodes = [];
            var auditData = {
                codes: codes,
                openEmail: $rootScope.curUser.loginName,
                status: status
            };
            auditService.submitEsinAudit(auditData).then(
                function(data) {
                    debugger
                    if (data.status == 200) {
                        var result = data.items;
                        if (result.status == "123120") {
                            toaster.pop("success", result.msg + result.items);
                        } else {
                            toaster.pop("error", result.msg + result.items);
                        }
                    } else {
                        toaster.pop("error", data.msg + data.items);
                    }
                    search();
                },
                function(errResponse) {
                    batchScope.confirmData.processing = true;
                    toaster.pop("error", "服务器请求异常！");
                }
            );
            return false;
        };

        /**
         * edit product detail info
         * @param  {int} id esin id
         * @return {[type]}    [description]
         */
        $scope.editProduct = function(code) {
            $state.go('pc.product.edit', {
                code: code,
                from: 'pc.product.newProductList',
                listVM: $scope.listVM
            });
        };
        //单核审核esin
        /**
         * view product detail info
         * @param  {string} code: esin code
         */
        $scope.viewProduct = function(code) {
            $state.go('pc.product.view', {
                code: code,
                from: 'pc.product.newProductList',
                listVM: $scope.listVM
            });
        };
        var auditData = {};
        //批量处理
        $scope.batchAudit = function(status, batchScope, modalInstance) {
            debugger
            if (status == '1') {
                batchScope.confirmData.processing = true;
                auditData = { auditOptions: $scope.auditOption.selectedItems, codes: $scope.listVM.checkedProductCodes, remark: "111" };
                auditService.auditPass(auditData).then(
                    function(data) {
                        batchScope.confirmData.processing = false;
                        if (data.status == '200') {
                            $scope.listVM.checkedProductCodes = [];
                            toaster.pop("success", "审核通过操作成功！");
                        } else {
                            toaster.pop("error", "审核通过操作失败，原因：" + data.msg);
                        }
                        search();
                    },
                    function(errResponse) {
                        batchScope.confirmData.processing = true;
                        toaster.pop("error", "服务器请求异常！");
                    }
                );
            } else if (status == '2') {
                batchScope.confirmData.processing = true;
                auditService.auditNoPass($scope.listVM.checkedProductCodes).then(
                    function(data) {
                        batchScope.confirmData.processing = false;
                        if (data.status == '200') {
                            $scope.listVM.checkedProductCodes = [];
                            toaster.pop("success", "审核不通过操作成功！");
                        } else {
                            toaster.pop("error", "审核不通过操作失败，原因：" + data.msg);
                        }
                        modalInstance.dismiss();
                        search();
                    },
                    function(errResponse) {
                        batchScope.confirmData.processing = true;
                        toaster.pop("error", "服务器请求异常！");
                    }
                );
            }
        };

    }];
});
