define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'assetService', 'metaService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, assetService, metaService, toaster) {

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
                add: function() {
                    showPlatformModal();
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#platformTable');
            });


            var getData = function(params) {
                assetService.platform.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
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
                            { field: 'id', title: '编号', align: 'center', valign: 'middle' },
                            { field: 'name', title: '平台名称', align: 'center', valign: 'middle' },
                            { field: 'createTime', title: '上线时间', align: 'left', valign: 'top' },
                            { field: 'content', title: '平台形式', align: 'left', valign: 'top' },
                            { field: 'amount', title: '累计销售额', align: 'left', valign: 'top' },
                            { field: 'number', title: '用户数', align: 'left', valign: 'top' },
                            { field: 'status', title: '状态', align: 'left', valign: 'top' }, {
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
            }

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

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

                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function submit() {
                            debugger
                            if (platform)
                                assetService.platform.update({ id: platform.id }, $scope.platformVM.data).$promise.then(saveSuccess, saveError);
                            else
                                assetService.platform.save($scope.platformVM.data).then(saveSuccess, saveError);
                            return true;
                        }

                        function saveSuccess(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '保存成功！');
                                $modalInstance.dismiss();
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
