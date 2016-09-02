define([], function() {
    return ['$scope', 'toaster', '$timeout', '$state', '$stateParams', 'metaService', '$filter', 'investorService', function($scope, toaster, $timeout, $state, $stateParams, metaService, $filter, investorService) {
        $scope.vm = {
            data: {},
            table: null,
            provinces: [],
            cancel: function() {
                $state.go('investor.investor.list');
            },
            bankProvinceChange: function() {
                $scope.vm.data.bankCity = null;
            },
            getCities: function(provinceCode) {
                var result = [];
                $scope.vm.provinces.forEach(function(item) {
                    if (item.code == provinceCode) {
                        result = item.children;
                        return;
                    }
                });
                return result;
            },
            submit: submit,
            getBankName: getBankName,
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.vm.table = $('#bankAccountTable');
        });

        function initMetaData() {
            metaService.getMeta("ZT", function(data) {
                $scope.vm.status = data;
            });
            metaService.getProvinces(function(res) {
                $scope.vm.bankProvince = res;
            });
            metaService.getCities(function(res) {
                $scope.vm.bankCity = res;
            });
        }
        initMetaData();

        function getBankName(id) {
            investorService.withdrawBackLabel.get({ id: id }).$promise.then(function(res) {
                //基本信息
                $scope.vm.data = res.data.result;
                $scope.vm.data.bankAccount = res.data.withdraw.id;

            });
        }
        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var queryCondition = { "paginate": paganition };
            investorService.investorListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };
        (function init() {

            $scope.bsBankAccountTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'bankAccountNo',
                        title: '银行账号',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'bankAccountNoMask',
                        title: '银行账号掩码',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'bankName',
                        title: '银行',
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'branchName',
                        title: '支行',
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
                        title: '地市',
                        formatter: cityFormatter,
                        align: 'center',
                        valign: 'middle',

                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                        formatter: statusFormatter

                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        formatter: dateFormatter,
                        align: 'center',
                        valign: 'middle',

                    }]
                }
            };

            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.vm.status);
            }

            function provinceFormatter(value, row, index) {
                return $filter('metaPCA')(value + '0000', $scope.vm.bankProvince);
            }

            function cityFormatter(value, row, index) {
                return $filter('metaPCA')(value + '00', $scope.vm.bankCity);
            }

            function dateFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }
        })();

        function submit(invalid) {
            $scope.vm.submitted = true;
            if (invalid) {
                return;
            }
            save();
            return true;
        };


        $scope.reset = function() {
            $scope.vm.data = {};
        };

        function save() {
            if (!$stateParams.id) {
                //新增银行账号
                investorService.createBankAcc.save($scope.vm.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '新增银行账户成功！');
                        $state.go("borrower.info.list");
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');
                });
                return;
            }
        }

    }];
});
