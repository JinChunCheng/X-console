define([], function() {
    return ['$scope', '$http','metaService','$state', '$timeout', '$modal', 'financialService','toaster',
        function($scope, $http,metaService,$state,$timeout, $modal, financialService,toaster) {

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
            //channel:[{id:1,title:'盒子支付'},{id:2,title:'恒丰银行'}],
            sendStatus:[{id:1,title:'等待发送'},{id:2,title:'发送失败'},{id:3,title:'发送成功'}],
            receiptStatus:[{id:1,title:'等待回执'},{id:2,title:'部分回执失败'},{id:3,title:'回执成功'},{id:4,title:'回执失败'}],
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            }

        };

        function initMetaData() {
            metaService.getProvinces(function(res) {
                $scope.listVM.provinces = res;
            });
            metaService.getCities(function(res) {
                $scope.listVM.bankCity = res;
            });
            metaService.getMeta('TXQD', function(data) {
                $scope.listView.channel = data;
            });
        }
        initMetaData();


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
                    var selected = $scope.listView.table.bootstrapTable('getSelections');
                    if (!selected || selected.length === 0) {
                        toaster.pop('error', '未选中行！');
                        return;
                    }

                }
                else {
                    var selectedId = selected[0].id;
                    $state.go('financial.monitor.detail', {id: selectedId});}
            },
            //重新发送
            senf: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    var selected = $scope.listView.table.bootstrapTable('getSelections');
                    if (!selected || selected.length === 0) {
                        toaster.pop('error', '未选中行！');
                        return;
                    }

                }
                else {
                    var selectedId = selected[0].id;
                    $state.go('financial.monitor.detail', {id: selectedId});}
            },
            //回执   只允许发送操作成功的状态
            receipt: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    var selected = $scope.listView.table.bootstrapTable('getSelections');
                    if (!selected || selected.length === 0) {
                        toaster.pop('error', '未选中行！');
                        return;
                    }

                }
                else {
                    var selectedId = selected[0].id;
                    $state.go('financial.monitor.detail', {id: selectedId});}
            }
        };
            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawCashMonitorTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.withdrawCashMonitorTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                $timeout(function() {
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                }, 500);
            });
        };
        (function init() {

            $scope.bsWithdrawCashMonitorTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [
                        {
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'remitPrintId',
                        title: '批次号',
                        align: 'center',
                        valign: 'middle'
                    },{
                        field: 'exeChannelName',
                        title: '提现渠道',
                        align: 'center',
                        valign: 'middle',
                        formatter: channelFormatter
                    }, {
                        field: 'execStatusName',
                        title: '发送状态',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'execDatetime',
                        title: '发送时间',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiptStatusName',
                        title: '回执状态',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiptDatetime',
                        title: '回执时间',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payCapitalAccountName',
                        title: '付款资金账户名',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'amount',
                        title: '金额',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payCapitalAccount',
                        title: '付款资金账户',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payBankName',
                        title: '付款开户行',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payBankProvince',
                        title: '付款开户行省份',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payBankCity',
                        title: '付款开户行地市',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiveCapitalAccountName',
                        title: '收款资金账户名',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiveCapitalAccount',
                        title: '收款资金账户',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiveBankName',
                        title: '收款开户行',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiveBankProvince',
                        title: '收款开户行省份',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiveBankCity',
                        title: '收款开户行地市',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'op',
                        title: '操作员',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'createDatetime',
                        title: '创建日期',
                        align: 'center',
                        valign: 'middle'
                    }]
                }
            };


        })();
        function channelFormatter(value, row, index) {
            return $filter('meta')(value, $scope.listView.channel);
        };
        function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };
        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
