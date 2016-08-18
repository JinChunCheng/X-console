define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', 'metaService',
        function($scope, $timeout, $state, $stateParams, borrowerService, metaService) {

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
                }
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                borrowerService.get({ id: id }).$promise.then(function(res) {
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
            }
        }
    ];
});
