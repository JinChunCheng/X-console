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

            $scope.$on('$viewContentLoaded', function() {
                $scope.vm.table = $('#profitDrawDetailTable');
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

                $scope.bsProfitDrawDetailTableControl = {
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
                            title: '利润类型',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace2',
                            title: '参考ID',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace3',
                            title: '金额',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace4',
                            title: '投资人标识',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace5',
                            title: '借款人标识',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace6',
                            title: '项目标识',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace7',
                            title: '产品分类',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace8',
                            title: '说明',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace9',
                            title: '操作员',
                            align: 'left',
                            valign: 'top',
                        }, {
                            field: 'workspace10',
                            title: '创建时间',
                            align: 'left',
                            valign: 'top',
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
