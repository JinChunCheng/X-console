//yucheng, added, for supplier list page
//
//return ['$scope','$http', '$routeParams','$location','metaService',
//    function($scope, $http, $routeParams, $location,metaService){

define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'soService', 'metaService','$stateParams','$window','$filter',
        function($rootScope, $scope, $state, toaster, soService, metaService, $stateParams,$window,$filter) {

            ph.mark($rootScope, {
                state: 'so.info.list',
                title: '订单列表'
            });

            $scope.listVM = {
                condition: $stateParams.condition ? $stateParams.condition : {
                    pageNo: 1,
                    pageSize: 10
                },
                paginate: {
                    pageSize: 10,
                    pageNumber: 1,
                    pagesCount: 0,
                    totalItemsCount: 0
                },
                items: []
            };

            $scope.openBeginDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.listVM.beginDateOpened = true;
                $scope.listVM.endDateOpened = false;
            };
            $scope.openEndDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.listVM.endDateOpened = true;
                $scope.listVM.beginDateOpened = false;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };

            $scope.view ={
                orderStatus:[
                    {value:'Pending Approval',text:'Pending'},
                    {value:'Pending Fulfillment',text:'Accept'},
                    {value:'Cancelled',text:'Not Accept'},
                    {value:'Pending Billing',text:'Shipped'},
                    {value:'Closed',text:'Cancelled'},
                    {value:'Completed ',text:'Completed '},
                    {value:'Billed',text:'Billed'}
                ],
                deliveryMode:[
                    /*{value:'Courier',text:'By Courier'},*/
                    {value:'POST',text:'By Post'},
                    {value:'OCEAN',text:'By OCEAN'},
                    {value:'AIR',text:'By AIR'},
                    {value:'EXPRESS',text:'By EXPRESS'}
/*                  {value:'Railway',text:'By Railway'},
                    {value:'SEXPR',text:'By Standard Express'},
                    {value:'GLAND',text:'By General Land Transportation'},
                    {value:'GAIRT',text:'By General Air Transportation'},*/
                ],
                countryCode:[{value:'China',text:'China'},{value:'Amarica',text:'Amarica'}],
                incoterm:[{value:'FOB',text:'FOB'},{value:'CIF',text:'CIF'},{value:'DDU',text:'DDU'},{value:'DDP',text:'DDP'}],
                condition:{
                    orderStatus:'',
                    countryCodeInDB:'',//物流国家表中的原始国家名称，带（..）
                    countryCode:'',//去掉（..）后的国家名称
                    incoterm:'',
                    buyerName:'',
                    dateFrom:'',
                    dateTo:'',
                    email:'',
                    orderNo:'',
                    pageNo: 1,
                    pageSize: 10,
                    campaignSource:'',
                    campaignMedium:''
                },
                result:{
                    pageIndex: 1,
                    pageSize: 10,
                    PageAmount: 0,
                    TotalCount: 0,
                    Items: []
                },
                campaignSourceList:'',
                campaignMediumList:'',
                buyerName:'',
                selectedRowRadioValue:"",/*radio被选中时的订单号*/
                downloadAllCheckBox:false,
                loading:false

            };

            //countryList
            $scope.getCountroyList = function(){
                soService.getCountroyList().then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.countryList = data.items;
                        } else {
                            toaster.pop('error', '获取国家集合失败！');
                        }
                    },
                    function(errResponse) {
                        console.error('Error while getCountroyList.');
                        toaster.pop('error', '获取国家集合失败！');
                    }
                );
            };
            $scope.getCountroyList();//页面加载时，就调用
            //媒介
            metaService.getMeta('SCGZMJ', function(list) {
                $scope.view.campaignMediumList = list;
            });
            //来源
            metaService.getMeta('SCGZLY', function(list) {
                $scope.view.campaignSourceList = list;
            });

            //SO ORDER STATUS
            /*metaService.getMeta('SOORDERSTATUS', function(list) {
                $scope.view.orderStatus = list;
            });*/
            //SO DELIVERY MODE
            /*metaService.getMeta('SODELIVERYMODE', function(list) {
                $scope.view.deliveryMode = list;
            });*/
            //so incoterm
            /*metaService.getMeta('SOINCOTERM', function(list) {
                $scope.view.incoterm = list;
            });*/
            //country code
            /*metaService.getMeta('BUYERENABLESTATUS', function(list) {
                $scope.view.countryCode = list;
            });*/

            //var hostname = config.supplier_domain; //supplier_domain;
            //

            /*
             各个状态的规则如下：
             1、Approve,Cancel都为蓝色时，Close,Fulfill,Bill置灰色；
             2、Approve操作后, Approve，Cancel 都置为灰色；Close,Fulfill置为蓝色；
             3、Cancel操作后，Approve，Cancel，Close,Fulfill 都置为灰色；
             4、Close操作后，Approve，Cancel，Close,Fulfill,Bill都置灰色；
             5、Fulfill操作后，Approve，Cancel，Close,Fulfill都置灰色；Bill置蓝色；
             6、Bill操作后，Approve，Cancel，Close,Fulfill, Bill都置灰色；

             */
            $scope.view.checkedAll = false;
            $scope.view.so_selectedList = [];
            $scope.checkAll = function() {
                if ($scope.view.checkedAll){
                    $scope.view.so_selectedList = $scope.view.result.Items.map(function(item) {
                        //console.info(item.orderNo);
                        return item.orderNo;
                    });
                }else{
                    $scope.view.so_selectedList = [];
                }
            };

            $scope.utcDateFormat = function(value,exDate){
                //debugger;
                value = $filter("exDate")(value,"yyyy-MM-dd HH:mm:ss");
                return value;
            };
            $scope.myTrim = function myTrim(x) {
                return x.replace(/^\s+|\s+$/gm,'');
            };
            $scope.handleCountryName = function(input) {
                //debugger;
                if(input.indexOf("(") != -1 && input.indexOf(")") != -1){
                    var substrCountry = input.substr(0,input.indexOf("("));//substr before "("
                    substrCountry = $scope.myTrim(substrCountry);
                    return substrCountry;
                }
                return input;
            };


            $scope.downloadSummary = function(){
                $scope.view.condition.countryCode = $scope.handleCountryName($scope.view.condition.countryCodeInDB);
                if($scope.view.downloadAllCheckBox){
                    var url = config.so_domain + '/saleorders/exportSummaryAll?';

                    url += "orderStatus="+$scope.view.condition.orderStatus;
                    url += "&countryCode="+$scope.view.condition.countryCode;
                    url += "&campaignSource="+$scope.view.condition.campaignSource;
                    url += "&campaignMedium="+$scope.view.condition.campaignMedium;
                    url += "&incoterm="+$scope.view.condition.incoterm;
                    url += "&buyerName="+$scope.view.condition.buyerName;
                    url += "&dateFrom="+$scope.utcDateFormat($scope.view.condition.dateFrom);
                    url += "&dateTo="+$scope.utcDateFormat($scope.view.condition.dateTo);
                    url += "&email="+$scope.view.condition.email;
                    url += "&orderNo="+$scope.view.condition.orderNo;
                    $window.location.href = url;
                    return;
                }
                //toaster.pop('info', $scope.view.so_selectedList );
                $scope.orderNoArray = $scope.view.so_selectedList;
                var orderNoStr = $scope.orderNoArray.join(",");
                //toaster.pop('info',orderNoStr);
                //debugger;
                if(!orderNoStr){
                    toaster.pop('warn','请勾选！');
                    return;
                }
                $window.location.href = config.so_domain+"/saleorders/exportSummary/"+orderNoStr;
            };


            $scope.downloadDetail = function(){
                $scope.view.condition.countryCode = $scope.handleCountryName($scope.view.condition.countryCodeInDB);
                if($scope.view.downloadAllCheckBox){
                    var url = config.so_domain + '/saleorders/exportDetailAll?';
                    url += "orderStatus="+$scope.view.condition.orderStatus;
                    url += "&countryCode="+$scope.view.condition.countryCode;
                    url += "&campaignSource="+$scope.view.condition.campaignSource;
                    url += "&campaignMedium="+$scope.view.condition.campaignMedium;
                    url += "&incoterm="+$scope.view.condition.incoterm;
                    url += "&buyerName="+$scope.view.condition.buyerName;
                    url += "&dateFrom="+$scope.utcDateFormat($scope.view.condition.dateFrom);
                    url += "&dateTo="+$scope.utcDateFormat($scope.view.condition.dateTo);
                    url += "&email="+$scope.view.condition.email;
                    url += "&orderNo="+$scope.view.condition.orderNo;
                    $window.location.href = url;
                    return;
                }
                //toaster.pop('info', $scope.view.so_selectedList );
                $scope.orderNoArray = $scope.view.so_selectedList;
                var orderNoStr = $scope.orderNoArray.join(",");
                //toaster.pop('info',orderNoStr);
                if(!orderNoStr){
                    toaster.pop('warn','请勾选！');
                    return;
                }
                $window.location.href = config.so_domain+"/saleorders/export/"+orderNoStr;
            };

            $scope.page = function(pageNum) {
                $scope.view.condition.pageNo = pageNum;
                if ($scope.view.result.pageSize > 0) {
                    $scope.view.condition.pageSize = $scope.view.result.pageSize > 100 ? 100 : $scope.view.result.pageSize;
                };
                $scope.view.loading = true;
                $scope.view.condition.countryCode = $scope.handleCountryName($scope.view.condition.countryCodeInDB);
                //debugger;
                soService.list($scope.view.condition).then(
                    function(data) {
                        if (data.status == '200') {
                            var res = data;
                            $scope.view.result.Items = res.items;
                            if(res.paginate){
                                $scope.view.result.PageSize = res.paginate.pageSize;
                                $scope.view.result.PageAmount = res.paginate.pagesCount;
                                $scope.view.result.TotalCount = res.paginate.totalItemsCount;
                                $scope.view.result.PageIndex = res.paginate.pageNumber;
                            }
                            //toaster.pop('success',"加载列表成功");
                        } else {
                            toaster.pop('error', '加载列表失败，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while search order.');
                    }
                );
            };

            ///**
            // * page changed
            // */
            //$scope.pageChanged = function() {
            //    $scope.page($scope.queryResult.PageIndex);
            //};
            //
            $scope.reset = function() {
                $scope.view.condition = {
                    orderStatus:'',
                    countryCode:'',
                    countryCodeInDB:'',
                    incoterm:'',
                    dateFrom:'',
                    dateTo:'',
                    buyerName:'',
                    email:'',
                    orderNo:'',
                    pageIndex: 1,
                    pageSize: 10
                };
            };

            //退款操作
            $scope.refund = function(){
                //toaster.pop('success',$scope.view.selectedRowRadioValue);
                var orderNoArray = $scope.view.so_selectedList;

                var orderNoStr = orderNoArray.join(",");
/*                if(!$scope.view.selectedRowRadioValue){
                    toaster.pop('error', '退款失败，原因：此条订单数据为空！' );
                    return;
                }*/
                if(!orderNoArray||orderNoArray.length == 0){
                    toaster.pop('error', '退款失败，原因：此条订单数据为空！' );
                    return;
                }
                if(orderNoArray.length > 1){
                    toaster.pop('error', '退款失败，原因：只能操作一条订单，不可多选！' );
                    return;
                }

                if(!$scope.view.result.Items){
                    toaster.pop('error', '退款失败，原因：订单列表为空！' );
                    return;
                }
                var item = {};
                for(var i=0;i<$scope.view.result.Items.length;i++){
                    if(orderNoStr == $scope.view.result.Items[i].orderNo){
                        item = $scope.view.result.Items[i];
                    }
                }

                var cond = {
                    "transType":"CREDITING",      		   //交易类型
                    "amount":"",                         //退款金额
                    "paymentType":"",		           //支付方式
                    "orderNo":"",	           //订单号
                    "buyerId":""			   //买家ID
                };
                if(!item.payAmount){
                    toaster.pop('error', '此条订单数据的定金支付金额为空！' );
                    return;
                }
                cond.amount = ""+item.payAmount;
                if(!item.payMethodFirst){
                    toaster.pop('error', '此条订单数据的定金支付方式为空！' );
                    return;
                }
                cond.paymentType = ""+item.payMethodFirst;
                if(!item.orderNo){
                    toaster.pop('error', '此条订单数据的订单号为空！' );
                    return;
                }
                cond.orderNo = ""+item.orderNo;
                if(!item.buyerId){
                    toaster.pop('error', '此条订单数据的买家ID为空！' );
                    return;
                }
                cond.buyerId = ""+item.buyerId;

                $scope.view.loading = true;
                soService.refunds(cond).then(
                    function(data) {
                        if (data.status == '100') {
                            var res = data;
                            $scope.page($scope.view.result.PageIndex);
                            toaster.pop('success',"退款成功");
                        }else if(data.status == '409'){
                            toaster.pop('error', '执行审核不通过失败，原因：数据重复');
                        } else {
                            toaster.pop('error', '退款失败，原因：' + (data.msg?data.msg:data.status));
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while search order.');
                    }
                );
            };
            //更新风控状态操作
            $scope.updateFinanceConfirmStatus = function(orderNo,financeConfirmStatus){
                if(!orderNo){
                    toaster.pop('error', '操作失败，原因：订单号为空！' );
                    return;
                }


                soService.updateFinanceConfirmStatus(orderNo,financeConfirmStatus).then(
                    function(data) {
                        if (data.status == '200') {
                            var res = data;
                            $scope.page($scope.view.result.PageIndex);
                            toaster.pop('success',financeConfirmStatus+" success");
                        } else {
                            toaster.pop('error', financeConfirmStatus +" failed,"+ data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while updateFinanceConfirmStatus.');
                    }
                );
            };
            //approve操作
            $scope.approve = function(item){
                if(!item){
                    toaster.pop('error', '退款失败，原因：此条订单数据为空！' );
                    return;
                }

                var cond = {
                    "transType":"CAPTURING",      		   //交易类型
                    "amount":"",                         //退款金额
                    "paymentType":"",		           //支付方式
                    "orderNo":"",	           //订单号
                    "buyerId":""			   //买家ID
                };
                if(!item.payAmount){
                    toaster.pop('error', '此条订单数据的定金支付金额为空！' );
                    return;
                }
                cond.amount = ""+item.payAmount;
                if(!item.payMethodFirst){
                    toaster.pop('error', '此条订单数据的定金支付方式为空！' );
                    return;
                }
                cond.paymentType = ""+item.payMethodFirst;
                if(!item.orderNo){
                    toaster.pop('error', '此条订单数据的订单号为空！' );
                    return;
                }
                cond.orderNo = ""+item.orderNo;
                if(!item.buyerId){
                    toaster.pop('error', '此条订单数据的买家ID为空！' );
                    return;
                }
                cond.buyerId = ""+item.buyerId;

                $scope.view.loading = true;
                soService.capture(cond).then(
                    function(data) {
                        if (data.status == '100') {
                            var res = data;
                            $scope.page($scope.view.result.PageIndex);
                            toaster.pop('success',"审核通过");
                        }else if(data.status == '409'){
                            toaster.pop('error', '执行审核不通过失败，原因：数据重复');
                        } else {
                            toaster.pop('error', '执行审核通过失败，原因：' + (data.msg?data.msg:data.status));
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while search order.');
                    }
                );
            };

            //cancle操作
            $scope.cancel = function(item){
                if(!item){
                    toaster.pop('error', '退款失败，原因：此条订单数据为空！' );
                    return;
                }

                if(item.orderStatus == 'PENDING APPROVAL' && (item.payStatus=='WAIT'||item.payStatus=='failed')){
                    soService.updateOrderStatus(item.orderNo,"CANCELLED").then(
                        function(data) {
                            if (data.status == '200') {
                                var res = data;
                                $scope.page($scope.view.result.PageIndex);
                                toaster.pop('success',"修改状态成功");
                            } else {
                                toaster.pop('error', '修改状态失败，原因：' + data.msg);
                            }
                            $scope.view.loading = false;
                        },
                        function(errResponse) {
                            $scope.view.loading = false;
                            console.error('Error while update order status.');
                        }
                    );
                }else{
                    var cond = {
                        "transType":"AUTHORIZATION_REVERSAL",      		   //交易类型
                        "amount":"",                         //退款金额
                        "paymentType":"",		           //支付方式
                        "orderNo":"",	           //订单号
                        "buyerId":""			   //买家ID
                    };
                    if(!item.payAmount){
                        toaster.pop('error', '此条订单数据的定金支付金额为空！' );
                        return;
                    }
                    cond.amount = ""+item.payAmount;
                    if(!item.payMethodFirst){
                        toaster.pop('error', '此条订单数据的定金支付方式为空！' );
                        return;
                    }
                    cond.paymentType = ""+item.payMethodFirst;
                    if(!item.orderNo){
                        toaster.pop('error', '此条订单数据的订单号为空！' );
                        return;
                    }
                    cond.orderNo = ""+item.orderNo;
                    if(!item.buyerId){
                        toaster.pop('error', '此条订单数据的买家ID为空！' );
                        return;
                    }
                    cond.buyerId = ""+item.buyerId;


                    $scope.view.loading = true;
                    soService.authorizationReversal(cond).then(
                        function(data) {
                            if (data.status == '100') {
                                var res = data;
                                $scope.page($scope.view.result.PageIndex);
                                toaster.pop('success',"审核不通过已执行");
                            }else if(data.status == '409'){
                                toaster.pop('error', '执行审核不通过失败，原因：数据重复');
                            } else {
                                toaster.pop('error', '执行审核不通过失败，原因：' + (data.msg?data.msg:data.status));
                            }
                            $scope.view.loading = false;
                        },
                        function(errResponse) {
                            $scope.view.loading = false;
                            console.error('Error while search order.');
                        }
                    );
                }
            };
            //
            // init the page.
            $scope.page(1);
            $scope.loading = false;
            //
            ////link to detail page
            $scope.gotoPage = function(pageState, orderId) {
                if (pageState) {
                    $state.go(pageState, {
                        id: orderId
                    });
                };
            }

            $scope.updateOrderStatus = function(orderNo,orderStatusIndex){
                var orderStatus = "PENDING APPROVAL";
                switch(orderStatusIndex){
                    case 1:orderStatus="ClOSED";break;
                    case 2:orderStatus="PENDING BILLING";break;
                    case 3:orderStatus="BILLED";break;
                }

                soService.updateOrderStatus(orderNo,orderStatus).then(
                    function(data) {
                        if (data.status == '200') {
                            var res = data;
                            $scope.page($scope.view.result.PageIndex);
                            toaster.pop('success',"修改状态成功");
                        } else {
                            toaster.pop('error', '修改状态失败，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while update order status.');
                    }
                );
            };

            $scope.getOrderDetail=function(orderId){
                $scope.gotoPage("so.info.view",orderId);
            };

            $scope.pageChanged = function(){
                $scope.page($scope.view.result.pageIndex);
            };

            $scope.getApproveStyle = function(item){
                return item.orderStatus=='PENDING APPROVAL' &&item.payStatus == 'AUTHORIZING' &&
                item.financeConfirmStatus=='ACCEPT' ?{'color': 'blue'}:{'color': 'grey'};
            };

            $scope.getCancelStyle = function(item){
                return (item.orderStatus=='PENDING APPROVAL' && item.financeConfirmStatus != 'ACCEPT')
                    ||((item.payStatus=='WAIT'||item.payStatus=='failed')&&item.orderStatus=='PENDING APPROVAL'&&!item.financeConfirmStatus)
                    ||(item.orderStatus=='PENDING APPROVAL'&&item.financeConfirmStatus != 'REJECT')?
                {'color': 'blue'}:{'color': 'grey'};
            };
            $scope.getCloseStyle = function(item){
                return item.orderStatus=='PENDING FULFILLMENT' && item.financeConfirmStatus=='ACCEPT'?
                {'color': 'blue'}:{'color': 'grey'};
            };
            $scope.getFullfillStyle = function(item){
                return item.orderStatus=='PENDING FULFILLMENT' && item.financeConfirmStatus=='ACCEPT'?
                {'color': 'blue'}:{'color': 'grey'};
            };
            $scope.getBillStyle = function(item){
                return item.orderStatus=='PENDING BILLING' && item.financeConfirmStatus=='ACCEPT'?
                {'color': 'blue'}:{'color': 'grey'};
            };
            $scope.getApproveDisable = function(item){
                return !(item.orderStatus=='PENDING APPROVAL' &&item.payStatus == 'AUTHORIZING' && item.financeConfirmStatus=='ACCEPT');
            };

            $scope.getCancelDisable = function(item){
                return !(
                (item.orderStatus=='PENDING APPROVAL' && item.financeConfirmStatus != 'ACCEPT')
                ||((item.payStatus=='WAIT'||item.payStatus=='failed')&&item.orderStatus=='PENDING APPROVAL'&&!item.financeConfirmStatus)
                ||(item.orderStatus=='PENDING APPROVAL'&&item.financeConfirmStatus != 'REJECT')
                );
            };
            $scope.getCloseDisable = function(item){
                return !(item.orderStatus=='PENDING FULFILLMENT' && item.financeConfirmStatus=='ACCEPT');
            };
            $scope.getFullfillDisable = function(item){
                return !(item.orderStatus=='PENDING FULFILLMENT' && item.financeConfirmStatus=='ACCEPT');
            };
            $scope.getBillDisable = function(item){
                return !(item.orderStatus=='PENDING BILLING' && item.financeConfirmStatus=='ACCEPT');
            };

        }];
});
