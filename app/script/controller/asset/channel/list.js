define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService', 'metaService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, borrowerService, metaService, toaster) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                paginate: {
                    sort: 'update_time desc',
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
                testToaster: function() {
                    toaster.pop('success', '成功！');
                    toaster.pop('error', '失败');
                    toaster.pop('info', '提示！');
                }
            };

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


            var getData = function(params) {
                borrowerService.resource.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
                    $timeout(function() {
                        res.data.items.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        res.data.items.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
                        params.success({
                            total: res.data.paginate.totalCount,
                            rows: res.data.items
                        });
                    }, 500);
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
                            { field: 'id', title: '编号' },
                            { field: 'name', title: '渠道名称' },
                            { field: 'createTime', title: '录入时间' },
                            { field: 'joinupType', title: '接入方式' },
                            { field: 'creditLimit', title: '授信额度' },
                            { field: 'assetCount', title: '接入资产' },
                            { field: 'status', title: '状态' }, {
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

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
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
                            submit: submit,
                            cancel: cancel
                        };

                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function submit(invalid) {
                            $scope.channelVM.submitted = true;
                            if (invalid) {
                                return;
                            }
                            saveChannel(item.id, $scope, $modalInstance);
                            return true;
                        }
                    }
                });
            }
        }
    ];
});
