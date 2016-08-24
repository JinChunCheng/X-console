define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'accountService', 'metaService', function($scope, $http, $timeout, $modal, accountService, metaService) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            paginate: {
                sort: 'update_time desc',
                pageNum: 1,
                pageSize: 10
            },
            data: {}
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            accountType: [{ id: 1, title: '汇和托管户', content: [{ code: 1, label: '充值' }, { code: 2, label: '提现' }, { code: 3, label: '放款' }, { code: 4, label: '还款' }, { code: 5, label: '沉淀利润' }, { code: 6, label: '风险准备金' }, { code: 7, label: '提现手续费' }, { code: 8, label: '提现手续费' }, { code: 9, label: '手工调增' }, { code: 10, label: '手工调减' }] }, { id: 2, title: '汇和准备金户', content: [{ code: 1, label: '补充' }, { code: 2, label: '手工调增' }, { code: 3, label: '手工调减' }] }, { id: 3, title: '汇和收益户', content: [{ code: 1, label: '沉淀利润' }, { code: 2, label: '提现手续费' }, { code: 3, label: '托管费' }, { code: 4, label: '手工调增' }, { code: 5, label: '手工调减' }] }, { id: 4, title: '恒丰托管费', content: [{ code: 1, label: '充值' }, { code: 2, label: '手工调增' }, { code: 3, label: '手工调减' }] }, { id: 5, title: '恒丰移动金融部', content: [{ code: 1, label: '提现' }, { code: 2, label: '手工调增' }, { code: 3, label: '手工调减' }] }, { id: 6, title: '盒子资金户', content: [{ code: 1, label: '充值' }, { code: 2, label: '放款' }, { code: 3, label: '手工调增' }, { code: 4, label: '手工调减' }] }, { id: 7, title: '盒子结算户', content: [] }, { id: 8, title: '盒子还款户', content: [] }]
        };

        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#fundAccountQueryTable');
        });


        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var queryCondition = { data: { capitalAccountNo: $scope.listView.condition.capitalAccountNo, capitalAccountLogType: $scope.listView.condition.capitalAccountLogType, createStartTime: $scope.listView.condition.startDay, createEndTime: $scope.listView.condition.EndDay }, paginate: paganition };
            accountService.accountQueryList.query({ queryCondition }).$promise.then(function(res) {
                //debugger
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });

            });
        };
        (function init() {

            $scope.bsFundAccountQueryTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'capitalAccountLogId',
                        title: '流水号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'capitalAccountNoName',
                        title: '账号名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'capitalAccountLogType',
                        title: '日志类型',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'referenceId',
                        title: '参考ID',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'beforeBalance',
                        title: '变动前余额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'changeAmount',
                        title: '发生额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'afterBalance',
                        title: '变动后余额',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankAccountName',
                        title: '银行账户名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankAccount',
                        title: '银行账户号码',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankName',
                        title: '开户行',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankProvince',
                        title: '开户行省份',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankCity',
                        title: '开户行地市',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'memo',
                        title: '说明',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                    }]
                }
            };
        })();


        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };
    }];
});
