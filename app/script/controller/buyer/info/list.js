//yucheng, added, for supplier list page
//
//return ['$scope','$http', '$routeParams','$location','metaService',
//    function($scope, $http, $routeParams, $location,metaService){

define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'buyerService', 'metaService','$stateParams',
    function($rootScope, $scope, $state, toaster, buyerService, metaService, $stateParams) {

        ph.mark($rootScope, {
            state: 'buyer.info.list',
            title: '买家列表'
        });

        var defaultCondition = {
            pageNo: 1,
            pageSize: 10
        };

        $scope.listVM = $stateParams.listVM || {
            condition: angular.copy(defaultCondition),
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: [],
            loading:false
        };

        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.beginDateOpened = true;
            $scope.listVM.endDateOpened = false;
        };
        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.endDateOpened = true;
            $scope.listVM.beginDateOpened = false;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        //BUYER REG STATUS
        metaService.getMeta('BUYERREGSTATUS', function(list) {
            $scope.listVM.buyerRegStatus = list;
        });
        //bnuyer enable status
        metaService.getMeta('BUYERENABLEFLG', function(list) {
            $scope.listVM.buyerEnableFlag = list;
        });
        //country code
        metaService.getMeta('BUYERENABLESTATUS', function(list) {
            $scope.listVM.countryCode = list;
        });

        //
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

        //启用禁用函数
        $scope.enable = function(buyerId,enable,flagEnable){
            var buyerAccount ={id:'',flagEnable:""};
            if(buyerId != null && buyerId >0){
                buyerAccount.id = buyerId;
            }
            else{
                buyerAccount.id = -1;
            }

            if (enable){
                if(flagEnable==1){
                    toaster.pop('info',"已处于启用状态");
                    return;
                };
                buyerAccount.flagEnable = 1;
            }
            else{
                if(flagEnable==0){
                    toaster.pop('info',"已处于关闭状态");
                    return;
                };
                buyerAccount.flagEnable = 0;
            }

            buyerService.updateBuyerFlagEnable(buyerAccount).then(
                function(data) {
                    if (data.status == '200') {
                        var res = data;
                        toaster.pop('success',"修改买家状态成功");
                    } else {
                        toaster.pop('error', '修改买家状态失败，原因：' + data.msg);
                    }
                    $scope.view.loading = false;
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    console.error('Error while updateBuyerFlagEnable.');
                }
            );
        };

        //
        var search = function(){
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            buyerService.buyerList($scope.listVM.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.listVM.items = data.items;
                        $scope.listVM.paginate = data.paginate;
                    } else {
                        toaster.pop('error', '加载买家列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    console.error('Error while search productWarehouse.');
                }
            );
        }
        search();

        /**
         * 分页控件翻页事件
         */
        $scope.pageChanged = function() {
            $scope.page($scope.listVM.paginate.pageNumber);
        };

        /**
         * search
         * @param  {[int]} index [description]
         */
        $scope.page = function(index) {
            $scope.listVM.condition.pageNo = index || 1;
            search();
        };

    }];
});
