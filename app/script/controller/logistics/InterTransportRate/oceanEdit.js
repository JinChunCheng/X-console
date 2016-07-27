define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'LogisticsService', 'toaster','$modal', function($rootScope, $scope, $state, $stateParams, LogisticsService, toaster,$modal) {
         ph.mark($rootScope, {
            state: 'logistics.InterTransportRate.oceanAirList.edit',
            title: '国际海空运费率信息'
        });
        //判断是否新增

        $scope.isSaving = false;
        //供应商信息


        $scope.weightIntervalsInfo=[];
        $scope.vendorsInfo=[];
        $scope.countrysInfo=[];
        $scope.originStatessInfo=[];
        $scope.originCitysInfo=[];
        $scope.destStatessInfo=[];
        $scope.destCitysInfo=[];
        $scope.calUnitInfos=[];
        $scope.serviceTypesInfo=[
        {value:'DDU',label:'DDU'},
        {value:'Non-DDU',label:'Non-DDU'}
        ];

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

        $scope.transportRateInfo = {
            id:'',
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
            price001:'',
            price002:'',
            price003:'',
            price004:'',
            price005:'',
            price006:'',
            price007:'',
            price008:'',
            price009:'',
            price010:'',
            transitDays:'',
            expiryDate:'',
            serviceType:'',
            logicalDel:''
        };


         $scope.transportationModes=[
        {value:'OCEAN',label:'BY OCEAN'},
        {value:'AIR',label:'BY AIR'}
        ];


        $scope.back=function(){
        	$state.go('logistics.InterTransportRate.oceanAirList', {
                condition: $stateParams.condition
            });
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
            if($scope.transportRateInfo.serviceType=='' || $scope.transportRateInfo.serviceType =='DDU')
            {
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
            }else //if ($scope.condition.serviceType!='' && $scope.condition.serviceType =='Non-DDU')
            {
                if (type=='origin') {
                    $scope.loadPortInfo('origin');
                }else{

                     $scope.loadPortInfo('dest');
                }
            }
            
        }

        //运输方式或者服务方式改变时候变更读取省信息
        $scope.loadStatesInfoBychange=function(){
            $scope.originStatessInfo=[];
            $scope.originCitysInfo=[];
            $scope.destStatessInfo=[];
            $scope.destCitysInfo=[];
            $scope.loadStatesInfo($scope.transportRateInfo.originCountryCode,'origin');
            $scope.loadStatesInfo($scope.transportRateInfo.destCountryCode,'dest');
        }

        //加载港口信息
        $scope.loadPortInfo=function(type){
            if($scope.transportRateInfo.transportMode!='' && $scope.transportRateInfo.serviceType !='')
            {
                LogisticsService.loadPortsInfo($scope.transportRateInfo,type).then(
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
            }
        }

       

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

        //加载运费信息
        $scope.loadInterTranRateInfo=function(){
            LogisticsService.getInterTransportRateInfoByID($stateParams.freightChargeId,$stateParams.serviceType).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.transportRateInfo = data.items;
                        $scope.loadStatesInfo($scope.transportRateInfo.originCountryCode,'origin');
                        $scope.loadStatesInfo($scope.transportRateInfo.destCountryCode,'dest');
                    } else {
                        toaster.pop('error', '加载海空运费率信息失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    console.error('Error while load InterTransportRate.');
                }
            );
        };

        $scope.loadInterTranRateInfo();

        //更新运费信息
        $scope.updateInterTranRateInfo=function(){
            $scope.isSaving = true;
            LogisticsService.updateInterTransportRateInfo($scope.transportRateInfo).then(
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
                    console.error('Error while update InterTransportRate.');
                }
            );
        };
    }];
});
