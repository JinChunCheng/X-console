define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService',
        function($scope, $timeout, $state, $stateParams, borrowerService) {

            var action = $stateParams.id ? 'edit' : 'add';
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
                }
            };
            function getDataLabel() {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.vm.condition) }).$promise.then(function(res) {
                    console.log(res.data.items[0].id);
                    $scope.vm.data.accountMark = res.data.items[0].id;
                    $scope.vm.data.accountCode = res.data.items[0].id;
                    $scope.vm.data.accountName = res.data.items[0].id;
                    $scope.vm.data.bankAccountName = res.data.items[0].id;
                    $scope.vm.data.bankAccountNum = res.data.items[0].id;
                    $scope.vm.data.openBank = res.data.items[0].id;
                    $scope.vm.data.openBankProvince = res.data.items[0].id;
                    $scope.vm.data.openBankCity = res.data.items[0].id;   
                    $scope.vm.data.balance = res.data.items[0].id;
                    $scope.vm.data.bigAmountBank = res.data.items[0].id;
                    $scope.vm.data.company = res.data.items[0].id;
                    $scope.vm.data.buildTime = res.data.items[0].id;
                    $scope.vm.data.memo = res.data.items[0].id;                
                });
            }
            getDataLabel();

            $scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#accountDetailTable');
            });

            var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.vm.condition) }).$promise.then(function(res) {
                    //debugger
                    $timeout(function() {
                        res.data.items.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        res.data.items.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
                        params.success({
                            total: res.data.paginate.totalCount,
                            rows: res.data.items
                        });
                    }, 500);
                });
            }

            function init() {

                $scope.bsAccountDetailTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'id',
                            title: '',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'name',
                            title: '流水号',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace',
                            title: '账户编码',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace2',
                            title: '账户名称',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace3',
                            title: '日志类型',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace4',
                            title: '参考ID',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace5',
                            title: '变动前余额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace6',
                            title: '发生额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace7',
                            title: '变动后余额',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace8',
                            title: '银行账户名称',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace9',
                            title: '银行账户号码',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace10',
                            title: '开户行',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace10',
                            title: '开户行省份',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '开户行地市',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace10',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'workspace10',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                        }]
                    }
                };
            };
            init();

            // (function(id) {
            //     console.log(id)
            //     if (!id) {
            //         return;
            //     }
            //     borrowerService.get({ id: id }).$promise.then(function(res) {
            //         $scope.vm.data = res.data;
            //     }, function(err) {
            //         debugger
            //     });
            // })($stateParams.id);

        }
    ];
});
