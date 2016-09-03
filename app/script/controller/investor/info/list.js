define([], function () {
    return ['$scope', '$state',  '$modal', 'investorService', function ($scope, $state,  $modal, investorService) {

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
            /* status: ['还款中', '逾期', '异常关闭', '正常关闭', '转让中', '转让完成'],
             channel: ['钱盒', '开通宝', '管理系统'],
             isUsed: ['包含', '不包含'],*/
        };

        /**
         * do something after view loaded
         * @param  {string}     event type
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function () {
            $scope.listView.table = $('#investmentListTable');
        });


        var getData = function (params) {
            //query: {where: JSON.stringify($scope.listVM.condition)}
            investorService.infoList.query({where: JSON.stringify($scope.listView.condition)}).$promise.then(function (res) {
                res.data.paginate = res.data.paginate || {totalCount: 0};
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });

            //post: 
            // var project = {};
            // project.borrowerId = 1;
            // project.contractTemplateId=1;
            // project.projectName="console-前台添加";
            // project.requestAmount=100000.00;
            // project.repaymentType="IOP";
            // project.duration=12;
            // project.durationUnit="Y";
            // project.periodCount=10;
            // project.interestRate=0.8;
            // project.interestRateTerm="Y";
            // project.serviceFeeRate=0;
            // project.serviceFeeRateTerm="Y";
            // project.latePaymentFeeRateTerm="D";
            // project.purpose="前端测试";
            // project.mortgageFlag="N";
            // project.mortgage="无";
            // project.guaranteeFlag="N";
            // project.guarantee="无";
            // project.description="这是一个通过controller添加进来的project";
            // project.biddingDeadline=new Date();
            // project.biddingStartAmount=5000;
            // project.biddingStepAmount=1000;
            // project.biddingAmount=100000.00;
            // project.status = "IRP";
            // project.totalDays=100;
            // project.totalInterest=100;
            // project.totalServiceFee=0.0;
            // project.debtStartDate=new Date();
            // project.debtEndDate=new Date();
            // project.principalPaid=0;
            // project.PrincipalBalance=100;
            // project.interestPaid=1;
            // project.serviceFeePaid=0;
            // project.memo="";
            // project.creditChannelId=1;

            // borrowerService.get(project).then(function(res) {
            //     debugger
            // });
        };

        (function init() {

            $scope.bsInvestmentListTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: 600,
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
                        checkbox: true
                    }, {
                        field: 'projectVO.projectId',
                        title: '项目编号'

                    }, {
                        field: 'projectVO.projectName',
                        title: '项目名称'
                    }, {
                        field: 'investorVO.investorId',
                        title: '投资人编号'
                    }, {
                        field: 'investorVO.name',
                        title: '投资人名称'
                    }, {
                        field: 'investmentVO.repaymentTypeName',
                        title: '还款方式'
                    }, {
                        field: 'investmentVO.debtStartDate',
                        title: '开始日期'
                    }, {
                        field: 'investmentVO.debtEndDate',
                        title: '结束日期'
                    }, {
                        field: 'investmentVO.statusName',
                        title: '状态'
                    }, {
                        field: 'investmentVO.interestRate',
                        title: '借款利率'
                    }, {
                        field: 'investmentVO.totalPrincipal',
                        title: '本金'
                    }, {
                        field: 'investmentVO.investmentPrice',
                        title: '买入价格'
                    }, {
                        field: 'investmentVO.totalInterest',
                        title: '利息'
                    }, {
                        field: 'investmentVO.principalPaid',
                        title: '已付本金'
                    }, {
                        field: 'investmentVO.principalBalance',
                        title: '剩余本金'
                    }, {
                        field: 'investorVO.fundAccountManagerId',
                        title: '理财客户经理编号'
                    }, {
                        field: 'investorVO.fundAccountManagerCode',
                        title: '理财客户经理代码'
                    }, {
                        field: 'investorVO.fundAccountManagerName',
                        title: '理财客户经理姓名'
                    }, {
                        field: 'investorVO.fundChannelCode',
                        title: '理财渠道代码'
                    }, {
                        field: 'investorVO.fundChannelName',
                        title: '理财渠道名称'
                    }, {
                        field: 'investmentVO.contractGenFlag',
                        title: '合同生成标志'
                    }, {
                        field: 'investmentVO.createDatetime',
                        title: '创建时间'
                    }, {
                        field: 'investmentVO.updateDatetime',
                        title: '更新时间'
                    }, {
                        field: 'investmentVO.hasTrial',
                        title: '是否包含试投金'
                    }, {
                        field: 'investmentVO.trialAmt',
                        title: '试投金金额'
                    }, {
                        field: 'flag',
                        title: '操作',
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
            $state.go('investor.info.detail', {id: row.investorVO.investorId});
        }


        $scope.search = function () {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function () {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };

    }];
});
