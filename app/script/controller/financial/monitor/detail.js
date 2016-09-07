define([], function() {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster',
        function($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {
            var defaultCondition = {
                paginate: {
                    sort: 'update_time desc',
                    pageNum: 1,
                    pageSize: 10
                }
            };
        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            //data:{},
            cancel: function() {
                $state.go('financial.monitor.monitor');
            }

        };

        function initMetaData() {
            metaService.getProvinces(function(items) {
                $scope.listView.provinces = items;
            });
            metaService.getCities(function(items) {
                $scope.listView.cities = items;
            });
        }
        initMetaData();

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#monitorDetailsTable');
        });
        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };
            financialService.monitorDetailsTable.query({id: $stateParams.id}, { where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };
    (function init() {

        $scope.bsMonitorDetailsTableControl = {
            options: {
                cache: false,
                height: 650,
                pagination: true,
                pageSize: 10,
                pageList: [10, 25, 50, 100, 200],
                ajax: getData,
                sidePagination: "server",
                columns: [
                    {
                        field: 'state',
                        checkbox: true,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'id',
                        title: '编号',
                        align: 'center',
                        valign: 'middle'
                    },{
                        field: 'fundOutType',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccount',
                        title: '账户名称',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankAccount',
                        title: '卡号',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankName',
                        title: '银行',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'bankBranchName',
                        title: '开户支行名称',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'province',
                        title: '省份',
                        align: 'center',
                        valign: 'middle',
                        formatter: provinceFormatter
                    }, {
                        field: 'cityName',
                        title: '地市',
                        align: 'center',
                        valign: 'middle',
                        formatter: cityFormatter
                    }, {
                        field: 'amount',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'payBankProvince',
                        title: '付款开户行省份',
                        align: 'center',
                        valign: 'middle',
                        formatter: provinceFormatter
                    }, {
                        field: 'memo',
                        title: '备注',
                        align: 'center',
                        valign: 'middle'
                    }, {
                        field: 'createDatetime',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        formatter: timeFormatter
                    }]
            }

        };
        function provinceFormatter(value, row, index) {
            return $filter('metaPCA')(value + '0000', $scope.listView.provinces);
        }

        function cityFormatter(value, row, index) {
            return $filter('metaPCA')(value + '00', $scope.listView.cities);
        }

        function timeFormatter(value, row, index) {
            return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
        }
    })();

            (function(id) {
                if(!id)
                    return;
                financialService.monitorDetailsTable.get({id: id}).$promise.then(function(res) {
                    if(res.code == 200) {
                        $scope.listView.data = res.data;
                    }
                    else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接错误！');
                });
            })($stateParams.id);
        }
    ];
});
