define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'assetService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, assetService, toaster) {

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

            (function init() {

                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [
                            { field: 'assetType', title: '资产类型' },
                            { field: 'assetChannelId', title: '资产渠道' },
                            { field: 'name', title: '借款人' },
                            { field: '', title: '借款金额/投标金额' },
                            { field: 'loanUse', title: '资金用途' },
                            { field: 'loanRate', title: '借款利率' },
                            { field: 'loanTermCount', title: '借款周期' },
                            { field: 'licaiRate', title: '理财利率' },
                            { field: 'debtEndDate', title: '投标截止日期' },
                            { field: 'repaymentType', title: '还款方式' },
                            { field: 'saleplatform', title: '销售平台' },
                            { field: 'status', title: '状态' }, {
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
