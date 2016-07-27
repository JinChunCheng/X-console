define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'LogisticsService', 'toaster','$modal', function($rootScope, $scope, $state, $stateParams, LogisticsService, toaster,$modal) {
         ph.mark($rootScope, {
            state: 'logistics.InterTransportRate.oceanAirList.edit',
            title: '国际快递运费率信息'
        });
        $scope.isSaving = false;

        $scope.weightIntervalsInfo=[];
        $scope.vendorsInfo=[];
        $scope.countrysInfo=[];
        $scope.originStatessInfo=[];
        $scope.originCitysInfo=[];
        $scope.destStatessInfo=[];
        $scope.destCitysInfo=[];
        $scope.calUnitInfos=[];

        //费率币种
        $scope.currencyInfos=[
        {value:'ADP',label:'安道尔比塞塔'},
        {value:'AED',label:'阿联酋迪拉姆'},
        {value:'AFA',label:'阿富汗阿富汗尼'},
        {value:'AFN',label:'阿富汗阿富汗尼'},
        {value:'ALL',label:'阿尔巴尼亚列克'},
        {value:'AMD',label:'亚美尼亚打兰'},
        {value:'ANG',label:'荷属安的列斯盾'},
        {value:'AOA',label:'安哥拉宽扎'},
        {value:'ARS',label:'阿根廷比索'},
        {value:'AUD',label:'澳大利亚元'},
        {value:'AWG',label:'阿鲁巴弗罗林'},
        {value:'AZN',label:'阿塞拜疆新马纳特'},
        {value:'CAD',label:'加拿大元'},
        {value:'CHF',label:'瑞士法郎'},
        {value:'CNY',label:'人民币'},
        {value:'EUR',label:'欧元'},
        {value:'GBP',label:'英镑'},
        {value:'HKD',label:'港币'},
        {value:'JPY',label:'日元'},
        {value:'SEK',label:'瑞典克朗'},
        {value:'SGD',label:'新加坡元'},
        {value:'USD',label:'美元'}
        ];

        //计费单位
        $scope.calUnitInfos=[
        {value:'KG',label:'KG'},
        {value:'CBM',label:'CBM'},
        {value:'TON',label:'TON'},
        {value:'20"',label:'20'},
        {value:'40"',label:'40'},
        {value:'40HC',label:'40HC'}
        ];

        $scope.expressTransportRateInfo = {
            id:'',
            serviceType:'DDU',
            transportMode:'',
            vendorCode:'',
            incoterm:'',
            originCountryCode:'',
            originStateCode:'',
            originCityCode:'',
            destCountryCode:'',
            destStateCode:'',
            destCityCode:'',
            wgtintervalCode:'',
            calUnit:'',
            currency:'',
            basicPrice001:'',
            addedPrice001:'',
            minCost001:'',
            basicPrice002:'',
            addedPrice002:'',
            minCost002:'',
            basicPrice003:'',
            addedPrice003:'',
            minCost003:'',
            basicPrice004:'',
            addedPrice004:'',
            minCost004:'',
            basicPrice005:'',
            addedPrice005:'',
            minCost005:'',
            basicPrice006:'',
            addedPrice006:'',
            minCost006:'',
            basicPrice007:'',
            addedPrice007:'',
            minCost007:'',
            basicPrice008:'',
            addedPrice008:'',
            minCost008:'',
            basicPrice009:'',
            addedPrice009:'',
            minCost009:'',
            basicPrice010:'',
            addedPrice010:'',
            minCost010:'',
            transitDays:'',
            expiryDate:'',
            logicalDel:''
        };

        //用于查询重量区间的参数
        $scope.weightIntervalparam = {
            transportMode:'',
            logisticsVendor:'',
            calUnit:''
        };


         $scope.transportationModes=[
        {value:'EXPRESS',label:'BY COURIER'},
        {value:'POST',label:'BY POST'}
        ];

        $scope.back=function(){
            $state.go('logistics.InterTransportRate.expressList', {
                condition: $stateParams.condition
            });
        };

         $scope.openDate = function($event) {
            console.debug("进入日期控件");
            $event.preventDefault();
            $event.stopPropagation();

            $scope.open = true;
        };

        //加载国家信息
        $scope.loadCountryInfo=function(){
            LogisticsService.loadCountryInfo().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.countrysInfo = data.items;
                    } else {
                        toaster.pop('error', '加载国家列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error  loadCountryInfo.');
                }
            );
        };

         //加载州省信息
        $scope.loadStatesInfo=function(countryCode,type){
            LogisticsService.loadStatesInfo(countryCode).then(
                function(data) {
                    if (data.status == '200') {
                        if (type=='origin') {
                            $scope.originStatessInfo=data.items;
                        }else{
                            $scope.destStatessInfo=data.items;
                        }
                    } else {
                        toaster.pop('error', '加载州信息失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error  logistics stateInfo.');
                }
            );
        }


        //加载城市信息
        $scope.loadCityInfo=function(type){
            LogisticsService.loadPortsInfo($scope.expressTransportRateInfo,type).then(
                function(data) {
                    if (data.status == '200') {
                        if (type=='origin') {
                            $scope.originCitysInfo=data.items;
                        }else{
                            $scope.destCitysInfo=data.items;
                        }
                    } else {
                        toaster.pop('error', '加载港口信息失败，原因：' + data.msg);
                        if (type=='origin') {
                            $scope.originCitysInfo=null;
                        }else{
                            $scope.destCitysInfo=null;
                        }
                    }
                },
                function(errResponse) {
                    console.error('Error  logistics stateInfo.');
                }
            );
        };

        //加载重量区间
        $scope.loadWeightIntervalInfo=function(){
            console.debug("运输方式："+$scope.expressTransportRateInfo.transportMode);
            console.debug("物流供应商："+$scope.expressTransportRateInfo.vendorCode);
            console.debug("计费单位："+$scope.expressTransportRateInfo.calUnit);
            $scope.weightIntervalparam.transportMode=$scope.expressTransportRateInfo.transportMode;
            $scope.weightIntervalparam.logisticsVendor=$scope.expressTransportRateInfo.vendorCode;
            $scope.weightIntervalparam.calUnit=$scope.expressTransportRateInfo.calUnit;
            if($scope.weightIntervalparam.transportMode!='' && $scope.weightIntervalparam.logisticsVendor !='' && $scope.weightIntervalparam.calUnit!=''&&
                $scope.weightIntervalparam.transportMode!=null && $scope.weightIntervalparam.logisticsVendor !=null && $scope.weightIntervalparam.calUnit!=null)
            {
                LogisticsService.loadWeightIntervalsInfo($scope.weightIntervalparam).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.weightIntervalsInfo=data.items;
                        } else {
                            toaster.pop('error', '加载重量区间信息失败，原因：' + data.msg);
                             $scope.weightIntervalsInfo=[];
                        }
                    },
                    function(errResponse) {
                        console.error('Error  logistics stateInfo.');
                        $scope.weightIntervalsInfo=[];
                    }
                );
            }else{
                $scope.weightIntervalsInfo=[];
            }
        };


       //加载物流供应商信息列表
        $scope.loadVendorList=function(){
            LogisticsService.loadVendorList().then(
                function(data) {
                    if (data.status == '200') {
                        $scope.vendorsInfo = data.items;
                    } else {
                        toaster.pop('error', '加载物流供应商列表失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error  logistics vendorCode.');
                }
            );
        };

        $scope.loadVendorList();
        $scope.loadCountryInfo();

        //加载需要编辑的运费信息
        $scope.loadExpressTranRateInfo=function(){
            LogisticsService.getInterExpressTransportRateInfoByID($stateParams.expresschargeId).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.expressTransportRateInfo = data.items;
                        //国际没快递都是DDU的形式
                        $scope.expressTransportRateInfo.serviceType='DDU';
                        $scope.loadWeightIntervalInfo();
                        $scope.loadStatesInfo(data.items.originCountryCode,'origin');
                        $scope.loadStatesInfo(data.items.destCountryCode,'dest');
                        $scope.loadCityInfo('origin');
                        $scope.loadCityInfo('dest');
                    } else {
                        toaster.pop('error', '保存失败：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while add InterExpressTransportRate.');
                }
            );
        };

        $scope.loadExpressTranRateInfo();
        

        //保存运费信息
        $scope.updateInterExpressTranRateInfo=function(){
            $scope.isSaving = true;
            LogisticsService.updateInterExpressTransportRateInfo($scope.expressTransportRateInfo).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.isSaving = false;
                        toaster.pop('success', '修改成功！');
                        $scope.back();
                    } else {
                        toaster.pop('error', '保存失败：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while add InterExpressTransportRate.');
                }
            );
        };
    }];
});
