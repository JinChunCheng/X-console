define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', 'toaster', 'fundService', function($scope, $http, metaService, $filter, $timeout, $modal, toaster, fundService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
            status: [{ id: 1, title: '申请' }, { id: 2, title: '批准' }, { id: 3, title: '拒绝' }],
            search: function() {
                search();
            },
            reset: function reset() {
                $scope.listView.condition = {};
            },

        };

        function search() {
            $scope.listView.table.bootstrapTable('refresh')
        }
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#fallbackCheckTable');
        });
        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            fundService.backCheckTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };
        (function init() {

            $scope.bsFallbackCheckTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
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
                        valign: 'middle',
                    }, {
                        field: 'requestDatetime',
                        title: '申请时间',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'investorId',
                        title: '申请人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'investorName',
                        title: '申请人',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'amount',
                        title: '申请金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'serviceFee',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'factAmount',
                        title: '到账金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCode',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'branchCode',
                        title: '开户支行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankProvince',
                        title: '省份',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCity',
                        title: '城市',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankAccount',
                        title: '银行卡号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'exeChannel',
                        title: '提现渠道',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'referenceId',
                        title: '提现编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'operateOrigin',
                        title: '操作来源',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'memo',
                        title: '备注',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-info': detailCheck

                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                ];
                return btnHtml.join('');
            }
        })();

        function detailCheck(e, value, row, index) {
            $modal.open({
                templateUrl: 'view/fund/fallback/checkOne.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.checkOneVM = {};
                    (function getDetail() {
                        fundService.backCheckOneDetail.get({ id: row.id }).$promise.then(function(res) {
                            $scope.checkOneVM = res.data.result;
                        });
                    })();
                    $scope.cancel = function(id) {
                        var data= {withdrawBackId:$scope.checkOneVM.withdrawBackId,op: "靳春城", memo: $scope.checkOneVM.memo, status: "D"};
                            fundService.backCheckOne.update({id: row.id}, data).$promise.then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '提现回退请求拒绝成功！');
                                    $modalInstance.dismiss();
                                    search();
                                } else
                                    toaster.pop('error', res.msg);
                            }, function(err) {
                                toaster.pop('error', '服务器连接失败！');
                            });
                        return true;
                    };

                    $scope.ok = function() {
                            fundService.batchUpdatePlatform({ withdrawBackId: $scope.checkOneVM.withdrawBackId, op: "靳春城", memo: $scope.checkOneVM.memo, status: "A" },"PUT").then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '审核成功！');
                                } else
                                    toaster.pop('error', res.msg);
                            }, function(err) {
                                toaster.pop('error', '服务器连接失败！');
                            });
                        $modalInstance.dismiss();
                        search();
                        return true;
                    };
                }
            });

        };
        $scope.checkRow = function(e, value, row, index) {
            var text = $scope.listView.table.bootstrapTable('getAllSelections');
            var withdrawNum = text.length;
            $modal.open({
                templateUrl: 'view/fund/fallback/check.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.checkVM = {};
                    //提现笔数
                    $scope.checkVM.withdrawNum = withdrawNum;
                    //提现金额
                    var withdrawAmount = 0;
                    text.forEach(function(item) {
                        withdrawAmount += parseFloat(item.amount);
                    });
                    $scope.checkVM.withdrawAmount = withdrawAmount.toFixed(2);
                    //提现服务费
                    var withdrawFee = 0;
                    text.forEach(function(item) {
                        withdrawFee += parseFloat(item.serviceFee);
                    });
                    $scope.checkVM.withdrawFee = withdrawFee.toFixed(2);
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    };

                    $scope.ok = function() {
                            var ids = $scope.listVM.checked.map(function(item) {
                                return item.id;
                            }).join(',');
                            fundService.batchUpdatePlatform({ withdrawBackIds: ids, op: "靳春城", memo: $scope.checkOneVM.memo, status: "A" },"PUT").then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '批量审核成功！');
                                } else
                                    toaster.pop('error', res.msg);
                            }, function(err) {
                                toaster.pop('error', '服务器连接失败！');
                            });
                        $modalInstance.dismiss();
                        search();
                        return true;
                    };
                }
            });

        };
    }];
});
