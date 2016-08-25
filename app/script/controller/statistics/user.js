define([], function() {
    return ['$scope', '$state', '$filter',
        function($scope, $state, $filter) {
            var today = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.vm = {
                condition: { start: today, end: today }
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };

            $scope.labels = ["公司内部员工", "盒伙人", "普通用户"];
            $scope.data = [300, 500, 100];

        }
    ];
});
