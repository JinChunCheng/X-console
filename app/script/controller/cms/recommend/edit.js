define(['common/session', 'service/config'], function(session, config) {
    return ['$scope', '$modalInstance', '$timeout', 'pageData', function($scope, $modalInstance, $timeout, pageData) {

        $scope.pageVM = {
            processing: false,
            title: pageData.title,
            data: pageData.data,
            statusList: pageData.statusList
        };

        $scope.ok = function() {
            $scope.pageVM.processing = true;
            $timeout(function() {
                $scope.pageVM.processing = false;
                $modalInstance.close($scope.pageVM.data);
            }, 500);
        };

        $scope.cancel = function() {
            debugger;
            $modalInstance.dismiss('cancel');
        };
    }];
});
