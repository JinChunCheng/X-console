define([], function() {
    return ['$scope', '$state', '$filter', 'statisticsService', 'toaster',
        function($scope, $state, $filter, statisticsService, toaster) {

            var date = new Date();
            //var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            var year = date.getFullYear() - 1; //去年
            var month = date.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month;
            var day = date.getDate();
            day = day < 10 ? ("0" + day) : day;
            var end = $filter('exDate')(new Date());
            var start = $filter('exDate')(year + '-' + month + '-' + day);

            $scope.vm = {
                condition: { start: start, end: end },
                investorLables: [],
                investorData: [],
                investmentLabels: [],
                investmentData: [],
                search: search,
                salePlatformInvestorList: []
            };

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
                        processData(res.data);
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接出错！');
                });
            }

            function processData(data) {
                var items = data.items || [];
                var totalInvestor = 0;
                var investorLabels = [];
                var investorData = [];
                var investmentLabels = [];
                var investmentData = [];
                items.forEach(function(item) {
                    totalInvestor += item.investorVO.totalInvestor;
                    
                    investorLabels.push(item.saleplatformVO.name);
                    investorData.push(item.investorVO.totalInvestor);

                    investmentLabels.push(item.saleplatformVO.name);
                    investmentData.push(item.investmentVO.totalInvestmentAmount);
                });
                $scope.vm.totalInvestor = totalInvestor;
                $scope.vm.list = items;

                //process chart
                //investor 
                $scope.vm.investorLabels = investorLabels;
                $scope.vm.investorData = investorData;
                //investment
                $scope.vm.investmentLabels = investmentLabels;
                $scope.vm.investmentData = investmentData;
            }

            search();
        }
    ];
});
