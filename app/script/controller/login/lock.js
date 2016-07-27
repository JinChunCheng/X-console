define(['common/session', 'service/config'], function(session, config) {
    return ['$scope', '$state', '$timeout', function($scope, $state, $timeout) {
        $scope.lockVM = {
            processing: false
        };

        $scope.unlock = function(valid) {
            if (!valid || $scope.lockVM.processing)
                return false;

            $scope.lockVM.processing = true;
            $timeout(function() {
                $state.go('home');
            }, 1000);
        };
    }];
});
