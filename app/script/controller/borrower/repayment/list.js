define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$state', '$timeout', '$modal', 'borrowerService', 'toaster', function($scope, $http, metaService, $filter, $state, $timeout, $modal, borrowerService, toaster) {

        $scope.listVM = {
            condition: {},
            table: null
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        function initMetaData() {
            metaService.getMeta('HKQD', function(data) {
                $scope.listVM.repaymentChannel = data;
            });
            metaService.getMeta('ZHKM', function(data) {
                $scope.listVM.accountSubjectCode = data;
            });
        }
        initMetaData();

        $scope.$on('$viewContentLoaded', function() {
            $scope.listVM.table = $('#borrowerRepaymentsTable');
        });


        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listVM.condition;
            $scope.listVM.condition.repaymentDateStart=$filter('exDate')($scope.listVM.condition.repaymentDateStart,'yyyy-MM-dd');
            $scope.listVM.condition.repaymentDateEnd=$filter('exDate')($scope.listVM.condition.repaymentDateEnd,'yyyy-MM-dd');
            var queryCondition = { "data": condition, "paginate": paganition };
            borrowerService.borrowerRepaymentList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsRepaymentsTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
                    sidePagination: "server",
                    columns: [{
                        field: '',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'borrowerId',
                        title: '借款人编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'name',
                        title: '资产方',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'repaymentDate',
                        title: '还款日期',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'accountSubjectCode',
                        title: '账户科目',
                        align: 'center',
                        valign: 'middle',
                        formatter: subjectFormatter
                    }, {
                        field: 'amount',
                        title: '还款金额',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'repaymentChannel',
                        title: '还款渠道',
                        align: 'center',
                        valign: 'middle',
                        formatter: channelFormatter

                    }, {
                        field: 'externalRef',
                        title: '参考凭证',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'op',
                        title: '操作人',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        formatter: dateFormatter

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
                            'click .btn-info': detail
                        }
                    }]
                }
            };

            function subjectFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listVM.accountSubjectCode);
            };

            function channelFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listVM.repaymentChannel );
            };

            function dateFormatter(date) {
                return $filter('exDate')(date);
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                ];
                return btnHtml.join('');
            }


        })();

        function detail(e, value, row, index) {
            $state.go('borrower.repayment.detail', { id: row.id });
        }

        $scope.search = function() {
            $scope.listVM.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listVM.condition = {};
        };
    }];
});
