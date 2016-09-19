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
                $scope.listVM.table = $('#releasedTable');
            });


            var getData = function(params) {
                assetService.findProduct($scope.listVM.condition).then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            function initMeta() {
                metaService.getMeta('HKFS', function(items) {
                    $scope.listVM.repaymentTypeList = items;
                });
                metaService.getMeta('ZCLX', function(items) {
                    $scope.listVM.assetTypeList = items;
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
                            { field: 'asset.assetType', title: '资产类型', formatter: assetTypeFormatter },
                            { field: 'asset.assetChannel', title: '资产渠道' },
                            { field: 'name', title: '借款人' },
                            { field: '', title: '借款金额/投标金额' },
                            { field: 'asset.loanUse', title: '资金用途' }, {
                                field: 'loanRate',
                                title: '借款利率',
                                formatter: function(value) {
                                    return value ? value + '%' : '';
                                }
                            }, {
                                field: 'loanTermCount',
                                title: '借款周期',
                                formatter: function(value) {
                                    return value ? value + '天' : '';
                                }
                            }, {
                                field: 'licaiRate',
                                title: '理财利率',
                                formatter: function(value) {
                                    return value ? value + '%' : '';
                                }
                            },
                            { field: 'debtEndDate', title: '投标截止日期', formatter: dateFormatter },
                            { field: 'repaymentType', title: '还款方式', formatter: repaymentTypeFormatter },
                            { field: 'saleplatform', title: '销售平台' }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                width: 80,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-unrelease"]': unrelease
                                }
                            }
                        ]
                    }
                };

                function assetTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.assetTypeList);
                }

                function repaymentTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.repaymentTypeList);
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-unrelease" class="btn btn-warning btn-xs btn-transparent" title="下架产品"><i class="fa fa-arrow-down"></i></button>',
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
