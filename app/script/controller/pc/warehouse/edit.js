define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'PcService', 'toaster', function($rootScope, $scope, $state, $stateParams, PcService, toaster) {

        $scope.title = $stateParams.code ? '修改产品库' : '添加产品库';
        ph.mark($rootScope, {
            state: 'pc.warehouse.edit',
            title: $scope.title
        });

        $scope.isSaving = false;
        $scope.isAdd = true;
        //added by eric.gao
        var self = this;
        $scope.loading = false;
        $scope.warehouse = {};
        // if ($routeParams.action == 'list' || $routeParams.action == 'edit') {  //需要菜单的action加在这里
        //     $scope.hasMenu = true;
        // } else {
        //     $scope.hasMenu = false;
        // }
        if ($stateParams.code != null && $stateParams.code != 'undefined') {
            $scope.isAdd = false;
        } else {
            $scope.isAdd = true;
        }
        $scope.back = function() {
            $state.go('pc.warehouse.list');
        };

        $scope.saveWarehouse = function(isValid) {
        	if ($scope.isAdd) {
        		addWarehouse(isValid);
        	}
        	else {
        		editWarehouse(isValid);
        	}
        };

        /**
         * 产品库管理--添加产品库
         * @param file
         */
        //编辑前的数据

        var addWarehouse = function(isValid) {
            if (!isValid) {
                toaster.pop('error', '请按要求完善产品库信息！');
                return false;
            }
            $scope.isSaving = true;
            //查询属性列表
            PcService.addWarehouse($scope.warehouse).then(
                function(data) {
                    if (data.status == '200') {
                        toaster.pop('success', '产品库记录添加成功！');

                    } else {
                        toaster.pop('error', '添加失败，原因：' + data.msg);
                    }
                    $scope.isSaving = false;
                },
                function(errResponse) {
                    console.error('Error while creatting warehouse.');
                    $scope.isSaving = false;
                }
            );
        };

        var oldWarehouse = {};
        //编辑--加载编辑数据
        $scope.loadProductWarehouseData = function() {
            $scope.loading = true;
            PcService.loadProductWarehouseData($stateParams.code).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.warehouse = data.items;
                        oldWarehouse = $.extend(true, {}, data.items);
                        $scope.loading = false;
                    } else {
                        toaster.pop('error', '加载产品库信息失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadProductWarehouseData.');
                    $scope.loading = true;
                }
            );
        };
        if (!$scope.isAdd) $scope.loadProductWarehouseData();
        /**
         * 产品库管理--修改产品库
         * @param file
         */
        var editWarehouse = function(isValid) {
            if (!isValid) {
                toaster.pop('error', '请按要求完善产品库信息！');
                return false;
            }
            if (isObjectValueEqual(oldWarehouse, $scope.warehouse)) {
                toaster.pop('info', '未做任何修改！');
                return false;
            }
            $scope.isSaving = true;
            //查询属性列表
            PcService.editWarehouse($scope.warehouse).then(
                function(data) {
                    if (data.status == '200') {
                        toaster.pop('success', '修改成功！');
                        $scope.loadProductWarehouseData();
                    } else {
                        alert();
                        toaster.pop('error', '修改失败，原因：' + data.msg);
                    }
                    $scope.isSaving = false;
                },
                function(errResponse) {
                    console.error('Error while creatting warehouse.');
                    $scope.isSaving = false;
                }
            );
        };

        function isObjectValueEqual(a, b) {
            // Of course, we can do it use for in
            // Create arrays of property names
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);

            // If number of properties is different,
            // objects are not equivalent
            if (aProps.length != bProps.length) {
                return false;
            }

            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];

                // If values of same property are not equal,
                // objects are not equivalent
                var a1 = a[propName];
                var b1 = b[propName];
                if (!(a1 instanceof Array)) {
                    if (a1 !== b1) {
                        return false;
                    }
                } else {
                    if (a1 instanceof Array) {
                        if (a1.length != b1.length) {
                            return false;
                        }
                    } else if (a1 == {}) {

                    }

                }

            }

            // If we made it this far, objects
            // are considered equivalent
            return true;
        }
    }];
});
