define([], function() {
    return ['$scope', '$state', '$stateParams', 'projectService',
        function($scope, $state, $stateParams, projectService) {

            $scope.projectVM = {
                borrower: {},
                project: {},
                cancel: function() {
                    $state.go('project.info.list');
                }
            };

            (function(id) {
                projectService.project.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200) {
                        if (res.data) {
                            $scope.projectVM.borrower = res.data.borrowerVO;
                            $scope.projectVM.project = res.data.projectVO;
                        }
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接出错！');
                });
            })($stateParams.id);

        }
    ];
});
