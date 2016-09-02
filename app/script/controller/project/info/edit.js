define([], function() {
    return ['$scope', '$state', '$stateParams', 'projectService', 'metaService',
        function($scope, $state, $stateParams, projectService, metaService) {

            $scope.projectVM = {
                data: { status: 'NEW' },
                creditChannelList: [],
                getManagerList: function() {
                    if (!$scope.projectVM.data.creditChannelId)
                        return [];
                    var result = [];
                    $scope.projectVM.creditChannelList.forEach(function(item) {
                        if (item.id == $scope.projectVM.data.creditChannelId) {
                            result = item.children;
                        }
                    });
                    return result;
                },
                submit: submit
            };

            (function() {
                metaService.getMeta('SXQD', function(items) {
                    $scope.projectVM.creditChannelList = items;
                });
                metaService.getMeta('CPLX', function(items) {
                    $scope.projectVM.productTypeList = items;
                });
                metaService.getMeta('XMLX', function(items) {
                    $scope.projectVM.projectTypeList = items;
                });
                metaService.getMeta('YOUWU', function(items) {
                    $scope.projectVM.youwuList = items;
                });
                metaService.getMeta('HTMB', function(items) {
                    $scope.projectVM.contractList = items;
                });
                metaService.getMeta('HKFS', function(items) {
                    $scope.projectVM.repaymentTypeList = items;
                });
                metaService.getMeta('JBFS', function(items) {
                    $scope.projectVM.autoApproveList = items;
                });
            })();


            function submit() {
            	projectService.project.save($scope.projectVM.data).$promise.then(function(res) {
            		if (res.code == 200) {
            			toaster.pop('success', '添加成功！');
            		}
            		else
            			toaster.pop('error', res.msg);
            	}, function(err) {
            		toaster.pop('error', '服务器连接失败！');
            	});
            }

        }
    ];
});
