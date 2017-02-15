define([], function() {
    return ['$scope', '$state', '$modal', '$filter', 'metaService', 'investorService', function($scope, $state, $modal, $filter, metaService, investorService) {

        $scope.listView = {
            condition: {},
            table: null
        };

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#purchaseListTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            investorService.purchaseList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                res.data.paginate = res.data.paginate || { totalCount: 0 };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {
            $scope.bsPurchaseListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'id',
                        title: '申购流水',
                        align: 'center'

                    }, {
                        field: 'investorId',
                        title: '投资人标识',
                        align: 'center'
                    }, {
                        field: 'subscriptionBatchId',
                        title: '申购批次号',
                        align: 'center'
                    }, {
                        field: 'amount',
                        title: '申购金额',
                        align: 'center'
                    }, {
                        field: 'actualSettlementAmount',
                        title: '实际结算金额',
                        align: 'center',
                    }, {
                        field: 'serviceRateId',
                        title: '费率标识',
                        align: 'center'
                    }, {
                        field: 'serviceFee',
                        title: '服务费',
                        align: 'center'
                    }, {
                        field: 'thirtpartyAccountNo',
                        title: '第三方账号',
                        align: 'center'
                    }, {
                        field: 'fundCode',
                        title: '基金代码',
                        align: 'center'
                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        formatter: statusFormatter
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
                        field: 'subscriptionOrderNo',
                        title: '申购序号',
                        align: 'center'
                    }, {
                        field: 'errorCode',
                        title: '错误编码',
                        align: 'center'
                    }, {
                        field: 'errorMsg',
                        title: '错误信息',
                        align: 'center'
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

            function createtimeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function finishtimeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.status);
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
            metaService.getMeta('SGZT', function(items) {
                $scope.listView.status = items;
            });
            metaService.getMeta('JJLX', function(items) {
                $scope.listView.fundType = items;
            });
        }
        initMeta();
        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        function editRow(e, value, row, index) {
            $state.go('investor.purchase.edit', { id: row.id });
        }
        $scope.reset = function() {
            $scope.listView.condition = {};
        };

    }];
});
