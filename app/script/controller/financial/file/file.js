define([], function() {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster',
        function($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {
        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            pageNum: 1,
            pageSize: 10
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            }
        };


        function initMetaData() {
            metaService.getMeta('WJRZLX', function(data) {
                $scope.listView.logType = data;
            });
            metaService.getMeta('WJRZZT', function(data) {
                $scope.listView.status = data;
            });
        }
        initMetaData();


        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#fileInterfaceLogTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.fileInterfaceLogTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsFileInterfaceLogTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true
                    }, {
                        field: 'fileLogId',
                        title: '编号'
                    }, {
                        field: 'ipAddr',
                        title: '地址'
                    }, {
                        field: 'logType',
                        title: '日志类型'
                    }, {
                        field: 'fileName',
                        title: '文件名'
                    }, {
                        field: 'fileRows',
                        title: '文件总条数'
                    }, {
                        field: 'succCount',
                        title: '处理成功条数'
                    }, {
                        field: 'errorCount',
                        title: '处理失败条数'
                    }, {
                        field: 'status',
                        title: '状态'
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        formatter: timeFormatter
                    }]
                }
            };

            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

        })();

            function search() {
                $scope.listView.table.bootstrapTable('refresh');
            };

        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
