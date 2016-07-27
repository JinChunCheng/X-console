define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'LogisticsService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, LogisticsService, toaster) {
         ph.mark($rootScope, {
            state: 'logistics.logisticsTrack.detail',
            title: '物流跟踪详情'
        });

         $scope.trackDetail={};

      
       $scope.loadTrackDetail=function(){
            LogisticsService.loadTrackDetail($stateParams.trackId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.trackDetail = data.items;
                        
                    } else {
                        toaster.pop('error', '加载产品库信息失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while search loadSaleOrderInfo.');
                }
            )
       };

       //加载物流信息
       $scope.loadTrackDetail();

       $scope.back=function(){
            $state.go('logistics.logisticsTrack.list', {
                condition: $stateParams.condition
            });
       };

    }];
});
