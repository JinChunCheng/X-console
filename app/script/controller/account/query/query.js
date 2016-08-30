define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'accountService', 'metaService', function($scope, $http, $timeout, $modal, accountService, metaService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
            accountType: [],
            getLogType: function(accountType) {
                var result = [];
                $scope.listView.accountType.forEach(function(item) {
                    if (item.value == accountType) {
                        result = item.children;
                        return;
                    }
                });
                return result;
            },
            optionChange:function(){
                $scope.listView.condition.logType = null;
            }
        };

        function initMetaData() {
            metaService.getMeta('ZJZHMC', function(data) {
                $scope.listView.accountType = data;
            });
        }
        initMetaData();

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#fundAccountQueryTable');
        });


        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data": data, "paginate": paganition };
            accountService.accountQueryList.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
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
