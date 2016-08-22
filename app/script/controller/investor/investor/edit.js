define([], function() {
    return ['$scope', '$timeout', '$state', 'metaService', '$stateParams', 'borrowerService', function($scope, $timeout, $state, metaService, $stateParams, borrowerService) {

        var action = $stateParams.id ? 'edit' : 'add';

        $scope.vm = {
            action: action,
            title: $stateParams.id ? '修改投资人信息' : '新增投资人',
            channel: [{ id: 1, title: '钱盒', content: [{ code: 1, label: '钱盒' }] }, { id: 2, title: '开通宝', content: [{ code: 1, label: '开通宝' }] }, { id: 3, title: '管理系统', content: [{ code: 1, label: '管理系统' }] }],
            isEmployee: [{ id: 1, title: '待定' }, { id: 2, title: '否' }, { id: 3, title: '是' }],
            status: [{ id: 1, title: '正常' }, { id: 2, title: '关闭' }],
            IDmark: [{ id: 1, title: '认证通过' }, { id: 2, title: '认证失败' }, { id: 3, title: '等待认证' }],
            data: {},
            cancel: function() {
                $state.go('investor.investor.list');
            }
        };

        function getDataLabel1(id) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            borrowerService.resource.query({ id: id }).$promise.then(function(res) {
                console.log(res.data.items[0].id);
                $scope.vm.data.code = res.data.items[0].id;
                $scope.vm.data.loginName = res.data.items[0].id;
                $scope.vm.data.realName = res.data.items[0].id;
                $scope.vm.data.IdNo = res.data.items[0].id;
                $scope.vm.data.IDmark = res.data.items[0].id;
                $scope.vm.data.Email = res.data.items[0].id;
                $scope.vm.data.mobile = res.data.items[0].id;
                $scope.vm.data.telephone = res.data.items[0].id;
                $scope.vm.data.postCode = res.data.items[0].id;
                $scope.vm.data.address = res.data.items[0].id;
                $scope.vm.data.channel = res.data.items[0].id;
                $scope.vm.data.manager = res.data.items[0].id;
                $scope.vm.data.isEmployee = res.data.items[0].id;
                $scope.vm.data.status = res.data.items[0].id;
                $scope.vm.data.boxBidding = res.data.items[0].id;
            });
        }
        getDataLabel1($stateParams.id);
        // (function(id) {
        //     if (!id) {
        //         return;
        //     }
        //     borrowerService.resource.get({ id: id }).$promise.then(function(res) {
        //         $scope.vm.data = res.data;
        //     }, function(err) {});
        // })($stateParams.id);
    }];
});
