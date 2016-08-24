define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('borrower.repayment.list');
            },
            accountSubjectCode:[{code:"1001",title:"人民币"}],
        };

        function getDetail(id) {
                //query: {where: JSON.stringify({'borrowerAccountNo':borrowerAccountNo})}
                borrowerService.borrowerRepaymentDetail.get({ id: id }).$promise.then(function(res) {
                    //基本信息
                    $scope.vm.accountSubjectCode.forEach(function(item) {
                        if (item.code === res.data.accountSubjectCode) {
                            res.data.accountSubjectCode = item.title;
                            return;
                        }
                    });
                    console.log(res.data);
                    $scope.vm.data = res.data;
                });
            }
            getDetail($stateParams.id);
    }];
});
