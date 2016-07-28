define([], function() {
    return ['$scope', '$http', '$timeout', 'applicationService', function($scope, $http, $timeout, applicationService) {


        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            pageNo: 1,
            pageSize: 10
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition)
        };

        var getData = function(params) {
            $http({
                    url: 'script/data/data1.json',
                    type: 'get'
                })
                .success(function(data) {
                    $timeout(function() {
                        data.forEach(function(item) {
                            item.id = parseInt(Math.random() * 100);
                        });
                        data.sort(function(a, b) {
                            return Math.random() > .5 ? -1 : 1;
                        });
                        params.success({
                            total: 98,
                            rows: data
                        });
                    }, 1000);
                })
                .error(function(err) {});
        };

        (function init() {
            $scope.bsTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: getHeight(),
                    striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    //search: true,
                    showColumns: true,
                    //showRefresh: false,
                    //minimumCountColumns: 2,
                    //clickToSelect: false,
                    //showToggle: true,
                    maintainSelected: true,
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: 'ID',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'name',
                        title: 'Item Name',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace',
                        title: 'Workspace',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace2',
                        title: 'Workspace2',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace3',
                        title: 'Workspace3',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace4',
                        title: 'Workspace4',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace5',
                        title: 'Workspace5',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace6',
                        title: 'Workspace6',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace7',
                        title: 'Workspace7',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace8',
                        title: 'Workspace8',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace9',
                        title: 'Workspace9',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: 'Workspace10',
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
                        // events: flagEvents
                    }]
                }
            };

            function getHeight() {
                var tb = $('#borrowerTable');
                return $(window).height() - tb.offset().top;
            }

            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>'
            }


            // $(window).resize(function() {
            //     $('#borrowerTable').bootstrapTable('resetView', {
            //         height: getHeight()
            //     });
            // });
        })();

        $scope.del = function() {
            console.log('del')
        };

        $scope.search = function() {
            $('#borrowerTable').bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };
    }];
});
