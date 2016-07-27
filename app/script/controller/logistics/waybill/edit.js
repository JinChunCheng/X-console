define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'LogisticsService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, LogisticsService, toaster) {
         ph.mark($rootScope, {
            state: 'logistics.waybill.edit',
            title: '订舱单详情'
        });

        $scope.isSaving = false;
        $scope.isCompleted = false;

        $scope.trackDetailId=$stateParams.trackDetailId;

        $scope.subWaybill={};
        $scope.trackDetail={};

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

        $scope.condition = {
            transportationMode:'',
            serviceType:'UN-DDU',
            originCountry:'',
            originState:'',
            originCity:'',
            destCountry:'',
            destState:''
        };
         //子订舱列表的查询条件
        //$scope.subWBCondition = {
        //    trackId:$stateParams.trackId
        //};


        //加载子订舱详情
        $scope.loadSubWaybillInfo=function(){
            $scope.swbDetailLoading = true;
            //alert('$stateParams.trackDetailId=' + $stateParams.trackDetailId);
            LogisticsService.loadSubWaybill($stateParams.trackDetailId).then(
                function(data) {
                    if (data.status == '200') {

                        $scope.subWaybill = data.items;
                        $scope.originCountryCode = data.items.originCountryCode;
                        $scope.originStateCode = data.items.originStateCode;
                        $scope.destCountryCode = data.items.destCountryCode;
                        $scope.destStateCode = data.items.destStateCode;
                        
                        $scope.loadOrgStateList();
                        $scope.loadOrgCityList();
                        $scope.loadDestStateList();
                        $scope.loadDestCityList();

                        //Init to load POL and POD List
                        $scope.condition.transportationMode = data.items.transportMode;
                        $scope.condition.originCountry = data.items.polCountrycode;
                        $scope.condition.destCountry = data.items.podCountrycode;
                        $scope.loadPortInfo("origin");
                        $scope.loadPortInfo("dest");

                        $scope.swbDetailLoading = false;

                        if ($scope.subWaybill.complete==1) {
                            $scope.isCompleted=true;
                        };

                    } else if (data.status == '404'){
                        $scope.subWaybill = '';
                        $scope.swbDetailLoading = false;
                        
                    } else{
                        toaster.pop('error', '加载订舱单详情失败，原因：' + data.msg);
                        $scope.swbDetailLoading = false;
                    }
                },
                function(errResponse) {
                    console.error('Error while loading subwaybill information.');
                    $scope.swbDetailLoading = true;
                }
            );
        };

        //加载子订舱的物流详情
        $scope.loadTrackDetailInfo=function(){
            //$scope.swbDetailLoading = true;
            //alert('$stateParams.trackDetailId=' + $stateParams.trackDetailId);
            //alert('$scope.orderId=' + $scope.orderId);
            LogisticsService.loadSubWaybillDetail($stateParams.trackDetailId).then(
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

        //加载发货人国家列表
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
        //加载发货人国家州省列表
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
        //加载发货人城市列表
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
        //加载收货人国家州省列表
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
        //加载收货人城市列表
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

        //第一次进行自动加载订舱单详情
        $scope.loadSubWaybillInfo();
        $scope.loadTrackDetailInfo();
        $scope.loadVendorList();
        $scope.loadCountryList();
        //alert("Countrycode=" + $scope.subWaybill.originCountryCode);
        //$scope.loadStateList();
        //$scope.loadCityList(originCountryCode, originStateCode);
        //$scope.loadCityList();
        //订舱单详情 End

        $scope.reloadOrgStates=function(){
            //alert("subWaybillForm.originCountryCode.value=" + subWaybillForm.originCountryCode.value);
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

        // 修改订舱信息
        $scope.updateSubWaybill=function(){
            $scope.isSaving = true;
            //jQuery
            //var txt=$("#originStateCode").find("option:selected").text().replace(/ /g, "");
            //var txt = $("#originStateCode option:selected").text();
            //alert("Origin State Name= #" + txt + " #");
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

            $scope.subWaybill.trackDetailId=$scope.trackDetailId;
            
            LogisticsService.editSubWaybill($scope.subWaybill).then(
                function(data){
                    if (data.status=='200') {
                        LogisticsService.editTrackSchedule($scope.trackDetail).then(
                            function(data){
                                if (data.status=='200') {
                                     toaster.pop('success', '修改成功！');
                                     $scope.isSaving = false;
                                     $scope.back();
                                }else{
                                    toaster.pop('error', '修改失败，原因：' + data.msg);
                                    $scope.isSaving = false;
                                }
                            },
                            function(errResponse){
                                 console.error('Error while update track detail.');
                                $scope.isSaving = true;
                            }
                        );
                    }else{
                        toaster.pop('error', '修改失败，原因：' + data.msg);
                        $scope.isSaving = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while update Sub-Waybill.');
                    $scope.isSaving = true;
                }
            );
            
        };


    }];
});
