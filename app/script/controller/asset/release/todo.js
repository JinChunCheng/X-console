define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', '$filter', 'assetService', 'metaService',
        function($scope, $http, $timeout, $modal, $state, $filter, assetService, metaService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                },
                data: { status: 0 }
            };

            $scope.listVM = {
                title: '待上架产品库',
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

            function search() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#tobeReleaseTable');
            });

            var findAsset = function(params) {
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
                        ajax: findAsset,
                        sidePagination: "server",
                        columns: [
                            { field: 'asset.assetType', title: '类型', formatter: assetTypeFormatter },
                            { field: 'loanRemark', title: '借款概要', formatter: loanRemarkFormatter },
                            { field: 'asset.assetChannel', title: '来源' }, {
                                field: 'loanRate',
                                title: '借款利率',
                                formatter: function(value) {
                                    return value ? value + '%' : '';
                                }
                            }, {
                                field: 'loanTermCount',
                                title: '借款周期',
                                formatter: function(value) {
                                    return value ? value + '天' : ''
                                }
                            },
                            { field: 'createTime', title: '收录日期', formatter: dateFormatter },
                            { field: 'loanDate', title: '过期时间', formatter: dateFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                width: 60,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-release"]': release
                                }
                            }
                        ]
                    }
                };

                function assetTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.assetTypeList);
                }

                function loanRemarkFormatter(value, row, index) {
                    var list = [];
                    if (row.name)
                        list.push(row.name);
                    list.push('借款' + (row.amount || 0) + '元')
                    if (row.loanUse)
                        list.push('用于' + row.loanUse);
                    return list.join('，');
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-release" class="btn btn-success btn-xs btn-transparent" title="上架产品"><i class="fa fa-arrow-up"></i></button>',
                    ]
                    return buttons.join('');
                }

                function release(e, value, row, index) {
                    $state.go('asset.release.edit', { id: row.id })
                    e.stopPropagation();
                    e.preventDefault();
                }

            })();
        }
    ];
});
