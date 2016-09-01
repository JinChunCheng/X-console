define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'projectService',
        function($scope, $http, $timeout, $modal, projectService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                sorting: 'update_time desc',
                pageNum: 1,
                pageSize: 10
            };

            $scope.listView = {
                condition: angular.copy(defaultCondition),
                table: null,
                status: ['待还款', '已还清'],
                search: search,
                reset: function() {
                    $scope.listView.condition = angular.copy(defaultCondition);
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listView.table = $('#repaymentListTable');
            });


            function search() {
                $scope.listView.table.bootstrapTable('refresh');
            };

            var getData = function(params) {
                // //query: {where: JSON.stringify($scope.listVM.condition)}
                // borrowerService.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                //     //debugger
                //     $timeout(function() {
                //         res.data.items.forEach(function(item) {
                //             item.id = parseInt(Math.random() * 100);
                //         });
                //         res.data.items.sort(function(a, b) {
                //             return Math.random() > .5 ? -1 : 1;
                //         });
                //         params.success({
                //             total: res.data.paginate.totalCount,
                //             rows: res.data.items
                //         });
                //     }, 500);
                // });
                params.success({
                    total: 0,
                    rows: []
                });
            };
            (function init() {

                $scope.bsRepaymentListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: "[10, 25, 50, 100, 200]",
                        ajax: getData,
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
                            title: '登录名',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace',
                            title: '真实姓名',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace2',
                            title: '身份证号码',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '手机号',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace4',
                            title: '固话',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace5',
                            title: '状态',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace6',
                            title: '理财客户经理编号',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace7',
                            title: '理财客户经理代码',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace8',
                            title: '理财客户经理姓名',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace9',
                            title: '理财渠道代码',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '理财渠道名称',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '注册类型',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '是否本公司员工',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '邮编',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '地址',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '是否新手',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '试投金状态',
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
                                'click .btn': function(e, value, row, index) {
                                    var text = "确定删除此记录？";
                                    $modal.open({
                                        templateUrl: 'view/shared/confirm.html',
                                        size: 'sm',
                                        // backdrop: true,
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
                            }
                        }]
                    }
                };

                function flagFormatter(value, row, index) {
                    return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
                }

            })();
        }
    ];
});
