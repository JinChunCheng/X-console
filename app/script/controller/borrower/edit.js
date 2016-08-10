define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {
        $scope.vm = {
            title: $stateParams.id ? '修改借款人信息' : '新增借款人信息',
            cancel: function() {
                $state.go('borrower-list');
            }
        };
    }];
});
