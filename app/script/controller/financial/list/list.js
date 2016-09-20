define([], function() {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster',
        function($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {

            var defaultCondition = {
                data:{},
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                }
            };

            $scope.listView = {
                condition: angular.copy(defaultCondition),
                table: null,
                search: search,
                reset: function() {
                    $scope.listView.condition = angular.copy(defaultCondition);
                }
            };
            function initMetaData() {
                metaService.getMeta('WJZT', function(data) {
                    $scope.listView.status = data;
                });
                metaService.getMeta('SHLBZT', function(items) {
                    $scope.listView.statusList = items;
                });
            }
            initMetaData();

            $scope.$on('$viewContentLoaded', function() {
                $scope.listView.table = $('#promptListTable');
            });

            var getData = function(params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var condition = $scope.listView.condition;
                if(condition.data.datetStart){
                    condition.data.datetStart = $filter('exDate')(condition.data.datetStart);
                }
                if(condition.data.datetEnd){
                    condition.data.datetEnd = $filter('exDate')(condition.data.datetEnd);
                }
                condition.paginate = paganition;
                financialService.promptListTable.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    res.data.paginate = res.data.paginate || {totalCount: 0};
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsPromptListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'state',
                            checkbox: true
                        },{
                            field: 'promptId',
                            title: '催款标识',
                            align: 'center'
                        },{
                            field: 'borrowerName',
                            title: '姓名',
                            align: 'center'
                        }, {
                            field: 'mobile',
                            title: '手机',
                            align: 'center'
                        }, {
                            field: 'email',
                            title: '邮箱',
                            align: 'center'
                        }, {
                            field: 'promptDate',
                            title: '催款日期',
                            align: 'center',
                            formatter: timerFormatter
                        }, {
                            field: 'paymentDueDate',
                            title: '最后还款日期',
                            align: 'center',
                            formatter: timerFormatter
                        }, {
                            field: 'principal',
                            title: '当期本金',
                            align: 'center'
                        }, {
                            field: 'loanInterest',
                            title: '贷款利息',
                            align: 'center'
                        }, {
                            field: 'serviceFee',
                            title: '当期手续费',
                            align: 'center'
                        }, {
                            field: 'latePaymentFee',
                            title: '延期回款费用',
                            align: 'center'
                        }, {
                            field: 'totalPayment',
                            title: '总回款',
                            align: 'center'
                        }, {
                            field: 'status',
                            title: '状态',
                            align: 'center',
                            formatter:statusFormatter
                        }, {
                            field: 'auditStatus',
                            title: '审核状态',
                            align: 'center'
                        }, {
                            field: 'auditOp',
                            title: '审核员工',
                            align: 'center'
                        }, {
                            field: 'auditDatetime',
                            title: '审核时间',
                            align: 'center',
                            formatter: timeFormatter
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            formatter: timeFormatter
                        }, {
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-info': edit
                            }
                        }]
                    }
                };

                function timeFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                };
                function timerFormatter(value, row, index) {
                    return $filter('exDate')(value).slice(0,10);
                };
                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listView.statusList);
                }
                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                    ];
                    return btnHtml.join('');
                }
            })();

            function edit(e, value, row, index) {
                showDetail(row.promptId);
                e.stopPropagation();
                e.preventDefault();
            }


            function showDetail(id) {

                $modal.open({
                    templateUrl: 'view/financial/list/detail.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {

                        $scope.detailView = {
                            data:{},
                            table:null
                        };
                        function getLikeList(id) {
                            console.log(id)
                            financialService.promptLikeListTable.get({id: id}).$promise.then(function (res) {
                                console.log(res);
                                $scope.detailView.data = res.data;
                            });
                        }
                        getLikeList(id);
                        var getData = function (params) {
                            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                            var data = $scope.detailView.data;

                            data.paginate = paganition;

                            financialService.promptLikeListTable.query({id:id}).$promise.then(function(res) {
                                res.data = res.data || { paginate: paganition, items: [] };
                                res.paginate = res.paginate || { totalCount: 0 };
                                params.success({
                                    rows: res.data
                                });
                            })
                        }
                        $scope.$on('$viewContentLoaded', function() {
                            $scope.detailView.table = $('#financialListTable');
                        });
                        $scope.bsFinancialListTableControl = {
                            options: {
                                cache: false,
                                //pagination: true,
                                //pageSize: 10,
                                //pageList: [10, 25, 50, 100, 200],
                                ajax: getData,
                                sidePagination: "server",
                                columns: [{
                                    field: 'promptId',
                                    title: '催款标识',
                                    align: 'center',
                                    valign: 'middle'
                                }, {
                                    field: 'promptDate',
                                    title: '催款日期',
                                    align: 'center',
                                    valign: 'middle'
                                }, {
                                    field: 'projectId',
                                    title: '项目标识',
                                    align: 'center'
                                }, {
                                    field: 'projectName',
                                    title: '项目名称',
                                    align: 'center'
                                }, {
                                    field: 'periodNo',
                                    title: '期数',
                                    align: 'center'
                                }, {
                                    field: 'borrowerName',
                                    title: '借款人名称',
                                    align: 'center'
                                }, {
                                    field: 'paymentDueDate',
                                    title: '最后还款日',
                                    align: 'center'
                                }, {
                                    field: 'principal',
                                    title: '当期本金',
                                    align: 'center'
                                }, {
                                    field: 'loanInterest',
                                    title: '贷款利息',
                                    align: 'center'
                                }, {
                                    field: 'serviceFee',
                                    title: '当期手续费',
                                    align: 'center'
                                }, {
                                    field: 'latePaymentFee',
                                    title: '延期回款费用',
                                    align: 'center'
                                }, {
                                    field: 'totalPayment',
                                    title: '总回款',
                                    align: 'center'
                                }, {
                                    field: 'createDatetime',
                                    title: '创建时间',
                                    align: 'center',
                                    formatter: timeFormatter
                                }]
                            }
                        };
                        function timeFormatter(value, row, index) {
                            return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                        };
                        $scope.cancel = function () {
                            $modalInstance.dismiss();
                            return false;
                        };
                    }
                });

            }

            function search() {
                $scope.listView.table.bootstrapTable('refresh');
            };
            $scope.reset = function () {
                $scope.listView.condition = angular.copy(defaultCondition);
            };

        }
    ];
});
