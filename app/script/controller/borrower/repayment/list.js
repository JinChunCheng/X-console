define([], function() {
    return ['$scope', '$http', '$state', '$timeout', '$modal', 'borrowerService', 'toaster', function($scope, $http, $state, $timeout, $modal, borrowerService, toaster) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            paginate: {
                sort: 'update_time desc',
                pageNum: 1,
                pageSize: 10
            },
            data: {}
        };

        $scope.listVM = {
            condition: angular.copy(defaultCondition),
            table: null
        };
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
            $scope.listVM.table = $('#borrowerRepaymentsTable');
        });


        var getDataTable = function(params) {
            paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            data = { "borrowerId": $scope.listVM.condition.borrowerId, 'name': $scope.listVM.condition.name, "repaymentDateStart": $scope.listVM.condition.startDay, "repaymentDateEnd": $scope.listVM.condition.endDay };
            console.log(paganition);
            var queryCondition = { "data": data, "paginate": paganition };
            borrowerService.borrowerRepaymentList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                //debugger
                res.data = res.data || { paginate: paganition, items: [] };
                console.log(res);
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
                        sortable: true
                    }, {
                        field: 'name',
                        title: '借款人姓名',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'repaymentDate',
                        title: '还款日期',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'accountSubjectCode',
                        title: '账户科目',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'amount',
                        title: '还款金额',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'repaymentChannel',
                        title: '还款渠道',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'externalRef',
                        title: '参考凭证',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'op',
                        title: '操作人',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'memo',
                        title: '备注',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
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
            $scope.listVM.condition = angular.copy(defaultCondition);
        };
    }];
});
