define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'accountService',
        function($scope, $timeout, $state, $stateParams, accountService) {

            var defaultCondition = {
                paginate: {
                    sort: 'update_time desc',
                    pageNum: 1,
                    pageSize: 10
                },
            };
            $scope.vm = {
                condition: angular.copy(defaultCondition),
                table: null,
                data: {},
                cancel: function() {
                    $state.go('account.list.list');
                },
                //初始化bsBorrowDetailTableControl对象，并将其扔到vm里面去，防止init调用的时候还没有加载出bsBorrowDetailTableControl这个对象而报错
                bsAccountDetailTableControl: {},
            };

            //$scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#accountDetailTable');
            //});

            function init() {

                $scope.vm.bsAccountDetailTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getDetailTable,
                        sidePagination: "server",
                        columns: [{
                            field: 'capitalAccountLogId',
                            title: '流水号',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'capitalAccountNo',
                            title: '账户编码',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'capitalAccountNoName',
                            title: '账户名称',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'capitalAccountLogType',
                            title: '日志类型',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'referenceId',
                            title: '参考ID',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'beforeBalance',
                            title: '变动前余额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'changeAmount',
                            title: '发生额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'afterBalance',
                            title: '变动后余额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'relBankAccountName',
                            title: '银行账户名称',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'relBankAccount',
                            title: '银行账户号码',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'relBankName',
                            title: '开户行',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'relBankProvince',
                            title: '开户行省份',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'relBankCity',
                            title: '开户行地市',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                        }]
                    }
                };
            }

            function getDataLabel(capitalAccountId) {
                accountService.accountDetailLabel.get({ id: capitalAccountId }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                    init();
                });
            }
            getDataLabel($stateParams.id);

            function getDetailTable(params) {
                //这里的params就是分页的json
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var queryCondition = { data: { capitalAccountNo: $scope.vm.data.capitalAccountNo }, paginate: paganition };
                accountService.accountDetailTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    console.log($scope.vm.data.capitalAccountNo);
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });

                });
            }
        }
    ];
});
