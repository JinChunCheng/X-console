define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('borrower.repayment.list');
            }
        };

        function getDetail(borrowerId) {
                //query: {where: JSON.stringify({'borrowerAccountNo':borrowerAccountNo})}
                borrowerService.borrowerRepaymentDetail.get({ id: borrowerId }).$promise.then(function(res) {
                    //基本信息
                    // $scope.vm.status.forEach(function(item) {
                    //     if (item.code === res.data.status) {
                    //         res.data.status = item.title;
                    //         return;
                    //     }
                    // });
                    $scope.vm.data = res.data;
                });
            }
            getDetail($stateParams.id);
    }];
});
