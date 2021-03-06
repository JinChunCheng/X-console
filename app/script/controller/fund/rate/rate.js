define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'fundService',
        function($scope, $http, metaService, $filter, $timeout, $modal, $state, fundService) {
            $scope.listVM = {
                condition: {},
                table: null,
                add: function() {
                    $state.go('fund.rate.add');
                },
            };

            function initMetaData() {
                metaService.getMeta('FLLX', function(data) {
                    $scope.listVM.rateType = data;
                });
                metaService.getMeta('FLBMF', function(data) {
                    $scope.listVM.rateCode = data;
                });
                metaService.getMeta('FLQD', function(data) {
                    $scope.listVM.operationChannel = data;
                });
                metaService.getMeta('ZT', function(data) {
                    $scope.listVM.status = data;
                });

            }
            initMetaData();

            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#ratePreserveTable');
            });


            var getData = function(params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var data = $scope.listVM.condition;
                var queryCondition = { "data": data, "paginate": paganition };
                fundService.rateListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });

            };

            (function init() {

                $scope.bsRatePreserveTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'rateId',
                            title: '费率标示',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'rateCode',
                            title: '费率编码',
                            formatter: rateNameFormatter,
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'rateName',
                            title: '费率名称',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'rateType',
                            title: '费率类型',
                            formatter: rateTypeFormatter,
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'rateValue',
                            title: '费率值',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'minValue',
                            title: '最低值',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'limitValue',
                            title: '封顶值',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'operationChannel',
                            formatter: channelFormatter,
                            title: '渠道',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'status',
                            formatter: statusFormatter,
                            title: '状态',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'op',
                            title: '操作员',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'createDatetime',
                            formatter: createDateFormatter,
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'updateDatetime',
                            title: '更新时间',
                            formatter: refreshDateFormatter,
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            valign: 'middle',
                        }, {
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            valign: 'middle',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-primary': editRow
                            }
                        }]
                    }
                };

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.status)
                };

                function rateNameFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.rateCode)
                };

                function channelFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.operationChannel)
                };

                function rateTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.rateType)
                };

                function refreshDateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
                };

                function createDateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function editRow(e, value, row, index) {
                $state.go('fund.rate.edit', { id: row.rateId });
            }

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = {};
            };
        }
    ];
});
