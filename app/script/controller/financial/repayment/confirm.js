define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, $filter, assetService, metaService, toaster) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                },
                data: { status: 2 }
            };

            $scope.listVM = {
                title: '已上架产品库',
                condition: angular.copy(defaultCondition),
                table: null,
                add: function() {
                    $state.go('asset.info.add');
                },
                search: search,
                reset: function() {
                    $scope.listVM.condition = angular.copy(defaultCondition);
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#repaymentConfirmTable');
            });


            var getData = function(params) {
                var condition = $scope.listVM.condition;
                condition.paginate = params.paginate;
                assetService.findProduct(condition).then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            function initMeta() {
                metaService.getMeta('CPZT', function(items) {
                    $scope.listVM.statusList = items;
                });
            }

            (function init() {
                initMeta();
                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [
                            { field: 'productName', title: '标的名称' },
                            { field: 'asset.name', title: '借款人' },
                            { field: 'asset.cardno', title: '银行账号' },
                            { field: 'repaymentDate', title: '还款日期', formatter: dateFormatter },
                            { field: 'status', title: '状态', formatter: statusFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                width: 80,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-confirm"]': unrelease
                                }
                            }
                        ]
                    }
                };

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.statusList);
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-confirm" class="btn btn-success btn-xs btn-transparent" title="确认还款">确认还款</button>',
                    ]
                    return buttons.join('');
                }

                function unrelease(e, value, row, index) {
                    var text = "确定下架此产品？";
                    $modal.open({
                        templateUrl: 'view/shared/confirm.html',
                        size: 'sm',
                        controller: function($scope, $modalInstance) {
                            $scope.confirmData = {
                                text: text,
                                processing: false
                            };
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                                return false;
                            }

                            $scope.ok = function() {
                                assetService.offshelf(row.id).then(function(res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '产品下架成功！');
                                        $modalInstance.dismiss();
                                        search();
                                    } else
                                        toaster.pop('error', res.msg);
                                }, function(err) {
                                    toaster.pop('error', '服务器连接失败！');
                                });
                                return true;
                            }
                        }
                    });
                    e.stopPropagation();
                    e.preventDefault();
                }

            })();

            function search() {
                $scope.listVM.table.bootstrapTable('refresh');
            };
        }
    ];
});
