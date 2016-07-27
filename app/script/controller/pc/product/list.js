define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$filter', 'toaster', 'supService', 'PcService', function($rootScope, $scope, $state, $stateParams, $timeout, $filter, toaster, supService, PcService) {

        ph.mark($rootScope, {
            state: 'pc.product.list',
            title: '产品列表'
        });

        var hasCache = $stateParams.listVM ? true : false;

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            statusList: [2, 4, 5],
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
            esinStatusList: [{
                value: 2,
                text: '齐全上架'
            }, {
                value: 4,
                text: '部分上架'
            }, {
                value: 5,
                text: '无SKU上架'
            }]
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
            }, function(err) {
                $scope.listVM.supplierLoading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * search product
         */
        var search = function() {
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            var selectedSupplier = $scope.listVM.condition.selectedSupplier;
            $scope.listVM.condition.supplierId = selectedSupplier ? selectedSupplier.supplierId : null;
            PcService.searchEsin($scope.listVM.condition).then(function(res) {
                if (res && res.status == 200) {
                    if (res.items && res.items.length > 0) {
                        //get one image
                        res.items.forEach(function(item) {
                            var pic = '';
                            if (item && item.productPics) {
                                item.productPics.forEach(function(p) {
                                    if (p.picType == 2 && p.picIndex == 1) {
                                        pic = p.picUrl;
                                        return false;
                                    }
                                });
                            }
                            item.pic = pic;
                        });
                    }
                    $scope.listVM.items = res.items;
                    $scope.listVM.paginate = res.paginate;
                } else {
                    toaster.pop('error', (res && res.msg) ? res.msg : '查询出错！');
                }
                $scope.listVM.loading = false;
            }, function(err) {
                $scope.listVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
        if (!hasCache)
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
         * view product's sku list
         * @param  {string} code: esin code
         */
        $scope.viewSKUs = function(code) {
            $state.go('pc.product.skus', {
                code: code,
                listVM: $scope.listVM
            });
        };
        /**
         * view product detail info
         * @param  {string} code: esin code
         */
        $scope.viewProduct = function(code) {
            $state.go('pc.product.view', {
                code: code,
                listVM: $scope.listVM
            });
        };
        /**
         * edit product detail info
         * @param  {int} id esin id
         * @return {[type]}    [description]
         */
        $scope.editProduct = function(code) {
            $state.go('pc.product.edit', {
                code: code,
                listVM: $scope.listVM
            });
        };

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

    }];
});
