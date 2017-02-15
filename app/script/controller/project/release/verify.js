define([], function() {
    return ['$scope', '$state', '$stateParams', '$filter', '$modal', 'projectService', 'metaService', 'toaster',
        function($scope, $state, $stateParams, $filter, $modal, projectService, metaService, toaster) {

            var date = $filter('exDate')(new Date());
            var date2 = $filter('exDate')(new Date(), "yyyy-MM-dd HH:mm:ss");
            var todayHours = new Date(date2).getHours() + '';
            var todayMinutes = new Date(date2).getMinutes() + '';
            console.log(todayHours, todayMinutes)

            $scope.projectVM = {
                borrower: {},
                project: {},
                data: { id: $stateParams.id, publishType: 'I', publishTime: date, publishH: todayHours, publishM: todayMinutes },
                cancel: function() {
                    $state.go('project.release.list');
                },
                pass: function() {
                    if ($scope.projectVM.data.publishType == 'T') {
                        var nowTime = $filter('exDate')($scope.projectVM.data.publishTime, 'yyyy-MM-dd ') + $scope.projectVM.data.publishH + ":" + $scope.projectVM.data.publishM + ":" + "59";
                        var date3 = $filter('exDate')(new Date(), "yyyy-MM-dd HH:mm:ss");
                        var d1 = new Date(date3.replace(/\-/g, "\/"));

                        var d2 = new Date(nowTime.replace(/\-/g, "\/"));
                        if ($scope.projectVM.data.publishTime == null) {
                            toaster.pop('error', '请填写完整的发布时间!');
                            return false;
                        } else if (d1 > d2) {
                            toaster.pop('error', '发布时间必须大于当前时间!');
                            return false;
                        }
                        verify(true);
                    } else if ($scope.projectVM.data.publishType == 'I') {
                        verify(true);
                    }


                },
                refuse: function() {
                    verify(false);
                }
            };
            $scope.Hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            $scope.Minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

            (function(id) {
                initMeta();
                projectService.project.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200) {
                        if (res.data) {
                            $scope.projectVM.borrower = res.data.borrowerVO;
                            $scope.projectVM.project = res.data.projectVO;
                            $scope.projectVM.projectBorrowerVOs = res.data.projectBorrowerVOs;
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
                    id: $stateParams.id
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
                            data.publishTime = $filter('exDate')($scope.projectVM.data.publishTime, 'yyyy-MM-dd ') + $scope.projectVM.data.publishH + ":" + $scope.projectVM.data.publishM + ":" + "59";
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
                            projectService.finishAuditRelease({ data: data }).then(function(res) {
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
