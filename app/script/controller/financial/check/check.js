define([], function () {
    return ['$scope', '$http', '$timeout', '$modal', '$filter', 'metaService', 'financialService', function ($scope, $http, $timeout, $modal, $filter, metaService, financialService) {

        /**
         * the default search condition
         * @type {Object}
         */
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
            /*check: function () {
             showChannelModal();
             },*/
            status: [{id: 1, title: '待审核'}, {id: 2, title: '已到账'}, {id: 3, title: '已转账'}]
        };

       /* $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };*/

        /**
         * do something after view loaded
         * @param  {string}     event type
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function () {
            $scope.listView.table = $('#promptCheckTable');
        });

        /*   function showChannelModal(channel) {
         var title = "催款单明细";
         var dataSourceList = $scope.listView.dataSourceList;
         $modal.open({
         templateUrl: 'view/financial/list/check.html',
         size: 'md',
         controller: function ($scope, $modalInstance) {

         $scope.channelVM = {
         title: title,
         processing: false,
         dataSourceList: dataSourceList,
         submit: submit,
         cancel: cancel
         };

         function cancel() {
         $modalInstance.dismiss();
         return false;
         }

         function submit() {
         saveChannel(item.id, $scope, $modalInstance);
         return true;
         }
         }
         });
         }*/


        var getData = function (params) {
            var paganition = {pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort};
            var condition = $scope.listView.condition;
            financialService.resource.query({where: JSON.stringify(condition)}).$promise.then(function (res) {
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
                        {field: 'state', checkbox: true, align: 'center', valign: 'middle'},
                        {field: 'id', title: '催款标识', align: 'center', valign: 'middle'},
                        {field: 'workspace', title: '审核状态', align: 'center', valign: 'middle'},
                        {field: 'workspace2', title: '审核员工', align: 'center', valign: 'middle'},
                        {field: 'workspace3', title: '审核时间', align: 'center', valign: 'middle'},
                        {field: 'workspace', title: '姓名', align: 'center', valign: 'middle'},
                        {field: 'workspace2', title: '手机', align: 'center', valign: 'middle'},
                        {field: 'workspace3', title: '邮箱', align: 'center', valign: 'middle'},
                        {field: 'workspace4', title: '催款日期', align: 'center', valign: 'middle'},
                        {field: 'workspace5', title: '最后还款日期', align: 'center', valign: 'middle'},
                        {field: 'workspace6', title: '当期本金', align: 'center', valign: 'middle'},
                        {field: 'workspace7', title: '贷款利息', align: 'center', valign: 'middle'},
                        {field: 'workspace8', title: '当期手续费', align: 'center', valign: 'middle'},
                        {field: 'workspace9', title: '延期回款费用', align: 'center', valign: 'middle'},
                        {field: 'workspace10', title: '总回款', align: 'center', valign: 'middle'},
                        {field: 'workspace10', title: '审核时间', align: 'center', valign: 'middle'},
                        {field: 'workspace10', title: '创建时间', align: 'center', valign: 'middle'},
                        {
                            field: 'flag', title: '操作', align: 'center', clickToSelect: false, formatter: flagFormatter,
                            events: {
                                'click [name="btn-right"]': editRow
                            }
                        }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button name="btn-right" type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

            function editRow(e, value, row, index) {
                showFinancialDetail(row);
                e.stopPropagation();
                e.preventDefault();
            }

        })();

        function showFinancialDetail(promptId) {
            var title = "催款单明细";
            $modal.open({
                templateUrl: 'view/financial/check/detail.html',
                size: 'lg',
                controller: function ($scope, $modalInstance) {
                    $scope.bsFinancialListTableControl = {
                        options: {
                            cache: false,
                            pagination: true,
                            pageSize: 10,
                            pageList: [10, 25, 50, 100, 200],
                            ajax: getData,
                            sidePagination: "server",
                            columns: [
                                {field: 'investmentRepaymentPlanVO.projectId', title: '项目编号', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.projectName', title: '项目名称', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.periodNo', title: '还款期数', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.periodStartDate', title: '当前开始日期', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.periodEndDate', title: '当期结束日期', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.paymentDueDate', title: '最后还款日', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.status', title: '状态', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.principal', title: '当期本金', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.interest', title: '当期利息', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.totalPayment', title: '当期总共应还', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.principalPaid', title: '当期已还本金', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.interestPaid', title: '当期已还利息', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.createDatetime', title: '创建时间', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.updateDatetime', title: '更新时间', align: 'center'},
                                {field: 'investmentRepaymentPlanVO.memeo', title: '备注', align: 'center'}]
                        }
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
