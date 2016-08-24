define([], function() {
    return ['$scope', '$http', '$state', '$timeout', '$modal', '$state', 'accountService',
        function($scope, $http, $state, $timeout, $modal, $state, accountService) {

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
                table: null,
                edit: function(id) {
                    $state.go('account.list.edit', { id: id });
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#fundAccountListTable');
            });


            var getDataTable = function(params) {
                paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                console.log(paganition);
                var queryCondition = {"paginate": paganition };
                accountService.accountList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
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
                            sortable: true
                        }, {
                            field: 'capitalAccountNo',
                            title: '账户编码',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            //TODO该字段还未确定
                            field: 'bankAccountName',
                            title: '账户名称',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'bankAccountName',
                            title: '银行账户名称',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'balance',
                            title: '资金余额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'bankAccount',
                            title: '银行账户号码',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'bankName',
                            title: '开户行',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'bankProvince',
                            title: '开户行省份',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'bankCity',
                            title: '开户行地市',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'companyName',
                            title: '公司名称',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'largePaymentNumber',
                            title: '大额行号',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        },  {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'updateDatetime',
                            title: '更新时间',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        },{
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

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                    ];
                    return btnHtml.join('');
                }

            })();

            function detail(e,value, row, index) {
                $state.go('account.list.detail',{ id: row.capitalAccountId });
            }

            function editRow(e, value, row, index) {
                $state.go('account.list.edit', { id: row.capitalAccountId });
            }


            $scope.del = function() {

            };

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };
        }
    ];
});
