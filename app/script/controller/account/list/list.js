define([], function() {
    return ['$scope', '$http', '$state', '$timeout', '$modal', '$state', 'accountService', '$filter', 'metaService',

        function($scope, $http, $state, $timeout, $modal, $state, accountService, $filter, metaService) {
            $scope.listVM = {
                condition: {},
                table: null,
            };

            function initMetaData() {
                metaService.getMeta('ZJZHMC', function(data) {
                    $scope.listVM.capitalAccountNo = data;
                });
                metaService.getProvinces(function(res) {
                    $scope.listVM.bankProvince = res;
                });
                metaService.getCities(function(res) {
                    $scope.listVM.bankCity = res;
                });
            }
            initMetaData();

            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#fundAccountListTable');
            });


            var getDataTable = function(params) {
                paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var queryCondition = { "paginate": paganition };

                accountService.accountList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsFundAccountListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getDataTable,
                        sidePagination: "server",
                        columns: [{
                            field: '',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle'
                        }, {
                            field: 'capitalAccountId',
                            title: '账户标识',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'capitalAccountNo',
                            title: '账户编码',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'capitalAccountNo',
                            title: '账户名称',
                            formatter: capitalAccountNoFormatter,
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'balance',
                            title: '资金余额',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bankAccountName',
                            title: '银行账户名称',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bankAccount',
                            title: '银行账户号码',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bankName',
                            title: '开户行',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bankProvince',
                            title: '开户行省份',
                            formatter: provinceFormatter,
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bankCity',
                            title: '开户行地市',
                            formatter: cityFormatter,
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'companyName',
                            title: '公司名称',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'largePaymentNumber',
                            title: '大额行号',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            formatter: dateFormatter,
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'updateDatetime',
                            title: '更新时间',
                            formatter: updateFormatter,
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
                                'click .btn-primary': editRow,
                                'click .btn-info': detail

                            }
                        }]
                    }
                };

                function capitalAccountNoFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.capitalAccountNo)
                };

                function provinceFormatter(value, row, index) {
                    return $filter('metaPCA')(value + '0000', $scope.listVM.bankProvince)
                };

                function cityFormatter(value, row, index) {
                    return $filter('metaPCA')(value + '00', $scope.listVM.bankCity)
                };

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
                };
                function updateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
                };


                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                    ];
                    return btnHtml.join('');
                };

            })();

            function detail(e, value, row, index) {
                $state.go('account.list.detail', { id: row.capitalAccountId });
            }

            function editRow(e, value, row, index) {
                $state.go('account.list.edit', { id: row.capitalAccountId });
            }


            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };
        }
    ];
});
