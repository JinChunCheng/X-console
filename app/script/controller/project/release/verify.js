define([], function() {
    return ['$scope', '$state', '$stateParams', '$filter', '$modal', 'projectService', 'metaService', 'toaster',
        function($scope, $state, $stateParams, $filter, $modal, projectService, metaService, toaster) {

            var date = $filter('exDate')(new Date());

            $scope.projectVM = {
                borrower: {},
                project: {},
                data: { projectId: $stateParams.id, publishType: 'I', publishTime: date },
                cancel: function() {
                    $state.go('project.release.list');
                },
                pass: function() {
                    verify(true);
                },
                refuse: function() {
                    verify(false);
                }
            };

            (function(id) {
                initMeta();
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

            function initMeta() {
                metaService.getMeta('XMLX', function(items) {
                    $scope.projectVM.projectTypeList = items;
                });
                metaService.getMeta('HKFS', function(items) {
                    $scope.projectVM.repaymentTypeList = items;
                });
                metaService.getMeta('SJDW', function(items) {
                    $scope.projectVM.timeUnitList = items;
                });
                metaService.getMeta('HTMB', function(items) {
                    $scope.projectVM.contractList = items;
                });
                metaService.getMeta('XMZT', function(items) {
                    $scope.projectVM.projectStatusList = items;
                });
                metaService.getMeta('YOUWU', function(items) {
                    $scope.projectVM.youwuList = items;
                });
                metaService.getMeta('JBFS', function(items) {
                    $scope.projectVM.approveTypeList = items;
                });
                metaService.getMeta('FBFS', function(items) {
                    $scope.projectVM.publishTypeList = items;
                });
                metaService.getMeta('SXQD', function(items) {
                    $scope.projectVM.creditChannelList = items;
                    var creditManagerList = [];
                    if (items && items.length > 0) {
                        items.forEach(function(item) {
                            creditManagerList = creditManagerList.concat(item.children);
                        });
                    }
                    $scope.projectVM.creditManagerList = creditManagerList;
                });
            }


            function verify(pass) {
                var text = '确认操作？';
                var data = {
                    projectId: $stateParams.id
                };
                if (!pass) {
                    text = '确定拒绝该项目？';
                    data.status = 'PBR';
                } else {
                    text = '确定审核通过该项目？';
                    data.publishType = $scope.projectVM.data.publishType;
                    switch ($scope.projectVM.data.publishType) {
                        case 'I':
                            data.status = 'IPB';
                            break;
                        case 'T':
                            data.status = 'RPB';
                            data.publishTime = $filter('exDate')($scope.projectVM.data.publishTime, 'yyyy-MM-dd HH:mm:ss');
                            //data.publishTime = new Date($filter('exDate')($scope.projectVM.data.publishTime, 'yyyy-MM-dd HH:mm:ss'));
                            break;
                        default:
                            break;
                    }
                }

                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance, $state) {
                        $scope.confirmData = {
                            text: text,
                            processing: false
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        };
                        $scope.ok = function() {
                            $scope.confirmData.processing = true;
                            projectService.finishAudit({ data: data }).then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '操作成功！');
                                    $modalInstance.dismiss();
                                    $state.go('project.release.list');
                                } else
                                    toaster.pop('error', res.msg);
                                $scope.confirmData.processing = false;
                            }, function(err) {
                                toaster.pop('error', '服务器连接出错！');
                                $scope.confirmData.processing = false;
                            });
                            return true;
                        };
                    }
                });
            }
        }
    ];
});
