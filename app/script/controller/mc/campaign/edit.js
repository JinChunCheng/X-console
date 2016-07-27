define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'metaService', 'McService', 'toaster', '$modal', function($rootScope, $scope, $state, $stateParams, $http, metaService, McService, toaster, $modal) {

        ph.mark($rootScope, {
            state: 'mc.campaign.edit',
            title: "修改运营"
        });

        $scope.isSaving = false;//是否正在保存
        $scope.tracking = {};//运营活动
        $scope.sources = [];//来源数据项
        $scope.mediums = [];//媒介数据项

        //获取市场跟踪来源数据项
        metaService.getMeta('SCGZLY', function(list) {
            $scope.sources = list;
        });

        //获取市场跟踪媒介数据项
        metaService.getMeta('SCGZMJ', function(list) {
            $scope.mediums = list;
        });

        //返回列表
        $scope.back = function(){
            $state.go('mc.campaign.list', {
                reload: true
            });
        };

        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.tracking.beginDateOpened = true;
            $scope.tracking.endDateOpened = false;
        };
        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.tracking.endDateOpened = true;
            $scope.tracking.beginDateOpened = false;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        //保存活动
        $scope.save = function(){

            if(!$scope.tracking.source){
                toaster.pop('error', '来源不能为空！');
                return false;
            }
            if(!$scope.tracking.medium){
                toaster.pop('error', '媒介不能为空！');
                return false;
            }
            if(!$scope.tracking.campaign){
                toaster.pop('error', '广告系列不能为空！');
                return false;
            }
            if(!$scope.tracking.startDate){
                toaster.pop('error', '发布日期不能为空！');
                return false;
            }
            if(!$scope.tracking.sourceUrl){
                toaster.pop('error', '来源链接不能为空！');
                return false;
            }

            if(Date.parse($scope.tracking.startDate) > Date.parse($scope.tracking.endDate)){
                toaster.pop('error', '开始时间不能晚于结束时间！');
                return false;
            }

            if(Date.parse($scope.tracking.startDate) > Date.parse($scope.tracking.endDate)){
                toaster.pop('error', '开始时间不能晚于结束时间！');
                return false;
            }

            McService.updateCampaign($scope.tracking).then(
                function(data) {
                    if(data.status == 200){
                        $scope.back();
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '保存出错！');
                    }
                },
                function(errResponse) {
                    console.error('Error while save tracking ');
                    toaster.pop('error', '服务器请求异常！');
                }
            )
        };

        //加载活动
        $scope.load = function(){
            McService.queryCampaignById($stateParams.id).then(
                function(data) {
                    if(data.status == 200){
                        $scope.tracking = data.items;
                    }else{
                        toaster.pop('error', (data && data.msg) ? data.msg : '保存出错！');
                    }
                },
                function(errResponse) {
                    console.error('Error while load tracking ');
                    toaster.pop('error', '服务器请求异常！');
                }
            )
        };

        $scope.load();

    }];
});
