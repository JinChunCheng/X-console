define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'LogisticsService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, LogisticsService, toaster) {
         ph.mark($rootScope, {
            state: 'logistics.tracking.edit',
            title: '跟踪详情'
        });

        $scope.isSaving = false;
        $scope.isFinishing= false;
         $scope.isCompleted=false;

        $scope.trackDetailId=$stateParams.trackDetailId;

        $scope.subWaybill={};
        $scope.trackDetail={};

        var originCountryCode;
        var originStateCode;
        var destCountryCode;
        var destStateCode;

        $scope.vendorList={};
        $scope.countryList={};
        $scope.originStateList={};
        $scope.originCityList={};
        $scope.destStateList={};
        $scope.destCityList={};
        $scope.transportModeList=[{
                value: 'POST',
                text: 'By Post'
            }, {
                value: 'EXPRESS',
                text: 'By Courier'
            }, {
                value: 'OCEAN',
                text: 'By Ocean'
            }, {
                value: 'AIR',
                text: 'By Air'
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
            }];


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
                        originCountryCode = data.items.originCountryCode;
                        originStateCode = data.items.originStateCode;
                        destCountryCode = data.items.destCountryCode;
                        destStateCode = data.items.destStateCode;
                        //alert(originCountryCode);
                        $scope.swbDetailLoading = false; 
                        if ($scope.subWaybill.complete==1) {
                            $scope.isCompleted=true;
                        };                       
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

        //加载子订舱详情
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
        //加载国家州省列表
        $scope.loadStateList=function(){
            //alert("countryCode is " + originCountryCode);
            LogisticsService.loadCountryStates(originCountryCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originStateList = data.items;
                    } else if (data.status == '404'){
                        $scope.originStateList = false;
                    } else{
                        toaster.pop('error', '加载国家州省列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading states information.');
                }
            );
        };
        //加载城市列表
        $scope.loadCityList=function(countryCode, stateCode){
            //alert("stateCode is" + stateCode);
            LogisticsService.loadCities(countryCode, stateCode).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.originCityList = data.items;
                    } else if (data.status == '404'){
                        $scope.originCityList = false;
                    } else{
                        toaster.pop('error', '加载城市列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while loading states information.');
                }
            );
        };

        //第一次进行自动加载订舱单详情
        $scope.loadSubWaybillInfo();
        $scope.loadTrackDetailInfo();
        $scope.loadVendorList();
        $scope.loadCountryList();
        //alert("Countrycode=" + $scope.subWaybill.originCountryCode);
        //$scope.loadStateList();
        //$scope.loadCityList(originCountryCode, originStateCode);

        //订舱单详情 End

        
        $scope.back=function(){
        	$state.go('logistics.tracking.list', {
                condition:$stateParams.condition
            });
        };
        
        $scope.openPolEtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openA = true;
        };
        $scope.openPolAtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openPOLATD = true;
        };

        $scope.openPodEta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };
        $scope.openPodAta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openAta = true;
        };

        $scope.openDestEta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openC = true;
        };
        $scope.openDestAta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openDesAta = true;
        };

        $scope.openOriginCCD = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openOrgCCD = true;
        };
        $scope.openDestCCD = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openCcd = true;
        };

        $scope.openOntruckDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openOntruck = true;
        };
        $scope.openReceiptDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openReceipt = true;
        };



        $scope.openPodEta = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };
        $scope.openEtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openETD = true;
        };
        $scope.openAtd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openATD = true;
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
        $scope.updateTracking=function(){
            $scope.isSaving = true;
            //$scope.subWaybill.trackDetailId=$scope.trackDetailId;
            LogisticsService.updateTrackDetail($scope.trackDetail).then(
                function(data){
                    if (data.status=='200') {
                        toaster.pop('success', '跟踪信息修改成功！');
                        $scope.isSaving = false;
                        $scope.back();
                    }else{
                        toaster.pop('error', '跟踪信息修改失败，原因：' + data.msg);
                        $scope.isSaving = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while update tracking detail.');
                    $scope.isSaving = true;
                }
            );
            
        };

        $scope.complete=function(){
            $scope.isFinishing = true;
            LogisticsService.finishTracking($scope.trackDetail).then(
                function(data){
                    if (data.status=='200') {
                        toaster.pop('success', '跟踪完成！');
                        $scope.isFinishing = false;
                        $scope.back();
                    }else{
                        toaster.pop('error', '完成跟踪失败，原因：' + data.msg);
                        $scope.isFinishing = false;
                    }
                    
                },
                function(errResponse){
                     console.error('Error while finishing the tracking.');
                    $scope.isFinishing = true;
                }
            );
        };


    }];
});
