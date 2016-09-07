define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'accountService', 'metaService', '$filter', 'metaService', function($scope, $http, $timeout, $modal, accountService, metaService, $filter, metaService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.listView = {
            condition: {},
            table: null,
        };

        function initMetaData() {
            metaService.getMeta('ZJZHMC', function(data) {
                $scope.listView.capitalAccountNo = data;
            });
            metaService.getMeta('ZJZHRZLX', function(data) {
                $scope.listView.capitalAccountLogType = data;
            });
            metaService.getProvinces(function(res) {
                $scope.listView.bankProvince = res;
            });
            metaService.getCities(function(res) {
                $scope.listView.bankCity = res;
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
                        field: 'capitalAccountNo',
                        title: '账号名称',
                        formatter: capitalAccountNoFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'capitalAccountLogType',
                        title: '日志类型',
                        formatter: capitalAccountLogTypeFormatter,
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
                        formatter: provinceFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'relBankCity',
                        title: '开户行地市',
                        formatter: cityFormatter,
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'memo',
                        title: '说明',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'createDatetime',
                        formatter: dateFormatter,
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                    }]
                }
            };

            function capitalAccountNoFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.capitalAccountNo)
            };

            function capitalAccountLogTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.capitalAccountLogType)
            };

            function provinceFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankProvince)
            };

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value, $scope.listView.bankCity)
            };

            function dateFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
            };

            function updateFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss')
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
