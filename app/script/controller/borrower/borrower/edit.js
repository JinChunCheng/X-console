define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService','$filter', 'borrowerService', function($scope, toaster, $timeout, $state, $stateParams, metaService,$filter, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改借款人信息' : '新增借款人信息',
            status: [{ code: 1, title: '正常' }, { code: 2, title: '关闭' }],
            bank: [{ code: 1, title: '农业银行' }, { code: 2, title: '中国工商银行' }, { code: '104100000004', title: '中国银行' }, { code: 2, title: '中国民生银行' }],
            data: {},
            cancel: function() {
                $state.go('borrower.info.list');
            },
            save: save
        };

        (function showContent() {
            if ($stateParams.id) {
                borrowerService.borrowerDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data;
                });
            }
            return;
        })();

        function save() {
            if (!$stateParams.id) {
                //新增借款人
                borrowerService.createBorrower.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增借款人成功！');
                        $state.go("borrower.info.list");
                    }

                });
                return;
            }
            //修改借款人
            borrowerService.updateBorrower.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改借款人成功！');
                    $state.go("borrower.info.list");
                }
            });
        }

        function initMetaData() {
            metaService.getProvinces(function(res) {
                $scope.vm.provinces = res;
            });
        }
        initMetaData();
    }];
});
