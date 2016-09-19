define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $timeout, $state, $stateParams, $modal, $filter, assetService, metaService, toaster) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.productVM = {
                action: action,
                title: '产品上架信息',
                data: {},
                cancel: function() {
                    $state.go('asset.release.todo');
                },
                canBeSubmitted: function() {
                    if (!$scope.productVM.data)
                        return false;
                    var status = $scope.productVM.data.status;
                    //to be on shelf or off shelf
                    return status === 0 || status === 1;
                },
                submit: submit
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                assetService.product.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200)
                        $scope.productVM.data = res.data;
                    else
                        toaster.pop('error', res.msg);
                }, function(err) {});

            })($stateParams.id);


            function initMetaData() {
                assetService.platform.query({ where: JSON.stringify({ data: { status: 1 }, paginate: { pageNum: 1, pageSize: 100 } }) }).$promise.then(function(res) {
                    if (res.code == 200) {
                        $scope.productVM.saleplatformList = res.data.items;
                    } else
                        console.log('获取销售平台失败：' + res.msg);
                }, function(err) {
                    console.log('获取销售平台失败：服务器连接错误！')
                });
                metaService.getMeta('ZCLX', function(data) {
                    $scope.productVM.assetTypeList = data;
                });
                metaService.getMeta('HKFS', function(data) {
                    $scope.productVM.repaymentTypeList = data;
                });
                metaService.getMeta('CQR', function(data) {
                    $scope.productVM.ownerList = data;
                });
                metaService.getMeta('JBFS', function(data) {
                    $scope.productVM.approveTypeList = data;
                });
            }

            function submit(invalid) {
                $scope.productVM.submitted = true;
                if (invalid) {
                    return false;
                }
                var data = $scope.productVM.data;
                //处理时间
                if (data.debtStartDate) {
                    data.debtStartDate = $filter('exDate')(data.debtStartDate);
                }
                if (data.debtEndDate) {
                    data.debtEndDate = $filter('exDate')(data.debtEndDate);
                }
                if (data.saleplatformId) {
                    var saleplatformList = $scope.productVM.saleplatformList;
                    if (saleplatformList) {
                        saleplatformList.forEach(function(item) {
                            if (item.id == data.saleplatformId) {
                                data.saleplatform = item.name;
                                return;
                            }
                        });
                    }
                }

                assetService.onshelf($scope.productVM.data).then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '产品上架成功！');
                        $state.go('asset.release.todo');
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接出错！');
                });
            }
        }
    ];
});
