define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        $scope.vm = {
            title: "修改催款单信息",
            data: {},
            cancel: function() {
                $state.go('financial.list.list');
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
