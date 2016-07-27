define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'toaster', 'sysService', function($rootScope, $scope, $state, $stateParams, $modal, toaster, sysService) {

        ph.mark($rootScope, {
            state: 'sys.permission.list',
            title: '权限管理列表'
        });


        $scope.listVM = {
            condition: $stateParams.condition ? $stateParams.condition : {
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


        var search = function() {
            $scope.listVM.searching = true;
            sysService.searchPermission($scope.listVM.condition).then(function(data) {
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
            var text = '确定删除权限[' + item.name + ']？';
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
                        delPermission(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var delPermission = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.delPermission(id).then(function(res) {
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
         * show modal dialog of permission info
         * @param  {int} type [0:view, 1:add, 2:edit]
         * @param {int} id [permission id]
         */
        var showModal = function(type, id) {
            var title = '权限信息';
            switch (type) {
                case 1:
                    title = '添加权限';
                    break;
                case 2:
                    title = '修改权限信息';
                    break;
                case 3:
                    title = '查看权限信息';
                    break;
                default:
                    break;
            }

            $modal.open({
                templateUrl: 'view/sys/permission/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.permissionVM = {
                        title: title,
                        type: type,
                        data:{isShow:0},
                        id: id
                    };

                    if (id)
                        loadPermission($scope, id);

                    //cancel
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    //save
                    $scope.ok = function(valid) {
                        $scope.permissionVM.submitted = true;
                        if (!valid || !verifyPermission($scope))
                            return false;

                        savePermission($scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        $scope.add = function() {
            showModal(1);
        };

        /**
         * show permission edit dialog
         * @param  {[type]} id [permission id]
         */
        $scope.edit = function(id) {
            showModal(2, id);
        };

        /**
         * show permission view dialog
         * @param  {[int]} id [permission id]
         */
        $scope.view = function(id) {
            showModal(3, id)
        };

        /**
         * validate permission info
         * @param  {object} permissionScope [permission scope]
         */
        var verifyPermission = function(permissionScope) {
            return true;
        };

        /**
         * load permission detail info
         * @param  {object} permissionScope
         * @param  {int} id     
         */
        var loadPermission = function(permissionScope, id) {
            permissionScope.permissionVM.loading = true;
            sysService.getPermission(id).then(function(data) {
                permissionScope.permissionVM.loading = false;
                if (data.status == 200)
                    permissionScope.permissionVM.data = data.items;
            }, function(err) {
                permissionScope.permissionVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * add or update permission info
         * @param  {object} permissionScope
         */
        var savePermission = function(permissionScope, modalInstance) {
            permissionScope.permissionVM.saving = true;
            var method = permissionScope.permissionVM.id ? 'PUT' : 'POST';
            sysService.savePermission(permissionScope.permissionVM.data, method).then(function(data) {
                if (data.status == 200) {
                    toaster.pop('success', '保存成功！');
                    modalInstance.dismiss();
                    search();
                } else
                    toaster.pop('error', data.msg);
                permissionScope.permissionVM.saving = false;

            }, function(err) {
                permissionScope.permissionVM.saving = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
    }];
});
