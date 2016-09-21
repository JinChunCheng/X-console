define([], function() {
    return ['$scope', '$http', '$timeout', '$filter', '$modal', 'projectService', 'metaService',
        function($scope, $http, $timeout, $filter, $modal, projectService, metaService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                data: {},
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                }
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
                var condition = $scope.listView.condition;
                condition.paginate = params.paginate;
                projectService.repayment.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                    res.data = res.data || { items: [], paginate: { totalCount: 0 } };
                    res.data.paginate = res.data.paginate || { totalCount: 0 };

                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            function initMeta() {
                metaService.getMeta('XMHKJHZT', function(items) {
                    $scope.listView.statusList = items;
                });
            }

            (function init() {
                initMeta();

                $scope.bsRepaymentListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: "[10, 25, 50, 100, 200]",
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                                field: 'borrowerVO.id',
                                title: '借款人编号'
                            }, {
                                field: 'borrowerVO.name',
                                title: '借款人姓名'
                            }, {
                                field: 'projectVO.projectId',
                                title: '项目编号'
                            }, {
                                field: 'projectVO.projectName',
                                title: '项目名称'
                            }, {
                                field: 'projectRepaymentPlanVO.periodNo',
                                title: '期数'
                            }, {
                                field: 'projectRepaymentPlanVO.periodStartDate',
                                title: '当期开始日期',
                                formatter: dateFormatter
                            }, {
                                field: 'projectRepaymentPlanVO.periodEndDate',
                                title: '当期结束日期',
                                formatter: dateFormatter
                            }, {
                                field: 'projectRepaymentPlanVO.paymentDueDate',
                                title: '最后还款日',
                                formatter: dateFormatter
                            }, {
                                field: 'projectRepaymentPlanVO.status',
                                title: '状态',
                                formatter: statusFormatter
                            }, {
                                field: 'projectRepaymentPlanVO.totalPayment',
                                title: '总金额'
                            }, {
                                field: 'projectRepaymentPlanVO.principal',
                                title: '本金'
                            }, {
                                field: 'projectRepaymentPlanVO.loanInterest',
                                title: '贷款利息'
                            }, {
                                field: 'projectRepaymentPlanVO.loanInterestPaid',
                                title: '已还贷款利息'
                            }, {
                                field: 'projectRepaymentPlanVO.serviceFee',
                                title: '服务费'
                            }, {
                                field: 'projectRepaymentPlanVO.createDatetime',
                                title: '创建时间',
                                formatter: datetimeFormatter
                            }, {
                                field: 'projectRepaymentPlanVO.updateDatetime',
                                title: '更新时间',
                                formatter: datetimeFormatter
                            }
                            // , {
                            //     field: 'flag',
                            //     title: '操作',
                            //     align: 'center',
                            //     valign: 'middle',
                            //     formatter: flagFormatter
                            // }
                        ]
                    }
                };

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listView.statusList)
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function datetimeFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                }

                function flagFormatter(value, row, index) {
                    return '<button class="btn btn-sm btn-danger"><i class="fa fa-remove"></i></button>';
                }

            })();
        }
    ];
});
