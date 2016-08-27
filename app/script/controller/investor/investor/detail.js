define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'investorService','metaService','$filter',
        function($scope, $timeout, $state, $stateParams, investorService,metaService,$filter) {
            $scope.vm = {
                table: null,
                data: {},
                accountLogType: [{ code: 'IV_WITHDRAW_APPROVED', title: "提现申请通过" }, { code: 'IV_INVESTMENT_REPAYMENT', title: "投资还款" }, { code: 'IV_INVESTMENT', title: "投资(结标审核通过)" }],
                status: [{ code: "C", title: "关闭" }, { code: "O", title: "正常" }],
                //初始化bsInvestorDetailTableControl对象，并将其扔到vm里面去，防止init调用的时候还没有加载出bsInvestorDetailTableControl这个对象而报错
                bsInvestorDetailTableControl: {},
                cancel: function() {
                    $state.go('investor.investor.list');
                }
            };

            $scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#investorDetailTable');
            });

            function init() {
                $scope.vm.bsInvestorDetailTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getDetailTable,
                        sidePagination: "server",
                        columns: [{
                            field: 'accountLogType',
                            title: '账户变动类型',
                            align: 'center',
                            valign: 'middle',
                            formatter: logFormatter
                        }, {
                            field: 'referenceId',
                            title: '参考编号',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforeBalance',
                            title: '发生前余额',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforeFrozenBalance',
                            title: '发生前余额冻结',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforeFreeBalance',
                            title: '发生前可用余额',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'changeAmount',
                            title: '发生额',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterBalance',
                            title: '发生后余额',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterFrozenBalance',
                            title: '发生后余额冻结',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterFreeBalance',
                            title: '发生后可用余额',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforePrincipalBalance',
                            title: '变动前待收本金',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterPrincipalBalance',
                            title: '变动后待收本金',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforeInterestBalance',
                            title: '变动前待收利息',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterInterestBalance',
                            title: '变动后待收利息',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'beforeTotalInterest',
                            title: '变动前总收益',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'afterTotalInterest',
                            title: '变动后总收益',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'balanceChangeFlag',
                            title: '余额变动标志',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                            
                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                            
                        }]
                    }
                };


                function logFormatter(value, row, index) {
                    var result = '';
                    $scope.vm.accountLogType.forEach(function(item) {
                        if (value === item.code) {
                            result = item.title;
                            return;
                        }
                    });
                    return result;
                }
            }

            function getDetail(investorId) {
                investorService.investorDetailLabel.get({ id: investorId }).$promise.then(function(res) {
                    //基本信息
                    $scope.vm.data.investorInfo = res.investorInfo;
                    //账户信息
                    $scope.vm.data.accountInfo = res.accountInfo;
                    
                    init();
                });
            }
            getDetail($stateParams.id);


            function getDetailTable(params) {
                //这里的params就是分页的json
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var queryCondition = { data: { accountNo: $scope.vm.data.investorInfo.accountNo }, paginate: paganition };
                investorService.investorDetailTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });

                });
            }
        }
    ];
});
