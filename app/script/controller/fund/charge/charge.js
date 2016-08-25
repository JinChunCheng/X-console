define([], function() {
    return ['$scope', '$http','metaService','$filter', '$timeout', '$modal', '$state', 'toaster', 'borrowerService', function($scope, $http,metaService,$filter, $timeout, $modal, $state, toaster, borrowerService) {

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
            type: [{ id: 1, title: '网银' }, { id: 2, title: '委托扣款' }, { id: 3, title: 'POS收款' }, { id: 4, title: '调账处理' }, { id: 5, title: '奖励' }, { id: 6, title: '其他' }],
            status: [{ id: 1, title: '待支付' }, { id: 2, title: '成功' }, { id: 3, title: '取消' }, { id: 4, title: '失败' }, { id: 5, title: '在途' }],
            channel: [{ id: 1, title: 'POS刷卡' }, { id: 2, title: '银联转账' }, { id: 3, title: '其他' }]
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#chargeListTable');
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

            $scope.bsChargeListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
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
                        title: '充值编号',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'name',
                        title: '投资人编号',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace',
                        title: '投资人姓名',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace2',
                        title: '注册来源',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace3',
                        title: '充值金额',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace4',
                        title: '服务费',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace5',
                        title: '结算金额',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace6',
                        title: '账户科目',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace7',
                        title: '状态',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace8',
                        title: '充值类型',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace9',
                        title: '充值渠道',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '银行名称',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '银行卡号',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '支付序号',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '外部参考编号',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '创建时间',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '完成时间',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '操作员',
                        align: 'center',
                        valign: 'middle',
                        
                    }, {
                        field: 'workspace10',
                        title: '备注',
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
                            'click .btn-primary': detail,
                            'click .btn-danger': del
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
            $state.go('fund.charge.detail', { id: row.id });
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
