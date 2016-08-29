define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$state', '$modal', 'borrowerService', 'toaster', function($scope, $http, metaService, $filter, $timeout, $state, $modal, borrowerService, toaster) {

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
            metaService.getMeta('AQDJ', function(data) {
                $scope.listView.securityLevel = data;
            });
            metaService.getMeta('CZLY', function(data) {
                $scope.listView.operateOrigin = data;
            });
        }
        initMetaData();

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawCheckTable');
        });


        var getData = function(params) {
            borrowerService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                $timeout(function() {
                    res.data.items.forEach(function(item) {
                        item.id = parseInt(Math.random() * 100);
                    });
                    res.data.items.sort(function(a, b) {
                        return Math.random() > .5 ? -1 : 1;
                    });
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                }, 500);
            });
        };

        (function init() {

            $scope.bsWithdrawCheckTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
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
                        field: 'name',
                        title: '登录名',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace',
                        title: '真实姓名',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace2',
                        title: '身份证号码',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace3',
                        title: '手机号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace4',
                        title: '固话',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace5',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace6',
                        title: '理财客户经理编号',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace7',
                        title: '理财客户经理代码',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace8',
                        title: '理财客户经理姓名',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace9',
                        title: '理财渠道代码',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '理财渠道名称',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '注册类型',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '是否本公司员工',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '邮编',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '地址',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '是否新手',
                        align: 'center',
                        valign: 'middle',
                    }, {
                        field: 'workspace10',
                        title: '试投金状态',
                        align: 'center',
                        valign: 'middle',
                    }]
                }
            };
        })();
        $scope.checkRow = function(e, value, row, index) {
            var text = $scope.listView.table.bootstrapTable('getAllSelections');
            var withdrawNum = text.length;
            console.log(text);
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
                        withdrawAmount += item.id;
                    });

                    $scope.checkVM.withdrawAmount = withdrawAmount;
                    //提现服务费
                    var withdrawFee = 0;
                    text.forEach(function(item) {
                        withdrawFee += item.id;
                    });
                    $scope.checkVM.withdrawFee = withdrawFee;
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    };

                    $scope.ok = function() {
                        delUser(item.id, $scope, $modalInstance);
                        return true;
                    };
                }
            });

        };

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };
    }];
});
