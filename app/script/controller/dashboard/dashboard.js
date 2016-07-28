define(['common/path-helper'], function(helper) {
    return ['$scope', 'dashboardService', function($scope, dashboardService) {
    	
        $scope.$on('$viewContentLoaded', function() {
            dashboardService.init();
            dashboardService.setHeights()
        });

    }];
});
