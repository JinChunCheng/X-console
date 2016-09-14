define([], function() {
    return ['$scope', '$http', '$filter', '$state', '$modal', 'projectService', 'metaService',
        function($scope, $http, $filter, $state, $modal, projectService, metaService) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                data: { status: 'NEW' },
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
                $scope.listVM.table = $('#releaseTable');
            });


            var getData = function(params) {
                projectService.project.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {
                initMeta();

                $scope.bsReleaseTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: "[10, 25, 50, 100, 200]",
                        ajax: getData,
                        sidePagination: "server",
                        columns: [
                            { field: 'projectId', title: '编号', align: 'center' },
                            { field: 'projectName', title: '项目名称' }, {
                                field: 'prodTypeId',
                                title: '产品类型',
                                formatter: function(value) {
                                    return $filter('meta')(value, $scope.listVM.productTypeList);
                                }
                            }, {
                                field: 'projectType',
                                title: '项目类型',
                                formatter: function(value) {
                                    return $filter('meta')(value, $scope.listVM.projectTypelist);
                                }
                            },
                            { field: 'creditChannelId', title: '授信渠道编号' }, {
                                field: 'creditChannelName',
                                title: '授信渠道名称',
                                formatter: function(value, row) {
                                    return $filter('meta')(row.creditChannelId, $scope.listVM.creditChannelList);
                                }
                            },
                            { field: 'borrowerId', title: '借款人编号' },
                            { field: 'borrowerName', title: '借款人' }, {
                                field: 'requestAmount',
                                title: '借款金额',
                                formatter: function(value) {
                                    return (value || 0) + '元';
                                }
                            },
                            { field: 'purpose', title: '借款用途' }, {
                                field: 'repaymentType',
                                title: '还款方式',
                                formatter: function(value) {
                                    return $filter('meta')(value, $scope.listVM.repaymentTypeList);
                                }
                            }, {
                                field: 'duration',
                                title: '借款期限',
                                formatter: function(value, row) {
                                    return (value || 0) + $filter('meta')(row.durationUnit, $scope.listVM.timeUnitList);
                                }
                            }, {
                                field: 'interestRate',
                                title: '借款利率',
                                formatter: function(value) {
                                    return (value || 0) + '%';
                                }
                            }, {
                                field: 'serviceFeeRate',
                                title: '服务费率',
                                formatter: function(value) {
                                    return (value || 0) + '%';
                                }
                            }, {
                                field: 'rebateRate',
                                title: '返利利率',
                                formatter: function(value) {
                                    return (value || 0) + '%';
                                }
                            },
                            { field: 'createDatetime', title: '创建时间', formatter: dateTimeFormatter },
                            { field: 'updateDatetime', title: '更新时间', formatter: dateTimeFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                clickToSelect: false,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btnDetail"]': function(e, value, row, index) {
                                        $state.go('project.release.verify', { id: row.projectId });
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
                    return '<button name="btnDetail" class="btn btn-xs btn-transparent btn-default" title="查看项目信息"><i class="fa fa-file-text-o"></i></button>';
                }

            })();

            function initMeta() {
                metaService.getMeta('SJDW', function(items) {
                    $scope.listVM.timeUnitList = items;
                });
                metaService.getMeta('XMZT', function(items) {
                    $scope.listVM.statusList = items;
                });
                metaService.getMeta('XMLX', function(items) {
                    $scope.listVM.projectTypelist = items;
                });
                metaService.getMeta('CPLX', function(items) {
                    $scope.listVM.productTypeList = items;
                });
                metaService.getMeta('HKFS', function(items) {
                    $scope.listVM.repaymentTypeList = items;
                });
                metaService.getMeta('SXQD', function(items) {
                    $scope.listVM.creditChannelList = items;
                    var creditManagerList = [];
                    if (items && items.length > 0) {
                        items.forEach(function(item) {
                            creditManagerList = creditManagerList.concat(item.children);
                        });
                    }
                    $scope.listVM.creditManagerList = creditManagerList;
                });

            }
        }
    ];
});
