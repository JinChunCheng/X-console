define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'toaster', 'fundService', function($scope, $http, metaService, $filter, $timeout, $modal, $state, toaster, fundService) {

        $scope.listView = {
            condition: {},
            table: null,
        };

        function initMetaData() {
            metaService.getMeta('ZCLY', function(data) {
                $scope.listView.salesId = data;
            });
            metaService.getMeta('ZHKM', function(data) {
                $scope.listView.subject = data;
            });

            metaService.getMeta('CZLX', function(data) {
                $scope.listView.paymentType = data;
            });
            metaService.getMeta('CZZT', function(data) {
                $scope.listView.status = data;
            });
            metaService.getMeta('CZQD', function(data) {
                $scope.listView.paymentChannel = data;
            });
        }
        initMetaData();
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#chargeListTable');
        });


        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listView.condition;
            $scope.listView.condition.createDatetimeStart=$filter('exDate')($scope.listView.condition.createDatetimeStart,'yyyy-MM-dd');
            $scope.listView.condition.createDatetimeEnd=$filter('exDate')($scope.listView.condition.createDatetimeEnd,'yyyy-MM-dd');
            $scope.listView.condition.finishDatetimeStart=$filter('exDate')($scope.listView.condition.finishDatetimeStart,'yyyy-MM-dd');
            $scope.listView.condition.finishDatetimeEnd=$filter('exDate')($scope.listView.condition.finishDatetimeEnd,'yyyy-MM-dd');
            var queryCondition = { "data": condition, "paginate": paganition };
            fundService.chargeListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsChargeListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'rechargeVO.id',
                        title: '充值编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.investorId',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'investorVO.name',
                        title: '投资人姓名',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'investorVO.salesId',
                        title: '注册来源',
                        formatter: salesIdFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.amount',
                        title: '充值金额',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.serviceFee',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.actualSettlementAmount',
                        title: '结算金额',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.accountSubjectCode',
                        title: '账户科目',
                        align: 'center',
                        formatter: subjectFormatter,
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.status',
                        title: '状态',
                        align: 'center',
                        formatter: statusFormatter,
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.paymentType',
                        title: '充值类型',
                        formatter: paymentTypeFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.paymentChannel',
                        title: '充值渠道',
                        formatter: paymentChannelFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.bankName',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.bankCard',
                        title: '银行卡号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.paymentOrderNo',
                        title: '支付序号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.externalRef',
                        title: '外部参考编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.createDatetime',
                        title: '创建时间',
                        formatter:dateCreateFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.finishDatetime',
                        title: '完成时间',
                        formatter: dateFinishFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.op',
                        title: '操作员',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.memo',
                        title: '备注',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-primary': detail,
                        }
                    }]
                }
            };

            function dateCreateFormatter(value, row, index) {
                return $filter('exDate')(value, "yyyy-MM-dd HH:mm:ss");
            };
            function dateFinishFormatter(value, row, index) {
                return $filter('exDate')(value, "yyyy-MM-dd HH:mm:ss");
            };

            function paymentChannelFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.paymentChannel);
            };

            function paymentTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.paymentType);
            };

            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.status);
            };

            function salesIdFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.salesId);
            };

            function subjectFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.subject);
            }

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary" title="查看详情"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function detail(e, value, row, index) {
            $state.go('fund.charge.detail', { id: row.rechargeVO.id });
        }

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = {};
        };

    }];
});
