define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'metaService', 'borrowerService', function($scope, $timeout, $state, $stateParams, metaService, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改借款人信息' : '新增借款人信息',
            status: [{ id: 1, title: '正常' }, { id: 2, title: '关闭' }],

            data: {},
            cancel: function() {
                $state.go('borrower.info.list');
            }
        };
        (function(id) {
            initMetaData();
            if (!id) {
                return;
            }
            borrowerService.resource.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {});
        })($stateParams.id);

        function initMetaData() {
            metaService.getProvinces(function(res) {
                console.log(res);
                $scope.vm.provinces = res;
            });
        }

        function getDataLabel1(id) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ id: id }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.code = res.data.items[0].id;
                $scope.vm.data.name = res.data.items[0].id;
                $scope.vm.data.idNo = res.data.items[0].id;
                $scope.vm.data.mobile = res.data.items[0].id;
                $scope.vm.data.telephone = res.data.items[0].id;
                $scope.vm.data.email = res.data.items[0].id;
                $scope.vm.data.bank = res.data.items[0].id;
                $scope.vm.data.bankAccountName = res.data.items[0].id;
                $scope.vm.data.accountNo = res.data.items[0].id;
                $scope.vm.data.status = res.data.items[0].id;
                $scope.vm.data.address = res.data.items[0].id;
                $scope.vm.data.postCode = res.data.items[0].id;
                $scope.vm.data.memo = res.data.items[0].id;
            });
        }
        getDataLabel1($stateParams.id);

    }];
});
