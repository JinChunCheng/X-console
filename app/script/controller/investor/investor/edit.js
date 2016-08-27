define([], function() {
    return ['$scope', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'investorService', function($scope, $timeout, $state, metaService, $filter, $stateParams, investorService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改投资人信息' : '新增投资人',
            fundChannelCode: [{ id: 1, title: '钱盒', content: [{ code: 1, label: '钱盒' }] }, { id: 2, title: '开通宝', content: [{ code: 1, label: '开通宝' }] }, { id: 3, title: '管理系统', content: [{ code: 1, label: '管理系统' }] }],
            staticParamValue: [{ id: 1, title: '待定' }, { id: 2, title: '否' }, { id: 3, title: '是' }],
            status: [{ id: 1, title: '正常' }, { id: 2, title: '关闭' }],
            staticParamValue: [{ id: 1, title: '认证通过' }, { id: 2, title: '认证失败' }, { id: 3, title: '等待认证' }],
            data: {},
            cancel: function() {
                $state.go('investor.investor.list');
            },
            submit: submit
        };

        function submit(invalid) {
            $scope.vm.submitted = true;
            if (invalid) {
                return;
            }
            save();
            return true;
        }
        (function showContent() {
            if ($stateParams.id) {
                investorService.investorDetailLabel.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res.data;
                });
            }
            return;
        })();

        function save() {
            if (!$stateParams.id) {
                //新增借款人
                investorService.createInvestor.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增借款人成功！');
                        $state.go("borrower.info.list");
                    }

                });
                return;
            }
            //修改借款人
            investorService.updateInvestor.update($scope.vm.data).$promise.then(function(res) {
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
