define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'toaster', 'SettingService', function($rootScope, $scope, $state, $stateParams, toaster, SettingService) {
        ph.mark($rootScope, {
            state: 'setting.finance.finance',
            title: '财务参数设置'
        });

        //是否正在加载
        $scope.loading = true;
        //是否正在保存
        $scope.saving = false;
        //财务参数
        $scope.finance = {};

        //保存财务参数
        $scope.saveFinanceParameter = function(){
            if($scope.financeForm.$invalid){
                toaster.pop("error", "校验不通过！");
                return false;
            }
            $scope.saving = true;
            SettingService.saveFinanceParameter($scope.finance).then(
                function(data) {
                    if (data.status != '200') {
                        toaster.pop("error", "保存财务参数失败，原因：" + data.msg);
                    }else{
                        toaster.pop("success", "财务参数保存成功");
                    }
                    $scope.saving = false;
                },
                function(errResponse) {
                    toaster.pop("error", "服务器请求失败！");
                    $scope.saving = false;
                }
            );
        }

        //加载财务参数
        SettingService.loadFinanceParameter().then(
            function(data) {
                if (data.status == '200') {
                    $scope.finance = data.items;
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
