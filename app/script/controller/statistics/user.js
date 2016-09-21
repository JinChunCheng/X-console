define([], function() {
    return ['$scope', '$state', '$filter', 'statisticsService', 'toaster',
        function($scope, $state, $filter, statisticsService, toaster) {

            var date = new Date();
            //var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            var year = date.getFullYear() - 1; //去年
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var end = $filter('exDate')(new Date());
            var start = $filter('exDate')(year + '-' + month + '-' + day);

            $scope.vm = {
                condition: { start: start, end: end },
                data: [],
                search: search
            };

            $scope.labels = ["公司内部员工", "盒伙人", "普通用户"];
            $scope.data = [300, 500, 100];


            function search() {

                var startDate = $scope.vm.condition.start;
                var endDate = $scope.vm.condition.end;
                startDate = $filter('exDate')(startDate);
                endDate = $filter('exDate')(endDate);
                if (!startDate || !endDate) {
                    toaster.pop('error', '请选择开始和结束日期！');
                    return false;
                }
                if (startDate > endDate) {
                    toaster.pop('error', '结束日期不能小于开始日期！');
                    return false;
                }

                statisticsService.findUser(startDate, endDate).then(function(res) {
                    if (res.code == 200) {
                        //processData(res.data);
                        console.log(res.data);
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接出错！');
                });
            }

            function processData(data) {
                var totalInvestorCount = 0;
                var salePlatformInvestorList = [];
                if (data && data.items) {
                    data.items.forEach(function(item) {
                        //
                    });
                }
            }
        }
    ];
});
