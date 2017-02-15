define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'investorService', function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams, investorService) {

        $scope.vm = {
            title: '修改申购记录信息',
            data: {},
            cancel: function() {
                $state.go('investor.purchase.list');
            },
            submit: save
        };

        function initMetaData() {
            metaService.getMeta('SGZT', function(items) {
                $scope.vm.status = items;
            });
            metaService.getMeta('JJLX', function(items) {
                $scope.vm.fundType = items;
            });
        }
        initMetaData();

        (function showContent() {
            if ($stateParams.id) {
                investorService.getPurchaseDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                });
            }
            return;
        })();

        function save() {
            investorService.updatePurchaseList.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改申购记录信息成功！');
                    $state.go("investor.purchase.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
