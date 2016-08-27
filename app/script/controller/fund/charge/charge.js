define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'toaster', 'fundService', function($scope, $http, metaService, $filter, $timeout, $modal, $state, toaster, fundService) {



        $scope.listView = {
            condition: {},
            table: null,
            type: [{ id: 1, title: '网银' }, { id: 2, title: '委托扣款' }, { id: 3, title: 'POS收款' }, { id: 4, title: '调账处理' }, { id: 5, title: '奖励' }, { id: 6, title: '其他' }],
            status: [{ id: 1, title: '待支付' }, { id: 2, title: '成功' }, { id: 3, title: '取消' }, { id: 4, title: '失败' }, { id: 5, title: '在途' }],
            channel: [{ id: 1, title: 'POS刷卡' }, { id: 2, title: '银联转账' }, { id: 3, title: '其他' }]
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#chargeListTable');
        });


        var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            //var data = { "investorId": $scope.listView.condition.investorId, "id": $scope.listView.condition.id, 'name': $scope.listView.condition.name, 'paymentType': $scope.listView.condition.paymentType, 'externalRef': $scope.listView.condition.externalRef,'status': $scope.listView.condition.status,'startDateTime':$scope.listView.condition.startDay,'endDateTime':$scope.listView.condition.endDay,'chargeStartDateTime':$scope.listView.condition.chargeStartDay,'chargeEndDateTime':$scope.listView.condition.chargeEndDay,'paymentNum':$scope.listView.condition.paymentNum,'paymentOrderNo':$scope.listView.condition.paymentOrderNo, 'paymentChannel':$scope.listView.condition.paymentChannel};
            var data=$scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            fundService.chargeListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsChargeListTableControl = {
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
                        field: 'rechargeVO.id',
                        title: '充值编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.investorId',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        //TODO  rechargeVO里面缺少
                        field: 'investorVO.name',
                        title: '投资人姓名',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        //TODO  rechargeVO里面缺少
                        field: 'investorVO.operateOrigin',
                        title: '注册来源',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.amount',
                        title: '充值金额',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.serviceFee',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.actualSettlementAmount',
                        title: '结算金额',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.accountSubjectCode',
                        title: '账户科目',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.paymentType',
                        title: '充值类型',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.rechargeVO.paymentChannel',
                        title: '充值渠道',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.rechargeVO.bankCode',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.rechargeVO.bankCard',
                        title: '银行卡号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.rechargeVO.paymentOrderNo',
                        title: '支付序号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.externalRef',
                        title: '外部参考编号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.finishDatetime',
                        title: '完成时间',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.op',
                        title: '操作员',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'rechargeVO.memo',
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
                            'click .btn-primary': detail,
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function detail(e, value, row, index) {
            $state.go('fund.charge.detail', { id: row.rechargeVO.id });
        }

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };

    }];
});
