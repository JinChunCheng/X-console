//exiaoMgrApp.controller("supplierEditCtrl",['SupplierService','metaService','areaService','$scope','$http', '$routeParams','$location',
//    function(SupplierService,metaService,areaService,$scope, $http, $routeParams, $location){

define(['common/session', 'service/config', 'common/path-helper'], function (session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'buyerService', 'metaService', '$stateParams',
        function ($rootScope, $scope, $state, toaster, buyerService, metaService, $stateParams) {
            ph.mark($rootScope, {
                state: 'buyer.info.edit',
                title: '询价详情'
            });

            $scope.view ={
                editFlag:true,
                buyerEnableFlag:'',
                countryCode:'',
                buyerId:$stateParams.id,
                buyerAccount:{},
                buyerInfo:{},
                buyerAddress:{},
                buyerCmpCert:{},
                result:{
                    pageIndex: 1,
                    pageSize: 10,
                    PageAmount: 0,
                    TotalCount: 0,
                    Items: []
                },
                loading:false

            };
            //BUYER REG STATUS
            metaService.getMeta('BUYERREGSTATUS', function(list) {
                $scope.view.buyerRegStatus = list;
            });
            //bnuyer enable status
            metaService.getMeta('BUYERENABLESTATUS', function(list) {
                $scope.view.buyerEnableFlag = list;
            });
            //country code
            metaService.getMeta('BUYERENABLESTATUS', function(list) {
                $scope.view.countryCode = list;
            });

            //$scope.goPoList = function () {
            //    $state.go('buyer.order.list' + {id: $scope.supplierId});
            //};
            //$scope.goProdList = function () {
            //    $state.go('buyer.product.list' + {id: $scope.supplierId});
            //};

            $scope.back = function () {
                $state.go('buyer.info.list');

            };


            //get buyer account
            $scope.getBuyerAccount = function(buyerId) {
                buyerService.getBuyerAccount(buyerId).then(
                    function(data) {
                        if (data.status == '200') {
                            $scope.view.buyerInfo = data.items;
                            //toaster.pop('success',"获取买家状态成功");
                        } else {
                            toaster.pop('error', '获取买家账号错误，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
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
                            //toaster.pop('success',"获取买家状态成功");
                        } else {
                            toaster.pop('error', '获取买家信息错误，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
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
                            toaster.pop('error', '获取买家公司认证错误，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
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
                            //toaster.pop('success',"获取买家状态成功");
                        } else {
                            toaster.pop('error', '获取买家地址错误，原因：' + data.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while getBuyerAddress.');
                    }
                );
            };

            $scope.getBuyerAccount($scope.view.buyerId);
            $scope.getBuyerInfo($scope.view.buyerId);
            $scope.getBuyerCmpCert($scope.view.buyerId);
            $scope.getBuyerAddress($scope.view.buyerId);

            $scope.editAddress = function(address){
                $scope.$apply(function (address) {
                    address.enditFlag=true;
                });
            };

            $scope.saveAddress = function(address){
                var msg=null;
                switch(true){
                    case address.firstName == null: msg="名称";
                    case address.company == null: msg="公司名称";
                    case address.countryCode == null: msg="国家编码";
                    case address.stateCode == null: msg="州，省市编码";
                    case address.cityCode == null: msg="城市编码";
                    case address.zipCode == null: msg="邮政编码";
                    case address.phoneNumber == null: msg="联系方式";
                };

                if (msg != null){
                    toaster.pop('info', '地址信息不全：' + msg + '不能为空');
                    return;
                }
                buyerService.updateBuyerAddress(address).then(
                    function(data) {

                        if (data.status == '200') {
                            msg = data.items;
                            //toaster.pop('success',"获取买家状态成功");
                        } else {
                            msg = data.items.toString();
                            toaster.pop('error', '保存买家地址错误，原因：' + msg);
                        }
                        $scope.view.loading = false;
                    },
                    function(errResponse) {
                        $scope.view.loading = false;
                        console.error('Error while saveAddress.');
                    }
                );
                address.enditFlag=false;
            }

        }];
});
