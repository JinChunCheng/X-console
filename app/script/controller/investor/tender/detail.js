define([], function () {
    return ['$scope', '$state', '$stateParams','investorService',
        function ($scope, $state, $stateParams, investorService) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('investor.tender.list');
                }
            };

            function getDetail(id) {
                investorService.tenderDetail.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                    console.log(res)
                    console.log($scope.vm.data.bindingVO)
                });
            }
            //console.log($stateParams)
            getDetail($stateParams.id);


        }];
});

