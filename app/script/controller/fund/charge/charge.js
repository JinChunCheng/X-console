define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state','toaster', 'borrowerService', function($scope, $http, $timeout, $modal, $state,toaster, borrowerService) {

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
            type: ['网银', '委托扣款', 'POS收款', '调账处理', '奖励', '其他'],
            status: ['待支付', '成功', '取消', '失败', '在途'],
            channel: ['POS刷卡', '银联转账', '其他']
        };
                $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#chargeListTable');
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

            $scope.bsChargeListTableControl = {
                options: {
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    height: 500,
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
                        title: '充值编号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'name',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'workspace',
                        title: '投资人姓名',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace2',
                        title: '注册来源',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace3',
                        title: '充值金额',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace4',
                        title: '服务费',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace5',
                        title: '结算金额',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace6',
                        title: '账户科目',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace7',
                        title: '状态',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace8',
                        title: '充值类型',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace9',
                        title: '充值渠道',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '银行名称',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '银行卡号',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '支付序号',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '外部参考编号',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '创建时间',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '完成时间',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '操作员',
                        align: 'left',
                        valign: 'top',
                        sortable: true
                    }, {
                        field: 'workspace10',
                        title: '备注',
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
                            'click .btn-primary': detail,
                            'click .btn-danger':del
                        }
                    }]
                }
            };

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-arrow-right"></i></button>',
                    '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();

        function detail(e, value, row, index) {
            $state.go('fund.charge.detail',{id:row.id});
        }
        function del(e, value, row, index) {
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
