define(['common/path-helper'], function(helper) {
    return ['$scope', '$http', 'toaster', 'dashboardService', function($scope, $http, toaster, dashboardService) {

        $scope.dashboardVM = {
            data: {},
            dataRange: 1,
            changeDataRange: function(dataRange) {
                $scope.dashboardVM.dataRange = dataRange;
            }
        }
        $scope.$on('$viewContentLoaded', function() {
            dashboardService.init();
            dashboardService.setHeights();
            dashboardService.getData().then(function(res) {
                if (res.code == 200) {
                    $scope.dashboardVM.data = res.data;
                    $scope.dashboardVM.data.totalAmount = $scope.dashboardVM.data.depositAmount + $scope.dashboardVM.data.biddingAmount;
                    processData();
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        });


        function processData(data) {
            var assetLabel = ['平台余额', '在仓金额'];
            var assetData = [$scope.dashboardVM.data.depositAmount, $scope.dashboardVM.data.biddingAmount];
            var depositCount=$scope.dashboardVM.data.depositCount;
            var authFlagCount=$scope.dashboardVM.data.authFlagCount;
            var userIncreAmount=$scope.dashboardVM.data.userIncreAmount;

            $scope.dashboardVM.depositPercent = (depositCount /authFlagCount*100).toFixed(2) + '%';
            $scope.dashboardVM.authPercent = (authFlagCount /userIncreAmount*100).toFixed(2) + '%';
            $scope.dashboardVM.assetLabel = assetLabel;
            $scope.dashboardVM.assetData = assetData;
            $scope.dashboardVM.userTransformLabel = ["充值人数", "实名人数", "注册人数"];
            $scope.dashboardVM.userTransformData = [$scope.dashboardVM.data.depositCount, $scope.dashboardVM.data.authFlagCount, $scope.dashboardVM.data.userIncreAmount, 0];
            $scope.dashboardVM.increaseLabel = ["充值金额", "提现金额", "净增金额"];
            $scope.dashboardVM.increaseData = [$scope.dashboardVM.data.depositSByDate, $scope.dashboardVM.data.withdrawAccount, $scope.dashboardVM.data.depositSByDate - $scope.dashboardVM.data.withdrawAccount];

        };
    }];
});
