define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $timeout, $modal, $state, borrowerService) {

            $scope.listVM = {
                condition: {},
                table: null,
                rateCode:[{id:1,title:'项目出款'},{id:2,title:'提现出款'}],
                rateType:[{id:1,title:'百分比'},{id:2,title:'绝对值'}],
                status:[{id:1,title:'正常'},{id:2,title:'关闭'}],

                add: function() {
                    console.log('add');
                    $state.go('account.rate.add');
                },
                edit: function(id) {
                    $state.go('account.rate.edit', { id: id });
                }
            };

            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#fundRatePreserveTable');
            });


            var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
                    //debugger
                    $timeout(function() {
                        res.data.items.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        res.data.items.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
                        params.success({
                            total: res.data.paginate.totalCount,
                            rows: res.data.items
                        });
                    }, 500);
                });
            };

            (function init() {

                $scope.bsFundRatePreserveTableControl = {
                    options: {
                        //data: rows,
                        // rowStyle: function(row, index) {
                        //     return { classes: 'none' };
                        // },
                        // fixedColumns: true,
                        // fixedNumber: 2,
                        cache: false,
                        //height: getHeight(),
                        //striped: true,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        //autoLoad: true,
                        onPageChange: pageChange,
                        sidePagination: "server",
                    
                        columns: [{
                            field: 'state',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle'
                        }, {
                            field: 'id',
                            title: '编号',
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
                            field: 'workspace',
                            title: '身份证号码',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace2',
                            title: '手机',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '固定电话',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace4',
                            title: '邮箱',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace5',
                            title: '省份',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace6',
                            title: '城市',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace7',
                            title: '开户行',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace8',
                            title: '银行账号',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace9',
                            title: '状态',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
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
                                'click .btn-primary': editRow
                            }
                        }]
                    }
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

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
                        }

                        $scope.ok = function() {
                            delUser(item.id, $scope, $modalInstance);
                            return true;
                        }
                    }
                });
            };

            function editRow(e, value, row, index) {
                $state.go('account.rate.edit', { id: row.id });
            }

            $scope.del = function() {

            };

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

            var pageChange = function(num, size) {

            };
        }
    ];
});
