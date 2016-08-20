define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('borrower.repayment.list');
            }
        };

        function getDataLabel1(id) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ id: id }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.borrowerCode = res.data.items[0].id;
                $scope.vm.data.borrowerName = res.data.items[0].id;
                $scope.vm.data.repaymentDate = res.data.items[0].id;
                $scope.vm.data.repaymentAmount = res.data.items[0].id;
                $scope.vm.data.accountBalance = res.data.items[0].id;
                $scope.vm.data.repaymentChannel = res.data.items[0].id;
                $scope.vm.data.reference = res.data.items[0].id;
                $scope.vm.data.operator = res.data.items[0].id;
                $scope.vm.data.buildTime = res.data.items[0].id;
                $scope.vm.data.refreshTime = res.data.items[0].id;
                $scope.vm.data.mobile = res.data.items[0].id;
                $scope.vm.data.IDcard = res.data.items[0].id;
                $scope.vm.data.postCode = res.data.items[0].id;
                $scope.vm.data.memo = res.data.items[0].id;
                $scope.vm.data.accountSubject = res.data.items[0].id;
                $scope.vm.data.address = res.data.items[0].id;
            });
        }
        getDataLabel1($stateParams.id);
        // (function(id) {
        //     if (!id) {
        //         return;
        //     }
        //     borrowerService.get({ id: id }).$promise.then(function(res) {
        //         $scope.vm.data = res.data;
        //     }, function(err) {
        //         debugger
        //     });
        // })($stateParams.id);

    }];
});
