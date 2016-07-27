define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','$stateParams', '$modal', 'toaster', 'LogisticsService', function($rootScope, $scope, $state, $stateParams,$modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.saleOrder.list',
            title: '销售订单列表'
        });

        $scope.isAdding = false;
        $scope.isSaving = false;
        //默认分页配置
        $scope.defualResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        $scope.isAdd = true;
        //added by eric.gao
        var self = this;
        $scope.queryResult = $scope.defualResult;
        $scope.loading = false;

        $scope.condition = {
            externOrderNo:'',
            orderType:'',
            orderDateBegin:'',
            orderDateEnd:'',
            customerName:'',
            customerContactNo:'',
            consigneeName:'',
            consigneeContactNo:'',
            orderStatus:'',
            aomPerformer:'',
            sorting:'orderid desc',
            pageNo: $scope.queryResult.PageIndex,
            pageSize: $scope.queryResult.PageSize,
            PageIndex: $scope.queryResult.PageIndex,
            PageSize: $scope.queryResult.PageSize,
            PageAmount: $scope.queryResult.PageAmount,
            TotalCount: $scope.queryResult.TotalCount,
            Items: []
        };
       // 跳转到第n页
        $scope.GoToPage = $scope.queryResult.PageIndex;

        //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.condition.pageNo = index || 1;
            $scope.searchSaleOrder();
        };

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.externOrderNo = '';
            $scope.condition.orderType = '';
            $scope.condition.orderDateBegin='';
            $scope.condition.orderDateEnd='';
            $scope.condition.customerName='';
            $scope.condition.customerContactNo='';
            $scope.condition.consigneeName='';
            $scope.condition.consigneeContactNo='';
            $scope.condition.orderStatus='';
        };
        $scope.doSort = function(sortType, field) {
            $scope.condition.sorting = field + "  " + sortType;
            $scope.searchSaleOrder();
        };
        var self = this;

        if ($stateParams.condition) {
            $scope.condition=$stateParams.condition;
        };

        $scope.searchSaleOrder = function() {
            $scope.loading = true;
            $scope.searching = true;
            LogisticsService.searchSaleOrders($scope.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.loading = false;
                        $scope.searching = false;
                        if(data.items.length>0)
                        {
                            $scope.queryResult.Items = data.items;
                            $scope.queryResult.PageSize = data.paginate.pageSize;
                            $scope.queryResult.PageAmount = data.paginate.pagesCount;
                            $scope.queryResult.TotalCount = data.paginate.totalItemsCount;
                            $scope.queryResult.PageIndex = data.paginate.pageNumber;
                            $scope.queryResult.pageNo = data.paginate.pageNumber;
                        }
                    } else {
                        toaster.pop('error', "加载订单列表失败，原因："+data.msg);
                        $scope.loading = false;
                        $scope.searching = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while search productWarehouse.');
                }
            );
        };
        // 进入页面第一次查询
        $scope.searchSaleOrder();

        //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        //
        $scope.openBegin = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };

        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openE = true;
        };

        //跳转到编辑页面
        $scope.editSaleOrder=function(orderId){
            $state.go('logistics.saleOrder.edit',{
                orderId:orderId,
                condition:$scope.condition
            });
        };


         $scope.add = function() {
            var orderInfo={
                orderId:'',
                externOrderNo:''
            }

            orderInfo=$scope.selectValue;
            $scope.selectValue='';
            if (orderInfo.orderId!=undefined && orderInfo.orderId!='')
            {
                var text = '确定为订单[' + orderInfo.externOrderNo + ']生成运单？';
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: text,
                            processing: false
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            addTrack(orderInfo, $scope, $modalInstance);
                            return true;
                        }
                    }
                });
            }else{
                toaster.pop("error","请选择需要产生运单的销售单");
            }
            
        };

        //新增运单
        var addTrack=function(orderInfo, confirmScope, modalInstance){
            confirmScope.confirmData.processing = true;
            //modalInstance.dismiss();
            if (orderInfo.orderId!=undefined && orderInfo.orderId!='')
            {
                $scope.isAdding=true;
                  LogisticsService.createTrack(orderInfo.orderId).then(
                    function(data) {
                        if (data.status == '200') {
                            toaster.pop('success', '成功创建运单');
                            $scope.isAdding=false;
                            confirmScope.confirmData.processing = false;
                            modalInstance.dismiss();
                            $scope.page($scope.queryResult.PageIndex);
                        } else {
                            confirmScope.confirmData.processing = false;
                            modalInstance.dismiss();
                            toaster.pop('error', '创建运单失败，原因：' + data.msg);
                            $scope.isAdding = false;
                        }
                     },
                    function(errResponse) {
                        $scope.isAdding = false;
                        confirmScope.confirmData.processing = false;
                        modalInstance.dismiss();
                        console.error('create track no error.');
                    }
                   );
            }else{
                toaster.pop("error","请选择需要产生运单的销售单");
            }
        };


        $scope.sortClass = function(field) {
            if ($scope.condition.sorting) {
                var sortArr = $scope.condition.sorting.split(' ');
                if (field == sortArr[0]) {
                    var cls = 'text-success ';
                    switch (sortArr[1]) {
                        case 'asc':
                            cls += 'fa-caret-up';
                            break;
                        case 'desc':
                        default:
                            cls += 'fa-caret-down';
                            break;
                    }
                    return cls;
                }
            }
            return 'fa-unsorted';
        };


        $scope.reSort = function(field) {
            if ($scope.loading)
                return false;
            var sortingArr = $scope.condition.sorting.split(' ');
            var preField = sortingArr[0];
            var preOrderMode = sortingArr[1];

            var newOrderMode = 'desc';
            if (field == preField) {
                newOrderMode = (preOrderMode == 'asc' ? 'desc' : 'asc');
            }

            $scope.condition.sorting = field + ' ' + newOrderMode;
            $scope.page(1);
        };

    }];
});
