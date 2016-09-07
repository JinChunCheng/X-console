define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', 'accountService', '$filter', function($scope, toaster, $timeout, $state, $stateParams, metaService, accountService, $filter) {

        $scope.vm = {
            title: '修改资金账户信息',
            data: {},
            cancel: function() {
                $state.go('account.list.list');
            },
            bankProvince: [],
            bankProvinceChange: function() {
                $scope.vm.data.bankCity = null;
            },
            getCities: function(provinceCode) {
                var result = [];
                $scope.vm.bankProvince.forEach(function(item) {
                    if (item.code == provinceCode) {
                        result = item.children;
                        return;
                    }
                });
                return result;
            },
            submit: submit
        };

        function initMetaData() {
            metaService.getMeta('ZJZHMC', function(data) {
                $scope.vm.capitalAccountNo = data;
            });
            metaService.getMeta('ZJZHRZLX', function(data) {
                $scope.vm.capitalAccountLogType = data;
            });
            metaService.getProvinces(function(res) {
                $scope.vm.bankProvince = res;
            });
            metaService.getCities(function(res) {
                $scope.vm.bankCity = res;
            });
        }
        initMetaData();

        function submit(invalid) {
            $scope.vm.submitted = true;
            if (invalid) {
                return;
            }
            save();
            return true;
        }
        (function showContent() {
            accountService.accountDetailLabel.get({ id: $stateParams.id }).$promise.then(function(res) {
                //基本信息展示
                $scope.vm.data = res.data;
            })
            return;
        })();

        function save() {
            accountService.accountListUpdate.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改资金账户信息成功！');
                    $state.go("account.list.list");
                }
            });
        }

    }];
});
