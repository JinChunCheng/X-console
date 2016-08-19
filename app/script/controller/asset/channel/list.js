define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService', 'metaService',
        function($scope, $http, $timeout, $modal, $state, borrowerService, metaService) {

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
                }
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
                    //debugger
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
                            { field: 'id', title: '编号', align: 'center', valign: 'middle' },
                            { field: 'name', title: '渠道名称', align: 'center', valign: 'middle' },
                            { field: 'workspace', title: '录入时间', align: 'left', valign: 'top' },
                            { field: 'workspace2', title: '接入方式', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '授信额度', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '接入资产', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '状态', align: 'left', valign: 'top' }, {
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

                function flagFormatter(value, row, index) {
                    var buttons = [
                        '<a href="" name="btn-edit">修改</button>'
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
                    $scope.listVM.dataSourceList = data;
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
                var dataSourceList = $scope.listVM.dataSourceList;
                $modal.open({
                    templateUrl: 'view/asset/channel/edit.html',
                    size: 'md',
                    controller: function($scope, $modalInstance) {

                        $scope.channelVM = {
                            title: title,
                            processing: false,
                            dataSourceList: dataSourceList,
                            submit: submit,
                            cancel: cancel
                        };
                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function submit() {
                            saveChannel(item.id, $scope, $modalInstance);
                            return true;
                        }
                    }
                });
            }
        }
    ];
});
