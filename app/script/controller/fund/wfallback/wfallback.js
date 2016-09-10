define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', 'fundService', 'toaster', function($scope, $http, metaService, $filter, $timeout, $modal, fundService, toaster) {

        $scope.listView = {
            condition: {},
            withdraw: {},
            getDetail: getDetail,
            batch:batch,
        };

        function initMetaData() {
            metaService.getMeta('TXZT', function(data) {
                $scope.listView.status = data;
            });
        }
        initMetaData();
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        function getDetail(id) {
            fundService.withdrawBackLabel.get({ id: id }).$promise.then(function(res) {
                //基本信息
                $scope.listView.condition = res.data.result;
                $scope.listView.withdraw.id = res.data.withdraw.id;

            });
        }

        function batch() {
            fundService.batchUpdatePlatform({ withdrawId: $scope.listView.withdraw.id,memo:$scope.listView.condition.memo },'POST').then(function(res) {
                if (res.code == 200) {
                    toaster.pop('success', '提现回退申请成功！');
                    $scope.listView.withdraw.id=null;
                    $scope.listView.condition={};
                } else
                    toaster.pop('error', res.msg);
            }, function(err) {
                toaster.pop('error', '服务器连接失败！');
            });
        }

    }];
});
