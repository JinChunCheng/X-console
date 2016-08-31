define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'borrowerService', function($scope, $http, $timeout, $modal, borrowerService) {

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
            table: null
        };

        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#endTenderCheckTable');
        });


        var getData = function(params) {
            borrowerService.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
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

            $scope.bsEndTenderCheckTableControl = {
                options: {
                    cache: false,
                    height: 840,
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [
                    { field: 'projectId', title: '项目编号' }, 
                    { field: 'projectName', title: '项目名' },
                    { field: '', title: '产品类型'},
                    {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn': function(e, value, row, index) {
                                var text = "确定删除此记录？";
                                $modal.open({
                                    templateUrl: 'view/shared/confirm.html',
                                    size: 'sm',
                                    // backdrop: true,
                                    controller: function($scope, $modalInstance) {
                                        $scope.confirmData = {
                                            text: text,
                                            processing: false
                                        };
                                        $scope.cancel = function() {
                                            $modalInstance.dismiss();
                                            return false;
                                        };

                                        $scope.ok = function() {
                                            delUser(item.id, $scope, $modalInstance);
                                            return true;
                                        };
                                    }
                                });

                            }
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };
    }];
});
