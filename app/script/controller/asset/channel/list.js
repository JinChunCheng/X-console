define([], function() {
    return ['$scope', '$http', '$filter', '$modal', '$state', '$timeout', 'assetService', 'metaService', 'toaster',
        function($scope, $http, $filter, $modal, $state, $timeout, assetService, metaService, toaster) {

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
                title: '渠道管理',
                condition: angular.copy(defaultCondition),
                table: null,
                checked: [],
                add: function() {
                    showChannelModal();
                },
                search: function() {
                    refreshChannel();
                },
                reset: function() {
                    $scope.listVM.condition = angular.copy(defaultCondition);
                },
                batchFreeze: function() {
                    batch(1, '批量冻结');
                },
                batchDelete: function() {
                    batch(0, '批量删除');
                }
            };

            function batch(type, title) {
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
                            processing: false,
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            assetService.batchUpdateChannel({ ids: [ids], type: type }).then(function(res) {
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
                $scope.listVM.checked = [];
            };


            function refreshChannel() {
                $scope.listVM.table.bootstrapTable('refresh');
            }

            /**
             * select2 plugin
             * @param  {object}
             */
            $scope.refreshUser = function(condition) {
                if (!condition) {
                    return;
                }
                $scope.listVM.userLoading = true;
                $timeout(function() {
                    $scope.listVM.userList = [
                        { name: 'usea', email: 'usea@iboxpay.com' },
                        { name: 'youhaiyang', email: 'youhaiyang@iboxpay.com' },
                        { name: 'jinchuncheng', email: 'jinchuncheng@iboxpay.com' },
                        { name: 'zhouzheng', email: 'zhouzheng@iboxpay.com' }
                    ];
                    $scope.listVM.userLoading = false;
                }, 1000);
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                var table = $('#channelTable');
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
            var findChannel = function(params) {
                var condition = $scope.listVM.condition;
                condition.paginate = params.paginate;
                assetService.findChannel($scope.listVM.condition).then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
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
                        ajax: findChannel,
                        sidePagination: "server",
                        columns: [
                            { field: 'state', checkbox: true, align: 'center', valign: 'middle' },
                            // { field: 'id', title: '渠道ID' },
                            { field: 'name', title: '渠道名称' }, { field: 'createTime', title: '渠道录入时间', formatter: createTimeFormatter },
                            { field: 'joinupType', title: '接入方式', formatter: joinupTypeFormatter },
                            { field: 'creditLimit', title: '授信额度' },
                            { field: 'assetCount', title: '接入资产数' },
                            { field: 'totalAsset', title: '接入资产总额' },
                            { field: 'status', title: '渠道状态', formatter: statusFormatter }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                width: 80,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-edit"]': edit,
                                    'click [name="btn-freeze"]': freeze,
                                    'click [name="btn-delete"]': remove
                                }
                            }
                        ]
                    }
                };

                function joinupTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.joinupTypeList);
                }

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.status);
                }

                function createTimeFormatter(value, row, index) {
                    return $filter('exDate')(value, "yyyy-MM-dd HH:mm:ss");
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-edit" class="btn btn-xs btn-info m-r-5"><i class="fa fa-edit"></i></button>',
                        '<button name="btn-freeze" class="btn btn-xs btn-warning"><i class="icon icons-weather-14"></i></button>',
                        //'<button name="btn-delete" class="btn btn-xs btn-danger"><i class="fa fa-close"></i></button>'
                    ]
                    return buttons.join('');
                }

                function edit(e, value, row, index) {
                    showChannelModal(row);
                    e.stopPropagation();
                    e.preventDefault();
                }

                function freeze(e, value, row, index) {
                    one(1,row);
                    e.stopPropagation();
                    e.preventDefault();
                }

                function remove(e, value, row, index) {
                    one(0,row);
                    e.stopPropagation();
                    e.preventDefault();
                }

            })();

            /**
             * initinal meta data
             */
            function initMeta() {
                metaService.getMeta('SJJRFS', function(data) {
                    $scope.listVM.joinupTypeList = data;
                });
                metaService.getMeta('QDZT', function(data) {
                    $scope.listVM.status = data;
                });
            }

            function one(type,row) {
                var title = type == 0 ? '删除' : '冻结';
                var text = "确定" + title + "？";
                var id = row.id;

                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: text,
                            processing: false,
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            if (type == 0) {
                                assetService.oneDeleteChannel.delete({ id: id }).$promise.then(function(res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '删除成功！');
                                        $modalInstance.dismiss();
                                        search();
                                    } else
                                        toaster.pop('error', res.msg);
                                }, function(err) {
                                    toaster.pop('error', '服务器连接失败！');
                                });
                                return true;
                            }
                            assetService.oneFreezeChannel.delete({ id: id }).$promise.then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '冻结成功！');
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
            };

            function showChannelModal(channel) {
                var title = channel ? "修改渠道信息" : "新增渠道";
                var joinupTypeList = $scope.listVM.joinupTypeList;
                $modal.open({
                    templateUrl: 'view/asset/channel/edit.html',
                    size: 'md',
                    controller: function($scope, $modalInstance) {

                        $scope.channelVM = {
                            title: title,
                            processing: false,
                            joinupTypeList: joinupTypeList,
                            data: channel || { status: 1 },
                            submit: submit,
                            cancel: cancel
                        };

                        (function() {
                            if (!channel) {
                                return;
                            }
                            assetService.channel.get({ id: channel.id }).$promise.then(function(res) {
                                $scope.channelVM.data = res.data;
                                $scope.channelVM.loading = false;
                            }, function() {
                                $scope.channelVM.loading = false;
                                toaster.pop('error', '服务器连接出错，请稍候再试！')
                            });
                            $scope.channelVM.loading = true;
                        })();

                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function submit(invalid) {
                            $scope.channelVM.submitted = true;
                            if (invalid) {
                                return;
                            }
                            saveChannel($scope.channelVM.data);
                            return true;
                        }

                        function saveChannel(data) {
                            if (channel) {
                                assetService.channel.update({ id: data.id }, data).$promise.then(saveSuccess, saveError);
                            } else {
                                assetService.channel.save(data).$promise.then(saveSuccess, saveError);
                            }
                        };

                        function saveSuccess(res) {
                            toaster.pop('success', '保存成功！');
                            $modalInstance.dismiss();
                            refreshChannel();
                        }

                        function saveError(res) {
                            toaster.pop('error', '连接服务器出错，请重试');
                        }
                    }
                });
            };
        }
    ];
});
