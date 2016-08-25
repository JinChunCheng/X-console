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
                action: action,
                condition: angular.copy(defaultCondition),
                table: null,
                data: {},
                cancel: function() {
                    $state.go('financial.monitor.monitor');
                }
            };

            function getDataLabel1(id) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ id:id }).$promise.then(function(res) {
                    console.log(res.data.items[0].id);
                    $scope.vm.data.borrowerCode = res.data.items[0].id;
                    $scope.vm.data.name = res.data.items[0].id;
                    $scope.vm.data.IDcard = res.data.items[0].id;
                    $scope.vm.data.status = res.data.items[0].id;
                    $scope.vm.data.mobile = res.data.items[0].id;
                    $scope.vm.data.phone = res.data.items[0].id;
                    $scope.vm.data.mail = res.data.items[0].id;
                    $scope.vm.data.bank = res.data.items[0].id;
                    $scope.vm.data.bankProvince = res.data.items[0].id;
                    $scope.vm.data.bankCity = res.data.items[0].id;
                    $scope.vm.data.innerCode = res.data.items[0].id;
                    $scope.vm.data.bankAccountName = res.data.items[0].id;
                    $scope.vm.data.bankAccount = res.data.items[0].id;
                    $scope.vm.data.address = res.data.items[0].id;
                    $scope.vm.data.postCode = res.data.items[0].id;
                    $scope.vm.data.buildTime = res.data.items[0].id;
                    $scope.vm.data.refreshTime = res.data.items[0].id;
                    $scope.vm.data.memo = res.data.items[0].id;
                });
            }
            getDataLabel1($stateParams.id);

            function getDataLabel2(id) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ id:id }).$promise.then(function(res) {
                    console.log(res.data.items[0].id);
                    $scope.vm.data.accountSubject = res.data.items[0].id;
                    $scope.vm.data.balance = res.data.items[0].id;
                    $scope.vm.data.freezeBalance = res.data.items[0].id;
                    $scope.vm.data.availableBalance = res.data.items[0].id;
                    $scope.vm.data.buildTime = res.data.items[0].id;
                });
            }
            getDataLabel2($stateParams.id);
            $scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#borrowDetailTable');
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

                $scope.bsBorrowDetailTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'id',
                            title: '编号',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'name',
                            title: '账户科目',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace',
                            title: '账户变动类型',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace2',
                            title: '参考编号',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '发生前余额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace4',
                            title: '发生前余额冻结',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace5',
                            title: '发生前可用余额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace6',
                            title: '发生额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace7',
                            title: '发生后余额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace8',
                            title: '发生后余额冻结',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace9',
                            title: '发生后可用余额',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '余额变动标志',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
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
            //     borrowerService.resource.get({ id: id }).$promise.then(function(res) {
            //         $scope.vm.data = res.data;
            //     }, function(err) {
            //         debugger
            //     });
            // })($stateParams.id);

        }
    ];
});
