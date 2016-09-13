define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', 'accountService', '$filter','publicService', function($scope, toaster, $timeout, $state, $stateParams, metaService, accountService, $filter,publicService) {

        $scope.vm = {
            title: '修改资金账户信息',
            data: {},
            bank:{},
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
            publicService.bankList.get().$promise.then(function(res) {
                $scope.vm.bankList = res.data.items;
                getBank();
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
        //防止showContent()时，$scope.vm.bankList还没有加载出来而报错
        function getBank() {
            var bankList = $scope.vm.bankList;
            var data = $scope.vm.data;
            if (bankList && bankList.length > 0 && data && data.bankCode) {
                $scope.vm.bankList.forEach(function(item) {
                    if (item.bankCode == data.bankCode) {
                        $scope.vm.bank = item;
                        return;
                    }
                });
            }
        }
        (function showContent() {
            accountService.accountDetailLabel.get({ id: $stateParams.id }).$promise.then(function(res) {
                //基本信息展示
                $scope.vm.data = res.data;
                getBank();
            })
            return;
        })();

        function save() {
            $scope.vm.data.bankCode = $scope.vm.bank.bankCode;
            $scope.vm.data.bankName = $scope.vm.bank.bankName;
            accountService.accountListUpdate.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改资金账户信息成功！');
                    $state.go("account.list.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
