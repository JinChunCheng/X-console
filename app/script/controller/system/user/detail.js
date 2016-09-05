define([], function() {
    return ['$scope','$state','$stateParams','systemService', function($scope,$state,$stateParams, systemService) {
        $scope.vm = {
            data: {},
            cancel: function () {
                $state.go('system.user.list');
            }
        };

        function getDetail(id) {
            systemService.systemDetail.get({id: id}).$promise.then(function (res) {
                $scope.vm.data = res.data;
            });
        }

        getDetail($stateParams.id);
    }]});