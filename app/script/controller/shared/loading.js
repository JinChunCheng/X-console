define(['common/session', 'service/config'], function(session, config) {
    return ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance) {
        
        // $scope.ok = function(valid) {
        //     $scope.terminalVM.processing = true;
        //     $timeout(function() {
        //         $scope.terminalVM.processing = false;
        //         $modalInstance.close($scope.terminalVM.data);
        //     }, 500);
        // };

        // $scope.cancel = function() {
        //     $modalInstance.dismiss('cancel');
        // };
    }];
});
