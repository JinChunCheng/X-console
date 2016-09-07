define([], function () {
    return ['$scope', '$state',  '$modal','$filter','metaService', 'investorService', function ($scope, $state,  $modal,$filter,metaService, investorService) {

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
        $scope.$on('$viewContentLoaded', function () {
            $scope.listView.table = $('#investmentListTable');
        });


        var getData = function (params) {

            investorService.infoList.query({where: JSON.stringify($scope.listView.condition)}).$promise.then(function (res) {
                res.data.paginate = res.data.paginate || {totalCount: 0};
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsInvestmentListTableControl = {
                options: {
                    cache: false,
                    height: 600,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
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
                        title: '开始日期',
                        formatter:timeFormatter
                    }, {
                        field: 'investmentVO.debtEndDate',
                        title: '结束日期',
                        formatter:timeFormatter
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
                        title: '创建时间',
                        formatter:timeFormatter
                    }, {
                        field: 'investmentVO.updateDatetime',
                        title: '更新时间',
                        formatter:timeFormatter
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
            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }
            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();
        function editRow(e, value, row, index) {
            $state.go('investor.info.detail', {id: row.investmentVO.investmentId});
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
