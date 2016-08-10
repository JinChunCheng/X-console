define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', 'borrowerService', function($scope, $http, $timeout, $modal, borrowerService) {

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
            depositType:['托管户=>盒子支付','准备金=>恒丰银行','托管户=>准备金','托管户=>收益户','收益户=>结算户打款','托管户=>恒丰结算户','托管户=>盒子结算户','盒子还款户=>托管户']
        };


            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#withdrawCashReconTable');
        });


                    var getData = function(params) {
                //query: {where: JSON.stringify($scope.listVM.condition)}
                borrowerService.query({ where: JSON.stringify($scope.listVM.condition) }).$promise.then(function(res) {
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

            $scope.bsWithdrawCashReconTableControl = {
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
                    onPageChange: pageChange,
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
                    }, {
                        field: 'name',
                        title: '登录名',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace',
                        title: '真实姓名',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace2',
                        title: '身份证号码',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace3',
                        title: '手机号',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace4',
                        title: '固话',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace5',
                        title: '状态',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace6',
                        title: '理财客户经理编号',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace7',
                        title: '理财客户经理代码',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace8',
                        title: '理财客户经理姓名',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace9',
                        title: '理财渠道代码',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '理财渠道名称',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '注册类型',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '是否本公司员工',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '邮编',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '地址',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '是否新手',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '试投金状态',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn': function(e, value, row, index) {
                                var text = "确定删除此记录？";
                                // var text = JSON.stringify($scope.listView.table.bootstrapTable('getAllSelections'));
                                $modal.open({
                                    templateUrl: 'view/shared/confirm.html',
                                    size: 'sm',
                                    // backdrop: true,
                                    controller: function($scope, $modalInstance) {
                                        $scope.confirmData = {
                                            text: text,
                                            processing: false
                                        };
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

                            }
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                return '<button class="btn btn-sm btn-danger" ng-click="del()"><i class="fa fa-remove"></i></button>';
            }

        })();

        $scope.del = function() {
            console.log('del');
        };

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };

        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
