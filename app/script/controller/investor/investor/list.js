define([], function() {
    return ['$scope', '$http', '$timeout', '$modal', '$state', 'borrowerService',
        function($scope, $http, $timeout, $modal, $state, borrowerService) {

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

            $scope.listVM = {
                condition: angular.copy(defaultCondition),
                table: null,
                channel: [{ id: 1, title: '钱盒', content: [{ code: 1, label: '钱盒' }] }, { id: 2, title: '开通宝', content: [{ code: 1, label: '开通宝' }] }, { id: 3, title: '管理系统', content: [{ code: 1, label: '管理系统' }] }],
                isEmployee: [{ id: 1, title: '待定' }, { id: 2, title: '否' }, { id: 3, title: '是' }],
                status: [{ id: 1, title: '未发放' }, { id: 2, title: '已发放' }, { id: 3, title: '已回收' }],
                operSource: [{ id: 1, title: '管理系统' }, { id: 2, title: '钱盒' }],

                isUsed: [{ id: 1, title: '使用' }, { id: 2, title: '未使用' }],
                add: function() {
                    console.log('add');
                    $state.go('investor.investor.add');
                },
                edit: function(id) {
                    $state.go('investor.investor.edit', { id: id });
                }
            };

            /**
             * do something after view loaded
             * @param  {string}     event type                       
             * @param  {function}   callback function
             */
            $scope.$on('$viewContentLoaded', function() {
                $scope.listVM.table = $('#investorTable');
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

                $scope.bsInvestorTableControl = {
                    options: {
                        //data: rows,
                        // rowStyle: function(row, index) {
                        //     return { classes: 'none' };
                        // },
                        // fixedColumns: true,
                        // fixedNumber: 2,
                        cache: false,
                        //height: getHeight(),
                        //striped: true,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
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
                            field: 'workspace11',
                            title: '注册类型',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace12',
                            title: '是否本公司员工',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace13',
                            title: '邮编',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace14',
                            title: '地址',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace15',
                            title: '是否新手',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace16',
                            title: '试投金状态',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace17',
                            title: '试投金是否已使用',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace18',
                            title: '试投金金额',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace19',
                            title: '操作来源',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace20',
                            title: '绑定钱盒商户',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace21',
                            title: '创建时间',
                            align: 'left',
                            valign: 'top',
                            sortable: true
                        }, {
                            field: 'workspace22',
                            title: '更新时间',
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
                                'click .btn-danger': deleteRow,
                                'click .btn-primary': editRow
                            }
                        }]
                    }
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>',
                        '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function deleteRow(e, value, row, index) {
                var text = "确定删除此记录？";
                //text = JSON.stringify($scope.listVM.table.bootstrapTable('getSelections'));
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    //backdrop: true,
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

            function editRow(e, value, row, index) {
                $state.go('investor.investor.edit', { id: row.id });
            }

            $scope.search = function() {
                $scope.listVM.table.bootstrapTable('refresh');
            };

            $scope.reset = function() {
                $scope.listVM.condition = angular.copy(defaultCondition);
            };

            var pageChange = function(num, size) {

            };
        }
    ];
});
