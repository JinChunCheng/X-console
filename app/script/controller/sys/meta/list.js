define([], function() {
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
            sysService.searchMeta($scope.listVM.condition).then(function(data) {
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

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.dataName = '';
            $scope.condition.dataCode = '';
        };


        $scope.del = function(item) {
            var text = '确定删除元数据[' + item.dataName + ']？';
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
                        delMeta(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var delMeta = function(id, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            sysService.delMeta(id).then(function(res) {
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
         * show modal dialog of Meta info
         * @param  {int} type [0:view, 1:add, 2:edit]
         * @param {int} id [Meta id]
         */
        var showModal = function(type, id) {
            var title = '元数据信息';
            switch (type) {
                case 1:
                    title = '添加元数据';
                    break;
                case 2:
                    title = '修改元数据信息';
                    break;
                case 3:
                    title = '查看元数据信息';
                    break;
                default:
                    break;
            }

            $modal.open({
                templateUrl: 'view/sys/meta/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.metaVM = {
                        title: title,
                        type: type,
                        id: id
                    };

                    if (id)
                        loadMeta($scope, id);

                    //cancel
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    //save
                    $scope.ok = function(valid) {
                        $scope.metaVM.submitted = true;
                        if (!valid || !verifyMeta($scope))
                            return false;

                        saveMeta($scope, $modalInstance);
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
         * validate Meta info
         * @param  {object} MetaScope [Meta scope]
         */
        var verifyMeta = function(metaScope) {
            return true;
        };

        /**
         * load Meta detail info
         * @param  {object} MetaScope
         * @param  {int} id     
         */
        var loadMeta = function(metaScope, id) {
            metaScope.metaVM.loading = true;
            sysService.getMeta(id).then(function(data) {
                metaScope.metaVM.loading = false;
                if (data.status == 200)
                    metaScope.metaVM.data = data.items;
            }, function(err) {
                metaScope.metaVM.loading = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };

        /**
         * add or update Meta info
         * @param  {object} MetaScope
         */
        var saveMeta = function(metaScope, modalInstance) {
            metaScope.metaVM.saving = true;
            var method = metaScope.metaVM.id ? 'PUT' : 'POST';
            sysService.saveMeta(metaScope.metaVM.data, method).then(function(data) {
                if (data.status == 200) {
                    toaster.pop('success', '保存成功！');
                    modalInstance.dismiss();
                    search();
                } else
                    toaster.pop('error', data.msg);
                metaScope.metaVM.saving = false;

            }, function(err) {
                metaScope.metaVM.saving = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
    }];
});
