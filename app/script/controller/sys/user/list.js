define(['common/path-helper', 'common/session'], function(ph,session) {
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
            $scope.loginName=session.getLoginUserInfo().loginName;
            sysService.searchUser($scope.listVM.condition).then(function(data) {
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
            var text = '确定删除用户[' + item.loginName + ']？';
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
                        delUser(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };



        var delUser = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.delUser(id).then(function(res) {
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

        $scope.active = function(item) {
            var text = '确定激活用户[' + item.loginName + ']？';
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
                        activeUser(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };



        var activeUser = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.activeUser(id).then(function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '激活成功！');
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

        $scope.forbid = function(item) {
            var text = '确定禁用用户[' + item.loginName + ']？';
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
                        forbidUser(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };



        var forbidUser = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.forbidUser(id).then(function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '禁用成功！');
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
         * show modal dialog of user info
         * @param  {int} type [0:view, 1:add, 2:edit]
         * @param {int} id [user id]
         */
        var showModal = function(type, id) {
            var title = '用户信息';
            switch (type) {
                case 1:
                    title = '添加用户';
                    break;
                case 2:
                    title = '修改用户信息';
                    break;
                case 3:
                    title = '查看用户信息';
                    break;
                default:
                    break;
            }

            $modal.open({
                templateUrl: 'view/sys/user/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.userVM = {
                        title: title,
                        type: type,
                        id: id
                    };

                    getDepartmentList($scope);
                    getRoleList($scope);

                    if (id)
                        loadUser($scope, id);

                    //cancel
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    //save
                    $scope.ok = function(valid) {
                        $scope.userVM.submitted = true;
                        if (!valid || !verifyUser($scope))
                            return false;

                        saveUser($scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        $scope.add = function() {
            showModal(1);
        };

        /**
         * show user edit dialog
         * @param  {[type]} id [user id]
         */
        $scope.edit = function(id) {
            showModal(2, id);
        };

        /**
         * show user view dialog
         * @param  {[int]} id [user id]
         */
        $scope.view = function(id) {
            showModal(3, id)
        };

        /**
         * validate user info
         * @param  {object} userScope [user scope]
         */
        var verifyUser = function(userScope) {
            if (userScope.userVM.type == 1 && userScope.userVM.data.password != userScope.userVM.data.confirmPassword) {
                toaster.pop('error', '两次密码不一致！');
                return false;
            }
            return true;
        };

        /**
         * get role list 
         * @param  {object} userScope [user modal dialog scope]
         */
        var getRoleList = function(userScope) {
            if ($scope.listVM.roleList) {
                userScope.userVM.roleList = $scope.listVM.roleList;
                return false;
            }

            sysService.getRoleList().then(function(res) {
                if (res && res.status == 200) {
                    //数据缓存在列表视图中
                    $scope.listVM.roleList = res.items;
                    userScope.userVM.roleList = res.items;
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * get department list 
         * @param  {object} userScope [user modal dialog scope]
         */
        var getDepartmentList = function(userScope) {
            if ($scope.listVM.departmentList) {
                userScope.userVM.departmentList = $scope.listVM.departmentList;
                return false;
            }

            sysService.getDepartmentList().then(function(res) {
                if (res && res.status == 200) {
                    //数据缓存在列表视图中
                    $scope.listVM.departmentList = res.items;
                    userScope.userVM.departmentList = res.items;
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * load user detail info
         * @param  {object} userScope
         * @param  {int} id     
         */
        var loadUser = function(userScope, id) {
            userScope.userVM.loading = true;
            sysService.getUser(id).then(function(data) {
                userScope.userVM.loading = false;
                if (data.status == 200)
                    userScope.userVM.data = data.items;
            }, function(err) {
                userScope.userVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * add or update user info
         * @param  {object} userScope
         */
        var saveUser = function(userScope, modalInstance) {
            userScope.userVM.saving = true;
            var method = userScope.userVM.id ? 'PUT' : 'POST';
            sysService.saveUser(userScope.userVM.data, method).then(function(data) {
                if (data.status == 200) {
                    toaster.pop('success', '保存成功！');
                    modalInstance.dismiss();
                    search()
                } else
                    toaster.pop('error', data.msg);
                userScope.userVM.saving = false;

            }, function(err) {
                userScope.userVM.saving = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
    }];
});
