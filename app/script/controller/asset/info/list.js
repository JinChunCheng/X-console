define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $timeout, $modal, $state, borrowerService) {

            /**
             * shared controller with more state
             * do different things in different router
             */
            var action = 'draft';
            var title = '资产列表';
            var buttons = [];
            var optColWidth = 120;
            switch ($state.current.name) {
                case 'asset.info.draft':
                    action = 'draft';
                    title = '资产草稿';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-submit" class="m-r-5">提交</button>',
                        '<a href="" name="btn-edit" class="m-r-5">修改</button>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    optColWidth = 120;
                    break;
                case 'asset.info.todo':
                    action = 'todo';
                    title = '未评审资产库';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-edit" class="m-r-5">修改</button>',
                        '<a href="" name="btn-pass" class="m-r-5">审核通过</a>',
                        '<a href="" name="btn-refuse" class="m-r-5">审核不通过</button>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    optColWidth = 220;
                    break;
                case 'asset.info.better':
                    action = 'better';
                    title = '优质资产库';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-cancel" class="m-r-5">取消审核</a>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    break;
                case 'asset.info.risk':
                    action = 'risk';
                    title = '风险资产库';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-pass" class="m-r-5">审核通过</a>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    break;
                default:
                    optColWidth = 120;
                    break;
            }

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
                title: title,
                condition: angular.copy(defaultCondition),
                table: null,
                add: function() {
                    console.log('add');
                    $state.go('asset.info.add');
                },
                batchUpload: function() {

                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#assetTable');
            });


            var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
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

                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        onPageChange: pageChange,
                        sidePagination: "server",
                        columns: [
                            { field: 'state', checkbox: true, align: 'center', valign: 'middle' },
                            { field: 'id', title: '编号', align: 'center', valign: 'middle' },
                            { field: 'name', title: '类型', align: 'center', valign: 'middle' },
                            { field: 'workspace', title: '借款概要', align: 'left', valign: 'top' },
                            { field: 'workspace2', title: '来源', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款利率', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '借款周期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '收录日期', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '过期时间', align: 'left', valign: 'top' },
                            { field: 'workspace3', title: '状态', align: 'left', valign: 'top' }, {
                                field: 'flag',
                                title: '操作',
                                align: 'center',
                                valign: 'middle',
                                width: optColWidth,
                                formatter: flagFormatter,
                                events: {
                                    'click [name="btn-view"]': view,
                                    'click [name="btn-edit"]': edit,
                                    'click [name="btn-submit"]': submit,
                                    'click [name="btn-pass"]': auditPass,
                                    'click [name="btn-refuse"]': auditRefuse,
                                    'click [name="btn-cancel"]': auditCancel,
                                    'click [name="btn-delete"]': deleteRow
                                }
                            }
                        ]
                    }
                };

                function flagFormatter(value, row, index) {
                    return buttons.join('');
                }

                function view(e, value, row, index) {
                    console.log('view');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function edit(e, value, row, index) {
                    console.log('edit');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function submit(e, value, row, index) {
                    console.log('submit');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditPass(e, value, row, index) {
                    console.log('pass');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditRefuse(e, value, row, index) {
                    console.log('refuse');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditCancel(e, value, row, index) {
                    console.log('cancel');
                    e.stopPropagation();
                    e.preventDefault();
                }

                function deleteRow(e, value, row, index) {
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
                            }

                            $scope.ok = function() {
                                delUser(item.id, $scope, $modalInstance);
                                return true;
                            }
                        }
                    });
                    e.stopPropagation();
                    e.preventDefault();
                };

            })();

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

            var pageChange = function(num, size) {
                console.log('page change');
            };
        }
    ];
});