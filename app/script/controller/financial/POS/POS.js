define([], function() {
    return ['$scope', '$http','metaService','$state', '$timeout', '$modal', 'financialService',"toaster",'$filter',
        function($scope, $http,metaService, $state,$timeout, $modal,financialService,toaster,$filter)  {

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
            search: search,
            reset: function() {
                $scope.listView.condition = angular.copy(defaultCondition);
            }
            //prompt:  function() {
            //    var row = $('#query_result').datagrid('getSelected');
            //    if (row == null) {
            //        toaster.pop('error', "请选择行！");
            //        return;
            //    }
            //    if(row.status!='F')
            //    {
            //        toaster.pop('error', '只允许处理对账失败的记录！');
            //        return;
            //    }else{
            //        $.messager.prompt('提示:','请输入充值编号',function(r){
            //            if(r){
            //                if(isNaN(r))
            //                {
            //                    $.messager.alert('Info', '请输入正确的充值编号！', 'info');
            //                }else{
            //                    $.ajax({
            //                        url : '../../autoStatementIboxpay/doAudit.ajax',
            //                        type : 'post',
            //                        dataType : 'JSON',
            //                        cache: false,
            //                        async: false,
            //                        data : {
            //                            autoStatementResultId : row.autoStatementResultId,
            //                            depositId : r
            //                        },
            //                        success : function(data) {
            //                            if (data.success) {
            //                                $.messager.alert('Info', '操作成功', 'info');
            //                                do_submit(1,10);
            //                            } else {
            //                                $.messager.alert('Error', data.message, 'error');
            //                            }
            //                        }
            //                    });
            //                }
            //            }
            //        })
            //    }
            //}
        };

        $scope.dateOptions = {
             startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
        function initMetaData() {
            metaService.getMeta('DZZT', function(data) {
                $scope.listView.status = data;
            });
        }
        initMetaData();

        /**
         * do something after view loaded
         * @param  {string}     event type                       
         * @param  {function}   callback function
         */
        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#POSchargeReconTable');
        });

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var data = $scope.listView.condition;
            var queryCondition = { "data":data,"paginate": paganition };

            financialService.POSchargeReconTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    res.data = res.data || { paginate: paganition, items: [] };
                    res.data.paginate = res.data.paginate || { totalCount: 0 };
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
            });
        };
        (function init() {

            $scope.bsPOSchargeReconTableControl = {
                options: {
                    cache: false,
                    height: 650,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
                    ajax: getData,
                    onPageChange: pageChange,
                    sidePagination: "server",
                    columns: [
                        {
                        field: 'state',
                        checkbox: true
                    }, {
                        field: 'settleDatetime',
                        title: '清算日期',
                        formatter: timeFormatter
                    }, {
                        field: 'tradeType',
                        title: '交易类型'
                    }, {
                        field: 'workspace',
                        title: '真实姓名'
                    }, {
                        field: 'tradeDatetime',
                        title: '交易日期',
                        formatter: timeFormatter
                    }, {
                        field: 'merchantNo',
                        title: '商户编号'
                    }, {
                        field: 'investorId',
                        title: '投资人编号'
                    }, {
                        field: 'name',
                        title: '投资人姓名'
                    }, {
                        field: 'amount',
                        title: '交易金额'
                    }, {
                        field: 'tradeNo',
                        title: '交易流水号'
                    }, {
                        field: 'serviceAmount',
                        title: '手续费'
                    }, {
                        field: 'batchNo',
                        title: '批次号'
                    }, {
                        field: 'depositId',
                        title: '充值流水'
                    }, {
                        field: 'status',
                        title: '状态',
                        formatter:statusFormatter
                    }, {
                        field: 'createDate',
                        title: '创建时间',
                        formatter: timeFormatter
                    },{
                            field: 'flag',
                            title: '操作',
                            align: 'center',
                            valign: 'middle',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-check': check
                            }
                        }]
                }
            };

        })();

        function flagFormatter(value, row, index) {
            return '<button type="button" class="btn btn-xs btn-info btn-check"><i class="fa fa-arrow-right"></i></button>';
        }

        function statusFormatter(value, row, index) {
            return $filter('meta')(value, $scope.listView.status);
        }
        function timeFormatter(value, row, index) {
            return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
        };

        function check(e, value, row, index) {
            $state.go('financial.POS.detail', {id: row.autoStatementResultId });
        };

        function search() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        //$scope.reset = function() {
        //    $scope.listView.condition = angular.copy(defaultCondition);
        //    console.log('aaa');
        //};
        //
        var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };
    }];
});
