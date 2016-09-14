define([], function () {
    return ['$scope', '$state', '$stateParams', '$modal', 'metaService', 'projectService', 'toaster',
        function ($scope, $state, $stateParams, $modal,metaService,projectService, toaster) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('project.check.list');
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
                                projectService.finishAudit({data:{
                                    projectId: $stateParams.id,
                                    status: 'DBA'
                                }}).then(function (res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '操作成功！');
                                        $modalInstance.close($state.go('project.check.list'));
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
                                $modalInstance.close($state.go('project.check.list'));
                                projectService.finishAudit({
                                    data:{
                                        projectId: $stateParams.id,
                                        status: 'DBR'
                                    }
                                });
                                return true;
                            
                            };
                        }
                    });
                }

            };
            function initMetaData() {
                metaService.getMeta('XMLX', function (data) {
                    $scope.vm.projectTypeList = data;
                });
                metaService.getMeta('HKFS', function (data) {
                    $scope.vm.repaymentTypeList = data;
                });
                metaService.getMeta('YOUWU', function (data) {
                    $scope.vm.guaranteeFlagList = data;
                });
                metaService.getMeta('JBFS', function (data) {
                    $scope.vm.autoApproveList = data;
                });
            }
            initMetaData();
            function getDetail(id) {
                projectService.project.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                    $scope.vm.data.projectVO.serviceFeeRate= parseFloat($scope.vm.data.projectVO.serviceFeeRate).toFixed(2)+'%/年';
                    $scope.vm.data.projectVO.interestRate= parseFloat($scope.vm.data.projectVO.interestRate).toFixed(2)+'%/年';
                    $scope.vm.data.projectVO.rebateRate=( $scope.vm.data.projectVO.rebateRate||0)+'%/年';
                });
            }

            getDetail($stateParams.id);
            
        }];
});

