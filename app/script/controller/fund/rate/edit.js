define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'fundService', function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams, fundService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改费率信息' : '新增费率信息',
            data: {},
            cancel: function() {
                $state.go('fund.rate.rate');
            },
            submit: submit
        };

        function initMetaData() {

            metaService.getMeta('FLLX', function(data) {
                $scope.vm.rateType = data;
            });
            metaService.getMeta('FLBMF', function(data) {
                $scope.vm.rateCode = data;
            });
            metaService.getMeta('ZT', function(data) {
                $scope.vm.status = data;
            });
            metaService.getMeta('FLQD', function(data) {
                $scope.vm.operationChannel = data;
            });
        }
        initMetaData();

        function submit(invalid) {
            $scope.vm.submitted = true;
            if (invalid) {
                return;
            }
            save();
            return true;
        };

        function showContent() {
            if ($stateParams.id) {
                fundService.getRateDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    $scope.vm.data = res;
                });
            }
            return;
        };
        showContent();

        function save() {
            if (!$stateParams.id) {
                //新增费率
                fundService.createRate.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增费率信息成功！');
                        $state.go("fund.rate.rate");
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');

                });
                return;
            }
            //修改费率
            fundService.updateRate.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改费率信息成功！');
                    $state.go("fund.rate.rate");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }
    }];
});
