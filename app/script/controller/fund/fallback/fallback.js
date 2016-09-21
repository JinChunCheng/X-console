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
            search: function() {
                search();
            },
            reset: function reset() {
                $scope.listView.condition = {};
            },
        };

        function initMetaData() {
            metaService.getMeta('TXSHZT', function(data) {
                $scope.listView.status = data;
            });
            metaService.getProvinces(function(res) {
                $scope.listView.provinces = res;
            });
            metaService.getMeta('TXQD', function(data) {
                $scope.listView.exeChannel = data;
            });
            metaService.getMeta('CZLY', function(data) {
                $scope.listView.operateOrigin = data;
            });
            metaService.getCities(function(res) {
                $scope.listView.bankCity = res;
            });
        };
        initMetaData();

        function search() {
            $scope.listView.table.bootstrapTable('refresh')
        }
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#fallbackCheckTable');
        });
        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listView.condition;
            $scope.listView.condition.requestDateStart = $filter('exDate')($scope.listView.condition.requestDateStart, 'yyyy-MM-dd');

            $scope.listView.condition.requestDateEnd = $filter('exDate')($scope.listView.condition.requestDateEnd, 'yyyy-MM-dd');
            var queryCondition = { "data": condition, "paginate": paganition };
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
                        formatter: dateFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter: statusFormatter,
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
                        field: 'bankName',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'bankBranch',
                        title: '开户支行名称',
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
                        formatter: exeChannelFormatter,
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
                        formatter: operateOriginFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'declareMemo',
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

            function statusFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.status)
            };

            function dateFormatter(value, row, index) {
                return $filter("exDate")(value, 'yyyy-MM-dd HH:mm:ss')
            };

            function provinceFormatter(value, row, index) {
                return $filter("metaPCA")(value, $scope.listView.provinces)
            };

            function exeChannelFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.exeChannel)
            };

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankCity);
            }

            function operateOriginFormatter(value, row, index) {
                return $filter("meta")(value, $scope.listView.operateOrigin)
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-check"></i></button>',
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
                    $scope.checkOneMeta = {};


                    (function getDetail() {
                        fundService.backCheckOneDetail.get({ id: row.id }).$promise.then(function(res) {
                            $scope.checkOneVM = res.data.result;
                        });
                    })();

                    function initMetaData1() {
                        metaService.getMeta('TXQD', function(data) {
                            $scope.checkOneMeta.exeChannel = data;
                            console.log($scope.checkOneMeta.exeChannel)
                        });
                    };
                    initMetaData1();

                    $scope.cancel = function(id) {
                        var data = { withdrawBackId: $scope.checkOneVM.withdrawBackId, memo: $scope.checkOneVM.memo, status: "D" };
                        fundService.fallbackCheckOne(data, "POST").then(function(res) {
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
                        fundService.fallbackCheckOne({ withdrawBackId: $scope.checkOneVM.withdrawBackId, memo: $scope.checkOneVM.memo, status: "A" }, "POST").then(function(res) {
                            if (res.code == 200) {
                                toaster.pop('success', '审核成功！');
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
        //批量审核
        $scope.checkRow = function(e, value, row, index) {
            var text = $scope.listView.table.bootstrapTable('getAllSelections');
            var withdrawNum = text.length;
            if (text.length == 0) {
                toaster.pop('error', "请先选择要审核的行");
                return;
            }
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
                    var wbIds = text.map(function(item) {
                        withdrawFee += parseFloat(item.serviceFee);
                        return item.id;
                    }).join(',');
                    $scope.checkVM.withdrawFee = withdrawFee.toFixed(2);
                    $scope.cancel = function() {
                        var data = { withdrawBackIds: wbIds, memo: $scope.checkVM.memo, status: "D" };
                        fundService.fallbackCheckRows(data, "POST").then(function(res) {
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
                        var ids = text.map(function(item) {
                            return item.id;
                        }).join(',');
                        fundService.fallbackCheckRows({ withdrawBackIds: ids, memo: $scope.checkVM.memo, status: "A" }, "POST").then(function(res) {
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
    }];
});
