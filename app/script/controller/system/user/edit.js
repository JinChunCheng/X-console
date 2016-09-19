define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'systemService',
        function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams,systemService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改用户信息' : '新增用户',
            data: {},
            cancel: function() {
                $state.go('system.user.list');
            },
            submit: submit,
            processing:false
        };

       /* function initMetaData() {
            metaService.getMeta('LCQDMC', function(data) {
                $scope.vm.fundChannelName = data;
            });
            metaService.getMeta('SFBGSYG', function(data) {
                $scope.vm.empFlag = data;
            });
            metaService.getMeta('ZT', function(data) {
                $scope.vm.status = data;
            });
            metaService.getMeta('SFRZZT', function(data) {
                $scope.vm.idAuthFlag = data;
            });
        }
        initMetaData();*/

        function submit(invalid) {
            console.log(invalid)
            $scope.vm.submitted = true;
            if (invalid) {
                console.log(2)
                return false;
            }
            console.log(1)
            save();
            return true;
        };

        (function showContent() {
            if ($stateParams.id) {
                systemService.updateDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data;
                    console.log(res.data);
                });
            }
            return;
        })();

        function save() {
            if (!$stateParams.id) {
                systemService.createSystem.save($scope.vm.data).$promise.then(function(res) {
                    console.log($scope.vm.data)
                    if (res.code == 200) {
                        toaster.pop('success', '新增用户信息成功！');
                        $state.go("system.user.list");
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');

                });
                return;
            }
            //修改用户
            systemService.updateSystem.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改用户信息成功！');
                    $state.go("system.user.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
