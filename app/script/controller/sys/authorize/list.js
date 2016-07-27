define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'toaster', 'sysService', function($rootScope, $scope, $state, $stateParams, $modal, toaster, sysService) {

        ph.mark($rootScope, {
            state: 'sys.authorize.list',
            title: '授权列表'
        });


        $scope.listVM = {
            condition: $stateParams.condition ? $stateParams.condition : {
                pageNo: 1,
                pageSize: 10,
                roleId: ''
            },
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: []
        };

        sysService.rolesInfo().then(function(data) {
            $scope.defaultRoles = data.items;
        }, function(errMsg) {
            abp.notify.error(errMsg);
        });

        var search = function() {
            $scope.listVM.searching = true;
            sysService.searchAuthorize($scope.listVM.condition).then(function(data) {
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

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = {
                pageNo: 1,
                pageSize: 10
            }
        };



        $scope.del = function(item) {
            var text = '确定删除授权[' + item.permissionName + ']？';
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
                        delAuthorize(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var delAuthorize = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.delAuthorize(id).then(function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '删除成功！');
                    modalInstance.dismiss();
                    search();
                } else
                    toaster.pop('error', res.msg);

                confirmScope.confirmData.processing = false;
            }, function(err) {
                toaster.pop('error', '服务器请求异常！')
                confirmScope.confirmData.processing = false;
            });
        };

        /**
         * show modal dialog of authorize info
         */
        var showModal = function() {
            var title = '权限配置';
            var defaultRoles = $scope.defaultRoles;
            $modal.open({
                templateUrl: 'view/sys/authorize/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.authorizeVM = {
                        title: title,
                        condition: {
                            pageNo: 1,
                            pageSize: 10
                        },
                        paginate: {
                            pageSize: 10,
                            pageNumber: 1,
                            pagesCount: 0,
                            totalItemsCount: 0
                        },
                        items: []
                    };

                    if (defaultRoles && defaultRoles.length > 0) {
                        $scope.defaultRoles = defaultRoles;
                    } else {
                        sysService.rolesInfo().then(function(data) {
                            $scope.defaultRoles = data.items;
                        }, function(errMsg) {
                            abp.notify.error(errMsg);
                        });
                    }

                    var searchAuthorizeByRoleNotExist = function() {
                        $scope.authorizeVM.searching = true;
                        sysService.searchAuthorizeByRoleNotExist($scope.authorizeVM.condition).then(function(data) {
                            if (data && data.status === 200) {
                                $scope.authorizeVM.items = data.items;
                                $scope.authorizeVM.paginate = data.paginate;
                            } else {
                                toaster.pop('error', data.msg);
                            }
                            $scope.authorizeVM.searching = false;
                        }, function(err) {
                            $scope.authorizeVM.searching = false;
                            toaster.pop('error', '服务器请求异常！');
                        });
                    };

                    /**
                     * 分页控件翻页事件
                     * @return {[type]} [description]
                     */
                    $scope.pageChanged = function() {
                        $scope.page($scope.authorizeVM.paginate.pageNumber);
                    };

                    /**
                     * search
                     * @param  {[int]} index [description]
                     */
                    $scope.page = function(index) {
                        $scope.authorizeVM.condition.pageNo = index || 1;
                        searchAuthorizeByRoleNotExist();
                    };

                    //cancel
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }


                    $scope.isAllChecked = false;
                    $scope.checkedPermissionIds = [];
                    //处理是否选中
                    var processItemsChecked = function(items) {
                        var isAll = true;
                        if (items && $scope.checkedPermissionIds) {
                            for (var i = 0; i < items.length; i++) {
                                if (isItemChecked(items[i].id)) {
                                    items[i].IsChecked = true;
                                } else
                                    isAll = false;
                            }
                        }
                        $scope.isAllChecked = isAll;
                    };

                    var processChecked = function(item) {
                        var hasChecked = isItemChecked(item.id);
                        if (item.IsChecked && !hasChecked) {
                            //当前选中，之前未选，在已选中添加
                            $scope.checkedPermissionIds.push(item.id);
                        } else if (!item.IsChecked && hasChecked) {
                            //当前未选中，之前已选，在已选中移除
                            for (var j = 0; j < $scope.checkedPermissionIds.length; j++) {
                                if ($scope.checkedPermissionIds[j] == item.id) {
                                    $scope.checkedPermissionIds.splice(j, 1);
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
                        for (var j = 0; j < $scope.checkedPermissionIds.length; j++) {
                            if ($scope.checkedPermissionIds[j] == id) {
                                return true;
                            }
                        }
                        return false;
                    };

                    //是否已全选
                    var allChecked = function() {
                        for (var i = 0; i < $scope.authorizeVM.items.length; i++) {
                            if (!$scope.authorizeVM.items[i].IsChecked)
                                return false;
                        }
                        return true;
                    };

                    //全选、反选事件
                    $scope.selectAll = function() {
                        var isSelect = $scope.isAllChecked;
                        for (var i = 0; i < $scope.authorizeVM.items.length; i++) {
                            $scope.authorizeVM.items[i].IsChecked = !isSelect;
                            processChecked($scope.authorizeVM.items[i]);
                        }
                        $scope.isAllChecked = !isSelect;
                    };

                    $scope.save = function() {
                        $scope.authorizeVM.saving = true;
                        sysService.saveAuthorize($scope.checkedPermissionIds, $scope.authorizeVM.condition.roleId).then(function(data) {
                            if (data.status == 200)

                                toaster.pop('success', '授权成功！');

                            else
                                toaster.pop('error', '授权失败！');
                            searchAuthorizeByRoleNotExist();
                            $scope.checkedPermissionIds= [];
                            $scope.authorizeVM.saving = false;
                        }, function(err) {
                            toaster.pop('error', '授权失败！');
                            $scope.authorizeVM.saving = false;
                        });
                    }
                }
            });
        };

        $scope.add = function() {
            showModal();
        };

        /**
         * validate authorize info
         * @param  {object} authorize [authorize scope]
         */
        var verifyAuthorize = function(authorizeScope) {
            return true;
        };

        /**
         * load authorize detail info
         * @param  {object} authorize
         * @param  {int} id     
         */
        var loadAuthorize = function(authorizeScope, id) {
            authorizeScope.authorizeVM.loading = true;
            sysService.getAuthorize(id).then(function(data) {
                authorizeScope.authorizeVM.loading = false;
                if (data.status == 200)
                    authorizeScope.authorizeVM.data = data.items;
            }, function(err) {
                authorizeScope.authorizeVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * add or update authorize info
         * @param  {object} authorize
         */
        var saveAuthorize = function(authorizeScope, modalInstance) {
            authorizeScope.authorizeVM.saving = true;
            var method = authorizeScope.authorizeVM.id ? 'PUT' : 'POST';
            sysService.saveAuthorize(authorizeScope.authorizeVM.data, method).then(function(data) {
                if (data.status == 200) {
                    toaster.pop('success', '保存成功！');
                    modalInstance.dismiss();
                    $scope.page(1);
                } else
                    toaster.pop('error', data.msg);
                authorizeScope.authorizeVM.saving = false;

            }, function(err) {
                authorizeScope.authorizeVM.saving = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

    }];
});
