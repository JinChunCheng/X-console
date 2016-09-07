define([], function() {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster',
        function($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            //data:{},
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
            metaService.getMeta('TXQD', function(data) {
                $scope.listView.channel = data;
            });
            metaService.getMeta('FSZT', function(data) {
                $scope.listView.execStatus = data;
            });
            metaService.getMeta('HZZT', function(data) {
                $scope.listView.receiptStatus = data;
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
            $scope.listView.table = $('#withdrawCashMonitorTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.withdrawCashMonitorTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
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
                        field: 'exeChannel',
                        title: '提现渠道',
                        align: 'center',
                        valign: 'middle',
                        formatter: channelFormatter
                    }, {
                        field: 'execStatus',
                        title: '发送状态',
                        align: 'center',
                        valign: 'middle',
                        formatter: execStatusFormatter
                    }, {
                        field: 'execDatetime',
                        title: '发送时间',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'receiptStatus',
                        title: '回执状态',
                        align: 'center',
                        valign: 'middle',
                        formatter: receiptStatusFormatter
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
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-check': check,
                            'click .btn-send': send,
                            'click .btn-receipt': receipt,
                        }
                     }]
                }

            };

            function flagFormatter(value, row, index) {
                var execStatus = row.execStatus;// $scope.listView.execStatus.value;
                    //console.log($scope.listView.execStatus);
                var receiptStatus = row.receiptStatus;// $scope.listView.condition.receiptStatus;
                var btnHtml = [];
                if(execStatus == 'F') {
                    console.log("execStatus == 'F'"),
                    btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary btn-send"><i class="fa fa-edit"></i></button>',
                    ];
                }else if (execStatus == 'S' && receiptStatus != 'S') {
                    console.log("execStatus == 'S'"),
                    btnHtml = [
                        '<button type="button" class="btn btn-xs btn-success btn-receipt"><i class="fa fa-cc-visa"></i></button>'
                    ];
                }
                console.log("push"),
                btnHtml.push('<button type="button" class="btn btn-xs btn-info btn-check"><i class="fa fa-arrow-right"></i></button>');

                return btnHtml.join('');
            }

        })();
        function channelFormatter(value, row, index) {
            return $filter('meta')(value, $scope.listView.channel);
        };function execStatusFormatter(value, row, index) {
            return $filter('meta')(value, $scope.listView.execStatus);
        };function receiptStatusFormatter(value, row, index) {
            return $filter('meta')(value, $scope.listView.receiptStatus);
        };

        function check(e, value, row, index) {
            $state.go('financial.monitor.detail', {id: row.remitPrintId });
        }
        function send(e, value, row, index) {
            var text = "是否重新发送？";
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function ($scope, $modalInstance, $state) {
                    $scope.confirmData = {
                        text: text,
                        processing: false
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                        return false;
                    };
                    $scope.ok = function () {
                        $scope.confirmData.processing = true;//请求数据的过程有个表示
                        financialService.sendAccept(row.remitPrintId).then(function (res) {
                            if (res.code == 200) {
                                toaster.pop('success', res.msg);
                                //$modalInstance.close;
                            }
                            else
                                toaster.pop('error', res.msg);
                            $scope.confirmData.processing = false;
                        }, function (err) {
                            toaster.pop('error', '服务器连接失败！');
                            $scope.confirmData.processing = false;
                        });
                        $modalInstance.dismiss();
                        return true;
                    };
                }
            });
        }

        function receipt(e, value, row, index) {
            var text = "是否执行此操作？";
            $modal.open({
                templateUrl: 'view/shared/confirm.html',
                size: 'sm',
                controller: function ($scope, $modalInstance, $state) {
                    $scope.confirmData = {
                        text: text,
                        processing: false
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                        return false;
                    };
                    $scope.ok = function () {
                        $scope.confirmData.processing = true;//请求数据的过程有个表示
                        financialService.receiptAccept(row.remitPrintId).then(function (res) {
                            if (res.code == 200) {
                                toaster.pop('success', '操作成功！');
                                //$modalInstance.close;
                            }
                            else
                                toaster.pop('error', res.msg);
                            $scope.confirmData.processing = false;
                        }, function (err) {
                            toaster.pop('error', '服务器连接失败！');
                            $scope.confirmData.processing = false;
                        });
                        $modalInstance.dismiss();
                        return true;
                    };
                }
            });
        }


            function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };
    }];
});
