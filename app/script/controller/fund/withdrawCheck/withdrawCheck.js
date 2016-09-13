define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$state', '$modal', 'fundService', 'toaster', function($scope, $http, metaService, $filter, $timeout, $state, $modal, fundService, toaster) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
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

        function initMetaData() {
            metaService.getMeta('AQDJ', function(data) {
                $scope.listView.securityLevel = data;
            });
            metaService.getMeta('TXSHZT', function(data) {
                $scope.listView.status = data;
            });
            metaService.getMeta('CZLY', function(data) {
                $scope.listView.operateOrigin = data;
            });
            metaService.getMeta('TXQD', function(data) {
                $scope.listView.exeChannel = data;
            });
            metaService.getProvinces(function(res) {
                $scope.listView.bankProvince = res;
            });
            metaService.getCities(function(res) {
               $scope.listView.bankCity=res;
            });
        }
        initMetaData();

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawCheckTable');
        });


        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listView.condition;
            $scope.listView.condition.requestDateStart=$filter('exDate')($scope.listView.condition.requestDateStart, 'yyyy-MM-dd');
            $scope.listView.condition.requestDateEnd=$filter('exDate')($scope.listView.condition.requestDateEnd, 'yyyy-MM-dd');
            condition.status = "R";
            var queryCondition = { "data": condition, "paginate": paganition };
            fundService.withdrawListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsWithdrawCheckTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
                    sidePagination: "server",
                    columns: [{
                        field: '',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '提现编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'requestDatetime',
                        title: '申请时间',
                        formatter: dateFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'investorId',
                        title: '申请人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'name',
                        title: '申请人',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCode',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankProvince',
                        title: '省份',
                        formatter: provinceFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankCity',
                        title: '城市',
                        formatter: cityFormatter,
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
                        formatter: channelFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'operateOrigin',
                        title: '操作来源',
                        align: 'center',
                        formatter: operateFormatter,
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
                        field: 'balance',
                        title: '账户余额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'freeBalance',
                        title: '可用金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'securityLevel',
                        title: '安全等级',
                        formatter: securityFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter: statusFormatter,
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

            function dateFormatter(value) {
                return $filter('exDate')(value, "yyyy-MM-dd HH:mm:ss");
            }

            function channelFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.exeChannel);
            }

            function provinceFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankProvince);
            }

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankCity);
            }

            function operateFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.operateOrigin);
            }

            function securityFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.securityLevel);
            }

            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.status);
            }

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                ];
                return btnHtml.join('');
            }
        })();
        //单一审核
        function detailCheck(e, value, row, index) {
            var exeChannel = $scope.listView.exeChannel;
            var securityLevel = $scope.listView.securityLevel;

            $modal.open({
                templateUrl: 'view/fund/withdrawCheck/checkOne.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.checkOneVM = {};
                    (function getDetail() {
                        fundService.withdrawDetailLabel.get({ id: row.id }).$promise.then(function(res) {
                            $scope.checkOneVM = res.data;
                            $scope.checkOneVM.exeChannel=$filter('meta')(res.data.exeChannel, exeChannel);
                            $scope.checkOneVM.securityLevel=$filter('meta')(res.data.securityLevel, securityLevel);

                        });
                    })();
                    $scope.cancel = function(id) {
                        var id = $scope.checkOneVM.id;
                        var ids = id.toString();
                        var data = { ids: ids, memo: $scope.checkOneVM.memo };
                        fundService.refuseWithdraw(data).then(function(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '提现请求拒绝成功！');
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
                        fundService.approveWithdraw({ ids: $scope.checkOneVM.id, memo: $scope.checkOneVM.memo }).then(function(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '提现请求批准成功！');
                                $modalInstance.dismiss();
                                search();
                            } else
                                toaster.pop('error', res.msg);
                        }, function(err) {
                            toaster.pop('error', '服务器连接失败！');
                        });
                        return true;
                    };
                    $scope.close = function() {
                        $modalInstance.dismiss();
                    }
                }
            });
        }
        //批量审核
        $scope.checkRow = function(e, value, row, index) {
            var text = $scope.listView.table.bootstrapTable('getAllSelections');
            var withdrawNum = text.length;
            if (text.length == 0) {
                toaster.pop('error', "请先选择要审核的行");
                return;
            }
            $modal.open({
                templateUrl: 'view/fund/withdrawCheck/check.html',
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
                    $scope.checkVM.withdrawFee = withdrawFee.toFixed(2);

                    var wbIds = text.map(function(item) {
                        withdrawFee += parseFloat(item.serviceFee);
                        return item.id;
                    }).join(',');

                    console.log(typeof wbIds)
                    $scope.cancel = function() {
                        var data = { ids: wbIds, memo: $scope.checkVM.memo };
                        fundService.refuseWithdraw(data).then(function(res) {
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
                        fundService.approveWithdraw({ ids: wbIds, memo: $scope.checkVM.memo }).then(function(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '批量审核批准成功！');
                                $modalInstance.dismiss();
                                search();
                            } else
                                toaster.pop('error', res.msg);
                        }, function(err) {
                            toaster.pop('error', '服务器连接失败！');
                        });
                        return true;
                    };
                    $scope.close = function() {
                        $modalInstance.dismiss();
                    }
                }
            });

        };

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = {};
        };
    }];
});
