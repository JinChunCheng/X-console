define([], function() {
    return ['$scope', '$http','metaService','$state', '$timeout', '$modal', 'financialService',"toaster",'$filter',
        function($scope, $http,metaService, $state,$timeout, $modal,financialService,toaster,$filter) {

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

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        $scope.listVM = {
            condition: angular.copy(defaultCondition),
            table: null,
            status: [{code:1,label:'正常'}, {code:2,label:'关闭'}],
            check: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    toaster.pop('error', '未选中行！');
                    return;
                }
                else {
                    var selectedId = selected[0].id;
                    $state.go('financial.directive.detail', {id: selectedId});}
            }
        };

            function initMetaData() {
                metaService.getMeta('CKLX', function(data) {
                    $scope.listView.cashType = data;
                });
                metaService.getMeta('CKZT', function(data) {
                    $scope.listView.status = data;
                });
                metaService.getProvinces(function(items) {
                    $scope.listView.provinces = items;
                });
                metaService.getCities(function(items) {
                    $scope.listView.cities = items;
                });
            }
            initMetaData();
        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#cashDirectiveTable');
        });
         var getData = function(params) {
             var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
             var data = $scope.listView.condition;
             var queryCondition = { "data":data,"paginate": paganition };
             financialService.cashDirectiveTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                 //debugger
                 $timeout(function() {
                     params.success({
                         total: res.data.paginate.totalCount,
                         rows: res.data.items
                     });
                 }, 500);
             });
         };
        (function init() {

            $scope.bsCashDirectiveTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [
                        {
                        field: 'state',
                        checkbox: true
                    }, {
                        field: 'id',
                        title: '编号'
                    },{
                        field: 'fundOutType',
                        title: '出款类型',
                        formatter: cashTypeFormatter
                    }, {
                        field: 'referenceId',
                        title: '发起方编号'
                    }, {
                        field: 'bankAccountName',
                        title: '账户名称'
                    }, {
                        field: 'bankAccount',
                        title: '卡号'
                    }, {
                        field: 'bankName',
                        title: '银行'
                    }, {
                        field: 'workspace6',
                        title: '开户支行名称'
                    }, {
                        field: 'bankProvince',
                        title: '省份',
                        formatter: provinceFormatter
                    }, {
                        field: 'bankCity',
                        title: '地市',
                        formatter: cityFormatter
                    }, {
                        field: 'amount',
                        title: '出款金额'
                    }, {
                        field: 'statusName',
                        title: '状态',
                        formatter: statusFormatter
                    }, {
                        field: 'fundOutCount',
                        title: '出款笔数'
                    }, {
                        field: 'memo',
                        title: '备注'
                    }, {
                        field: 'exeDate',
                        title: '执行日期',
                        formatter: timeFormatter
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        formatter: timeFormatter
                    }]
                }
            };

        })();
            function provinceFormatter(value, row, index) {
                return $filter('metaPCA')(value + '0000', $scope.listView.provinces);
            };

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value + '00', $scope.listView.cities);
            };

            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            };

            function cashTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.cashType);
            };
            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.status);
            };

            function search() {
                $scope.listView.table.bootstrapTable('refresh');
            };
    }];
});
