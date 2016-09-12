define([], function () {
    return ['$scope', '$state', '$stateParams','metaService','investorService',
        function ($scope, $state, $stateParams,metaService, investorService) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('investor.tender.list');
                }
            };
            function initMetaData() {
                metaService.getMeta('TBLBZT', function (data) {
                    $scope.vm.status = data;
                });
                metaService.getMeta('SFBHSTJ', function(data) {
                    $scope.vm.hasTrial = data;
                });
            };
            initMetaData();
            function getDetail(id) {
                investorService.tenderDetail.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                    //$scope.vm.data.projectVO
                });
            }

            getDetail($stateParams.id);


        }];
});

