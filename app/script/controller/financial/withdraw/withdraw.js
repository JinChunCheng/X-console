define([], function() {
    return ['$scope', '$http', 'metaService','$timeout', '$modal', 'financialService', 'toaster',
        function($scope, $http,metaService, $timeout, $modal,financialService, toaster) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            fundOutType: 'WDR',
            sorting: 'update_time desc',

            //exeChannel为必选项 值默认为IBOXPAY
            exeChannel: 'IBOXPAY'
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            //channel:[{code:"IBOXPAY",title:'盒子支付'},{code:"EGBANK",title:'恒丰银行'}],
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
                else{
                    var text = "是否执行出款操作？";
                    var exeChannel = $scope.listView.condition.exeChannel;
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
                                financialService.withdrawAccept(ids, exeChannel).then(function(res) {
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
            function initMetaData() {
                metaService.getMeta('TXQD', function(data) {
                    $scope.listView.exeChannel = data;
                });
            }
            initMetaData();

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
        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;


            var queryCondition = { "data":data,"paginate": paganition };
            financialService.withdrawCashTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items || []
                });
            });
        };
        (function init() {
            $scope.bsWithdrawCashTableControl = {
                options: {
                    cache: false,
                    height: 650,
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
                        valign: 'middle',
                        formatter: exeChannelFormatter
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
            function exeChannelFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.channel);
            };
            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();
        function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };
    }];
});
