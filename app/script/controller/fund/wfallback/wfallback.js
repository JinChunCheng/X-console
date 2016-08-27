define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', 'fundService', 'toaster', function($scope, $http, metaService, $filter, $timeout, $modal, fundService, toaster) {

        $scope.listView = {
            condition: {},
            withdraw:{},
            getDetail:getDetail,
        };
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
    }];
});
