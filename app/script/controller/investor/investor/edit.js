define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', 'metaService', '$filter', '$stateParams', 'investorService', function($scope, toaster, $timeout, $state, metaService, $filter, $stateParams, investorService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改投资人信息' : '新增投资人',
            data: {},
            cancel: function() {
                $state.go('investor.investor.list');
            },
            channelChange: function() {
                $scope.vm.data.fundAccountManagerId = null;
            },
            fundChannelName: [],
            getManagers: function(channelId) {
                var result = [];
                $scope.vm.fundChannelName.forEach(function(item) {
                    if (item.value == channelId) {
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
                $scope.vm.fundChannelName = data;
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
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');

                });
                return;
            }
            //修改投资人
            investorService.updateInvestor.update($scope.vm.data).$promise.then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '修改投资人信息成功！');
                    $state.go("investor.investor.list");
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
