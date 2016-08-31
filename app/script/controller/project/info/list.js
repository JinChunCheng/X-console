define([], function() {
    return ['$scope', '$http', '$filter', '$modal', 'projectService', 'metaService',
        function($scope, $http, $filter, $modal, projectService, metaService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                data: {},
                paginate: { pageSize: 10, pageNum: 1 }
            };

            $scope.listVM = {
                condition: angular.copy(defaultCondition),
                table: null,
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
                $scope.listVM.table = $('#projectListTable');
            });


            var getData = function(params) {
                projectService.project.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {
                initMeta();

                $scope.bsProjectListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: "[10, 25, 50, 100, 200]",
                        ajax: getData,
                        sidePagination: "server",
                        columns: [
                            { field: 'projectId', title: '编号', align: 'center' },
                            { field: 'projectName', title: '项目名称' },
                            { field: 'prodTypeId', title: '产品类型' },
                            { field: 'projectType', title: '项目类型' },
                            { field: 'status', title: '状态', formatter: statusFormatter },
                            { field: 'borrowerId', title: '借款人编号' },
                            { field: '', title: '借款人' },
                            { field: 'requestAmount', title: '借款金额' },
                            { field: 'purpose', title: '借款用途' },
                            { field: 'displayChannelCode', title: '显示渠道' },
                            { field: 'repaymentType', title: '还款方式' },
                            { field: 'duration', title: '借款期限' },
                            { field: 'interestRate', title: '借款利率' },
                            { field: 'serviceFeeRate', title: '服务费率' },
                            { field: 'biddingDeadline', title: '投标截止时间', formatter: dateFormatter },
                            { field: '', title: '返利利率' },
                            { field: 'rebateRate', title: '投标进度' },
                            { field: 'biddingAmount', title: '投标金额' },
                            { field: 'creditChannelCode', title: '授信渠道编号' },
                            { field: 'creditChannelName', title: '授信渠道名称' },
                            { field: '', title: '授信客户经理编号' },
                            { field: '', title: '授信客户经理名称' },
                            { field: '', title: '满标时间' },
                            { field: 'createDatetime', title: '创建时间', formatter: dateTimeFormatter },
                            { field: 'updateDatetime', title: '更新时间', formatter: dateTimeFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                clickToSelect: false,
                                formatter: flagFormatter,
                                events: {
                                    'click .btn': function(e, value, row, index) {
                                        var text = "确定删除此记录？";
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
                                                };

                                                $scope.ok = function() {
                                                    delUser(item.id, $scope, $modalInstance);
                                                    return true;
                                                };
                                            }
                                        });

                                    }
                                }
                            }
                        ]
                    }
                };

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function dateTimeFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                }

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.statusList);
                }

                function flagFormatter(value, row, index) {
                    return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
                }

            })();

            function initMeta() {
                metaService.getMeta('XMZT', function(items) {
                    $scope.listVM.statusList = items;
                });
            }
        }
    ];
});
