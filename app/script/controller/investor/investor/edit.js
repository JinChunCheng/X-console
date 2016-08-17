define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', function($scope, $timeout, $state, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改投资人信息' : '新增投资人',
            channel: [{ id: 1, title: '钱盒', content: [{ code: 1, label: '钱盒' }] }, { id: 2, title: '开通宝', content: [{ code: 1, label: '开通宝' }] }, { id: 3, title: '管理系统', content: [{ code: 1, label: '管理系统' }] }],
            isEmployee:[{id:1,title:'待定'},{id:2,title:'否'},{id:3,title:'是'}],
            status:[{id:1,title:'正常'},{id:2,title:'关闭'}],
            IDmark:[{id:1,title:'认证通过'},{id:2,title:'认证失败'},{id:3,title:'等待认证'}],
            data: {},
            cancel: function() {
                $state.go('investor.investor.list');
            }
        };

        (function(id) {
            if (!id) {
                return;
            }
            borrowerService.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            }, function(err) {
                debugger
            });
        })($stateParams.id);

    }];
});
