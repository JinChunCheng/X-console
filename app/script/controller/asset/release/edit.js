define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', 'borrowerService', 'metaService',
        function($scope, $timeout, $state, $stateParams, $modal, borrowerService, metaService) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.assetVM = {
                action: action,
                title: '产品上架信息',
                data: {},
                cancel: function() {
                    $state.go('asset.release.todo');
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

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                borrowerService.resource.get({ id: id }).$promise.then(function(res) {
                    $scope.assetVM.data = res.data;
                }, function(err) {});



                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 20,
                        pageList: [10, 25, 50, 100, 200],
                        height: 500,
                        ajax: getBorrowerList,
                        sidePagination: "server",
                        columns: [
                            { field: 'id', title: '投资编号', align: 'center', valign: 'middle' },
                            { field: 'workspace3', title: '投资人ID', align: 'left', valign: 'top' },
                            { field: 'name', title: '投资人姓名', align: 'center', valign: 'middle' },
                            { field: 'workspace', title: '投资金额', align: 'left', valign: 'top' },
                            { field: 'workspace2', title: '投资时间', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '状态', align: 'left', valign: 'top' }
                        ]
                    }
                };

            })($stateParams.id);


            function getBorrowerList(params) {
                borrowerService.resource.query({ where: "" }).$promise.then(function(res) {
                    //debugger
                    $timeout(function() {
                        res.data.items.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        res.data.items.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
                        params.success({
                            total: res.data.paginate.totalCount,
                            rows: res.data.items
                        });
                    }, 500);
                });
            };

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
                metaService.getMeta('JBFS', function(data) {
                    $scope.assetVM.finishTypeList = data;
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
