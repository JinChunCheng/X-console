define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('fund.charge.charge');
            }
        };

        function getDataLabel1(id) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ id: id }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.chargeCode = res.data.items[0].id;
                $scope.vm.data.investorCode = res.data.items[0].id;
                $scope.vm.data.investorName = res.data.items[0].id;
                $scope.vm.data.amount = res.data.items[0].id;
                $scope.vm.data.serviceFee = res.data.items[0].id;
                $scope.vm.data.subject = res.data.items[0].id;
                $scope.vm.data.status = res.data.items[0].id;
                $scope.vm.data.chargeType = res.data.items[0].id;
                $scope.vm.data.channel = res.data.items[0].id;
                $scope.vm.data.payNum = res.data.items[0].id;
                $scope.vm.data.externalCode = res.data.items[0].id;
                $scope.vm.data.buildTime = res.data.items[0].id;
                $scope.vm.data.achieveTime = res.data.items[0].id;
                $scope.vm.data.operator = res.data.items[0].id;
                $scope.vm.data.errorCode = res.data.items[0].id;
                $scope.vm.data.errorInformation = res.data.items[0].id;
                $scope.vm.data.bankCard = res.data.items[0].id;
                $scope.vm.data.memo = res.data.items[0].id;
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
