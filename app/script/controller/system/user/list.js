define([], function() {
    return ['$scope','$state','$filter', 'investorService','systemService', function($scope,$state, $filter,metaService, systemService) {

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
            add:function(){
                $state.go('system.user.add')
            }
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
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center'
                    }, {
                        field: 'opname',
                        title: '用户名',
                        align: 'center'
                    }, {
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
                    }, {
                        field: 'createTime',
                        title: '创建时间',
                        align: 'center',
                        formatter:timeFormatter
                    }, {
                        field: 'workspace10',
                        title: '更新时间',
                        align: 'center',
                        formatter:timeFormatter
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-info': editRow,
                            'click .btn-primary': revise,
                        }
                    }]
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
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };
    }];
});

