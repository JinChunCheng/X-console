define([], function() {
    return ['$scope', 'toaster','$timeout', '$state', '$stateParams', 'accountService',  'metaService', '$filter',function($scope, toaster,$timeout, $state, $stateParams, accountService, metaService, $filter) {
        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改费率' : '新增费率',
            data: {},
            cancel: function() {
                $state.go('account.rate.rate');
            },
            submit:submit
        };

        function initMetaData() {

            metaService.getMeta('FLLX', function(data) {
                $scope.vm.rateType = data;
            });
            metaService.getMeta('FLBM', function(data) {
                $scope.vm.rateCode = data;
            });
            metaService.getMeta('ZT', function(data) {
                $scope.vm.status = data;
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

    }];
});
