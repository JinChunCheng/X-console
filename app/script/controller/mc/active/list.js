define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'toaster', 'McService', function($rootScope, $scope, $state, $stateParams, $timeout, toaster, McService) {
        ph.mark($rootScope, {
            state: 'mc.active.list',
            title: '促销活动'
        });

        var defaultCondition = {
            pageNo: 1,
            pageSize: 10
        };

        /**
         * common data
         * @type {Object}
         */
        $scope.listVM = {
            condition: angular.copy(defaultCondition),
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: [],
            statusList: [{
                value: "NOT_START",
                text: '未开始'
            }, {
                value: "START",
                text: '进行中'
            }, {
                value: "CLOSE",
                text: '已结束'
            }],
            type: [{
                value: "REDUCE",
                intValue: "1",
                text: '满减'
            }, {
                value: "DISCOUNT",
                intValue: "2",
                text: '满折'
            }, {
                value: "SAMPLE_FREE_SHIPPING",
                intValue: "3",
                text: '样品包邮'
            }]
        };

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

        //查询活动
        var search = function(page) {
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            McService.queryActives($scope.listVM.condition).then(
                function(res) {
                    if (res && res.status == 200) {
                        if (res.items && res.items.length > 0) {

                        }
                        $scope.listVM.items = res.items;
                        $scope.listVM.items.forEach(function(e){
                            var start = Date.parse(e.startTime);
                            var end = Date.parse(e.endTime);
                            var now = Date.parse(new Date());
                            if(now < start){
                                e.status = "NOT_START";
                            }
                            if(now > end){
                                e.status = "CLOSE";
                            }
                            if((start < now) && (now < end)){
                                e.status = "START";
                            }
                        })
                        $scope.listVM.paginate = res.paginate;
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '查询出错！');
                    }
                    $scope.listVM.loading = false;
                },
                function(err) {
                    $scope.listVM.loading = false;
                    toaster.pop('error', '服务器请求异常！');
                }
            );
        };

        //打开页面时自动加载
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

        $scope.reset = function() {
            $scope.listVM.condition = {};
        };

    }];
});
