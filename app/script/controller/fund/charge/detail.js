define([], function() {
    return ['$scope', '$timeout', 'metaService', '$filter', '$state', '$stateParams', 'fundService', function($scope, $timeout, metaService, $filter, $state, $stateParams, fundService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('fund.charge.charge');
            }
        };

        function initMetaData() {
            metaService.getMeta('ZCLY', function(data) {
                $scope.vm.salesId = data;
            });
            metaService.getMeta('ZHKM', function(data) {
                $scope.vm.subject = data;
            });

            metaService.getMeta('CZLX', function(data) {
                $scope.vm.paymentType = data;
            });
            metaService.getMeta('CZZT', function(data) {
                $scope.vm.status = data;
            });
            metaService.getMeta('CZQD', function(data) {
                $scope.vm.paymentChannel = data;
            });
        }
        initMetaData();

        function getDetail(id) {
            fundService.chargeDetailLabel.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            });
        }
        getDetail($stateParams.id);

    }];
});
