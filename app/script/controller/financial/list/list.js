define([], function() {
    return ['$scope', '$http','metaService','$stateParams','$state', '$timeout', '$modal', '$filter', 'financialService','toaster',
        function($scope, $http,metaService,$stateParams,$state,$timeout, $modal, $filter, financialService,toaster) {

            /**
             * the default search condition
             * @type {Object}
             */
            var defaultCondition = {
                sorting: 'update_time desc',
                data:{},
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
                //check: function() {
                //    var selected = $scope.listView.table.bootstrapTable('getSelections');
                //    if (!selected || selected.length === 0) {
                //        var text = "未选中行";
                //        $modal.open({
                //            templateUrl: 'view/shared/confirm.html',
                //            size: 'sm',
                //            controller: function($scope, $modalInstance) {
                //                $scope.confirmData = {
                //                    text: text,
                //                    processing: false
                //                };
                //                $scope.cancel = function() {
                //                    $modalInstance.dismiss();
                //                    return false;
                //                }
                //                $scope.ok = function() {
                //                    $modalInstance.dismiss();
                //                    return false;
                //                }
                //            }
                //        });
                //        return;
                //    }
                //    else {showChannelModal();}
                //},
                //status:[{id:1,title:'等待处理'},{id:2,title:'失败'},{id:3,title:'成功'}],
                //edit: function(id) {
                //    $state.go('financial.list.edit', { id: id });
                //}
            };
            function initMetaData() {
                metaService.getMeta('WJZT', function(data) {
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
                $scope.listView.table = $('#promptListTable');
            });


            var getData = function(params) {
                var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
                var data = $scope.listView.condition;
                var queryCondition = { "data":data,"paginate": paganition };
                financialService.promptListTable.query({ where: JSON.stringify(queryCondition) }).$promise.then(function(res) {
                    params.success({
                        total: res.data.paginate.totalCount,
                        rows: res.data.items
                    });
                });
            };

            (function init() {

                $scope.bsPromptListTableControl = {
                    options: {
                        cache: false,
                        pagination: true,
                        pageSize: 10,
                        pageList: [10, 25, 50, 100, 200],
                        ajax: getData,
                        sidePagination: "server",
                        columns: [{
                            field: 'state',
                            checkbox: true
                        },{
                            field: 'promptId',
                            title: '催款标识'
                        },{
                            field: 'borrowerName',
                            title: '姓名'
                        }, {
                            field: 'mobile',
                            title: '手机'
                        }, {
                            field: 'email',
                            title: '邮箱'
                        }, {
                            field: 'promptDate',
                            title: '催款日期',
                            formatter: timeFormatter
                        }, {
                            field: 'paymentDueDate',
                            title: '最后还款日期',
                            formatter: timeFormatter
                        }, {
                            field: 'principal',
                            title: '当期本金'
                        }, {
                            field: 'loanInterest',
                            title: '贷款利息'
                        }, {
                            field: 'serviceFee',
                            title: '当期手续费'
                        }, {
                            field: 'latePaymentFee',
                            title: '延期回款费用'
                        }, {
                            field: 'totalPayment',
                            title: '总回款'
                        }, {
                            field: 'status',
                            title: '状态'
                        }, {
                            field: 'auditStatus',
                            title: '审核状态'
                        }, {
                            field: 'auditOp',
                            title: '审核员工'
                        }, {
                            field: 'auditDatetime',
                            title: '审核时间',
                            formatter: timeFormatter
                        }, {
                            field: 'createDatetime',
                            title: '创建时间',
                            formatter: timeFormatter
                        }, {
                            field: 'flag',
                            title: '操作',
                            clickToSelect: false,
                            formatter: flagFormatter,
                            events: {
                                'click .btn-info': detailCheck

                            }
                        }]
                    }
                };

                function timeFormatter(value, row, index) {
                    return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
                };

                function flagFormatter(value, row, index) {
                    var btnHtml = [
                        '<button type="button" class="btn btn-xs btn-primary"><i class="fa fa-edit"></i></button>'
                        //,
                        //'<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i></button>'
                    ];
                    return btnHtml.join('');
                }

            })();

            function detailCheck(e, value, row, index) {
                $modal.open({
                    templateUrl: 'view/financial/list/checkOne.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.checkOneView = {};
                        $scope.checkOneMeta = {};


                        (function getDetail() {
                            financialService.backCheckOneDetail.get({ id: row.id }).$promise.then(function(res) {
                                $scope.checkOneView = res.data.result;
                            });
                        })();

                        $scope.ok = function() {
                            financialService.fallbackCheckOne({ promptId: $scope.checkOneView.promptId, status: "A" }, "POST").then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '审核成功！');
                                    $modalInstance.dismiss();
                                    search();
                                } else
                                    toaster.pop('error', res.msg);
                            }, function(err) {
                                toaster.pop('error', '服务器连接失败！');
                            });
                            return true;
                        };

                        $scope.cancel = function(id) {
                            var data = { promptId: $scope.checkOneView.promptId,status: "D" };
                            financialService.fallbackCheckOne(data, "POST").then(function(res) {
                                if (res.code == 200) {
                                    toaster.pop('success', '提现回退请求拒绝成功！');
                                    $modalInstance.dismiss();
                                    search();
                                } else
                                    toaster.pop('error', res.msg);
                            }, function(err) {
                                toaster.pop('error', '服务器连接失败！');
                            });
                            return true;
                        };

                        $scope.close = function() {
                            $modalInstance.dismiss();
                        }
                    }
                });

            };

            //function showChannelModal(channel) {
            //    var title = "催款单明细";
            //    var dataSourceList = $scope.listView.dataSourceList;
            //    $modal.open({
            //        templateUrl: 'view/financial/list/check.html',
            //        size: 'md',
            //        controller: function($scope, $modalInstance) {
            //
            //            $scope.channelView = {
            //                title: title,
            //                processing: false,
            //                dataSourceList: dataSourceList,
            //                submit: submit,
            //                cancel: cancel
            //            };
            //
            //            function cancel() {
            //                $modalInstance.dismiss();
            //                return false;
            //            }
            //
            //            function submit() {
            //                saveChannel(item.id, $scope, $modalInstance);
            //                return true;
            //            }
            //        }
            //    });
            //}


            function search() {
                $scope.listView.table.bootstrapTable('refresh');
            };

            //$scope.reset = function() {
            //    $scope.listView.condition = angular.copy(defaultCondition);
            //};

            //var pageChange = function(num, size) {
            //
            //};
        }
    ];
});
