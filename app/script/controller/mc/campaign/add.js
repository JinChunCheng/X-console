define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http', '$timeout', 'metaService', 'toaster', 'McService', function($rootScope, $scope, $state, $stateParams, $http, $timeout, metaService, toaster, McService) {

        ph.mark($rootScope, {
            state: 'mc.campaign.add',
            title: "添加运营"
        });

        //时间格式化
        Date.prototype.format = function(format)
        {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(),    //day
                "h+" : this.getHours(),   //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1 ? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }

        $scope.isSaving = false;//是否正在保存
        $scope.tracking = {};//运营活动
        $scope.sources = [];//来源数据项
        $scope.mediums = [];//媒介数据项

        var initTimeDate = function(){

            $scope.minDate = new Date();

            var startTime = new Date().format("yyyy-MM-dd");
            var date = new Date();
            date.setDate(date.getDate() + 30);
            var endTime = new Date(date).format("yyyy-MM-dd");

            $scope.tracking.startTime = startTime;
            $scope.tracking.endTime = endTime;
        };

        //initTimeDate();

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

        //获取市场跟踪来源数据项
        metaService.getMeta('SCGZLY', function(list) {
            $scope.sources = list;
        });

        //获取市场跟踪媒介数据项
        metaService.getMeta('SCGZMJ', function(list) {
            $scope.mediums = list;
        });

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

            McService.saveCampaign($scope.tracking).then(
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
        }

    }];
});
