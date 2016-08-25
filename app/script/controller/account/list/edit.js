define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', 'accountService', function($scope, toaster, $timeout, $state, $stateParams, metaService, accountService) {

            $scope.vm = {
                title: '修改资金账户信息',
                bank: [{ id: 1, title: '农业银行' }, { id: 2, title: '工商银行' }, { id: 1, title: '人民银行' }, { id: 2, title: '建设银行' }],

                data: {},
                cancel: function() {
                    $state.go('account.list.list');
                },
                save: save
            };

            (function showContent() {
                accountService.accountDetailLabel.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data;
                })
                return;
            })();

            function save() {
                accountService.accountListUpdate.update($scope.vm.data).$promise.then(function(res) {
                    console.log(res);
                    if (res.code == 200) {
                        toaster.pop('success', '修改资金账户信息成功！');
                        $state.go("account.list.list");
                    }
                });
            }

            function initMetaData() {
                metaService.getProvinces(function(res) {
                    console.log(res);
                    $scope.vm.provinces = res;
                });
            } 
            initMetaData(); 

    }];
});
