define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, $filter, assetService, metaService, toaster) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                paginate: {
                    pageNum: 1,
                    pageSize: 10
                },
                data: {}
            };

            $scope.listVM = {
                title: '销售平台管理',
                condition: angular.copy(defaultCondition),
                table: null,
                checked: [],
                search: function() {
                    search();
                },
                reset: function() {
                    $scope.listVM.condition = angular.copy(defaultCondition);
                },
                add: function() {
                    showPlatformModal();
                },
                batchFreeze: function() {
                    batch(3, '批量冻结');
                },
                batchDelete: function() {
                    batch(2, '批量删除');
                }
            };

            function batch(status, title) {
                var text = "确定" + title + "？";
                var ids = $scope.listVM.checked.map(function(item) {
                    return item.id;
                }).join(',');
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
                            assetService.batchUpdatePlatform({ ids: ids, status: status }).then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '批量操作成功！');
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
            }

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                var table = $('#platformTable');
                table.on('check.bs.table uncheck.bs.table ' +
                    'check-all.bs.table uncheck-all.bs.table',
                    function() {
                        $timeout(function() {
                            var checked = table.bootstrapTable('getSelections')
                            $scope.listVM.checked = checked || [];
                        });
                    });

                $scope.listVM.table = table;
            });

            function search() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            var getData = function(params) {
                var condition = $scope.listVM.condition;
                condition.paginate = params.paginate;
                assetService.platform.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                    if (res.code == 200) {
                        params.success({
                            total: res.data.paginate.totalCount,
                            rows: res.data.items
                        });
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');
                });
            };

            (function init() {
                initMeta();
                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [
                            { field: 'state', checkbox: true, align: 'center', valign: 'middle' },
                            { field: 'code', title: '平台编号' },
                            { field: 'name', title: '平台名称' },
                            { field: 'createTime', title: '上线时间', formatter: dateFormatter },
                            { field: 'content', title: '平台形式', formatter: typeFormatter },
                            { field: 'amount', title: '累计销售额' },
                            { field: 'number', title: '用户数' },
                            { field: 'status', title: '状态', formatter: statusFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                width: 60,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-edit"]': edit
                                }
                            }
                        ]
                    }
                };

                function typeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.platformTypeList);
                }

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.platformStatusList);
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-edit" class="btn btn-xs btn-info"><i class="fa fa-edit"></i></button>'
                    ]
                    return buttons.join('');
                }

                function edit(e, value, row, index) {
                    showPlatformModal(row);
                    e.stopPropagation();
                    e.preventDefault();
                }

            })();

            /**
             * initinal meta data
             */
            function initMeta() {
                metaService.getMeta('SJJRFS', function(data) {
                    $scope.listVM.dataSourceList = data;
                });
                metaService.getMeta('XSPTXS', function(data) {
                    $scope.listVM.platformTypeList = data;
                });
                metaService.getMeta('XSPTZT', function(data) {
                    $scope.listVM.platformStatusList = data;
                });
            }

            function showPlatformModal(platform) {
                var title = platform ? "修改销售平台信息" : "新增销售平台";
                var platformTypeList = $scope.listVM.platformTypeList;
                $modal.open({
                    templateUrl: 'view/asset/platform/edit.html',
                    size: 'md',
                    controller: function($scope, $modalInstance) {

                        $scope.platformVM = {
                            title: title,
                            processing: false,
                            platformTypeList: platformTypeList,
                            submit: submit,
                            cancel: cancel
                        };

                        (function() {
                            if (!platform) {
                                return;
                            }
                            assetService.platform.get({ id: platform.id }).$promise.then(function(res) {
                                $scope.platformVM.data = res.data;
                                $scope.platformVM.loading = false;
                            }, function() {
                                $scope.platformVM.loading = false;
                                toaster.pop('error', '服务器连接出错，请稍候再试！')
                            });
                            $scope.platformVM.loading = true;
                        })();

                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function submit() {
                            if (platform)
                                assetService.platform.update({ id: platform.id }, $scope.platformVM.data).$promise.then(saveSuccess, saveError);
                            else
                                assetService.platform.save($scope.platformVM.data).$promise.then(saveSuccess, saveError);
                        }

                        function saveSuccess(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '保存成功！');
                                $modalInstance.dismiss();
                                search();
                            } else
                                toaster.pop('error', res.msg);
                        }

                        function saveError(err) {
                            toaster.pop('error', '服务器连接失败！');
                        }
                    }
                });
            }
        }
    ];
});
