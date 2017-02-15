define([], function() {
    return ['$scope', '$state', '$filter', 'metaService', 'systemService', function($scope, $state, $filter, metaService, systemService) {

        $scope.listView = {
            condition: {},
            table: null,
            add: function() {
                $state.go('system.user.add')
            }
        };

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#usersListTable');
        });


        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition.data || {};
            var queryCondition = { "data": data, "paginate": paganition };
            systemService.system.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
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
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                            field: 'opcode',
                            title: '登录账号',
                            align: 'center'
                        }, {
                            field: 'opname',
                            title: '真实姓名',
                            align: 'center'
                        },
                        /* {
                        field: 'workspace',
                        title: '部门',
                        align: 'center'
                    }, {
                        field: 'workspace2',
                        title: '姓名',
                        align: 'center'
                    }, {
                        field: 'workspace3',
                        title: 'Email',
                        align: 'center'
                    }, {
                        field: 'workspace4',
                        title: '手机',
                        align: 'center'
                    }, {
                        field: 'workspace5',
                        title: '电话',
                        align: 'center'
                    }, {
                        field: 'workspace6',
                        title: '状态',
                        align: 'center'
                    }, {
                        field: 'workspace7',
                        title: '加密等级',
                        align: 'center'
                    }, {
                        field: 'workspace8',
                        title: '动态口令序列号',
                        align: 'center'
                    }, {
                        field: 'workspace9',
                        title: '有效期',
                        align: 'center',
                        valign: 'top'
                    }, */
                        {
                            field: 'createTime',
                            title: '创建时间',
                            align: 'center',
                            formatter: timeFormatter
                        },
                        /*{
                                               field: 'workspace10',
                                               title: '更新时间',
                                               align: 'center',
                                               formatter:timeFormatter
                                           },*/
                        {
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-info': editRow,
                                'click .btn-primary': revise,
                            }
                        }
                    ]
                }
            };

            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                ];
                return btnHtml.join('');
            }

        })();

        function editRow(e, value, row, index) {
            $state.go('system.user.detail', { id: row.id });
        };

        function revise(e, value, row, index) {
            $state.go('system.user.edit', { id: row.id });
        };
        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = {};
        };
    }];
});
