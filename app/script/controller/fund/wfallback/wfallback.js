define([], function() {
    return ['$scope', '$http', '$timeout', '$modal','borrowerService', 'toaster',function($scope, $http, $timeout, $modal,borrowerService,toaster) {

        /**
         * the default search condition
         * @type {Object}
         */

        $scope.listView = {};
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
        **/
    }];
});
