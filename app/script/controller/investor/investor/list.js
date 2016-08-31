define([], function() {
    return ['$scope', '$http', 'metaService', '$filter', '$timeout', '$modal', '$state', 'investorService',
        function($scope, $http, metaService, $filter, $timeout, $modal, $state, investorService) {

            $scope.listVM = {
                condition: {},
                table: null,
                add: function() {
                    $state.go('investor.investor.add');
                },
            };

            function initMetaData() {
                metaService.getMeta('ZCLX', function(data) {
                    $scope.listVM.registerType = data;
                });
                metaService.getMeta('SFBGSYG', function(data) {
                    $scope.listVM.empFlag = data;
                });
                metaService.getMeta('STJZT', function(data) {
                    $scope.listVM.trialFlag = data;
                });
                metaService.getMeta('CZLY', function(data) {
                    $scope.listVM.operateOrigin = data;
                });
                metaService.getMeta('LCQDMC', function(data) {
                    $scope.listVM.fundChannelCode = data;
                });
                metaService.getMeta('STJSFYSY', function(data) {
                    $scope.listVM.trialUsed = data;
                });
                
            };
            initMetaData();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };


            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#investorTable');
            });


            var getData = function(params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                //var data = { "investorId": $scope.listVM.condition.investorId, "name": $scope.listVM.condition.name, 'loginName': $scope.listVM.condition.name, 'empFlag': $scope.listVM.condition.empFlag, 'mobile': $scope.listVM.condition.mobile , 'trialFlag': $scope.listVM.condition.trialFlag, 'operateOrigin': $scope.listVM.condition.operateOrigin, 'fundChannelCode': $scope.listVM.condition.fundChannelCode, 'fundAccountManagerId': $scope.listVM.condition.fundAccountManagerId, 'trialUsed': $scope.listVM.condition.trialUsed, 'idNo': $scope.listVM.condition.idNo,'createStartTime': $scope.listVM.condition.startDay,'createEndTime': $scope.listVM.condition.endDay,'bindIboxpayUser': $scope.listVM.condition.bindIboxpayUser};
                var data = $scope.listVM.condition;
                var queryCondition = { "data": data, "paginate": paganition };
                investorService.investorListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsInvestorTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'state',
                            checkbox: true,
                            align: 'center',
                            valign: 'middle'
                        }, {
                            field: 'investorId',
                            title: '编号',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'loginName',
                            title: '登录名',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'name',
                            title: '真实姓名',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'idNo',
                            title: '身份证号码',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'mobile',
                            title: '手机号',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'telephone',
                            title: '固话',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'status',
                            title: '状态',
                            align: 'center',
                            valign: 'middle',
                            formatter:statusFormatter

                        }, {
                            field: 'fundAccountManagerId',
                            title: '理财客户经理编号',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'fundAccountManagerCode',
                            title: '理财客户经理代码',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'fundAccountManagerName',
                            title: '理财客户经理姓名',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'fundChannelCode',
                            title: '理财渠道代码',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'fundChannelName',
                            title: '理财渠道名称',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'registerType',
                            title: '注册类型',
                            align: 'center',
                            valign: 'middle',
                            formatter:registerFormatter
                        }, {
                            field: 'empFlag',
                            title: '是否本公司员工',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'zipCode',
                            title: '邮编',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'address',
                            title: '地址',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'noviciate',
                            title: '是否新手',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'trialFlag',
                            title: '试投金状态',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'trialUsed',
                            title: '试投金是否已使用',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'trialAmt',
                            title: '试投金金额',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'operateOrigin',
                            title: '操作来源',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'bindIboxpayUser',
                            title: '绑定钱盒商户',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            align: 'center',
                            valign: 'middle',

                        }, {
                            field: 'updateDatetime',
                            title: '更新时间',
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
                                'click .btn-info': detail,
                                'click .btn-primary': editRow
                            }
                        }]
                    }
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function detail(e, value, row, index) {
                $state.go('investor.investor.detail', { id: row.investorId });
            }

            function editRow(e, value, row, index) {
                $state.go('investor.investor.edit', { id: row.investorId });
            }

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };
        }
    ];
});
