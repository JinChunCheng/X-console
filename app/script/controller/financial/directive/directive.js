define([], function() {
    return ['$scope', '$http', '$state', '$timeout', '$modal', 'financialService',"toaster",
        function($scope, $http, $state,$timeout, $modal,financialService,toaster) {

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
            cashType:[{id:1,title:'项目出款'},{id:2,title:'提现出款'}],
            status:[{id:1,title:'待出款'},{id:2,title:'出款确认'},{id:3,title:'出款完成'}],
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            },
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
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [
                        {
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle'
                    },{
                        field: 'fundOutType',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'referenceId',
                        title: '发起方编号',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccountName',
                        title: '账户名称',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccount',
                        title: '卡号',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankName',
                        title: '银行',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'workspace6',
                        title: '开户支行名称',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankProvince',
                        title: '省份',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankCity',
                        title: '地市',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'amount',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'statusName',
                        title: '状态',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'fundOutCount',
                        title: '出款笔数',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'memo',
                        title: '备注',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'exeDate',
                        title: '执行日期',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle'
                    }]
                }
            };

        })();

        function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };
    }];
});
