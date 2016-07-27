define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'LogisticsService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, LogisticsService, toaster) {

        /*
        ph.mark($rootScope, {
            state: 'logistics.waybill.edit',
            title: '订舱单详情'
        });
        */

        $scope.isSaving = false;
        var init = function() {
                //alert("name=" + $state.current.name);
                switch ($state.current.name) {
                    case 'logistics.waybill.add':
                        title = '新增订舱信息';
                        isAdd = true;
                        break;
                    case 'logistics.waybill.edit':
                        title = '修改订舱信息';
                        isEdit = true;
                        break;
                    default:
                        break;
                }

                /**
                 * breadscrumb
                 * @type {String}
                 */
                ph.mark($rootScope, {
                    state: 'logistics.waybill.edit',
                    title: title
                });
            };
            init();
        
        $scope.orderId=$stateParams.orderId;
        $scope.trackId=$stateParams.trackId;
        $scope.trackDetailId=$stateParams.trackDetailId;

        $scope.saleOrder={};
        $scope.subWaybill={
            trackDetailId:'',
            parentDetailId:'',
            trackId:'',
            trackNo:'',
            subTrackNo:'',
            originCountryCode:'',
            originStateCode:'',
            originCityCode:'',
            originCountry:'',
            originState:'',
            originCity:'',
            destCountryCode:'',
            destStateCode:'',
            destCityCode:'',
            destCountry:'',
            destState:'',
            destCity:'',
            polCountrycode:'',
            polCountry:'',
            POL:'',
            podCountrycode:'',
            podCountry:'',
            POD:'',
            totalPackage:'',
            totalQty:'',
            totalWeight:'',
            totalVolume:'',
            weightUnit:'KG',
            volumeUnit:'CBM',
            consignerName:'',
            consignerAddr:'',
            consignerContacter:'',
            consignerContactNo:'',
            consignerEmail:'',
            consigneeName:'',
            consigneeAddr:'',
            consigneeContacter:'',
            consigneeContactNo:'',
            consigneeEmail:'',
            notifyName:'',
            notifyAddr:'',
            notifyContacter:'',
            notifyContactNo:'',
            notifyEmail:'',
            status:'',
            complete:'0',
            sortSeq:'',
            remarks:'',
            soTotalShippingCost:'',
            soCurrency:''
        };
        $scope.trackDetail={
            blId:'0',
            trackDetailId:'0',
            blNo:'',
            vendorCode:'',
            transportMode:'',
            incoterm:'',
            intendedVFNo:'',
            containerNo:'',
            polETD:'',
            etd:'',
            podETA:'',
            destETA:'',
            receiptDate:'',
            recipients:'',
            truckNo:'',
            truckContactPerson:'',
            truckContactNo:'',
            shippingCost:'',
            currency:''
        };

        $scope.trackNo=false;

        $scope.vendorList={};
        $scope.countryList={};
        $scope.originStateList={};
        $scope.originCityList={};
        $scope.destStateList={};
        $scope.destCityList={};
        $scope.originPortList={};
        $scope.destPortList={};
        $scope.transportModeList=[{
                value: 'POST',
                text: 'By Post'
            }, {
                value: 'Express',
                text: 'By Courier'
            }, {
                value: 'OCEAN',
                text: 'By Ocean'
            }, {
                value: 'AIR',
                text: 'By Air'
            }, {
                value: 'TRUCK',
                text: 'By Truck'
            }];
        $scope.incotermList=[{
                value: 'FOB',
                text: 'FOB'
            }, {
                value: 'CIF',
                text: 'CIF'
            }, {
                value: 'DDU',
                text: 'DDU'
            }, {
                value: 'DDP',
                text: 'DDP'
            }, {
                value: 'Sample',
                text: 'Sample'
            }];


         //子订舱列表的查询条件
        //$scope.subWBCondition = {
        //    trackId:$stateParams.trackId
        //};

        $scope.condition = {
            transportationMode:'',
            serviceType:'UN-DDU',
            originCountry:'',
            originState:'',
            originCity:'',
            destCountry:'',
            destState:''
        };

        //加载销售单信息
       $scope.loadSalesOrderInfo=function(){
            $scope.swbDetailLoading = true;
            LogisticsService.loadSaleOrderInfo($stateParams.orderId).then(
                function(data) {
                    //$scope.warehouse = data.items;
                    if (data.status == '200') {
                        $scope.saleOrder = data.items;
                        $scope.trackNo = $scope.saleOrder.trackNo;
                        if($scope.trackDetailId == 0){
                            $scope.subWaybill.trackId = $stateParams.trackId;
                            $scope.subWaybill.trackNo = $scope.saleOrder.trackNo;
                            $scope.subWaybill.totalWeight = $scope.saleOrder.totalWeight;
                            $scope.subWaybill.totalVolume = $scope.saleOrder.totalVolume;
                            $scope.subWaybill.totalQty = $scope.saleOrder.totalPackage;
                            
                            $scope.trackDetail.transportMode = $scope.saleOrder.transportMode;
                            $scope.trackDetail.incoterm = $scope.saleOrder.incoterm;

                            $scope.subWaybill.originCountryCode = $scope.saleOrder.originCountryCode;
                            $scope.subWaybill.originStateCode = $scope.saleOrder.originStateCode;
                            $scope.subWaybill.originCityCode = $scope.saleOrder.originCityCode;
                            
                            $scope.subWaybill.destCountryCode=$scope.saleOrder.destCountryCode;
                            $scope.subWaybill.destStateCode=$scope.saleOrder.destStateCode;
                            $scope.subWaybill.destCityCode=$scope.saleOrder.destCityCode;
                            $scope.subWaybill.destCountry='';
                            $scope.subWaybill.destState='';
                            $scope.subWaybill.destCity='';

                            $scope.subWaybill.polCountrycode = $scope.saleOrder.originCountryCode;
                            $scope.subWaybill.podCountrycode=$scope.saleOrder.destCountryCode;
                            $scope.subWaybill.soTotalShippingCost=$scope.saleOrder.shippingCost;
                            $scope.subWaybill.soCurrency=$scope.saleOrder.currency;


                            $scope.subWaybill.consigneeName = $scope.saleOrder.consigneeName;
                            $scope.subWaybill.consigneeAddr=$scope.saleOrder.consigneeAddr;
                            $scope.subWaybill.consigneeContacter = $scope.saleOrder.consigneeContacter;
                            $scope.subWaybill.consigneeContactNo = $scope.saleOrder.consigneeContactNo;
                            $scope.subWaybill.consigneeEmail = $scope.saleOrder.consigneeEmail;

                            $scope.subWaybill.notifyName = $scope.saleOrder.notifyName;
                            $scope.subWaybill.notifyAddr=$scope.saleOrder.notifyAddr;
                            $scope.subWaybill.notifyContacter = $scope.saleOrder.notifyContacter;
                            $scope.subWaybill.notifyContactNo = $scope.saleOrder.notifyContactNo;
                            $scope.subWaybill.notifyEmail = $scope.saleOrder.notifyEmail;

                             //Init to load POL and POD List
                            $scope.condition.transportationMode = $scope.saleOrder.transportMode;
                            $scope.condition.originCountry = $scope.saleOrder.originCountryCode;
                            $scope.condition.destCountry = $scope.saleOrder.destCountryCode;
                            $scope.loadPortInfo("origin");
                            $scope.loadPortInfo("dest");

                            $scope.originCountryCode = $scope.saleOrder.originCountryCode;
                            $scope.originStateCode = $scope.saleOrder.originStateCode;
                            $scope.destCountryCode = $scope.saleOrder.destCountryCode;
                            $scope.destStateCode = $scope.saleOrder.destStateCode;
                            if ($scope.saleOrder.originCountryCode=='') {
                                $scope.subWaybill.originCountryCode = 'CN';
                                $scope.originCountryCode = 'CN';
                            };

                            $scope.loadOrgStateList();
                            if ($scope.originStateCode!=null && $scope.originStateCode!='') $scope.loadOrgCityList();
                            $scope.loadDestStateList();
                            if ($scope.destStateCode!=null && $scope.destStateCode!='') $scope.loadDestCityList();
                        };

                        $scope.swbDetailLoading = false;
                    } else {
                        toaster.pop('error', '订舱单初始化失败，原因：' + data.msg);
                        $scope.swbDetailLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while init sub-waybill.');
                    $scope.swbDetailLoading = true;
                }
            );
       };

        //加载子订舱详情
        $scope.loadSubWaybillInfo=function(){
            $scope.swbDetailLoading = true;
            //alert('$stateParams.trackDetailId=' + $stateParams.trackDetailId);
            LogisticsService.loadSubWaybill($stateParams.trackDetailId).then(
                function(data) {
                    if (data.status == '200') {

                        $scope.subWaybill = data.items;
                        
                        $scope.originCountryCode = data.items.destCountryCode;
                        $scope.originStateCode = data.items.destStateCode;
                        $scope.destCountryCode = $scope.saleOrder.destCountryCode;
                        $scope.destStateCode = $scope.saleOrder.destStateCode;
                        // alert('$scope.originStateCode=' + $scope.saleOrder.destCountryCode);

                        $scope.subWaybill.trackDetailId = '';
                        $scope.subWaybill.parentDetailId = $stateParams.trackDetailId;
                        $scope.subWaybill.trackId = $stateParams.trackId;

                        $scope.subWaybill.originCountryCode=data.items.destCountryCode;
                        $scope.subWaybill.originStateCode=data.items.destStateCode;
                        $scope.subWaybill.originCityCode=data.items.destCityCode;
                        $scope.subWaybill.originCountry=data.items.destCountry;
                        $scope.subWaybill.originState=data.items.destState;
                        $scope.subWaybill.originCity=data.items.destCity;
                        
                        $scope.subWaybill.consignerName = data.items.consigneeName;
                        $scope.subWaybill.consignerContacter = data.items.consigneeContacter;
                        $scope.subWaybill.consignerContactNo = data.items.consigneeContactNo;
                        $scope.subWaybill.consignerEmail = data.items.consigneeEmail;
                        $scope.subWaybill.consignerAddr=data.items.consingeeAddr;

                        $scope.subWaybill.destCountryCode=$scope.saleOrder.destCountryCode;
                        $scope.subWaybill.destStateCode=$scope.saleOrder.destStateCode;
                        $scope.subWaybill.destCityCode=$scope.saleOrder.destCityCode;
                        //alert('$scope.subWaybill.destCountryCode=' + $scope.subWaybill.destCountryCode);
                        // $scope.subWaybill.destStateCode='';
                        // $scope.subWaybill.destCityCode='';
                        $scope.subWaybill.destCountry='';
                        $scope.subWaybill.destState='';
                        $scope.subWaybill.destCity='';
                        $scope.subWaybill.remarks='';

                        $scope.subWaybill.polCountrycode = $scope.saleOrder.originCountryCode;
                        $scope.subWaybill.podCountrycode=$scope.saleOrder.destCountryCode;
                        $scope.subWaybill.soTotalShippingCost=$scope.saleOrder.shippingCost;
                        $scope.subWaybill.soCurrency=$scope.saleOrder.currency;

                        $scope.subWaybill.consigneeName = $scope.saleOrder.consigneeName;
                        $scope.subWaybill.consigneeAddr=$scope.saleOrder.consigneeAddr;
                        $scope.subWaybill.consigneeContacter = $scope.saleOrder.consigneeContacter;
                        $scope.subWaybill.consigneeContactNo = $scope.saleOrder.consigneeContactNo;
                        $scope.subWaybill.consigneeEmail = $scope.saleOrder.consigneeEmail;

                        $scope.subWaybill.notifyName = $scope.saleOrder.notifyName;
                        $scope.subWaybill.notifyAddr=$scope.saleOrder.notifyAddr;
                        $scope.subWaybill.notifyContacter = $scope.saleOrder.notifyContacter;
                        $scope.subWaybill.notifyContactNo = $scope.saleOrder.notifyContactNo;
                        $scope.subWaybill.notifyEmail = $scope.saleOrder.notifyEmail;                       

                        $scope.loadOrgStateList();
                        $scope.loadOrgCityList();
                        $scope.loadDestStateList();
                        $scope.loadDestCityList();
                        
                        $scope.swbDetailLoading = false;                        
                    } else if (data.status == '404'){
                        $scope.subWaybill = '';
                        $scope.swbDetailLoading = false;
                        
                    } else{
                        toaster.pop('error', '加载子订舱单详情失败，原因：' + data.msg);
                        $scope.swbDetailLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading subwaybill information.');
                    $scope.swbDetailLoading = true;
                }
            );

            
        };
        /*
        //加载子订舱详情
        $scope.loadTrackDetailInfo=function(){
            //$scope.swbDetailLoading = true;
            //alert('$stateParams.trackDetailId=' + $stateParams.trackDetailId);
            //alert('$scope.orderId=' + $scope.orderId);
            LogisticsService.loadTrackDetail($stateParams.trackDetailId).then(
                function(data) {
                    if (data.status == '200') {

                        $scope.trackDetail = data.items;
                        //$scope.swbDetailLoading = false;                        
                    } else if (data.status == '404'){
                        //$scope.subWaybill = '';
                        $scope.trackDetail = false;
                        
                    } else{
                        toaster.pop('error', '加载子订舱单详情失败，原因：' + data.msg);
                        //$scope.swbDetailLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading trackdetail information.');
                    //$scope.swbDetailLoading = true;
                }
            );
        };
        */
        //加载物流供应商列表
        $scope.loadVendorList=function(){
            LogisticsService.loadVendorList().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.vendorList = data.items;
                    } else if (data.status == '404'){
                        $scope.vendorList = false;
                    } else{
                        toaster.pop('error', '加载物流供应商列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading logistics vendor information.');
                }
            );
        };
        //加载国家列表
        $scope.loadCountryList=function(){
            LogisticsService.loadCountries().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.countryList = data.items;
                    } else if (data.status == '404'){
                        $scope.countryList = false;
                    } else{
                        toaster.pop('error', '加载国家列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading countries information.');
                }
            );
        };
        //加载发货国家州省列表
        $scope.loadOrgStateList=function(){
            //alert("countryCode is " + $scope.originCountryCode);
            LogisticsService.loadCountryStates($scope.originCountryCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originStateList = data.items;
                    } else if (data.status == '404'){
                        $scope.originStateList = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading states information.');
                }
            );
        };
        //加载发货城市列表
        $scope.loadOrgCityList=function(){
            //alert("stateCode is" + stateCode);
            LogisticsService.loadCities($scope.originCountryCode, $scope.originStateCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originCityList = data.items;
                    } else if (data.status == '404'){
                        $scope.originCityList = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading origin cities information.');
                }
            );
        };
        //加载收货国家州省列表
        $scope.loadDestStateList=function(){
            LogisticsService.loadCountryStates($scope.destCountryCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.destStateList = data.items;
                    } else if (data.status == '404'){
                        $scope.destStateList = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading dest states information.');
                }
            );
        };
        //加载收货城市列表
        $scope.loadDestCityList=function(){
            LogisticsService.loadCities($scope.destCountryCode, $scope.destStateCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.destCityList = data.items;
                    } else if (data.status == '404'){
                        $scope.destCityList = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading dest cities information.');
                }
            );
        };

        //加载港口信息
        $scope.loadPortInfo=function(type){
            if($scope.condition.transportationMode!=''&& 
                    ($scope.condition.transportationMode=='OCEAN' || $scope.condition.transportationMode=='AIR'))
            {
                LogisticsService.loadPortsInfo($scope.condition,type).then(
                    function(data) {
                        if (data.status == '200') {
                            if (type=='origin') {
                                $scope.originPortList=data.items;
                            }else{
                                $scope.destPortList=data.items;
                            }
                        } else {
                            toaster.pop('error', '加载港口信息失败，原因：' + data.msg);
                            if (type=='origin') {
                                $scope.originPortList=null;
                            }else{
                                $scope.destPortList=null;
                            }
                        }
                    },
                    function(errResponse) {
                        console.error('Error  logistics stateInfo.');
                    }
                );
            }
        }
        //当运输方式或发货国家或目的国家变更之后，刷新港口信息
        $scope.reloadPortList=function(type){
            $scope.condition.transportationMode=subWaybillForm.transportMode.value;
            $scope.condition.originCountry=subWaybillForm.polCountrycode.value;
            $scope.condition.destCountry=subWaybillForm.podCountrycode.value;

            if ($scope.condition.transportationMode!='' && 
                    ($scope.condition.transportationMode=='OCEAN' || $scope.condition.transportationMode=='AIR')) {
                if(type!=''){
                    if ($scope.condition.originCountry!='' && type=='origin') $scope.loadPortInfo(type);
                    if ($scope.condition.destCountry!='' && type=='dest') $scope.loadPortInfo(type);
                }else{
                    if ($scope.condition.originCountry!='') $scope.loadPortInfo('origin');
                    if ($scope.condition.destCountry!='') $scope.loadPortInfo('dest');
                }
            }else{
                $scope.originPortList = null;
                $scope.destPortList = null;
            }
        };
        

        $scope.initFormData=function(){
            alert($scope.saleOrder.consigneeName);
            if($scope.trackDetailId = 0){
                $scope.subWaybill.trackNo = $scope.saleOrder.trackNo;
                $scope.subWaybill.originCountryCode = 'CN';
            }else{
                $scope.loadSubWaybillInfo();

                $scope.subWaybill.parentDetailId = $scope.subWaybill.trackDetailId;
                $scope.subWaybill.trackDetailId = '';
                $scope.subWaybill.originCountryCode=$scope.subWaybill.destCountryCode;
                $scope.subWaybill.originStateCode=$scope.subWaybill.destStateCode;
                $scope.subWaybill.originCityCode=$scope.subWaybill.destCityCode;
                $scope.subWaybill.originCountry=$scope.subWaybill.destCountry;
                $scope.subWaybill.originState=$scope.subWaybill.destState;
                $scope.subWaybill.originCity=$scope.subWaybill.destCity;

                $scope.subWaybill.consignerAddr=$scope.subWaybill.consingeeAddr;
                
            }
            alert('$scope.saleOrder.destCountryCode=' + $scope.saleOrder.destCountryCode);
            $scope.subWaybill.destCountryCode=$scope.saleOrder.destCountryCode;
            alert('$scope.subWaybill.destCountryCode=' + $scope.subWaybill.destCountryCode);
            $scope.subWaybill.destStateCode='';
            $scope.subWaybill.destCityCode='';
            $scope.subWaybill.destCountry='';
            $scope.subWaybill.destState='';
            $scope.subWaybill.destCity='';

            $scope.subWaybill.consigneeName = $scope.saleOrder.consigneeName;
            $scope.subWaybill.consigneeAddr=$scope.saleOrder.consigneeAddr;
            $scope.subWaybill.consigneeContacter = $scope.saleOrder.consigneeContacter;
            $scope.subWaybill.consigneeContactNo = $scope.saleOrder.consigneeContactNo;
            $scope.subWaybill.consigneeEmail = $scope.saleOrder.consigneeEmail;

            $scope.subWaybill.notifyName = $scope.saleOrder.notifyName;
            $scope.subWaybill.notifyAddr=$scope.saleOrder.notifyAddr;
            $scope.subWaybill.notifyContacter = $scope.saleOrder.notifyContacter;
            $scope.subWaybill.notifyContactNo = $scope.saleOrder.notifyContactNo;
            $scope.subWaybill.notifyEmail = $scope.saleOrder.notifyEmail;
            //End of the first loading
        };

        //第一次进行自动加载新增订舱单的信息
        $scope.loadSalesOrderInfo();
        if($scope.trackDetailId >0 )    $scope.loadSubWaybillInfo();

        $scope.loadVendorList();
        $scope.loadCountryList();
        //alert("Countrycode=" + $scope.subWaybill.originCountryCode);
        //$scope.loadStateList();
        //$scope.loadCityList(originCountryCode, originStateCode);

        //订舱单详情 End

        $scope.reloadOrgStates=function(){
            alert("subWaybillForm.originCountryCode.value=" + subWaybillForm.originCountryCode.value);
            LogisticsService.loadCountryStates(subWaybillForm.originCountryCode.value).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originStateList = data.items;
                        $scope.originCityList = false;
                    } else if (data.status == '404'){
                        $scope.originStateList = false;
                    }
                }
            );
        };
        $scope.reloadOrgCities=function(){
            LogisticsService.loadCities(subWaybillForm.originCountryCode.value, subWaybillForm.originStateCode.value).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originCityList = data.items;
                    } else if (data.status == '404'){
                        $scope.originCityList = false;
                    }
                }
            );
        };
        $scope.reloadDestStates=function(){
            LogisticsService.loadCountryStates(subWaybillForm.destCountryCode.value).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.destStateList = data.items;
                        $scope.destCityList = false;
                    } else if (data.status == '404'){
                        $scope.destStateList = false;
                    }
                }
            );
        };
        $scope.reloadDestCities=function(){
            LogisticsService.loadCities(subWaybillForm.destCountryCode.value, subWaybillForm.destStateCode.value).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.destCityList = data.items;
                    } else if (data.status == '404'){
                        $scope.destCityList = false;
                    }
                }
            );
        };

        $scope.back=function(){
        	$state.go('logistics.waybill.view', {
                orderId: $stateParams.orderId,
                trackId: $stateParams.trackId,
                condition:$stateParams.condition
            });
        };
        
        $scope.openPolEtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openA = true;
        };

        $scope.openEtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openD = true;
        };
        
        $scope.openPodEta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };

        $scope.openDestEta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openC = true;
        };

        $scope.allowIntOnly=function($event){
            var e = $event||window.event;
            var key = e.keyCode;
            //firefox delete/光标左右键
            if(key!=8&&key!=37&&key!=39){
                //for firefox
                if(key==0) key=e.which;
                //for IE/Chrome/Firefox
                if (key < 48 || key > 57) {
                    //$event.returnValue = false;
                    $event.preventDefault(); 
                    $event.stopPropagation();
                }
            }
        }

        $scope.allowFloatOnly=function($event){
            var e = $event||window.event;
            var key = e.keyCode;
            if(key==0) key=e.which;
            if ((key!=8&&key!=37&&key!=39&& key!=46&&(key < 48 || key > 57))) {
                //$event.returnValue = false; 
                $event.preventDefault(); 
                $event.stopPropagation();
            }
        }

        
        // 新增订舱信息
        $scope.saveSubWaybill=function(){
            $scope.isSaving = true;

            var obj = document.getElementById("originCountryCode");
            $scope.subWaybill.originCountry = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
            obj = document.getElementById("originStateCode");
            $scope.subWaybill.originState = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
            obj = document.getElementById("originCityCode");
            $scope.subWaybill.originCity = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
            obj = document.getElementById("destCountryCode");
            $scope.subWaybill.destCountry = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
            obj = document.getElementById("destStateCode");
            $scope.subWaybill.destState = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
            obj = document.getElementById("destCityCode");
            $scope.subWaybill.destCity = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;

             obj = document.getElementById("polCountrycode");
            $scope.subWaybill.polCountry = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;
             obj = document.getElementById("podCountrycode");
            $scope.subWaybill.podCountry = obj.options.selectedIndex==0?"":obj.options[obj.options.selectedIndex].text;

            //$scope.subWaybill.trackDetailId=$scope.trackDetailId;
            LogisticsService.insertSubwaybill($scope.subWaybill).then(
                function(data){
                    if (data.status=='200') {
                        //toaster.pop('success', '新增成功！');
                        //$scope.isSaving = false;
                        //alert(data.items);
                        //$scope.back();

                        $scope.trackDetail.trackDetailId = data.items;

                        LogisticsService.insertBLMaster($scope.trackDetail).then(
                            function(data){
                                if (data.status=='200') {
                                     toaster.pop('success', '新增成功！');
                                     $scope.isSaving = false;
                                     $scope.back();
                                }else{
                                    toaster.pop('error', '新增失败，原因：' + data.msg);
                                    $scope.isSaving = false;
                                }
                            },
                            function(errResponse){
                                 console.error('Error while create track detail.');
                                $scope.isSaving = true;
                            }
                        );
                        
                    }else{
                        toaster.pop('error', '新增失败，原因：' + data.msg);
                        $scope.isSaving = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while create Sub-Waybill.');
                    $scope.isSaving = true;
                }
            );
                        
        };
        
        /*
        $scope.saveSubWaybill=function(){
            $scope.isSaving = true;
            //$scope.subWaybill.trackDetailId=$scope.trackDetailId;
            LogisticsService.insertBLMaster($scope.trackDetail).then(
                function(data){
                    if (data.status=='200') {
                        toaster.pop('success', '新增成功！');
                        $scope.isSaving = false;
                        $scope.back();
                        
                        LogisticsService.editTrackSchedule($scope.trackDetail).then(
                            function(data){
                                if (data.status=='200') {
                                     toaster.pop('success', '新增成功！');
                                     $scope.isSaving = false;
                                     $scope.back();
                                }else{
                                    toaster.pop('error', '新增失败，原因：' + data.msg);
                                    $scope.isSaving = false;
                                }
                            },
                            function(errResponse){
                                 console.error('Error while create track detail.');
                                $scope.isSaving = true;
                            }
                        );
                    }else{
                        toaster.pop('error', '新增失败，原因：' + data.msg);
                        $scope.isSaving = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while create Sub-Waybill.');
                    $scope.isSaving = true;
                }
            );
            
        };
        */


    }];
});
