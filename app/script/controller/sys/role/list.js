define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', '$stateParams', '$modal', 'sysService', 'toaster', function($rootScope, $scope, $stateParams, $modal, sysService, toaster) {

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
            sysService.searchRole($scope.listVM.condition).then(function(data) {
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

        /**
         * show modal dialog of role info
         * @param  {int} type [0:view, 1:add, 2:edit]
         * @param {int} id [role id]
         */
        var showModal = function(type, id) {
            var title = '角色信息';
            switch (type) {
                case 1:
                    title = '添加角色';
                    break;
                case 2:
                    title = '修改角色信息';
                    break;
                case 3:
                    title = '查看角色信息';
                    break;
                default:
                    break;
            }

            $modal.open({
                templateUrl: 'view/sys/role/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.roleVM = {
                        title: title,
                        type: type,
                        data:{personNum:0},
                        id: id
                    };
                    //$scope.roleVM.personNum="0";
                    if (id)
                        loadRole($scope, id);

                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        saveRole($scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        $scope.add = function() {
            showModal(1);
        };

        /**
         * show role edit dialog
         * @param  {[type]} id [role id]
         */
        $scope.edit = function(id) {
            showModal(2, id);
        };

        /**
         * show role view dialog
         * @param  {[int]} id [role id]
         */
        $scope.view = function(id) {
            showModal(3, id)
        };

        /**
         * load role detail info
         * @param  {object} roleScope
         * @param  {int} id     
         */
        var loadRole = function(roleScope, id) {
            roleScope.roleVM.loading = true;
            sysService.getRole(id).then(function(data) {
                roleScope.roleVM.loading = false;
                if (data.status == 200)
                    roleScope.roleVM.data = data.items;
            }, function(err) {
                roleScope.roleVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        $scope.del = function(item) {
            var text = '确定删除岗位[' + item.roleName + ']？';
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
                        delRole(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var delRole = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.delRole(id).then(function(res) {
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
         * add or update role info
         * @param  {object} roleScope
         */
        var saveRole = function(roleScope, modalInstance) {
            roleScope.roleVM.saving = true;
            var method = roleScope.roleVM.id ? 'PUT' : 'POST';
            sysService.saveRole(roleScope.roleVM.data, method).then(function(data) {
                if (data.status == 200) {
                    toaster.pop('success', '保存成功！');
                    modalInstance.dismiss();
                    search();
                }
                else 
                    toaster.pop('error', data.msg);
                roleScope.roleVM.saving = false;

            }, function(err) {
                roleScope.roleVM.saving = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
    }];
});
