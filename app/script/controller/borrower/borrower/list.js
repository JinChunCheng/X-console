define([], function() {
    return ['$scope', '$http', '$state', '$resource', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $state, $resource, $timeout, $modal, $state, borrowerService) {

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
                status: [{ state: "O", title: '正常' }, { state: "C", title: '关闭' }],
                add: function() {
                    console.log('add');
                    $state.go('borrower.info.add');
                },
                edit: function(id) {
                    $state.go('borrower.info.edit', { id: id });
                }
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
                console.log(paganition);
                var queryCondition = { "data": data, "paginate": paganition };
                borrowerService.borrowerListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
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
                            sortable: true
                        }, {
                            field: 'name',
                            title: '姓名',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'idNo',
                            title: '身份证号码',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'mobile',
                            title: '手机',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'telephone',
                            title: '固定电话',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'email',
                            title: '邮箱',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'bankProvince',
                            title: '省份',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'bankCity',
                            title: '地市',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'bankName',
                            title: '开户行',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'bankAccount',
                            title: '银行账号',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'status',
                            title: '状态',
                            align: 'left',
                            valign: 'top',
                            sortable: true,
                            formatter: statusFormatter
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            valign: 'middle',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-danger': deleteRow,
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

            function deleteRow(e, value, row, index) {
                var text = "确定删除此记录？";
                //text = JSON.stringify($scope.listVM.table.bootstrapTable('getSelections'));
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    //backdrop: true,
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: text,
                            processing: false
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        };

                        $scope.ok = function() {
                            delUser(item.id, $scope, $modalInstance);
                            return true;
                        };
                    }
                });
            }

            function editRow(e, value, row, index) {
                console.log(row, value, e, index)
                $state.go('borrower.info.edit', { id: row.borrowerId });
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
