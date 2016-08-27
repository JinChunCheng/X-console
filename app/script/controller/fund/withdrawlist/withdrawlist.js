define([], function() {
    return ['$scope', '$http','metaService','$filter', '$timeout', '$modal','$state','toaster' ,'fundService', function($scope, $http,metaService,$filter, $timeout, $modal,$state,toaster, fundService) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
            status: [{id:1,title:'申请'}, {id:2,title:'批准'}, {id:3,title:'拒绝'}, {id:4,title:'执行完成'}, {id:5,title:'回退'}],
            operSource: [{id:1,title:'管理系统'}, {id:2,title:'钱盒'}]
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawListTable');
        });


         var getDataTable = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            //var data = { "investorId": $scope.listView.condition.investorId, "id": $scope.listView.condition.id, 'name': $scope.listView.condition.name, 'paymentType': $scope.listView.condition.paymentType, 'externalRef': $scope.listView.condition.externalRef,'status': $scope.listView.condition.status,'startDateTime':$scope.listView.condition.startDay,'endDateTime':$scope.listView.condition.endDay,'chargeStartDateTime':$scope.listView.condition.chargeStartDay,'chargeEndDateTime':$scope.listView.condition.chargeEndDay,'paymentNum':$scope.listView.condition.paymentNum,'paymentOrderNo':$scope.listView.condition.paymentOrderNo, 'paymentChannel':$scope.listView.condition.paymentChannel};
            var data=$scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            fundService.withdrawListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsWithdrawListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getDataTable,
                    sidePagination: "server",
                    columns: [{
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'investorId',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'name',
                        title: '投资人',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'amount',
                        title: '申请金额',
                        align: 'center', 
                        valign: 'middle',
                    }, {
                        field: 'ferviceFee',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        //TODO 接口里面缺少
                        field: 'factAmount',
                        title: '到账金额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'exeChannel',
                        title: '提现渠道',
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
                        field: 'requestDatetime',
                        title: '申请时间',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'opApprove',
                        title: '审核人',
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
                            'click .btn-primary': detail,
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-arrow-right"></i></button>',
                ];
                return btnHtml.join('');
            }

        })();

        function detail(e, value, row, index) {
            $state.go('fund.withdrawlist.detail',{id:row.id});
        }

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };

    }];
});
