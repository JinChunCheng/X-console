define([], function() {
    return ['$scope', '$timeout', 'metaService', '$filter', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, metaService, $filter, $state, $stateParams, borrowerService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('borrower.repayment.list');
            },
        };

        function initMetaData() {
            metaService.getMeta('HKQD', function(data) {
                $scope.vm.repaymentChannel = data;
            });
            metaService.getMeta('ZHKM', function(data) {
                $scope.vm.accountSubjectCode = data;
            });
        }
        initMetaData();

        function getDetail(id) {
            borrowerService.borrowerRepaymentDetail.get({ id: id }).$promise.then(function(res) {
                //基本信息
                $scope.vm.data = res.data;
            });
        }
        getDetail($stateParams.id);
    }];
});
