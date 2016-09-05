define([], function() {
    return ['$scope','$state','systemService', function($scope,$state, systemService) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            data: {},
            paginate:{
                pageNum: 1,
                pageSize: 10
            }
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,

        };

        /**
         * do something after view loaded
         * @param  {string}     event type
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#usersListTable');
        });


        var getData = function(params) {
            systemService.system.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                res.data.paginate = res.data.paginate || { totalCount: 0 };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsUsersListTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: 650,
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    //onPageChange: pageChange,
                    sidePagination: "server",
                    //search: true,
                    //showColumns: true,
                    //showRefresh: false,
                    //minimumCountColumns: 2,
                    //clickToSelect: false,
                    //showToggle: true,
                    //maintainSelected: true,
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'opname',
                        title: '用户名',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'workspace',
                        title: '部门',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace2',
                        title: '姓名',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace3',
                        title: 'Email',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace4',
                        title: '手机',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace5',
                        title: '电话',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace6',
                        title: '状态',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace7',
                        title: '加密等级',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace8',
                        title: '动态口令序列号',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace9',
                        title: '有效期',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'createTime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'workspace10',
                        title: '更新时间',
                        align: 'center',
                        valign: 'top'
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-info': editRow
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function editRow(e, value, row, index) {
            $state.go('system.user.detail', { id: row.id });
        }
        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };
    }];
});

