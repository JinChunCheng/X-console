define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'toaster','SettingService', function($rootScope, $scope, $state, $stateParams, toaster, SettingService) {
        ph.mark($rootScope, {
            state: 'setting.logistics.logistics',
            title: '物流参数设置'
        });

        //是否正在加载
        $scope.loading = true;
        //是否正在保存
        $scope.saving = false;
        //物流参数
        $scope.logistics = {
            "weightVolumeRatio":"",
            "unitLogisticsVolume":"",
            "sampleLogisticsCost":"",
            "defaultInitalCost":"",
            "defaultVolumeCost":"",
            "defaultweightCost":""
        };

        $scope.saveLogisticsParameter = function(){
            if($scope.logisticsForm.$invalid){
                toaster.pop("error", "校验不通过！");
                return;
            }
            $scope.saving = true;
            SettingService.saveLogisticsParameter($scope.logistics).then(
                function(data) {
                    if (data.status != '200') {
                        toaster.pop("error", "保存物流参数失败，原因：" + data.msg);
                    }else{
                        toaster.pop("success", "物流参数保存成功");
                    }
                    $scope.saving = false;
                },
                function(errResponse) {
                    toaster.pop("error", "服务器请求失败！");
                    $scope.saving = false;
                }
            );
        };

        SettingService.loadLogisticsParameter().then(
            function(data) {
                if (data.status == '200') {
                    $scope.logistics = data.items;
                }else{
                    toaster.pop("error", "加载物流参数失败，原因：" + data.msg);
                }
                $scope.loading = false;
            },
            function(errResponse) {
                toaster.pop("error", "服务器请求失败！");
                $scope.loading = false;
            }
        );
    }];
});