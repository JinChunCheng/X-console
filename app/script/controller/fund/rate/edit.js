define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            title:"基本信息",
            data: {},
            cancel: function() {
                $state.go('fund.rate.rate');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.get({id: id}).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                debugger
            });
        })($stateParams.id);

    }];
});
