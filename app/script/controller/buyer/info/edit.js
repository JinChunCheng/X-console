//exiaoMgrApp.controller("supplierEditCtrl",['SupplierService','metaService','areaService','$scope','$http', '$routeParams','$location',
//    function(SupplierService,metaService,areaService,$scope, $http, $routeParams, $location){

define(['common/session', 'service/config', 'common/path-helper'], function (session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'buyerService', 'metaService', '$stateParams','$filter',
        function ($rootScope, $scope, $state, toaster, buyerService, metaService, $stateParams, $filter) {
            ph.mark($rootScope, {
                state: 'buyer.info.edit',
                title: '买家详情'
            });

            $scope.flagList = [{"text":"Y","value":1},{"text":"N","value":0}];

            $scope.countryList = [];
            $scope.stateList = [];
            $scope.cityList = [];

            $scope.view ={
                buyerRegStatus:[],
                countryCode:'',
                buyerId:$stateParams.id,
                buyerAccount:{},
                buyerInfo:{},
                buyerAddress:[],
                buyerCmpCert:{},
                loading:false
            };
            //BUYER REG STATUS
            metaService.getMeta('BUYERREGSTATUS', function(list) {
                $scope.view.buyerRegStatus = list;
            });


            $scope.changeCountry = function(obj){
                $scope.stateList = [];
                $scope.cityList = [];
                getStateList(obj.countryCode);
                var array = $filter("filter")($scope.countryList,{"countryCode":obj.countryCode});
                if(array.length>0){
                    obj.countryName = array[0].countryName;
                }
            };

            $scope.changeState = function(obj){
                $scope.cityList = [];
                getCityList(obj.countryCode, obj.stateCode);
                var array = $filter("filter")($scope.stateList,{"stateCode":obj.stateCode});
                if(array.length>0){
                    obj.stateName = array[0].stateName;
                }
            }

            $scope.changeCity = function(obj){
                var array = $filter("filter")($scope.cityList,{"cityCode":obj.cityCode});
                if(array.length>0){
                    obj.cityName = array[0].cityName;
                }
            }

            //countryList
            var getCountroyList = function(){
                buyerService.getCountroyList().then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.countryList = data.items;
                        } else {
                            //toaster.pop('error', '获取国家集合失败！');
                        }
                    },
                    function(errResponse) {
                        console.error('Error while getCountroyList.');
                        toaster.pop('error', '获取国家集合失败！');
                    }
                );
            };

            //stateList
            var getStateList = function(countryCode){
                if(countryCode==null||countryCode==""){
                    return false;
                }
                buyerService.getStateList(countryCode).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.stateList = data.items;
                        } else {
                            //toaster.pop('error', '获取省市集合失败！');
                        }
                    },
                    function(errResponse) {
                        console.error('Error while getStateList.');
                        toaster.pop('error', '获取省市集合失败！');
                    }
                );
            };

            //cityList
            var getCityList = function(countryCode, stateCode){
                if(countryCode==null||countryCode==""){
                    return false;
                }
                if(stateCode==null||stateCode==""){
                    return false;
                }
                buyerService.getCityList(countryCode, stateCode).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.cityList = data.items;
                        } else {
                            //toaster.pop('error', '获取城市集合失败！');
                        }
                    },
                    function(errResponse) {
                        console.error('Error while getCityList.');
                        toaster.pop('error', '获取城市集合失败！');
                    }
                );
            };

            //返回列表
            $scope.back = function () {
                var fromState = $stateParams.from || 'buyer.info.list';
                $state.go(fromState, {
                    listVM: $stateParams.listVM
                }, {
                    reload: true
                });
            };

            //getUrl
            $scope.getUrl = function(para){
                buyerService.getUrl(para).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.URL = data.items;
                        } else {
                            //toaster.pop('error', '获取验证URL失败！');
                        }
                    },
                    function(errResponse) {
                        console.error('Error while getUrl.');
                        toaster.pop('error', '获取验证URL失败！');
                    }
                )
            };

            //get buyer account
            $scope.getBuyerAccount = function(buyerId) {
                buyerService.getBuyerAccount(buyerId).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.buyerAccount = data.items;
                            if($scope.view.buyerAccount.email!=null||$scope.view.buyerAccount.email!=""){
                                var para = {"buyerId":buyerId,"email":$scope.view.buyerAccount.email};
                                $scope.getUrl(para);
                            }
                        } else {
                            //toaster.pop('error', '获取买家账号失败！');
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while getBuyerAccount.');
                    }
                );
            };
            //get buyer info
            $scope.getBuyerInfo = function(buyerId) {
                buyerService.getBuyerInfo(buyerId).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.buyerInfo = data.items;
                            if($scope.view.buyerInfo.countryCode != null && $scope.view.buyerInfo.countryName != null){
                                $scope.view.countryCode = $scope.view.buyerInfo.countryCode +"-"+ $scope.view.buyerInfo.countryName;
                            }
                        } else {
                            //toaster.pop('error', '获取买家信息失败！');
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while getBuyerInfo.');
                    }
                );
            };
            //get buyer company certification
            $scope.getBuyerCmpCert = function(buyerId) {
                buyerService.getBuyerCmpCert(buyerId).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.buyerCmpCert = data.items;
                            //toaster.pop('success',"获取买家状态成功");
                        } else {
                            //toaster.pop('error', '获取买家公司认证失败！');
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while getBuyerCmpCert.');
                    }
                );
            };
            //get buyer address
            $scope.getBuyerAddress = function(buyerId) {
                buyerService.getBuyerAddress(buyerId).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.buyerAddress = data.items;
                        } else {
                            //toaster.pop('error', '获取买家地址失败！');
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        toaster.pop('error', '服务器错误！');
                        console.error('Error while getBuyerAddress.');
                    }
                );
            };

            $scope.getBuyerAccount($scope.view.buyerId);
            $scope.getBuyerInfo($scope.view.buyerId);
            //$scope.getBuyerCmpCert($scope.view.buyerId);
            $scope.getBuyerAddress($scope.view.buyerId);

            $scope.editAddress = function(address){
                address.readOnly = !address.readOnly;
                if(!address.readOnly){
                    if($scope.countryList.length == 0){
                        getCountroyList();
                    }
                    getStateList(address.countryCode);
                    getCityList(address.countryCode, address.stateCode);
                }
            };

            $scope.saveAddress = function(address){
                if(address.firstName == null||address.firstName == ""){
                    toaster.pop('info', '地址信息不全：名称不能为空');
                    return;
                }

                if(address.company == null||address.company == ""){
                    toaster.pop('info', '地址信息不全：公司名称不能为空');
                    return;
                }

                if(address.countryCode == null||address.countryCode == ""){
                    toaster.pop('info', '地址信息不全：国家编码不能为空');
                    return;
                }

                if(address.stateCode == null||address.stateCode == ""){
                    toaster.pop('info', '地址信息不全：州，省市编码不能为空');
                    return;
                }

                //if(address.cityCode == null||address.cityCode == ""){
                //    toaster.pop('info', '地址信息不全：城市编码不能为空');
                //    return;
                //}

                if(address.zipCode == null||address.zipCode == ""){
                    toaster.pop('info', '地址信息不全：邮政编码不能为空');
                    return;
                }

                if(address.phoneNumber == null||address.phoneNumber == ""){
                    toaster.pop('info', '地址信息不全：联系方式不能为空');
                    return;
                }

                buyerService.updateBuyerAddress(address).then(
                    function(data) {
                        if (data.status == '200') {
                            address.readOnly = true;
                            toaster.pop('success',"保存买家地址成功！");
                            //$scope.getBuyerAddress($scope.view.buyerId);
                        } else {
                            toaster.pop('error', '保存买家地址错误，原因：' + data.msg);
                        }
                    },
                    function(errResponse) {
                        console.error('Error while saveAddress.');
                    }
                );
                address.enditFlag=false;
            }

        }];
});
