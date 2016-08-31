define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'investorService', function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams, investorService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改投资人信息' : '新增投资人',
            data: {},
            fundChannelCode:[],
            cancel: function() {
                $state.go('investor.investor.list');
            },
            fundChannelChange: function() {
                $scope.vm.data.fundAccountManagerCode = null;
            },
            getManager: function(channelCode) {
                var result = [];
                $scope.vm.fundChannelCode.forEach(function(item) {
                    if (item.value == channelCode) {
                        result = item.children;
                        return;
                    }
                });
                return result;
            },
            submit: submit
        };

        function initMetaData() {
            metaService.getMeta('LCQDMC', function(data) {
                $scope.vm.fundChannelCode = data;
            });
            metaService.getMeta('SFBGSYG', function(data) {
                $scope.vm.empFlag = data;
            });
            metaService.getMeta('ZT', function(data) {
                $scope.vm.status = data;
            });
            metaService.getMeta('SFRZZT', function(data) {
                $scope.vm.idAuthFlag = data;
            });
            metaService.getMeta('LCJLXM', function(data) {
                $scope.vm.fundAccountManagerCode = data;
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
                investorService.updateInvestorDetail.get({ id: $stateParams.id }).$promise.then(function(res) {
                    //基本信息展示
                    $scope.vm.data = res;
                });
            }
            return;
        })();

        function save() {
            if (!$stateParams.id) {
                //新增投资人
                investorService.createInvestor.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增投资人信息成功！');
                        $state.go("investor.investor.list");
                    }

                });
                return;
            }
            //修改投资人
            investorService.investorUpdate($scope.vm.data).then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改投资人信息成功！');
                    $state.go("investor.investor.list");
                }
            });
        }

    }];
});
