define([], function() {
    return ['$scope', '$timeout','metaService', '$state', '$stateParams', 'toaster', 'financialService',
        function($scope, $timeout, metaService,$state, $stateParams, toaster, financialService) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.vm = {
                action: action,
                data: {},
                cancel: function() {
                    $state.go('financial.POS.POS');
                }
            };
            function initMetaData() {
                metaService.getMeta('DZZT', function(data) {
                    $scope.vm.status = data;
                });
            }
            initMetaData();
            (function(id) {
                if(!id)
                    return;
                financialService.POSDetailsTable.get({id: id}).$promise.then(function(res) {
                    if(res.code == 200) {
                        $scope.vm.data = res.data;
                    }
                    else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接错误！');
                });
            })($stateParams.id);
        }
    ];
});
