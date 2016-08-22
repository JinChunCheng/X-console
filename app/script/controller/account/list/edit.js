define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams','metaService', 'borrowerService', function($scope, $timeout, $state, $stateParams, metaService,borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action:action,
            title: $stateParams.id ? '修改资金账户信息' : '',
            bank: [{ id: 1, title: '农业银行' }, { id: 2, title: '工商银行' },{ id: 1, title: '人民银行' }, { id: 2, title: '建设银行' }],

            data: {},
            cancel: function() {
                $state.go('account.list.list');
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

    }];
});
