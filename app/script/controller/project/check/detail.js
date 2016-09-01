define([], function () {
    return ['$scope', '$state', '$stateParams', '$modal',  'projectService', 'toaster',
        function ($scope, $state, $stateParams, $modal, projectService, toaster) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('project.check.check');
                },
                pass: function () {
                    var text = "您确定批准吗？";
                    $modal.open({
                        templateUrl: 'view/shared/confirm.html',
                        size: 'sm',
                        controller: function ($scope, $modalInstance, $state) {
                            $scope.confirmData = {
                                text: text,
                                processing: false
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                                return false;
                            };
                            $scope.ok = function () {
                                $scope.confirmData.processing = true;//请求数据的过程有个表示
                                //$timeout(function () {
                                //        $scope.confirmData.processing = false;
                                //    }, 1000);
                                projectService.finishAudit({
                                    projectId: $stateParams.id,
                                    status: 'DBA'
                                }).then(function (res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '操作成功！');
                                        $modalInstance.close($state.go('project.check.check'));
                                    }
                                    else
                                        toaster.pop('error', res.msg);
                                    $scope.confirmData.processing = false;
                                }, function (err) {
                                    toaster.pop('error', '服务器连接失败！');
                                    $scope.confirmData.processing = false;
                                });
                                return true;
                            };
                        }
                    });
                },
                refuse: function () {
                    var text = "您确定拒绝吗？";
                    $modal.open({
                        templateUrl: 'view/shared/confirm.html',
                        size: 'sm',
                        controller: function ($scope, $modalInstance, $state) {
                            $scope.confirmData = {
                                text: text,
                                processing: false
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                                return false;
                            };
                            $scope.ok = function () {
                                $modalInstance.close($state.go('project.check.check'));
                                projectService.finishAudit({
                                    projectId: $stateParams.id,
                                    status: 'DBR'
                                });
                                return true;
                            
                            };
                        }
                    });
                }

            };

            function getDetail(id) {
                projectService.project.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                });
            }

            getDetail($stateParams.id);
            
        }];
});

