define([], function() {
    return ['$scope', '$state', '$stateParams', 'projectService', 'metaService', 'toaster',
        function($scope, $state, $stateParams, projectService, metaService, toaster) {

            $scope.projectVM = {
                borrower: {},
                project: {},
                cancel: function() {
                    $state.go('project.info.list');
                }
            };

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
        }
    ];
});
