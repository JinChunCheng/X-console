define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'assetService',
        function($scope, $http, $timeout, $modal, $state, assetService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var status = 1;
            var defaultCondition = {
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                },
                data: { status: status }
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
                assetService.findAsset($scope.listVM.condition).then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: findAsset,
                        sidePagination: "server",
                        columns: [
                            { field: 'id', title: '编号', align: 'center', valign: 'middle' },
                            { field: 'name', title: '类型', align: 'center', valign: 'middle' },
                            { field: 'workspace', title: '借款概要', align: 'left', valign: 'top' },
                            { field: 'workspace2', title: '来源', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款利率', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款周期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '收录日期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '过期时间', align: 'left', valign: 'top' }, {
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

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<a href="" name="btn-release">上架</button>'
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
