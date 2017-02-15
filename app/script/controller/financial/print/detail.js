define([], function() {
    return ['$scope', '$timeout', 'metaService', 'toaster', '$filter', '$state', '$stateParams', 'financialService', function($scope, $timeout, metaService, toaster, $filter, $state, $stateParams, financialService) {
        $scope.vm = {
            data: {},
            print: print,
            templateType: $stateParams.templateType,
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
            if ($scope.vm.templateType == 'PRJ') {
                financialService.printTempPRJ.get({ id: id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                });
            } else if ($scope.vm.templateType == 'WDR') {
                financialService.printTempWDR.get({ id: id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                });
            } else {
                toaster.pop('error', '模板类型为null！');
                return false;
            }

        }
        getDetail($stateParams.id);
        console.log($scope.vm.templateType)

        function print() {
            if (!$scope.vm.templateType) {
                toaster.pop('error', '模板类型为null！');
                return false;
            }
            window.print();
        }
    }];
});
