define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action:action,
            title: $stateParams.id ? '修改资产信息' : '新增资产信息',
            data: {},
            cancel: function() {
                $state.go('asset.info.list');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.get({id: id}).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                
            });
        })($stateParams.id);

    }];
});
