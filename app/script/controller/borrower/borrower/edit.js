define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', '$filter', 'borrowerService', 'publicService', function($scope, toaster, $timeout, $state, $stateParams, metaService, $filter, borrowerService, publicService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改借款人信息' : '新增借款人信息',
            data: {},
            bank: {},
            provinces: [],
            cancel: function() {
                $state.go('borrower.info.list');
            },
            bankProvinceChange: function() {
                $scope.vm.data.bankCity = null;
            },
            getCities: function(provinceCode) {
                var result = [];
                $scope.vm.provinces.forEach(function(item) {
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
            metaService.getProvinces(function(res) {
                $scope.vm.provinces = res;
            });
            metaService.getCities(function(res) {
                $scope.vm.bankCity = res;
            });
            metaService.getMeta('ZT', function(data) {
                $scope.vm.status = data;
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
            //TODO
            save();
            return true;
        };
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

        showContent();

        function showContent() {
            if ($stateParams.id) {
                borrowerService.borrowerDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    //$scope.vm.bank = getBankName(res.data.borrowerDetail.bankCode);
                    $scope.vm.data = res.data.borrowerDetail;
                    if ($scope.vm.data.bankProvince.length == 2) {
                        $scope.vm.data.bankProvince += '0000';
                    }
                    if ($scope.vm.data.bankCity.length == 4) {
                        $scope.vm.data.bankCity += '00';
                    }
                    getBank();
                });
            }
            return;
        };

        function save() {
            if (!$stateParams.id) {
                //新增借款人
                $scope.vm.data.bankCode = $scope.vm.bank.bankCode;
                $scope.vm.data.bankName = $scope.vm.bank.bankName;

                borrowerService.updateBorrower.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增借款人成功！');
                        $state.go("borrower.info.list");
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');

                });
                return;
            }
            //修改借款人
            console.log($scope.vm.bank.bankCode)
            $scope.vm.data.bankCode = $scope.vm.bank.bankCode;
            $scope.vm.data.bankName = $scope.vm.bank.bankName;
            borrowerService.updateBorrower.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改借款人成功！');
                    $state.go("borrower.info.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
