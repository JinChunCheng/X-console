define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'toaster', 'fundService', function($scope, $http, metaService, $filter, $timeout, $modal, $state, toaster, fundService) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawListTable');
        });

        function initMetaData() {
            metaService.getMeta('CZLY', function(data) {
                $scope.listView.operateOrigin = data;
            });
            metaService.getMeta('TXZT', function(data) {
                $scope.listView.status = data;
            });
            metaService.getProvinces(function(res) {
                $scope.listView.provinces = res;
            });
            metaService.getMeta('TXQD', function(data) {
                $scope.listView.exeChannel = data;
            });
            metaService.getCities(function(res) {
                $scope.listView.bankCity = res;
            });
        }
        initMetaData();

        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            fundService.withdrawListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsWithdrawListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
                    sidePagination: "server",
                    columns: [{
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'investorId',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'name',
                        title: '投资人',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'amount',
                        title: '申请金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'serviceFee',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',
                    }, {

                        field: 'factAmount',
                        title: '到账金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter: statusFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'exeChannel',
                        title: '提现渠道',
                        formatter: exeChannelFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCode',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'branchCode',
                        title: '开户支行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankProvince',
                        title: '省份',
                        formatter: provinceFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCity',
                        title: '城市',
                        formatter: cityFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankAccount',
                        title: '银行卡号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'requestDatetime',
                        title: '申请时间',
                        formatter: dateFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'opApprove',
                        title: '审核人',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'operateOrigin',
                        title: '操作来源',
                        formatter:operateOriginFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'memo',
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

            function statusFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.status)
            };

            function provinceFormatter(value, row, index) {
                return $filter("metaPCA")(value, $scope.listView.provinces)
            };

            function exeChannelFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.exeChannel)
            };

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankCity);
            };
            function dateFormatter(value, row, index) {
                return $filter('exDate')(value,'yyyy-MM-dd HH:mm:ss');
            }
            function operateOriginFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.operateOrigin)
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-arrow-right"></i></button>',
                ];
                return btnHtml.join('');
            }

        })();

        function detail(e, value, row, index) {
            $state.go('fund.withdrawlist.detail', { id: row.id });
        }

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = {};
        };

    }];
});
