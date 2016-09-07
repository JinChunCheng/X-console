define([], function() {
    return ['$scope', '$timeout', 'metaService', '$filter', '$state', '$stateParams', 'borrowerService',
        function($scope, $timeout, metaService, $filter, $state, $stateParams, borrowerService) {
            $scope.vm = {
                table: null,
                data: {},
                bsBorrowDetailTableControl: {},
                cancel: function() {
                    $state.go('borrower.info.list');
                }
            };

            function initMetaData() {
                metaService.getProvinces(function(res) {
                    $scope.vm.provinces = res;
                });
                metaService.getCities(function(res) {
                    $scope.vm.bankCity = res;
                });
                metaService.getMeta('ZT', function(data) {
                    $scope.vm.status = data;
                });
                metaService.getMeta('ZHBDLX', function(data) {
                    $scope.vm.borrowerAccountLogType = data;
                });
                metaService.getMeta('ZHKM', function(data) {
                    $scope.vm.accountSubjectCode = data;
                });
            }
            initMetaData();

            $scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#borrowDetailTable');
            });

            function init() {
                $scope.vm.bsBorrowDetailTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getDetailTable,
                        sidePagination: "server",
                        columns: [{
                            field: 'accountSubjectCode',
                            title: '账户科目',
                            align: 'center',
                            formatter: subjectFormatter,
                            valign: 'middle'
                        }, {
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
                            field: 'balanceChangeFlag',
                            title: '余额变动标志',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                            formatter: dateFormatter

                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',

                        }]
                    }
                };

                function subjectFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.vm.accountSubjectCode);
                };

                function logFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.vm.borrowerAccountLogType);
                };

                function dateFormatter(date) {
                    return $filter('exDate')(date);
                };

            };

            function getDetail(borrowerId) {
                borrowerService.borrowerDetail.get({ id: borrowerId }).$promise.then(function(res) {
                    $scope.vm.data.borrowerDetail = res.data.borrowerDetail;
                    $scope.vm.data.borrowerAccount = res.data.borrowerAccount;
                    init();
                });
            };
            getDetail($stateParams.id);


            function getDetailTable(params) {
                //这里的params就是分页的json
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var queryCondition = { data: { borrowerAccountNo: $scope.vm.data.accountNo }, paginate: paganition };
                borrowerService.borrowerDetailTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
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
