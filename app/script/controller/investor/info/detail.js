define([], function () {
    return ['$scope', '$state', '$stateParams','$modal','investorService',
        function ($scope, $state, $stateParams,$modal, investorService) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('investor.info.list');
                },
                repayList:function(){
                   showRepayList();
                }
            };

            function getDetail(id) {
                investorService.infoList.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                });
            }

            getDetail($stateParams.id);
            function showRepayList(){
                return alert('aa')

            }

        }];
});
