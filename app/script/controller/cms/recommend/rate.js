define(['common/session', 'service/config'], function(session, config) {
    return ['$scope', '$modalInstance', '$timeout', 'rateData', function($scope, $modalInstance, $timeout, rateData) {

        $scope.rateVM = {
            processing: false,
            title: rateData.title,
            data: rateData.data
        };
		console.log(rateData.data);

        $scope.ok = function() {
            $scope.rateVM.processing = true;
            $timeout(function() {
                $scope.rateVM.processing = false;
                $modalInstance.close($scope.rateVM.data);
            }, 500);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }];
});
