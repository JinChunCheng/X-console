define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'borrowerService', function($scope, $http, $timeout, $modal,borrowerService) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            pageNum: 1,
            pageSize: 10
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            batchUpload: function() {
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
                else {
                    var text = "是否执行出款操作？";
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
                };
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
            $scope.listView.table = $('#endBiddingCashTable');
        });
        var getData = function(params) {
            borrowerService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
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

            $scope.bsEndBiddingCashTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: 650,
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    //search: true,
                    //showColumns: true,
                    //showRefresh: false,
                    //minimumCountColumns: 2,
                    //clickToSelect: false,
                    //showToggle: true,
                    //maintainSelected: true,
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    },{
                        field: 'workspace',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace2',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace3',
                        title: '出款项目',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace4',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace5',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace6',
                        title: '银行',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace7',
                        title: '银行户名',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace8',
                        title: '银行账号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }]
                }
            };
            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();


        $scope.del = function() {
            console.log('del');
        };

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };

        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
