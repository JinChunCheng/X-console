define([], function() {
    return ['$scope', '$state', '$filter', 'metaService', 'projectService', function($scope, $state, $filter, metaService, projectService) {

        var defaultCondition = {
            data: { status: 'BDF' },
            paginate: {
                pageNum: 1,
                pageSize: 10
            }
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null
        };

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#endTenderCheckTable');
        });


        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listView.condition;
            condition.paginate = paganition;
            projectService.project.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                res.data = res.data || { items: [], paginate: { totalCount: 0 } };
                res.data.paginate = res.data.paginate || { totalCount: 0 };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {
            initMeta();

            $scope.EndTenderCheckTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'code',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '项目编号'
                    }, {
                        field: 'projectName',
                        title: '项目名称'
                    }, {
                        field: 'projectType',
                        title: '项目类型',
                        formatter: function(value) {
                            return $filter('meta')(value, $scope.listView.projectTypelist);
                        }
                    }, {
                        field: 'prodTypeId',
                        title: '产品类型',
                        formatter: function(value) {
                            return $filter('meta')(value, $scope.listView.productTypeList);
                        }
                    }, {
                        field: 'borrowerId',
                        title: '借款人编号'
                    }, {
                        field: 'borrowerName',
                        title: '借款人'
                    }, {
                        field: 'requestAmount',
                        title: '借款金额'
                    // }, {
                    //     field: 'purpose',
                    //     title: '借款用途'
                    }, {
                        field: 'repaymentType',
                        title: '还款方式',
                        formatter: function(value) {
                            return $filter('meta')(value, $scope.listView.repaymentTypeList);
                        }
                    }, {
                        field: 'duration',
                        title: '借款期限'
                    }, {
                        field: 'interestRate',
                        title: '借款利率',
                        formatter:rateFormatter
                    }, {
                        field: 'discountRate',
                        title: '优惠利率',
                        formatter:rateFormatter
                    }, {
                        field: 'serviceFeeRate',
                        title: '服务费率',
                        formatter:rateFormatter
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter: function(value, row, index) {
                            return $filter('meta')(value, $scope.listView.statusList);
                        }
                    }, {
                        field: 'publishTime',
                        title: '发布时间',
                        formatter: timeFormatter
                    }, {
                        field: 'biddingDeadline',
                        title: '满标时间',
                        formatter: timeFormatter
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        formatter: timeFormatter
                    }, {
                        field: 'updateDatetime',
                        title: '更新时间',
                        formatter: timeFormatter
                    }, {
                        field: 'flag',
                        title: '查看',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-primary': editRow
                        }
                    }]
                }
            };

            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }
            function rateFormatter(value, row, index) {
                return (value*100).toFixed(2)+'%/年';
            }
            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-file-text-o"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function initMeta() {
            metaService.getMeta('XMZT', function(items) {
                $scope.listView.statusList = items;
            });
            metaService.getMeta('CPLX', function(items) {
                $scope.listView.productTypeList = items;
            });
            metaService.getMeta('XMLX', function(items) {
                $scope.listView.projectTypelist = items;
            });
            metaService.getMeta('HKFS', function(items) {
                $scope.listView.repaymentTypeList = items;
            });
        }

        function editRow(e, value, row, index) {
            $state.go('project.check.detail', { id: row.id });
        }

    }];
});
