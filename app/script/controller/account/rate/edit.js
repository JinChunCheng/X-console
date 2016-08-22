define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {
        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改费率' : '新增费率',
            rateCode: [{ id: 1, title: '项目出款'}, { id: 2, title: '提现出款'}],
            rateType: [{ id: 1, title: '百分比' }, { id: 2, title: '绝对值' }],
            status: [{ id: 1, title: '正常' }, { id: 2, title: '关闭' }],
            data: {},
            cancel: function() {
                $state.go('account.rate.rate');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.resource.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                debugger
            });
        })($stateParams.id);

    }];
});
