define([], function() {
    return ['$scope', '$timeout', 'metaService', '$filter', '$state', '$stateParams', 'fundService', function($scope, $timeout, metaService, $filter, $state, $stateParams, fundService) {

        $scope.vm = {
            condition:{},
            data: {},
            cancel: function() {
                $state.go('fund.withdrawlist.withdrawlist');
            }
        };

        function getDetail(id) {
            fundService.withdrawDetailLabel.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            });
        }
        getDetail($stateParams.id);

    }];
});
