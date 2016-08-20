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
                            { field: 'name', title: '平台名称', align: 'center', valign: 'middle' },
                            { field: 'workspace', title: '上线时间', align: 'left', valign: 'top' },
                            { field: 'workspace2', title: '平台形式', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '累计销售额', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '用户数', align: 'left', valign: 'top' },
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
                            savePlatform(item.id, $scope, $modalInstance);
                            return true;
                        }
                    }
                });
            }
        }
    ];
});
