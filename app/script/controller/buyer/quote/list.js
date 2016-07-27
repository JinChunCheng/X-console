define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'buyerService', 'metaService','$stateParams',
    function($rootScope, $scope, $state, toaster, buyerService, metaService, $stateParams) {

        ph.mark($rootScope, {
            state: 'buyer.quote.list',
            title: '询价管理'
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

        //回复日期查询
        $scope.openResentBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.ResentBeginDateOpened = true;
            $scope.listVM.ResentEndDateOpened = false;
            $scope.listVM.beginDateOpened = false;
            $scope.listVM.endDateOpened = false;
        };
        $scope.openResentEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.ResentEndDateOpened = true;
            $scope.listVM.ResentBeginDateOpened = false;
            $scope.listVM.beginDateOpened = false;
            $scope.listVM.endDateOpened = false;
        };
        //生成日期查询
        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.beginDateOpened = true;
            $scope.listVM.endDateOpened = false;
            $scope.listVM.ResentBeginDateOpened = false;
            $scope.listVM.ResentEndDateOpened = false;
        };
        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.endDateOpened = true;
            $scope.listVM.beginDateOpened = false;
            $scope.listVM.ResentBeginDateOpened = false;
            $scope.listVM.ResentEndDateOpened = false;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        //重置函数
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

        //结束询价函数
        $scope.finish = function(obj){
            buyerService.updateQuoteStatusFinish(obj.id).then(
                function(data) {
                    if (data.status == '200') {
                        search();
                    } else {
                        toaster.pop('error', '结束询价失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    toaster.pop('error', '  服务器错误！');
                    console.error('Error while updateQuoteStatusFinish.');
                }
            );
        };

        //查询询价列表
        var search = function(){
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            buyerService.quoteList($scope.listVM.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.listVM.items = data.items;
                        $scope.listVM.paginate = data.paginate;
                    } else {
                        toaster.pop('error', '加载询价列表失败，原因：' + data.msg);
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

        //查询函数
        $scope.query = function(index){
            if($scope.listVM.condition.dateFrom != undefined && $scope.listVM.condition.dateTo == undefined){
                toaster.pop('info', '生成日期结束时间不能为空！');
                return;
            }

            if($scope.listVM.condition.dateFrom == undefined && $scope.listVM.condition.dateTo != undefined){
                toaster.pop('info', '生成日期开始时间不能为空！');
                return;
            }

            if($scope.listVM.condition.updateDateFrom != undefined && $scope.listVM.condition.updateDateTo == undefined){
                toaster.pop('info', '回复日期结束时间不能为空！');
                return;
            }

            if($scope.listVM.condition.updateDateFrom == undefined && $scope.listVM.condition.updateDateTo != undefined){
                toaster.pop('info', '回复日期开始时间不能为空！');
                return;
            }

            if(Date.parse($scope.listVM.condition.dateFrom) > Date.parse($scope.listVM.condition.dateTo)){
                toaster.pop('info', '生成日期开始时间不能晚于结束时间！');
                return false;
            }

            if(Date.parse($scope.listVM.condition.updateDateFrom) > Date.parse($scope.listVM.condition.updateDateTo)){
                toaster.pop('info', '回复日期开始时间不能晚于结束时间！');
                return false;
            }

            $scope.listVM.condition.pageNo = index || 1;
            search();
        }

    }];
});
