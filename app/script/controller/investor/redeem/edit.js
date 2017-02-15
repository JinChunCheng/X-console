define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'investorService', function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams, investorService) {

        $scope.vm = {
            title: '修改赎回记录信息',
            data: {},
            cancel: function() {
                $state.go('investor.redeem.list');
            },
            submit: save
        };

        function initMeta() {
            metaService.getMeta('REDEEMZT', function(items) {
                $scope.vm.redeemStatus = items;
            });
            metaService.getMeta('SHFS', function(items) {
                $scope.vm.redeemType = items;
            });
            metaService.getMeta('SHTD', function(items) {
                $scope.vm.redeemChannel = items;
            });
            metaService.getMeta('JJLX', function(items) {
                $scope.vm.fundType = items;
            });
            metaService.getMeta('SHDFJG', function(items) {
                $scope.vm.pilResult = items;
            });
        }
        initMeta();

        (function showContent() {
            if ($stateParams.id) {
                investorService.getRedeemDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                });
            }
            return;
        })();

        function save() {
            investorService.updateRedeemList.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改申购记录信息成功！');
                    $state.go("investor.redeem.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
