define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', 'assetService', 'metaService', 'toaster',
        function($scope, $timeout, $state, $stateParams, $modal, assetService, metaService, toaster) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.assetVM = {
                action: action,
                title: $stateParams.id ? '修改资产信息' : '新增资产信息',
                data: {},
                cancel: function() {
                    $state.go('asset.info.list');
                },
                provinceChange: function() {
                    $scope.assetVM.data.city = null;
                    $scope.assetVM.data.area = null;
                },
                cityChange: function() {
                    $scope.assetVM.data.area = null;
                },
                showFiles: function(type, title) {
                    showFiles(type, title);
                }
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                assetService.asset.get({ id: id }).$promise.then(function(res) {
                    $scope.assetVM.data = res.data;
                }, function(err) {});
            })($stateParams.id);

            function initMetaData() {
                metaService.getMeta('XB', function(data) {
                    $scope.assetVM.genderList = data;
                });
                metaService.getMeta('SF', function(data) {
                    $scope.assetVM.ynList = data;
                });
                metaService.getMeta('YW', function(data) {
                    $scope.assetVM.ywList = data;
                });
                metaService.getMeta('ZCLX', function(data) {
                    $scope.assetVM.assetTypeList = data;
                });
                metaService.getMeta('HYZK', function(data) {
                    $scope.assetVM.marriageList = data;
                });
                metaService.getProvinces(function(res) {
                    $scope.assetVM.provinces = res;
                });
                metaService.getMeta('HKLX', function(data) {
                    $scope.assetVM.hukouTypeList = data;
                });
                metaService.getMeta('JYSP', function(data) {
                    $scope.assetVM.educationList = data;
                });
                metaService.getMeta('JZQK', function(data) {
                    $scope.assetVM.livingList = data;
                });
                metaService.getMeta('DWXZ', function(data) {
                    $scope.assetVM.corpPropList = data;
                });
                metaService.getMeta('QYHY', function(data) {
                    $scope.assetVM.industryList = data;
                });
                metaService.getMeta('QYGM', function(data) {
                    $scope.assetVM.corpScaleList = data;
                });
                metaService.getMeta('JKLX', function(data) {
                    $scope.assetVM.borrowTypeList = data;
                });
                metaService.getMeta('YTLB', function(data) {
                    $scope.assetVM.useTypeList = data;
                });
                metaService.getMeta('XYJB', function(data) {
                    $scope.assetVM.creditList = data;
                });
                metaService.getMeta('HKFS', function(data) {
                    $scope.assetVM.repaymentTypeList = data;
                });
                metaService.getMeta('HKLY', function(data) {
                    $scope.assetVM.repaymentFromList = data;
                });
                metaService.getMeta('CQR', function(data) {
                    $scope.assetVM.ownerList = data;
                });
            }


            function showFiles(type, title) {
                title = title || '文件列表';
                $modal.open({
                    templateUrl: 'view/asset/info/files.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.filesVM = {
                            title: title,
                            processing: false,
                            files: [
                                { "name": "审批文件01", "url": "/data/files/shenpi01.doc" },
                                { "name": "身份证", "url": "/data/files/shenpi01.doc" },
                                { "name": "资产证明", "url": "/data/files/shenpi01.doc" },
                                { "name": "营业执照", "url": "/data/files/shenpi01.doc" },
                                { "name": "借款协议", "url": "/data/files/shenpi01.doc" },
                                { "name": "调查文件", "url": "/data/files/shenpi01.doc" }
                            ]
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }
                    }
                });
            }
        }
    ];
});
