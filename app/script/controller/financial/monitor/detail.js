define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'financialService','toaster',
        function($scope, $timeout, $state, $stateParams, financialService,toaster) {

            var action = $stateParams.id ? 'edit' : 'add';
            var defaultCondition = {

                paginate: {
                    sort: 'update_time desc',
                    pageNum: 1,
                    pageSize: 10
                },
            };
            $scope.vm = {
                action: action,
                condition: angular.copy(defaultCondition),
                table: null,
                data: {},
                cancel: function() {
                    $state.go('financial.monitor.monitor');
                }
            };

            (function(id) {
                if(!id)
                    return;
                financialService.monitorDetailsTable.get({id: id}).$promise.then(function(res) {
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
