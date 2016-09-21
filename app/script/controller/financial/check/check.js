define([], function () {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster', function ($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {

        var defaultCondition = {
            data: {},
            paginate: {
                pageNum: 1,
                pageSize: 10
            }
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            search: function(){
                $scope.listView.table.bootstrapTable('refresh');
            },
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            },
            checkRow: function() {
                var selected = $scope.listView.table.bootstrapTable('getSelections');
                if (!selected || selected.length === 0) {
                    toaster.pop('error', '未选中行！');
                    return;
                }
                else{
                    var text = "您确定执行批量到账处理吗？";
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
                                return item.promptId;
                            }).join(',');
                            $scope.ok = function() {
                                var valid = true;
                                selected.map(function(item) {
                                    if(item.status != 'W') {
                                       /* toaster.pop('error', '待审核状态才能确认到账！');
                                        $modalInstance.dismiss();
                                        refreshTable();*/
                                        valid = false;
                                    }

                                });


                                if(valid){
                                    //return false;
                                    financialService.financialCheckList(ids).then(function(res) {
                                        if(res.code == 200) {
                                            toaster.pop('success', '操作成功！');
                                            $modalInstance.dismiss();
                                            refreshTable();
                                        }
                                        else
                                            toaster.pop('error', res.msg);
                                            refreshTable();
                                    }, function(err) {
                                        toaster.pop('error', '服务器连接失败！');
                                    });
                                }else{
                                     toaster.pop('error', '待审核状态才能确认到账！');
                                     $modalInstance.dismiss();
                                     refreshTable();
                                }


                                    return true;
                            }
                        }
                    });
                };
            }
        };
        function initMetaData() {
            metaService.getMeta('SHZT', function(items) {
                $scope.listView.status = items;
            });
        }
        initMetaData();
        function refreshTable(){
            $scope.listView.table.bootstrapTable('refresh');
        }
        $scope.$on('$viewContentLoaded', function () {
            $scope.listView.table = $('#promptCheckTable');
        });

        var getData = function (params) {
            var paganition = {pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort};
            var condition = $scope.listView.condition;
            condition.paginate = paganition;
            financialService.promptListTable.query({where: JSON.stringify(condition)}).$promise.then(function (res) {
                res.data = res.data || {paginate: paganition, items: []};
                res.data.paginate = res.data.paginate || {totalCount: 0};
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {

            $scope.bsPromptCheckTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [
                        {field: 'state', checkbox: true},
                        {field: 'promptId', title: '催款标识', align: 'center'},
                        {field: 'status', title: '审核状态',align: 'center',formatter:statusFormatter},
                        {field: 'auditOp', title: '审核员工'},
                        {field: 'auditDatetime', title: '审核时间', formatter: timeFormatter, align: 'center'},
                        {field: 'borrowerName', title: '姓名', align: 'center'},
                        {field: 'mobile', title: '手机', align: 'center'},
                        {field: 'email', title: '邮箱', align: 'center'},
                        {field: 'promptDate', title: '催款日期', align: 'center', formatter: timerFormatter},
                        {field: 'paymentDueDate', title: '最后还款日期', align: 'center',formatter: timerFormatter},
                        {field: 'principal', title: '当期本金', align: 'center'},
                        {field: 'loanInterest', title: '贷款利息', align: 'center'},
                        {field: 'serviceFee', title: '当期手续费', align: 'center'},
                        {field: 'latePaymentFee', title: '延期回款费用', align: 'center'},
                        {field: 'totalPayment', title: '总回款', align: 'center'},
                        {field: 'createDatetime', title: '创建时间', align: 'center',formatter: timeFormatter},
                        {
                            field: 'flag', title: '操作', align: 'center', clickToSelect: false, formatter: flagFormatter,
                            events: {
                                'click .btn-info': edit
                            }
                        }]
                }
            };
            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            };
            function timerFormatter(value, row, index) {
                return $filter('exDate')(value).slice(0,10);
            };
            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.status);
            }
            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

            function edit(e, value, row, index) {
                showDetail(row.promptId);
                e.stopPropagation();
                e.preventDefault();
            }

        })();

        function showDetail(id) {

            $modal.open({
                templateUrl: 'view/financial/check/detail.html',
                size: 'lg',
                controller: function ($scope, $modalInstance) {
                    $scope.detailView = {
                        data:{},
                        table:null
                    };
                    function getLikeList(id) {
                        console.log(id)
                        financialService.promptLikeListTable.get({id: id}).$promise.then(function (res) {
                            console.log(res);
                            $scope.detailView.data = res.data;
                        });
                    }
                    getLikeList(id);
                    var getData = function (params) {
                        var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                        var data = $scope.detailView.data;

                        data.paginate = paganition;

                        financialService.promptLikeListTable.query({id:id}).$promise.then(function(res) {
                            res.data = res.data || { paginate: paganition, items: [] };
                            res.paginate = res.paginate || { totalCount: 0 };
                            params.success({
                                rows: res.data
                            });
                        })
                    }
                    $scope.$on('$viewContentLoaded', function() {
                        $scope.detailView.table = $('#financialListTable');
                    });

                    $scope.bsFinancialListTableControl = {
                        options: {
                            cache: false,
                            //pagination: true,
                            //pageSize: 10,
                            //pageList: [10, 25, 50, 100, 200],
                            ajax: getData,
                            sidePagination: "server",
                            columns: [
                                {field: 'promptId', title: '催款标识', align: 'center', valign: 'middle'},
                                {field: 'promptDate', title: '催款日期', align: 'center', valign: 'middle'},
                                {field: 'projectId', title: '项目标识', align: 'center'},
                                {field: 'projectName', title: '项目名称', align: 'center'},
                                {field: 'periodNo', title: '期数', align: 'center'},
                                {field: 'borrowerName', title: '借款人名称', align: 'center'},
                                {field: 'paymentDueDate', title: '最后还款日', align: 'center'},
                                {field: 'principal', title: '当期本金', align: 'center'},
                                {field: 'loanInterest', title: '贷款利息', align: 'center'},
                                {field: 'serviceFee', title: '当期手续费', align: 'center'},
                                {field: 'latePaymentFee', title: '延期回款费用', align: 'center'},
                                {field: 'totalPayment', title: '总回款', align: 'center'},
                                {field: 'createDatetime', title: '创建时间', align: 'center', formatter: timeFormatter}]
                        }
                    };
                    function timeFormatter(value, row, index) {
                        return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                        return false;
                    };
                }

            });
        }

        $scope.search = function () {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function () {
            $scope.listView.condition = angular.copy(defaultCondition);
        };

    }];
});
