define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', '$filter', 'borrowerService', 'publicService', function($scope, toaster, $timeout, $state, $stateParams, metaService, $filter, borrowerService, publicService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改资产方信息' : '新增资产方信息',
            data: {},
            bank: {},
            provinces: [],
            cancel: function() {
                $state.go('borrower.info.list');
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
            getDistricts: function(provinceCode, cityCode) {
                var result = [];
                var cities = $scope.vm.getCities(provinceCode);
                if (cities.length > 0) {
                    cities.forEach(function(item) {
                        if (item.code == cityCode) {
                            result = item.children;
                            return;
                        }
                    });
                }
                return result;
            },
            registeredProvinceChange: function() {
                $scope.vm.registeredCity = null;
            },
            addressProvinceChange: function() {
                $scope.vm.addressCity = null;
            },
            bankProvinceChange: function() {
                $scope.vm.bankCity = null;
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
            metaService.getMeta('DWXZ', function(data) {
                $scope.vm.enterpriseNature = data;
            });
            metaService.getMeta('XB', function(data) {
                $scope.vm.sex = data;
            });
            metaService.getMeta('HYZK', function(data) {
                $scope.vm.marriage = data;
            });
            metaService.getMeta('SJJRFS', function(data) {
                $scope.vm.joinupType = data;
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
        };

        function splitPCA(str) {
            var PCAarr;
            PCAarr = str.split('-');
            return PCAarr;
        };
        showContent();

        function showContent() {
            if ($stateParams.id) {
                borrowerService.borrowerDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data.borrowerDetail;
                    $scope.vm.data.addressProvince = splitPCA(res.data.borrowerDetail.address)[0];
                    $scope.vm.data.addressCity = splitPCA(res.data.borrowerDetail.address)[1];
                    $scope.vm.data.addressDetail = splitPCA(res.data.borrowerDetail.address)[2];
                    $scope.vm.data.registeredProvince = splitPCA(res.data.borrowerDetail.registeredAddress)[0];
                    $scope.vm.data.registeredCity = splitPCA(res.data.borrowerDetail.registeredAddress)[1];
                    $scope.vm.data.registeredDetail = splitPCA(res.data.borrowerDetail.registeredAddress)[2];
                    getBank();
                });
            }
            return;
        };

        function save() {
            console.log($scope.vm.data.birthday)
            if (!$stateParams.id) {
                //新增借款人
                $scope.vm.data.bankCode = $scope.vm.bank.bankCode;
                $scope.vm.data.bankName = $scope.vm.bank.bankName;
                $scope.vm.data.address = $scope.vm.data.addressProvince + "-" + $scope.vm.data.addressCity + "-" + $scope.vm.data.addressDetail;
                $scope.vm.data.registeredAddress = $scope.vm.data.registeredProvince + "-" + $scope.vm.data.registeredCity + "-" + $scope.vm.data.registeredDetail;
                $scope.vm.data.birthday = $filter('exDate')($scope.vm.data.birthday, 'yyyy-MM-dd');
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
            $scope.vm.data.bankCode = $scope.vm.bank.bankCode;
            $scope.vm.data.bankName = $scope.vm.bank.bankName;
            $scope.vm.data.address = $scope.vm.data.addressProvince + "-" + $scope.vm.data.addressCity + "-" + $scope.vm.data.addressDetail;
            $scope.vm.data.registeredAddress = $scope.vm.data.registeredProvince + "-" + $scope.vm.data.registeredCity + "-" + $scope.vm.data.registeredDetail;
            $scope.vm.data.birthday = $filter('exDate')($scope.vm.data.birthday, 'yyyy-MM-dd');
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
