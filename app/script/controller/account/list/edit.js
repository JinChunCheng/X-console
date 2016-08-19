define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action:action,
            title: $stateParams.id ? '修改费率信息' : '新增费率信息',
            data: {},
            cancel: function() {
                $state.go('account.list.list');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.resource.get({id: id}).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                debugger
            });
        })($stateParams.id);

    }];
});
