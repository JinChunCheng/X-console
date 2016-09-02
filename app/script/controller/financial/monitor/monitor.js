define([], function() {
    return ['$scope', '$http','$state', '$timeout', '$modal', 'financialService','toaster',
        function($scope, $http,$state,$timeout, $modal, financialService,toaster) {

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
            channel:[{id:1,title:'盒子支付'},{id:2,title:'恒丰银行'}],
            sendStatus:[{id:1,title:'等待发送'},{id:2,title:'发送失败'},{id:3,title:'发送成功'}],
            receiptStatus:[{id:1,title:'等待回执'},{id:2,title:'部分回执失败'},{id:3,title:'回执成功'},{id:4,title:'回执失败'}]

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
                    var text = "未选中行";
                    $modal.open({
                        templateUrl: 'view/shared/confirm.html',
                        size: 'sm',
                        controller: function($scope, $modalInstance) {
                            $scope.confirmData = {
                                text: text,
                                processing: false
                            };
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                                return false;
                            }
                            $scope.ok = function() {
                                $modalInstance.dismiss();
                                return false;
                            }
                        }
                    });
                    return;
                }
                else {
                    console.log('check');
                    $state.go('financial.monitor.detail');}
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
                //query: {where: JSON.stringify($scope.listVM.condition)}
                financialService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                    //debugger
                    $timeout(function() {
                        res.data.items.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        res.data.items.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
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
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [{
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
                        valign: 'middle'
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

            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();

        $scope.del = function() {
            console.log('del');
        };

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };

        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
