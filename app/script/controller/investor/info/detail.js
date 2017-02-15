define([], function () {
    return ['$scope', '$state', '$stateParams', '$modal','$filter', 'metaService','investorService',
        function ($scope, $state, $stateParams, $modal,$filter, metaService,investorService) {
            var defaultCondition = {
                data:{},
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                }
            };
            $scope.vm = {
                //data: {},
                condition: angular.copy(defaultCondition),
                table: null,
                cancel: function () {
                    $state.go('investor.info.list');
                },
                repayList: function () {
                    showRepayList()
                }
            };
                function initMetaData() {
                metaService.getMeta('TZLBZT', function (data) {
                    $scope.vm.status = data;
                });
                metaService.getMeta('SFBHSTJ', function(data) {
                    $scope.vm.hasTrial = data;
                });
                metaService.getMeta('HKFS', function(data) {
                    $scope.vm.repaymentType = data;
                });
                metaService.getMeta('LCQD', function(data) {
                    $scope.vm.fundChannelName = data;
                });
                metaService.getMeta('LCJLXM', function(data) {
                    $scope.vm.fundAccountManagerName = data;
                });
            }
            initMetaData();

            function getDetail(id) {
                investorService.infoDetail.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                    $scope.vm.data.investmentVO.interestRate= parseFloat($scope.vm.data.investmentVO.interestRate*100).toFixed(2)+'%/年'
                });
            }

            getDetail($stateParams.id);
            var getData = function (params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var data = $scope.vm.condition;

                data.paginate = paganition;
                data.data.investmentId=$stateParams['id'];
                investorService.infoRepayList.query({ where: JSON.stringify(data) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    res.paginate = res.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                })
            }

            function showRepayList() {
                var title = "投资还款计划列表";

                $modal.open({
                    templateUrl: 'view/investor/info/repayList.html',
                    size: 'lg',
                    controller: function ($scope, $modalInstance, $state) {
                        $scope.bsInvestmentListTableControl = {
                            options: {
                                cache: false,
                                //striped: true,
                                pagination: true,
                                pageSize: 10,
                                pageList: [10, 25, 50, 100, 200],
                                ajax: getData,
                                //autoLoad: true,
                                //onPageChange: pageChange,
                                sidePagination: "server",
                                columns: [{
                                    field: 'investmentRepaymentPlanVO.projectId',
                                    title: '项目编号',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.projectName',
                                    title: '项目名称',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodNo',
                                    title: '还款期数',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodStartDate',
                                    title: '当前开始日期',
                                    formatter:dateFormatter,
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodEndDate',
                                    title: '当期结束日期',
                                    formatter:dateFormatter,align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.paymentDueDate',
                                    title: '最后还款日',
                                    formatter:dateFormatter,
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.status',
                                    title: '状态',
                                    align: 'center',
                                    formatter:statusFormatter
                                }, {
                                    field: 'investmentRepaymentPlanVO.principal',
                                    title: '当期本金',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.interest',
                                    title: '当期利息',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.totalPayment',
                                    title: '当期总共应还',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.principalPaid',
                                    title: '当期已还本金',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.interestPaid',
                                    title: '当期已还利息',
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.createDatetime',
                                    title: '创建时间',
                                    formatter:dateFormatter,
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.updateDatetime',
                                    title: '更新时间',
                                    formatter:dateFormatter,
                                    align: 'center'
                                }, {
                                    field: 'investmentRepaymentPlanVO.memeo',
                                    title: '备注',
                                    align: 'center'
                                }]
                            }
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss();
                            return false;
                        };
                    }

                })
                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.vm.statusList);
                }
                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd');
                }
                function initMeta() {
                    metaService.getMeta('HKLB', function(items) {
                        $scope.vm.statusList = items;
                    });
                }
                initMeta();
            }

        }];
});
