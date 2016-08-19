define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';
        var defaultCondition = {

            paginate: {
                sort: 'update_time desc',
                pageNum: 1,
                pageSize: 10
            },
        };
        $scope.vm = {
            condition: angular.copy(defaultCondition),
            data: {},
            cancel: function() {
                $state.go('fund.withdrawlist.withdrawlist');
            }
        };

        function getDataLabel1() {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ where: JSON.stringify($scope.vm.condition) }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.applier = res.data.items[0].id;
                $scope.vm.data.mobile = res.data.items[0].id;
                $scope.vm.data.IDcard = res.data.items[0].id;
                $scope.vm.data.fundAccount = res.data.items[0].id;
                $scope.vm.data.province = res.data.items[0].id;
                $scope.vm.data.city = res.data.items[0].id;
                $scope.vm.data.bankName = res.data.items[0].id;
                $scope.vm.data.branchName = res.data.items[0].id;
                $scope.vm.data.bankCardNum = res.data.items[0].id;
                $scope.vm.data.accountBalance = res.data.items[0].id;
                $scope.vm.data.availableBalance = res.data.items[0].id;
                $scope.vm.data.freezeBalance = res.data.items[0].id;
            });
        }
        getDataLabel1();

        function getDataLabel2() {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ where: JSON.stringify($scope.vm.condition) }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.code = res.data.items[0].id;
                $scope.vm.data.applyAmount = res.data.items[0].id;
                $scope.vm.data.serviceFee = res.data.items[0].id;
                $scope.vm.data.receiptAmount = res.data.items[0].id;
                $scope.vm.data.withdrawTime = res.data.items[0].id;
                $scope.vm.data.withdrawChannel = res.data.items[0].id;
                $scope.vm.data.approvalTime = res.data.items[0].id;
                $scope.vm.data.reviewer = res.data.items[0].id;
                $scope.vm.data.performTime = res.data.items[0].id;
                $scope.vm.data.status = res.data.items[0].id;
                $scope.vm.data.operSource = res.data.items[0].id;
                $scope.vm.data.memo = res.data.items[0].id;
                $scope.vm.data.security = res.data.items[0].id;
            });
        }
        getDataLabel2();
        // (function(id) {
        //     if (!id) {
        //         return;
        //     }
        //     borrowerService.resource.get({ id: id }).$promise.then(function(res) {
        //         $scope.vm.data = res.data;
        //     }, function(err) {
        //         debugger
        //     });
        // })($stateParams.id);

    }];
});
