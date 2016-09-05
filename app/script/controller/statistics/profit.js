define([], function() {
    return ['$scope', '$state', 'statisticsService',
        function($scope, $state, statisticsService) {

            $scope.profitVM = {
                data: [],
                search: search
            };

            function search() {
                $scope.profitVM.data = [{
                    "profitLogType": null,
                    "profitDate": "2016-08-01",
                    "withdrawProfit": 0.00,
                    "depositProfit": 0.00,
                    "investmentProfit": 0.00,
                    "projectProfit": 0.00
                }, {
                    "profitLogType": null,
                    "profitDate": "2016-08-02",
                    "withdrawProfit": 0.00,
                    "depositProfit": 0.00,
                    "investmentProfit": 0.00,
                    "projectProfit": 0.00
                }, {
                    "profitLogType": null,
                    "profitDate": "2016-08-04",
                    "withdrawProfit": 0.00,
                    "depositProfit": 0.00,
                    "investmentProfit": 0.00,
                    "projectProfit": 0.00
                }, {
                    "profitLogType": null,
                    "profitDate": "2016-08-05",
                    "withdrawProfit": 0.00,
                    "depositProfit": 0.00,
                    "investmentProfit": 0.00,
                    "projectProfit": 0.00
                }];


                $scope.profitVM.data.forEach(function(item) {
                    item.totalProfit = item.withdrawProfit + item.depositProfit + item.investmentProfit + item.projectProfit;
                });
            }
        }
    ];
});
