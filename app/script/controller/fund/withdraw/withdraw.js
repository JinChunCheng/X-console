define([], function() {
    return ['$scope', '$http','metaService','$filter', '$timeout', '$modal', 'borrowerService', function($scope, $http,metaService,$filter, $timeout, $modal,borrowerService) {

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
            channel:[{id:1,title:'盒子支付'},{id:2,title:'恒丰银行'}]
        };
        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#accountInfoTable');
            $scope.listView.table = $('#bankListTable');
        });


                   var getDataTable1 = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
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
                            rows: res.data.items[0]
                        });
                    }, 500);
                });
            };
                               var getDataTable2 = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
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

            $scope.bsAccountInfoTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    //height: 100,
                    //striped: true,
                    pagination: false,
                    ajax: getDataTable1,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '借款人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'name',
                        title: '姓名',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace',
                        title: '身份证号码',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace2',
                        title: '手机',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace3',
                        title: '固定电话',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace4',
                        title: '邮箱',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace5',
                        title: '省份',
                        align: 'left',
                        valign: 'top',
                    }]
                }   
            };
            $scope.bsBankListTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    //height: 100,
                    //striped: true,
                    pagination: false,

                    ajax: getDataTable2,
                    //autoLoad: true,
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
                        title: '借款人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'name',
                        title: '姓名',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace',
                        title: '身份证号码',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace2',
                        title: '手机',
                        align: 'left',
                        valign: 'top',
                    }, {
                        field: 'workspace3',
                        title: '固定电话',
                        align: 'left',
                        valign: 'top',
                    }]
                }   
            };

        })();

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

    }];
});
