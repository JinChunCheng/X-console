define([], function() {
    return ['$scope', '$state', '$filter', 'statisticsService', 'toaster',
        function($scope, $state, $filter, statisticsService, toaster) {

            var now = new Date();
            var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month;
            var day = date.getDate();
            day = day < 10 ? ("0" + day) : day;
            var end = $filter('exDate')(new Date());
            var start = $filter('exDate')(year + '-' + month + '-' + day);

            $scope.profitVM = {
                condition: { start: start, end: end },
                data: [],
                search: search
            };

            $scope.line = {};
            $scope.pie = {};

            function search() {
                var startDate = $scope.profitVM.condition.start;
                var endDate = $scope.profitVM.condition.end;
                startDate = $filter('exDate')(startDate);
                endDate = $filter('exDate')(endDate);
                if (!startDate || !endDate) {
                    toaster.pop('error', '请选择开始和结束日期！');
                    return false;
                }
                console.log(startDate, endDate)
                if (startDate > endDate) {
                    toaster.pop('error', '结束日期不能小于开始日期！');
                    return false;
                }

                statisticsService.findProfit(startDate, endDate).then(function(res) {
                    if (res.code == 200) {
                        processData(res.data);
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接出错！');
                });
            }
            search();

            function processData(data) {
                data = data || [];
                var totalRow = {
                    profitDate: '总计',
                    withdrawProfit: 0.00,
                    depositProfit: 0.00,
                    investmentProfit: 0.00,
                    projectProfit: 0.00,
                    totalProfit: 0.00
                };
                data.forEach(function(item) {
                    var totalProfit = item.withdrawProfit + item.depositProfit + item.investmentProfit + item.projectProfit;
                    totalRow.withdrawProfit += item.withdrawProfit;
                    totalRow.depositProfit += item.depositProfit;
                    totalRow.investmentProfit += item.investmentProfit;
                    totalRow.projectProfit += item.projectProfit;
                    totalRow.totalProfit += totalProfit;

                    item.totalProfit = totalProfit.toFixed(2);
                    item.withdrawProfit = item.withdrawProfit.toFixed(2);
                    item.depositProfit = item.depositProfit.toFixed(2);
                    item.investmentProfit = item.investmentProfit.toFixed(2);
                    item.projectProfit = item.projectProfit.toFixed(2);
                });

                buildPieChart(angular.copy(totalRow));

                totalRow.profitDate = '共' + data.length + '天';
                var tableData = angular.copy(data);

                totalRow.withdrawProfit = totalRow.withdrawProfit.toFixed(2);
                totalRow.depositProfit = totalRow.depositProfit.toFixed(2);
                totalRow.investmentProfit = totalRow.investmentProfit.toFixed(2);
                totalRow.projectProfit = totalRow.projectProfit.toFixed(2);
                totalRow.totalProfit = totalRow.totalProfit.toFixed(2);
                tableData.push(totalRow);
                $scope.profitVM.data = tableData;

                buildLineChart(data);
            }

            function buildPieChart(totalRow) {
                var deposit = (totalRow.depositProfit / totalRow.totalProfit * 100).toFixed(1);
                var withdraw = (totalRow.withdrawProfit / totalRow.totalProfit * 100).toFixed(1);
                var project = (totalRow.projectProfit / totalRow.totalProfit * 100).toFixed(1);
                var investment = (totalRow.investmentProfit / totalRow.totalProfit * 100).toFixed(1);
                $scope.pie.labels = ["充值利润(%)", "提现利润(%)", "项目利润(%)", "利息利润(%)"];
                $scope.pie.data = [deposit, withdraw, project, investment];
                $scope.pie.series = ["充值利润", "提现利润", "项目利润", "利息利润"];
            }

            function buildLineChart(data) {

                $scope.line.labels = data.map(function(item) {
                    return item['profitDate'];
                });

                $scope.line.data = [
                    data.map(function(item) {
                        return item['totalProfit'];
                    })
                ];
                $scope.line.options = {
                    scales: {
                        yAxes: [{
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }]
                    }
                };
            };
        }
    ];
});
