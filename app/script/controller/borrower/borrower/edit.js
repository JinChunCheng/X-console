define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', '$filter', 'borrowerService', function($scope, toaster, $timeout, $state, $stateParams, metaService, $filter, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改借款人信息' : '新增借款人信息',
            data: {},
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

        (function showContent() {
            if ($stateParams.id) {
                borrowerService.borrowerDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data.borrowerDetail;
                    $scope.vm.data.bankProvince += '0000';
                    $scope.vm.data.bankCity += '00';
                });
            }
            return;
        })();

        function save() {
            if (!$stateParams.id) {
                //新增借款人
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
