define([], function() {
    return ['$scope', '$timeout','metaService','$filter', '$state', '$stateParams', 'fundService', function($scope, $timeout,metaService,$filter, $state, $stateParams, fundService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('fund.charge.charge');
            }
        };

            function getDetail(id) {
                fundService.chargeDetailLabel.get({ id: id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                });
            }
            getDetail($stateParams.id);

    }];
});
