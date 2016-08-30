define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $http, $timeout, $modal, $state, $filter, assetService, metaService, toaster) {

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
                        '<button name="btn-submit" class="btn btn-success btn-xs btn-transparent m-r-5" title="提交到待审核资产库"><i class="fa fa-minus-circle"></i></button>',
                        '<button name="btn-edit" class="btn btn-info btn-xs btn-transparent m-r-5" title="修改资产信息"><i class="fa fa-edit"></i></button>',
                        '<button name="btn-delete" class="btn btn-danger btn-xs btn-transparent" title="删除"><i class="fa fa-times"></i></button>'
                    ];
                    optColWidth = 120;
                    showAddBtn = true;
                    break;
                case 'asset.info.todo':
                    status = 0;
                    action = 'todo';
                    title = '未评审资产库';
                    buttons = [
                        '<button name="btn-pass" class="btn btn-success btn-xs btn-transparent m-r-5" title="审核通过"><i class="fa fa-check"></i></button>',
                        '<button name="btn-refuse" class="btn btn-warning btn-xs btn-transparent m-r-5" title="审核不通过"><i class="fa fa-minus-circle"></i></button>',
                        '<button name="btn-delete" class="btn btn-danger btn-xs btn-transparent" title="删除"><i class="fa fa-times"></i></button>'
                    ];
                    optColWidth = 100;
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
                data: { status: status }
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
                },
                search: search,
                reset: function() {
                    $scope.listVM.condition = angular.copy(defaultCondition);
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

            function search() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

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
                initMeta();
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
                            { field: 'loanRemark', title: '借款概要', formatter: loanRemarkFormatter },
                            { field: 'source', title: '来源' }, {
                                field: 'loanRate',
                                title: '借款利率',
                                formatter: function(value) {
                                    return value ? value + '%' : '';
                                }
                            }, {
                                field: 'loanTermCount',
                                title: '借款周期',
                                formatter: function(value) {
                                    return value ? value + '天' : ''
                                }
                            },
                            { field: 'createTime', title: '收录日期' },
                            { field: 'loanDate', title: '过期时间', formatter: dateFormatter },
                            { field: 'status', title: '状态', formatter: statusFormatter }, {
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
                                    'click [name="btn-pass"]': verifyPass,
                                    'click [name="btn-refuse"]': verifyRefuse,
                                    'click [name="btn-cancel"]': verifyCancel,
                                    'click [name="btn-delete"]': deleteRow
                                }
                            }
                        ]
                    }
                };

                function assetTypeFormatter(value, row, index) {
                    return '车贷';
                }

                function loanRemarkFormatter(value, row, index) {
                    return row.name + ', 借款' + (row.amount || 0) + '元, 用于' + (row.loanUse || '');
                }

                function dateFormatter(value, row, index) {
                    return $filter('exDate')(value);
                }

                function statusFormatter(value, row, index) {
                    return $filter('meta')(value, $scope.listVM.assetStatusList);
                }

                function flagFormatter(value, row, index) {
                    return buttons.join('');
                }

                function view(e, value, row, index) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                function edit(e, value, row, index) {
                    $state.go('asset.info.edit', { id: row.id });
                }

                function submit(e, value, row, index) {
                    verify(row.id, 0, '确定提交该资产到待审核？');
                }

                function verifyPass(e, value, row, index) {
                    verify(row.id, 1, '确定审核通过该资产？');
                }

                function verifyRefuse(e, value, row, index) {
                    verify(row.id, 3, '确定审核不通过该资产？');
                }

                function verifyCancel(e, value, row, index) {
                    verify(row.id, 0, '确定取消审核该资产？');
                }

                function verify(id, status, text) {
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
                                $scope.confirmData.processing = true;
                                assetService.verifyAsset(id, status).then(function(res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '操作成功！');
                                        search();
                                        $modalInstance.dismiss();
                                    } else
                                        toaster.pop('error', res.msg);
                                    $scope.confirmData.processing = false;
                                }, function(err) {
                                    toaster.pop('error', '服务器连接失败！');
                                    $scope.confirmData.processing = false;
                                });
                                return true;
                            }
                        }
                    });
                }

                function deleteRow(e, value, row, index) {
                    var text = "确定删除该资产？";
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
                                assetService.asset.delete({ id: row.id }).$promise.then(function(res) {
                                    if (res.code == 200) {
                                        toaster.pop('success', '删除成功！');
                                        search();
                                        $modalInstance.dismiss();
                                    } else
                                        toaster.pop('error', '服务器连接失败！');
                                }, function(err) {
                                    toaster.pop('error', '服务器连接失败！');
                                    $scope.confirmData.processing = false;
                                });
                                return true;
                            }
                        }
                    });
                    e.stopPropagation();
                    e.preventDefault();
                };

            })();

            function initMeta() {
                metaService.getMeta('ZCZT', function(items) {
                    $scope.listVM.assetStatusList = items;
                });
            }
        }
    ];
});
