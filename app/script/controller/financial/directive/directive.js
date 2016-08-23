define([], function() {
    return ['$scope', '$http', '$state', '$timeout', '$modal', 'borrowerService', function($scope, $http, $state,$timeout, $modal,borrowerService) {

        /**
         * the default search condition
         * @type {Object}
         */
        var defaultCondition = {
            sorting: 'update_time desc',
            pageNum: 1,
            pageSize: 10
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            cashType:[{id:1,title:'项目出款'},{id:2,title:'提现出款'}],
            status:[{id:1,title:'待出款'},{id:2,title:'出款确认'},{id:3,title:'出款完成'}]
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        $scope.listVM = {
            condition: angular.copy(defaultCondition),
            table: null,
            status: [{code:1,label:'正常'}, {code:2,label:'关闭'}],
            check: function() {
                console.log('check');
                $state.go('financial.directive.detail');
            }
        };


        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#cashDirectiveTable');
        });


                    var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.resource.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                    //debugger
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

                //post: 
                // var project = {};
                // project.borrowerId = 1;
                // project.contractTemplateId=1;
                // project.projectName="console-前台添加";
                // project.requestAmount=100000.00;
                // project.repaymentType="IOP";
                // project.duration=12;
                // project.durationUnit="Y";
                // project.periodCount=10;
                // project.interestRate=0.8;
                // project.interestRateTerm="Y";
                // project.serviceFeeRate=0;
                // project.serviceFeeRateTerm="Y";
                // project.latePaymentFeeRateTerm="D";
                // project.purpose="前端测试";
                // project.mortgageFlag="N";
                // project.mortgage="无";
                // project.guaranteeFlag="N";
                // project.guarantee="无";
                // project.description="这是一个通过controller添加进来的project";
                // project.biddingDeadline=new Date();
                // project.biddingStartAmount=5000;
                // project.biddingStepAmount=1000;
                // project.biddingAmount=100000.00;
                // project.status = "IRP";
                // project.totalDays=100;
                // project.totalInterest=100;
                // project.totalServiceFee=0.0;
                // project.debtStartDate=new Date();
                // project.debtEndDate=new Date();
                // project.principalPaid=0;
                // project.PrincipalBalance=100;
                // project.interestPaid=1;
                // project.serviceFeePaid=0;
                // project.memo="";
                // project.creditChannelId=1;

                // borrowerService.get(project).then(function(res) {
                //     debugger
                // });
            };
        (function init() {

            $scope.bsCashDirectiveTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: 650,
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    sidePagination: "server",
                    //search: true,
                    //showColumns: true,
                    //showRefresh: false,
                    //minimumCountColumns: 2,
                    //clickToSelect: false,
                    //showToggle: true,
                    //maintainSelected: true,
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
                        sortable: true
                    },{
                        field: 'workspace',
                        title: '出款类型',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace2',
                        title: '发起方编号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace3',
                        title: '账户名称',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace4',
                        title: '卡号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace5',
                        title: '银行',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace6',
                        title: '开户支行名称',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace7',
                        title: '省份',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace8',
                        title: '地市',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace9',
                        title: '出款金额',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '出款笔数',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '备注',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '执行日期',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }]
                }
            };

        })();

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };
    }];
});
