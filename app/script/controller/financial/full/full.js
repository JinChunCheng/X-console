define([], function() {
    return ['$scope', '$http', '$timeout', '$filter', '$modal', 'financialService', 'metaService','toaster',
        function($scope, $http, $timeout, $filter, $modal,financialService, metaService,toaster) {
        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            fundOutType: 'PRJ',
            sorting: 'update_time desc'
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            },
            batchUpload: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    toaster.pop('error', '未选中行！');
                    return;
                }
                else {
                    var text = "是否执行出款操作？";
                    var ids = $scope.listView.condition.ids;
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
                            var ids = selected.map(function(item) {
                                return item.id;
                            }).join(',');
                            $scope.ok = function() {
                                //delUser(item.id, $scope, $modalInstance);
                                financialService.fullAccept(ids).then(function(res) {
                                    if(res.code == 200) {
                                        toaster.pop('success', '操作成功！');
                                        $modalInstance.dismiss();
                                        search();
                                    }
                                    else
                                        toaster.pop('error', res.msg);
                                }, function(err) {
                                    toaster.pop('error', '服务器连接失败！');
                                });
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
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.endBiddingCashTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                $timeout(function() {
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                }, 500);
            });
        };

        (function init() {
            initMeta();
            $scope.bsEndBiddingCashTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    onPageChange: pageChange,
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
                        field: 'exeDate',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        formatter: timeFormatter
                    }, {
                        field: 'fundOutType',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'projectName',
                        title: '出款项目',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'amount',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                        formatter: statusFormatter
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
                    }]
                }
            };

            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.statusList);
            }
        })();

        function initMeta() {
            metaService.getMeta('CKZT', function(items) {
                $scope.listView.statusList = items;
            });
        }

        function timeFormatter(value, row, index) {
            return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
        }

        function search() {
        $scope.listView.table.bootstrapTable('refresh');
        };
        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
