define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'financialService', function($scope, $http, $timeout, $modal,financialService) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            fundOutType: 'WDR',
            sorting: 'update_time desc'
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            channel:[{code:"IBOXPAY",title:'盒子支付'},{code:"EGBANK",title:'恒丰银行'}]
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
            $scope.listView.table = $('#withdrawCashTable');
        });


            //        var getData = function(params) {
            //    //query: {where: JSON.stringify($scope.listVM.condition)}
            //    financialService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
            //        //debugger
            //        $timeout(function() {
            //            res.data.items.forEach(function(item) {
            //                item.id = parseInt(Math.random() * 100);
            //            });
            //            res.data.items.sort(function(a, b) {
            //                return Math.random() > .5 ? -1 : 1;
            //            });
            //            params.success({
            //                total: res.data.paginate.totalCount,
            //                rows: res.data.items
            //            });
            //        }, 500);
            //    });
            //};

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;


            var queryCondition = { "data":data,"paginate": paganition };
            financialService.withdrawCashTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };



        (function init() {

            $scope.bsWithdrawCashTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle'
                    },{
                        field: 'fundOutType',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'exeChannel',
                        title: '出款渠道',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankName',
                        title: '银行',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccountName',
                        title: '银行户名',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccount',
                        title: '银行账号',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'amount',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'statusName',
                        title: '状态',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'projectId',
                        title: '关联ID',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'fundOutCount',
                        title: '出款笔数',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'exeDate',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle'
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();
        $scope.checkRow = function(e, value, row, index) {
            var text = "是否执行出款操作？";
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
                        //delUser(item.id, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

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
