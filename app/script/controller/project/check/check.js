define([], function() {
    return ['$scope', '$state','projectService', function($scope,$state,projectService) {

        var defaultCondition = {
            data: {},
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
            projectService.project.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {
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
                        field: 'projectId',
                        title: '项目编号'
                    }, {
                        field: 'projectName',
                        title: '项目名称'
                    }, {
                        field: 'projectType',
                        title: '项目类型'
                    }, {
                        field: 'workspace2',
                        title: '产品分类'
                    }, {
                        field: 'borrowerId',
                        title: '借款人编号'
                    }, {
                        field: 'workspace4',
                        title: '借款人'
                    }, {
                        field: 'requestAmount',
                        title: '借款金额'
                    }, {
                        field: 'purpose',
                        title: '借款用途'
                    }, {
                        field: 'repaymentType',
                        title: '还款方式'
                    }, {
                        field: 'duration',
                        title: '借款期限'
                    }, {
                        field: 'interestRate',
                        title: '借款利率'
                    }, {
                        field: 'serviceFeeRate',
                        title: '服务费率'
                    }, {
                        field: 'workspace10',
                        title: '返利利率'
                    }, {
                        field: 'status',
                        title: '状态'
                    }, {
                        field: 'publishTime',
                        title: '发布时间'
                    }, {
                        field: 'biddingDeadline',
                        title: '满标时间'
                    }, {
                        field: 'createDatetime',
                        title: '创建时间'
                    }, {
                        field: 'updateDatetime',
                        title: '更新时间'
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

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function editRow(e, value, row, index) {
            $state.go('project.check.detail', { id: row.projectId });
        }

    }];
});
