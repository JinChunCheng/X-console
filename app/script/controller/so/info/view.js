define(['common/session', 'service/config', 'common/path-helper'], function (session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'soService', 'metaService', '$stateParams',
        function ($rootScope, $scope, $state, toaster, soService, metaService, $stateParams) {
            ph.mark($rootScope, {
                state: 'so.info.view',
                title: '订单详情'
            });

            $scope.view = {
                orderId: $stateParams.id,
                loading: false

            };

            $scope.order = {};
            $scope.onlinePayItem={};
            $scope.offlinePayItem={};
            $scope.transactionId = '';
            $scope.onlinePayMethod='';
            $scope.onlinePayStatus='';
            $scope.orderNo='';
            $scope.shipToAddr = '';
            $scope.shipAddr = {};
            $scope.billAddr = {};
            $scope.firstName = '';
            $scope.lastName = '';

            $scope.back = function () {
                $state.go('so.info.list');

            };

            //get so detail
            $scope.getOrderDetail = function (orderId) {
                soService.getOrderDetail(orderId).then(
                    function(data) {
                        if (data.status == '200') {
                            if(data.items){
                                $scope.order = data.items;
                                $scope.orderNo=data.items.header.orderNo;
                                var buyerName = data.items.header.buyerName;
                                if(buyerName){
                                    var nameAry = buyerName.split(" ");
                                    if(nameAry.length == 0){
                                        $scope.firstName = nameAry[0];
                                    }else{
                                        $scope.firstName = nameAry[0];
                                        $scope.lastName = nameAry[1];
                                    }
                                }

                                if(data.items.logisticsItems && data.items.logisticsItems.length > 0){
                                    //debugger;
                                    if(data.items.logisticsItems[0].shipCalcMethod
                                        && data.items.logisticsItems[0].shipCalcMethod == 'TOPORT'
                                        && data.items.logisticsItems[0].shipToAddr.indexOf('|') > 0){
                                        $scope.shipToAddr = data.items.logisticsItems[0].shipToAddr.split('|')[1];
                                    }else{
                                        $scope.shipToAddr = data.items.logisticsItems[0].shipToAddr;
                                    }
                                }

                                if(data.items.payItems&&data.items.payItems.length > 0){
                                    //debugger;
                                    for(var i=0;i<data.items.payItems.length;i++){
                                        if(data.items.payItems[i].isOnlinePay == 0){
                                            $scope.onlinePayItem = data.items.payItems[i];
                                            $scope.onlinePayMethod = data.items.payItems[i].payMethod;
                                            $scope.onlinePayStatus = data.items.payItems[i].payStatus;
                                        }else{
                                            $scope.offlinePayItem = data.items.payItems[i];
                                        }
                                    }
                                    $scope.getTransactionDetail($scope.onlinePayMethod,$scope.orderNo);
                                }

                                if(data.items.addressItems&&data.items.addressItems.length > 0){
                                    for(var i=0;i<data.items.addressItems.length;i++){
                                        if(data.items.addressItems[i].addrType == 0){
                                            $scope.consigneeAddr = data.items.addressItems[i];
                                        }else if(data.items.addressItems[i].addrType == 1){
                                            $scope.billAddr = data.items.addressItems[i];
                                        }else{
                                            $scope.shipAddr = data.items.addressItems[i];
                                        }
                                    }
                                }
                            }
                            toaster.pop('success',"查询订单明细成功");
                        } else {
                            toaster.pop('error', '查询订单明细失败，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while query order detail.');
                    }
                );
            };

            $scope.getTransactionDetail = function(payMethod,orderNo){
                //debugger;
                if(!payMethod || !orderNo){
                    console.info('支付交易号查询参数为空.');
                    return;
                }
                //查询支付transactionId
                soService.getTransactionDetail(payMethod,orderNo).then(
                    function(data) {
                        if (data.status == '200') {
                            if (data.items && data.items.length > 0) {
                                $scope.transactionId = data.items[0].transactionId;
                            }else{
                                // toaster.pop('error', '支付交易号查询为空！');
                                console.info('支付交易号查询为空！');
                            }
                        }else{
                            //toaster.pop('error', '支付交易号查询失败，原因：' + data.msg);
                            console.info('支付交易号查询失败，原因：' + data.msg);
                        }
                    },function(errResponse) {
                        console.info('支付交易号查询，系统错误.');
                    }
                );
            }


            $scope.getOrderDetail($scope.view.orderId);


        }
    ];
});
