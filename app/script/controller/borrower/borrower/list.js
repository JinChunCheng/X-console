define([], function() {
    return ['$scope', '$http', '$state', '$resource', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $state, $resource, $timeout, $modal, $state, borrowerService) {
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
                status: [{ state: "O", title: '正常' }, { state: "C", title: '关闭' }],
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#borrowerTable');
            });


            var getDataTable = function(params) {
                paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                data = { "status": $scope.listVM.condition.status, "borrowerId": $scope.listVM.condition.borrowerId, 'name': $scope.listVM.condition.name, 'idNo': $scope.listVM.condition.idNo, 'mobile': $scope.listVM.condition.mobile };
                var queryCondition = { "data": data, "paginate": paganition };
                borrowerService.borrowerListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsBorrowerTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getDataTable,
                        sidePagination: "server",
                        columns: [{
                            field: 'state',
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
                            title: '姓名',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'idNo',
                            title: '身份证号码',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'mobile',
                            title: '手机',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'telephone',
                            title: '固定电话',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'email',
                            title: '邮箱',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'bankProvince',
                            title: '省份',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'bankCity',
                            title: '地市',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'bankName',
                            title: '开户行',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'bankAccount',
                            title: '银行账号',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'status',
                            title: '状态',
                            align: 'center',
                            valign: 'middle',
                            ,
                            formatter: statusFormatter
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
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

                function statusFormatter(value, row, index) {
                    var result = '';
                    $scope.listVM.status.forEach(function(item) {
                        if (value === item.code) {
                            result = item.title;
                            return;
                        }
                    });
                    return result;
                }



                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                        '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function detail(e, value, row, index) {
                $state.go('borrower.info.detail', { id: row.borrowerId });
            }

            function editRow(e, value, row, index) {
                console.log(row, value, e, index)
                $state.go('borrower.info.edit', { id: row.borrowerId });
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
