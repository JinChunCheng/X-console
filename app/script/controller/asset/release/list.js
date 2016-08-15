define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $timeout, $modal, $state, borrowerService) {

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
                condition: angular.copy(defaultCondition),
                table: null,
                add: function() {
                    console.log('add');
                    $state.go('asset.release.add');
                },
                edit: function(id) {
                    $state.go('asset.release.edit', { id: id });
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#releaseTable');
            });


            var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
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
                        columns: [{
                            field: 'state',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle'
                        }, {
                            field: 'id',
                            title: '资产ID',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'name',
                            title: '资产类型',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace',
                            title: '资产来源',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace2',
                            title: '借款人',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '借款金额/投标金额',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '资金用途',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '借款利率',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '借款周期',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '理财利率',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '投标截止日期',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '还款方式',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '投放渠道',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '创建时间',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '状态',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            valign: 'middle',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-danger': deleteRow,
                                'click .btn-primary': editRow
                            }
                        }]
                    }
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function deleteRow(e, value, row, index) {
                var text = "确定删除此记录？";
                //text = JSON.stringify($scope.listVM.table.bootstrapTable('getSelections'));
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    //backdrop: true,
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
            };

            function editRow(e, value, row, index) {
                $state.go('asset.release.edit', { id: row.id });
            }

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
