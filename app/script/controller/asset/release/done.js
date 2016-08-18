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
                title: '已上架产品库',
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
                $scope.listVM.table = $('#releasedTable');
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
                            { field: 'id', title: '资产ID', align: 'center', valign: 'middle' },
                            { field: 'name', title: '资产类型', align: 'center', valign: 'middle' },
                            { field: 'workspace2', title: '资产来源', align: 'left', valign: 'top' },
                            { field: 'workspace', title: '借款人', align: 'left', valign: 'top' },
                            { field: 'workspace', title: '借款金额/投标金额', align: 'left', valign: 'top' },
                            { field: 'workspace', title: '资金用途', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款利率', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款周期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '理财利率', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '投标截止日期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '还款方式', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '投放渠道', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '创建时间', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '状态', align: 'left', valign: 'top' },
                            {   field: 'flag',
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

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<a href="" name="btn-unrelease">取消上架</button>'
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
                                return true;
                            }
                        }
                    });
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
