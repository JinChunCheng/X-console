define([], function() {
    return ['$scope', '$timeout', 'metaService', '$filter', '$state', '$stateParams', 'fundService', function($scope, $timeout, metaService, $filter, $state, $stateParams, fundService) {

        $scope.vm = {
            condition: {},
            data: {},
            cancel: function() {
                $state.go('fund.withdrawlist.withdrawlist');
            }
        };

        function initMetaData() {
            metaService.getMeta('CZLY', function(data) {
                $scope.vm.operateOrigin = data;
            });
            metaService.getMeta('TXZT', function(data) {
                $scope.vm.status = data;
            });
            metaService.getProvinces(function(res) {
                $scope.vm.provinces = res;
            });
            metaService.getMeta('TXQD', function(data) {
                $scope.vm.exeChannel = data;
            });
            metaService.getCities(function(res) {
                $scope.vm.bankCity = res;
            });
        }
        initMetaData();

        function getDetail(id) {
            fundService.withdrawDetailLabel.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            });
        }
        getDetail($stateParams.id);

    }];
});
