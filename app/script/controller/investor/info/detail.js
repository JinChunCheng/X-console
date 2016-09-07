define([], function () {
    return ['$scope', '$state', '$stateParams','$modal','investorService',
        function ($scope, $state, $stateParams,$modal, investorService) {
            $scope.vm = {
                data: {},
                table: null,
                cancel: function () {
                    $state.go('investor.info.list');
                },
                repayList:function(){
                    showRepayList()
                }
            };

            function getDetail(id) {
                investorService.infoDetail.get({id: id}).$promise.then(function (res) {
                    $scope.vm.data = res.data;
                });
            }

            getDetail($stateParams.id);

            var getData = function (params) {
                investorService.repayList($stateParams.id).then(function(res){
                    console.log(res.data);
                    params.success({
                        total: res.data.length,
                        rows: res.data
                    });
                })
            }

            function showRepayList(){
                var title = "投资还款计划列表";

                $modal.open({
                    templateUrl: 'view/investor/info/repayList.html',
                    size: 'lg',
                    controller: function($scope,$modalInstance, $state) {
                        $scope.bsInvestmentListTableControl = {
                            options: {
                                cache: false,
                                //striped: true,
                                pagination: true,
                                pageSize: 10,
                                pageList: "[10, 25, 50, 100, 200]",
                                ajax: getData,
                                //autoLoad: true,
                                //onPageChange: pageChange,
                                sidePagination: "server",
                                columns: [{
                                    field: 'investmentRepaymentPlanVO.projectId',
                                    title: '项目编号'
                                }, {
                                    field: 'investmentRepaymentPlanVO.projectName',
                                    title: '项目名称'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodNo',
                                    title: '还款期数'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodStartDate',
                                    title: '当前开始日期'
                                }, {
                                    field: 'investmentRepaymentPlanVO.periodEndDate',
                                    title: '当期结束日期'
                                }, {
                                    field: 'investmentRepaymentPlanVO.paymentDueDate',
                                    title: '最后还款日'
                                }, {
                                    field: 'investmentRepaymentPlanVO.status',
                                    title: '状态'
                                }, {
                                    field: 'investmentRepaymentPlanVO.principal',
                                    title: '当期本金'
                                }, {
                                    field: 'investmentRepaymentPlanVO.interest',
                                    title: '当期利息'
                                }, {
                                    field: 'investmentRepaymentPlanVO.totalPayment',
                                    title: '当期总共应还'
                                }, {
                                    field: 'investmentRepaymentPlanVO.principalPaid',
                                    title: '当期已还本金'
                                }, {
                                    field: 'investmentRepaymentPlanVO.interestPaid',
                                    title: '当期已还利息'
                                }, {
                                    field: 'investmentRepaymentPlanVO.createDatetime',
                                    title: '创建时间'
                                }, {
                                    field: 'investmentRepaymentPlanVO.updateDatetime',
                                    title: '更新时间'
                                }, {
                                    field: 'investmentRepaymentPlanVO.memeo',
                                    title: '备注'
                                }]
                            }
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        };

                    }
                })

            }

        }];
});
