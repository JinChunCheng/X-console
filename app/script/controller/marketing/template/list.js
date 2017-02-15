define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'marketingService',
        function($scope, $http, metaService, $filter, $timeout, $modal, $state, marketingService) {

            $scope.listVM = {
                condition: {},
                table: null,
                add: function() {
                    $state.go('marketing.template.add');
                },
                channelChange: function() {
                    $scope.listVM.condition.fundAccountManagerId = null;
                },
                fundChannelName: [],
                getManagers: function(channelId) {
                    var result = [];
                    $scope.listVM.fundChannelName.forEach(function(item) {
                        if (item.value == channelId) {
                            result = item.children;
                            return;
                        }
                    });
                    return result;
                },
            };

            //function initMetaData() {
            //    metaService.getMeta('ZT', function(data) {
            //        $scope.listVM.status = data;
            //    });
            //    metaService.getMeta('ZHUCLX', function(data) {
            //        $scope.listVM.registerType = data;
            //    });
            //    metaService.getMeta('SFBGSYG', function(data) {
            //        $scope.listVM.empFlag = data;
            //    });
            //    metaService.getMeta('STJZT', function(data) {
            //        $scope.listVM.trialFlag = data;
            //    });
            //    metaService.getMeta('CZLY', function(data) {
            //        $scope.listVM.operateOrigin = data;
            //    });
            //    metaService.getMeta('LCQD', function(data) {
            //        $scope.listVM.fundChannel = data;
            //
            //    });
            //    metaService.getMeta('LCQDMC', function(data) {
            //        $scope.listVM.fundChannelName = data;
            //
            //    });
            //    metaService.getMeta('STJSFYSY', function(data) {
            //        $scope.listVM.trialUsed = data;
            //    });
            //    metaService.getMeta('LCJLXM', function(data) {
            //        $scope.listVM.fundAccountManagerName = data;
            //
            //    });
            //    metaService.getMeta('SFXS', function(data) {
            //        $scope.listVM.noviciate = data;
            //    });
            //};
            //initMetaData();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };


            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#marketingTable');
            });


            var getData = function(params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var data = $scope.listVM.condition;
                var queryCondition = { "data": data, "paginate": paganition };
                marketingService.marketingListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsMarketingTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'state',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle'
                        }, {
                            field: 'marketingId',
                            title: 'ID',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'name',
                            title: '模板名称',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'categoryScopeDesc',
                            title: '支持标的类型',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'value',
                            title: '加息',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'effectiveDays',
                            title: '有效期',
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
                                'click .btn-info': detail,
                                'click .btn-primary': editRow,
                                'click .btn-success': bankMaintain,
                            }
                        }]
                    }
                };

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.status);
                }

                function registerFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.registerType);
                }

                function empFlagFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.empFlag);
                }

                function trialFlagFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.trialFlag);
                }

                function trialUsedFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.trialUsed);
                }

                function operateOriginFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.operateOrigin);
                }

                function fundChannelNameFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.fundChannel);
                }

                function fundAccountManagerNameFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.fundAccountManagerName);
                }

                function fundAccountManagerCodeFormatter(value, row, index) {
                    return $filter('metaCM')(row.fundAccountManagerId, $scope.listVM.fundAccountManagerName);
                }

                function fundChannelCodeFormatter(value, row, index) {
                    return $filter('metaCM')(row.fundChannelId, $scope.listVM.fundChannelName);
                }

                function noviciateFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.noviciate);
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                }

                function updateFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                }

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                        '<button type="button" class="btn btn-xs btn-success"><i class="fa fa-cc-visa"></i></button>'

                    ];
                    return btnHtml.join('');
                }

            })();

            function detail(e, value, row, index) {
                $state.go('marketing.template.detail', { id: row.marketingId });
            }

            function bankMaintain(e, value, row, index) {
                $state.go('marketing.template.maintain', { id: row.marketingId });
            }

            function editRow(e, value, row, index) {
                $state.go('marketing.template.edit', { id: row.marketingId });
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
