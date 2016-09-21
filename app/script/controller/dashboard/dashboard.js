define(['common/path-helper'], function(helper) {
    return ['$scope', 'dashboardService', function($scope, dashboardService) {
    	
        $scope.$on('$viewContentLoaded', function() {
            dashboardService.init();
            dashboardService.setHeights()
        });

        $scope.dashboardVM = {
        	dataRange: 1,
        	changeDataRange: function(dataRange) {
        		$scope.dashboardVM.dataRange = dataRange;
        	}
        }
    }];
});
