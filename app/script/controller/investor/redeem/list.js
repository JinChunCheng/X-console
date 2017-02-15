define([], function() {
    return ['$scope', '$state', '$modal', '$filter', 'metaService', 'investorService', function($scope, $state, $modal, $filter, metaService, investorService) {

        $scope.listView = {
            condition: {},
            table: null
        };

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#redeemListTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            investorService.getRedeemList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                res.data.paginate = res.data.paginate || { totalCount: 0 };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {
            $scope.bsRedeemListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'id',
                        title: '赎回流水',
                        align: 'center'

                    }, {
                        field: 'investorId',
                        title: '投资人标识',
                        align: 'center'
                    }, {
                        field: 'redeemType',
                        title: '赎回方式',
                        formatter: redeemTypeFormatter,
                        align: 'center'
                    }, {
                        field: 'redeemChannel',
                        title: '赎回通道',
                        formatter: redeemChannelFormatter,
                        align: 'center',
                    }, {
                        field: 'amount',
                        title: '赎回金额',
                        align: 'center'
                    }, {
                        field: 'actualSettlementAmount',
                        title: '实际赎回金额',
                        align: 'center'
                    }, {
                        field: 'serviceRateId',
                        title: '费率标识',
                        align: 'center'
                    }, {
                        field: 'serviceFee',
                        title: '服务费',
                        align: 'center'
                    }, {
                        field: 'fundCode',
                        title: '基金代码',
                        align: 'center',
                    }, {
                        field: 'fundType',
                        title: '基金类型',
                        align: 'center',
                        formatter: fundTypeFormatter
                    }, {
                        field: 'externalRef',
                        title: '外部参考号',
                        align: 'center'
                    }, {
                        field: 'bankAccountMask',
                        title: '银行帐号掩码',
                        align: 'center'
                    }, {
                        field: 'pilFlowNo',
                        title: '代付流水号',
                        align: 'center'
                    }, {
                        field: 'pilReversalNo',
                        title: '代付冲正流水号',
                        align: 'center'
                    }, {
                        field: 'redeemOrderNo',
                        title: '申购序号',
                        align: 'center',
                    }, {
                        field: 'pilResultFlag',
                        title: '代付结果',
                        formatter: pilResultFormatter,
                        align: 'center',
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter: redeemStatusFormatter,
                        align: 'center',
                    }, {
                        field: 'errorCode',
                        title: '错误编码',
                        align: 'center',
                    }, {
                        field: 'errorMsg',
                        title: '错误信息',
                        align: 'center',
                    }, {
                        field: 'bankCode',
                        title: '赎回银行标示',
                        align: 'center',
                    }, {
                        field: 'bankAccount',
                        title: '赎回银行账号',
                        align: 'center',
                    }, {
                        field: 'memo',
                        title: '备注',
                        align: 'center',
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        formatter: createtimeFormatter,
                        align: 'center'
                    }, {
                        field: 'modifyDatetime',
                        title: '赎回时间',
                        formatter: modifytimeFormatter,
                        align: 'center'
                    }, {
                        field: 'finishDatetime',
                        title: '完成时间',
                        formatter: finishtimeFormatter,
                        align: 'center'
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-primary': editRow
                        }
                    }]
                }
            };

            function redeemTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.redeemType);
            }

            function createtimeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function pilResultFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.pilResult);
            }

            function redeemChannelFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.redeemChannel);
            }

            function modifytimeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function finishtimeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function redeemStatusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.redeemStatus);
            }

            function fundTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.fundType);
            }

            function flagFormatter(value, row, index) {
                if (row.status == 'F') {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>'
                    ];
                    return btnHtml.join('')
                } else {
                    return '';
                }

            }

        })();

        function initMeta() {
            metaService.getMeta('REDEEMZT', function(items) {
                $scope.listView.redeemStatus = items;
            });
            metaService.getMeta('SHFS', function(items) {
                $scope.listView.redeemType = items;
            });
            metaService.getMeta('SHTD', function(items) {
                $scope.listView.redeemChannel = items;
            });
            metaService.getMeta('JJLX', function(items) {
                $scope.listView.fundType = items;
            });
            metaService.getMeta('SHDFJG', function(items) {
                $scope.listView.pilResult = items;
            });
        }
        initMeta();
        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        function editRow(e, value, row, index) {
            $state.go('investor.redeem.edit', { id: row.id });
        }
        $scope.reset = function() {
            $scope.listView.condition = {};
        };

    }];
});
