define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('fund.charge.charge');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                debugger
            });
        })($stateParams.id);

    }];
});
