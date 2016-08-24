define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'assetService',
        function($scope, $http, $timeout, $modal, $state, assetService) {

            /**
             * shared controller with more state
             * do different things in different router
             */
            var action = 'draft';
            var title = '资产列表';
            var buttons = [];
            var optColWidth = 120;
            var showAddBtn = false;
            var status = -1;
            switch ($state.current.name) {
                case 'asset.info.draft':
                    status = -1;
                    action = 'draft';
                    title = '资产草稿';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-submit" class="m-r-5">提交</button>',
                        '<a href="" name="btn-edit" class="m-r-5">修改</button>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    optColWidth = 120;
                    showAddBtn = true;
                    break;
                case 'asset.info.todo':
                    status = 0;
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
                    showAddBtn = true;
                    break;
                case 'asset.info.better':
                    status = 1;
                    action = 'better';
                    title = '优质资产库';
                    buttons = [
                        '<a href="" name="btn-view" class="m-r-5">查看</button>',
                        '<a href="" name="btn-cancel" class="m-r-5">取消审核</a>',
                        '<a href="" name="btn-delete" class="m-r-5 text-danger">删除</button>'
                    ];
                    break;
                case 'asset.info.risk':
                    status = 3;
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
                action: action,
                table: null,
                add: function() {
                    $state.go('asset.info.add');
                },
                batchUpload: function() {
                    var selected = $scope.listVM.table.bootstrapTable('getSelections');
                    if (!selected || selected.length === 0) {
                        alert('未选中');
                        return;
                    }
                    alert('已选' + selected.length + "条")
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


            var findAsset = function(params) {
                assetService.findAsset($scope.listVM.condition).then(function(res) {
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.tbControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: findAsset,
                        sidePagination: "server",
                        columns: [
                            { field: 'assetType', title: '类型', formatter: assetTypeFormatter },
                            { field: 'remark', title: '借款概要' },
                            { field: 'source', title: '来源' },
                            { field: 'loanRate', title: '借款利率', formatter: function(value) {
                                    return value ? value + '%' : ''; } }, {
                                field: 'loanTermCount',
                                title: '借款周期',
                                formatter: function(value) {
                                    return value ? value + '天' : ''
                                }
                            },
                            { field: 'createTime', title: '收录日期' },
                            { field: 'expireTime', title: '过期时间' },
                            { field: 'state', title: '状态' }, {
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

                function assetTypeFormatter(value, row, index) {
                    return '车贷';
                }

                function flagFormatter(value, row, index) {
                    return buttons.join('');
                }

                function view(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function edit(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function submit(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditPass(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditRefuse(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function auditCancel(e, value, row, index) {
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
        }
    ];
});
