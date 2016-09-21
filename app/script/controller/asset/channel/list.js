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
                add: function() {
                    showChannelModal();
                },
                search: function() {
                    refreshChannel();
                },
                reset: function() {
                    $scope.listVM.condition = angular.copy(defaultCondition);
                }
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
                $scope.listVM.table = $('#channelTable');
            });


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
                            { field: 'name', title: '渠道名称' },
                            { field: 'createTime', title: '录入时间' },
                            { field: 'joinupType', title: '接入方式', formatter: joinupTypeFormatter },
                            { field: 'creditLimit', title: '授信额度' },
                            { field: 'assetCount', title: '接入资产' }, {
                                field: 'flag',
                                title: '操作',
                                width: 60,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-edit"]': edit
                                }
                            }
                        ]
                    }
                };

                function joinupTypeFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.joinupTypeList);
                }

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<button name="btn-edit" class="btn btn-xs btn-info"><i class="fa fa-edit"></i></button>'
                    ]
                    return buttons.join('');
                }

                function edit(e, value, row, index) {
                    showChannelModal(row);
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
            }

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
            }
        }
    ];
});
