define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','$stateParams', '$modal', 'toaster', 'LogisticsService', 
    function($rootScope, $scope, $state, $stateParams,$modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.InterTransportRate.list',
            title: '国际海空运费率'
        });

        $scope.isAdding = false;
        $scope.isSaving = false;
        $scope.loading = false;
        //下拉菜单信息
        //供应商信息
        $scope.vendorsInfo=[];
        $scope.countrysInfo=[];
        $scope.originStatessInfo=[];
        $scope.originCitysInfo=[];
        $scope.destStatessInfo=[];
        $scope.destCitysInfo=[];
        $scope.weightIntervalsInfo=[];
        $scope.calUnitInfos=[];
        $scope.serviceTypesInfo=[
        {value:'DDU',label:'DDU'},
        {value:'Non-DDU',label:'Non-DDU'}
        ];

        
        $scope.transportModes=[
        {value:'OCEAN',label:'BY OCEAN'},
        {value:'AIR',label:'BY AIR'}
        ];

        //运输货物类型
        $scope.freightTypes=[
        {text:'普通货物',value:'001',},
        {text:'冷藏货物',value:'002'},
        {text:'冷冻货物',value:'003'},
        {text:'液体普货',value:'004'},
        {text:'危险品',value:'005'},
        {text:'医疗用品',value:'006'},
        {text:'瓶装运输',value:'007'},
        {text:'活体运输',value:'008'},
        {text:'项目运输',value:'009'},
        {text:'其他',value:'010'},
        ];


        //var freightTypesList=[];
        $scope.freightTypes.selectedItems=['001','002','003','004','005','006','007','008','009','010'];
        $scope.freightTypes.showItems={
            item001:true,
            item002:true,
            item003:true,
            item004:true,
            item005:true,
            item006:true,
            item007:true,
            item008:true,
            item009:true,
            item010:true
        };


        //默认分页配置
        $scope.defualResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };

        $scope.queryResult = $scope.defualResult;

        $scope.condition = {
            transportMode:'',
            serviceType:'',
            logisticsVendor:'',
            calUnit:'',
            weightInterval:'',
            originCountryCode:'',
            originStateCode:'',
            originCityCode:'',
            destCountryCode:'',
            destStateCode:'',
            destCityCode:'',
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
            $scope.searchInterTransportRate();
        };

        //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        
        //跳转到编辑页面
        $scope.editSaleOrder=function(orderId){
            $state.go('logistics.saleOrder.edit',{
                orderId:orderId,
                condition:$scope.condition
            });
        };


        //显示/隐藏货物类型运费
        $scope.showfreightType=function(type)
        {
            if(type=='001')
            {
                $scope.freightTypes.showItems.item001=!$scope.freightTypes.showItems.item001;
            }
            else if(type=='002')
            {
                $scope.freightTypes.showItems.item002=!$scope.freightTypes.showItems.item002;
            }
            else if(type=='003')
            {
                $scope.freightTypes.showItems.item003=!$scope.freightTypes.showItems.item003;
            }
            else if(type=='004')
            {
                $scope.freightTypes.showItems.item004=!$scope.freightTypes.showItems.item004;
            }
            else if(type=='005')
            {
                $scope.freightTypes.showItems.item005=!$scope.freightTypes.showItems.item005;
            }
            else if(type=='006')
            {
                $scope.freightTypes.showItems.item006=!$scope.freightTypes.showItems.item006;
            }
            else if(type=='007')
            {
                $scope.freightTypes.showItems.item007=!$scope.freightTypes.showItems.item007;
            }
            else if(type=='008')
            {
                $scope.freightTypes.showItems.item008=!$scope.freightTypes.showItems.item008;
            }
            else if(type=='009')
            {
                $scope.freightTypes.showItems.item009=!$scope.freightTypes.showItems.item009;
            }
            else if(type=='010')
            {
                $scope.freightTypes.showItems.item010=!$scope.freightTypes.showItems.item010;
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
                    console.error('Error  logistics vendorCode.');
                }
            );
        };

        //加载州省信息
        $scope.loadStatesInfo=function(countryCode,type){
            if($scope.condition.serviceType=='' || $scope.condition.serviceType =='DDU')
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
        $scope.loadVendorList();
        $scope.loadCountryInfo();
        $scope.condition.originCountryCode='CN';
        $scope.loadStatesInfo('CN','origin');

        //加载港口信息
        $scope.loadPortInfo=function(type){
            if($scope.condition.transportMode!='' && $scope.condition.serviceType !='')
            {
                LogisticsService.loadPortsInfo($scope.condition,type).then(
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



        //当运输方式变更之后，刷新港口信息
        $scope.loadPortInfoByTransport=function(transportMode){
            if (transportMode!='') {
                if($scope.condition.originCountryCode!='' && $scope.condition.originStateCode!=''){
                    $scope.loadPortInfo('origin');
                }

                if($scope.condition.destCountryCode!='' && $scope.condition.destStateCode!=''){
                    $scope.loadPortInfo('dest');
                }
            }
        };

        //加载重量区间
        $scope.loadWeightIntervalInfo=function(){
            if($scope.condition.transportMode!='' && $scope.condition.logisticsVendor !='' && $scope.condition.calUnit!=''&&
                $scope.condition.transportMode!=null && $scope.condition.logisticsVendor !=null && $scope.condition.calUnit!=null)
            {
                LogisticsService.loadWeightIntervalsInfo($scope.condition).then(
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


        //加载计费单位
        $scope.loadCalUnitInfo=function(){
            if($scope.condition.transportMode!='' && $scope.condition.logisticsVendor !='' &&
                $scope.condition.transportMode!=null && $scope.condition.logisticsVendor !=null )
            {
                LogisticsService.loadCalUnitsInfo($scope.condition).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.calUnitInfos=data.items;
                            $scope.weightIntervalsInfo=[];
                        } else {
                            toaster.pop('error', '加载计费单位信息失败，原因：' + data.msg);
                            $scope.calUnitInfos=[];
                            $scope.weightIntervalsInfo=[];
                        }
                    },
                    function(errResponse) {
                        console.error('Error  logistics stateInfo.');
                        $scope.weightIntervalsInfo=[];
                    }
                );
            }else{
                $scope.calUnitInfos=[];
                $scope.weightIntervalsInfo=[];
            }
        };
        //运输方式变更时候联动的下拉菜单
        $scope.transportChange=function(transportMode){
            $scope.loadPortInfoByTransport(transportMode);   //变更港口类型
            $scope.loadCalUnitInfo();   //变更计费单位
        };

        //服务类型变更的时候联动下拉菜单
        $scope.serverTypeChange=function(serviceType){
            if (serviceType != '') 
            {
                if(serviceType=='DDU')
                {
                    if($scope.condition.originCountryCode!='' && $scope.condition.originStateCode!=''){
                        $scope.loadPortInfo('origin');
                    }

                    if($scope.condition.destCountryCode!='' && $scope.condition.destStateCode!=''){
                        $scope.loadPortInfo('dest');
                    }
                }else{
                    if($scope.condition.originCountryCode!=''){
                        $scope.loadPortInfo('origin');
                    }
                    if($scope.condition.destCountryCode!=''){
                        $scope.loadPortInfo('dest');
                    }
                }
                
            }
        }


        //查询国际费率信息
        $scope.searchInterTransportRate = function() {
            if(!validCondition())
            {
                return false;
            }
            $scope.loading = true;
            $scope.searching = true;
            $scope.queryResult.Items=[];
            LogisticsService.searchInterSeaAirTransportRateInfo($scope.condition).then(
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
                        toaster.pop('error', "加载费率列表失败，原因："+data.msg);
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



        //校验判断条件是否都填写上了
        var validCondition=function(){
            if ($scope.condition.transportMode=='' || $scope.condition.transportMode== null) {
                toaster.pop('error', '请选择运输方式！');
                return false;
            }
            if ($scope.condition.serviceType=='' || $scope.condition.serviceType== null) {
                toaster.pop('error', '请选择服务类型！');
                return false;
            }
             if ($scope.condition.logisticsVendor=='' || $scope.condition.logisticsVendor== null) {
                toaster.pop('error', '请选择物流供应商！');
                return false;
            }
             if ($scope.condition.originCountryCode=='' || $scope.condition.originCountryCode== null) {
                toaster.pop('error', '请选择发货国家！');
                return false;
            }
             if ($scope.condition.destCountryCode=='' || $scope.condition.destCountryCode== null) {
                toaster.pop('error', '请选择收货国家！');
                return false;
            }
            return true;
        }

        //测试用预设条件
        // $scope.condition.transportMode='OCEAN';
        // $scope.condition.serviceType='Non-DDU';
        // $scope.condition.logisticsVendor='DHL';
        // $scope.condition.originCountryCode='CN';
        // $scope.condition.originCityCode='CNQIN';
        // $scope.condition.destCountryCode='AU';
        // $scope.condition.destCityCode='AUKIT';
        // $scope.searchInterTransportRate();

        //跳转到编辑页面
        $scope.editTransportRate=function(freightChargeId,serviceType){
            $state.go('logistics.InterTransportRate.oceanAirEdit',{
                freightChargeId:freightChargeId,
                serviceType:serviceType,
                condition:$scope.condition
            });
        };

        $scope.addTransportRate=function(){
            $state.go('logistics.InterTransportRate.oceanAirAdd',{
                condition:$scope.condition
            });
        };

        //删除快递运费
        $scope.deleteRate=function(freightchargeId){

            var text = '确定删除该运费信息？';
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
                        deleteOceanAirTransportRate(freightchargeId, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var deleteOceanAirTransportRate=function(freightchargeId,confirmScope, modalInstance){
            confirmScope.confirmData.processing = true;
            console.debug("进来了！");
            LogisticsService.deleteInterTransportRateInfo(freightchargeId).then(
                function(data) {
                    if (data.status == '200') {
                        confirmScope.confirmData.processing = false;
                        toaster.pop('success', "删除成功。");
                        modalInstance.dismiss();
                        $scope.searchInterTransportRate();
                        
                    } else {
                        toaster.pop('error', "删除信息失败，原因："+data.msg);
                        confirmScope.confirmData.processing = false;
                        modalInstance.dismiss();
                    }
                },
                function(errResponse) {
                    console.error('Error while delete InterTransportRateInfo.');
                    confirmScope.confirmData.processing = false;
                    modalInstance.dismiss();
                }
            );
        };
        
       
    }];
});
