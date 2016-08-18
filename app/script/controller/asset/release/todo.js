define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $timeout, $modal, $state, borrowerService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                paginate: {
                    sort: 'update_time desc',
                    pageNum: 1,
                    pageSize: 10
                },
                data: {}
            };

            $scope.listVM = {
                title: '待上架产品库',
                condition: angular.copy(defaultCondition),
                table: null,
                add: function() {
                    $state.go('asset.info.add');
                },
                batchUpload: function() {

                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#tobeReleaseTable');
            });


            var getData = function(params) {
                borrowerService.resource.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
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
            };

            (function init() {

                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        onPageChange: pageChange,
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
                    $state.go('asset.release.edit', {id: value})
                    e.stopPropagation();
                    e.preventDefault();
                }

            })();

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

            var pageChange = function(num, size) {
                console.log('page change');
            };
        }
    ];
});
