define([], function () {
    return ['$scope', '$state','$modal', '$stateParams','metaService','investorService','toaster',
        function ($scope, $state,$modal, $stateParams,metaService, investorService,toaster) {
            $scope.vm = {
                data: {},
                cancel: function () {
                    $state.go('investor.tender.list');
                },
                cancelTender: function () {
                    var flag=true;
                    var text = "您确定要撤销此次投标吗!";
                    var data = $scope.vm.data;
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
                                $scope.confirmData.processing = true;
                                investorService.finishCancel(
                                    data.investorVO.investorId,
                                    data.projectVO.id,
                                    data.biddingVO.biddingId
                                ).then(function (res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '操作成功！');
                                        //$modalInstance.close($state.go('project.check.check'));
                                        flag=false;
                                        $modalInstance.dismiss();
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
                }
            };
            function initMetaData() {
                metaService.getMeta('TBLBZT', function (data) {
                    $scope.vm.status = data;
                });
                metaService.getMeta('SFBHSTJ', function(data) {
                    $scope.vm.hasTrial = data;
                });
            };
            initMetaData();
            function getDetail(id) {
                investorService.tenderCancel.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                });
            }

            getDetail($stateParams.id);


        }];
});
