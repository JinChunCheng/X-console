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
                check: function() {
                    var selected = $scope.listView.table.bootstrapTable('getSelections');
                    if (!selected || selected.length === 0) {
                        var text = "未选中行";
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
                                    $modalInstance.dismiss();
                                    return false;
                                }
                            }
                        });
                        return;
                    }
                    else {showChannelModal();}
                },
                status:[{id:1,title:'等待处理'},{id:2,title:'失败'},{id:3,title:'成功'}],
                edit: function(id) {
                    $state.go('financial.list.edit', { id: id });
                }
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#promptListTable');
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

                $scope.bsPromptListTableControl = {
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
                        },{
                            field: 'id',
                            title: '催款标识',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        },{
                            field: 'workspace',
                            title: '姓名',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace2',
                            title: '手机',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace3',
                            title: '邮箱',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace4',
                            title: '催款日期',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace5',
                            title: '最后还款日期',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace6',
                            title: '当期本金',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace7',
                            title: '贷款利息',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace8',
                            title: '当期手续费',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace9',
                            title: '延期回款费用',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '总回款',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '状态',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '审核状态',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '审核员工',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '审核时间',
                            align: 'center',
                            valign: 'middle',
                            sortable: true
                        }, {
                            field: 'workspace10',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',
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
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>'
                        //,
                        //'<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
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

            function showChannelModal(channel) {
                var title = "催款单明细";
                var dataSourceList = $scope.listVM.dataSourceList;
                $modal.open({
                    templateUrl: 'view/financial/list/check.html',
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

            function editRow(e, value, row, index) {
                $state.go('financial.list.edit', { id: row.id });
            }

            $scope.del = function() {

            };

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

            var pageChange = function(num, size) {

            };
        }
    ];
});
