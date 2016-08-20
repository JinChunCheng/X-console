define([], function() {
    return ['$scope', '$timeout', '$state','metaService','$stateParams', 'borrowerService', function($scope, $timeout, $state,metaService, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改费率信息' : '新增费率信息',
            rateCode: [{ id: 1, title: '充值', content: [{ code: 1, label: 'POS刷卡' },{ code: 2, label: '银联转账' },{ code: 3, label: '其他' }] }, { id: 2, title: '提现', content: [{ code: 1, label: '盒子支付' },{ code: 2, label: '恒丰银行' }] }],
            rateType:[{id:1,title:'百分比'},{id:2,title:'绝对值'}],
            status:[{id:1,title:'正常'},{id:2,title:'关闭'}],
            data: {},
            cancel: function() {
                $state.go('fund.rate.rate');
            }
        };

        function getDataLabel1(id) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ id: id }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.rateMark = res.data.items[0].id;
                $scope.vm.data.rateName = res.data.items[0].id;
                $scope.vm.data.rateCode = res.data.items[0].id;
                $scope.vm.data.rateType = res.data.items[0].id;
                $scope.vm.data.rateValue = res.data.items[0].id;
                $scope.vm.data.capValue = res.data.items[0].id;
                $scope.vm.data.lowestValue = res.data.items[0].id;
                $scope.vm.data.channel = res.data.items[0].id;
                $scope.vm.data.status = res.data.items[0].id;
                $scope.vm.data.memo = res.data.items[0].id;

            });
        }
        getDataLabel1($stateParams.id);
        // (function(id) {
        //     if (!id) {
        //         return;
        //     }
        //     borrowerService.resource.get({id: id}).$promise.then(function(res) {
        //         $scope.vm.data = res.data;
        //     }, function(err) {
        //         debugger
        //     });
        // })($stateParams.id);

    }];
});
