define([], function() {
    return ['$scope', '$http','metaService','$state', '$timeout', '$modal', 'financialService',"toaster",'$filter',
        function($scope, $http,metaService, $state,$timeout, $modal,financialService,toaster,$filter)  {

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
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            },
            check: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    toaster.pop('error', '未选中行！');
                    return;
                }
                else {
                    var selectedId = selected[0].id;
                    $state.go('financial.POS.detail', {id: selectedId});}
            }
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        function initMetaData() {
            metaService.getMeta('DZZT', function(data) {
                $scope.listView.status = data;
            });
        }
        initMetaData();

        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#POSchargeReconTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.POSchargeReconTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                $timeout(function() {
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                }, 500);
            });
        };

        (function init() {

            $scope.bsPOSchargeReconTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true
                    }, {
                        field: 'settleDatetime',
                        title: '清算日期',
                        formatter: timeFormatter
                    }, {
                        field: 'tradeType',
                        title: '交易类型'
                    }, {
                        field: 'workspace',
                        title: '真实姓名'
                    }, {
                        field: 'tradeDatetime',
                        title: '交易日期',
                        formatter: timeFormatter
                    }, {
                        field: 'merchantNo',
                        title: '商户编号'
                    }, {
                        field: 'investorId',
                        title: '投资人编号'
                    }, {
                        field: 'investorName',
                        title: '投资人姓名'
                    }, {
                        field: 'amount',
                        title: '交易金额'
                    }, {
                        field: 'tradeNo',
                        title: '交易流水号'
                    }, {
                        field: 'serviceAmount',
                        title: '手续费'
                    }, {
                        field: 'batchNo',
                        title: '批次号'
                    }, {
                        field: 'depositId',
                        title: '充值流水'
                    }, {
                        field: 'status',
                        title: '状态'
                    }, {
                        field: 'createDate',
                        title: '创建时间',
                        formatter: timeFormatter
                    }, {
                        field: 'flag',
                        title: '操作',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn': function(e, value, row, index) {
                                var text = "确定删除此记录？";
                                // var text = JSON.stringify($scope.listView.table.bootstrapTable('getAllSelections'));
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

        function timeFormatter(value, row, index) {
            return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
        };



        function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        //$scope.reset = function() {
        //    $scope.listView.condition = angular.copy(defaultCondition);
        //    console.log('aaa');
        //};
        //
        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
