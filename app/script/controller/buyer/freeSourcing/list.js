//yucheng, added, for supplier list page
//
//return ['$scope','$http', '$routeParams','$location','metaService',
//    function($scope, $http, $routeParams, $location,metaService){

define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'buyerService', 'metaService', '$modal','$stateParams',
    function($rootScope, $scope, $state, toaster, buyerService, metaService, $modal, $stateParams) {

        ph.mark($rootScope, {
            state: 'buyer.info.list',
            title: '询盘列表'
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
            buyerRegStatus:[],
            buyerEnableFlag:[],
            countryCode:[],
            condition:{
                //regStatus:'',
                //countryCode:'',
                //flagEnable:'',
                //dateFrom:'',
                //dateTo:'',
                //email:'',
                productName:'',
                userEmail:'',
                pageNo: 1,
                pageSize: 10
            },
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

        $scope.open = function (files) {
            var modalInstance = $modal.open({
                templateUrl: "view/buyer/freeSourcing/view.html",
                controller: function($scope, $modalInstance){

                    $scope.files = JSON.parse(files);

                    $scope.ok = function () {
                        $modalInstance.dismiss();
                        return false;
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                        return false;
                    };
                }
            });
        };

        //结束询盘函数
        $scope.finish = function(id){
            buyerService.updateSourcingStatusFinish(id).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.page(1);
                    } else {
                        toaster.pop('error', '结束询价失败，原因：' + data.msg);
                    }
                },
                function(errResponse) {
                    toaster.pop('error', '  服务器错误！');
                    console.error('Error while updateQuoteStatusFinish.');
                }
            );
        };

        $scope.page = function(pageNum) {
            $scope.view.condition.pageNo = pageNum;
            if ($scope.view.result.pageSize > 0) {
                $scope.view.condition.pageSize = $scope.view.result.pageSize > 100 ? 100 : $scope.view.result.pageSize;
            };
            $scope.view.loading = true;
            buyerService.getFreeSourcingList($scope.view.condition).then(
                function(data) {
                    if (data.status == '200') {
                        var res = data;
                        $scope.view.result.Items = res.items;
                        $scope.view.result.PageSize = res.paginate.pageSize;
                        $scope.view.result.PageAmount = res.paginate.pagesCount;
                        $scope.view.result.TotalCount = res.paginate.totalItemsCount;
                        $scope.view.result.PageIndex = res.paginate.pageNumber;
                        //toaster.pop('success',"加载列表成功");
                    } else {
                        toaster.pop('error', '加载询盘列表失败，原因：' + data.msg);
                    }
                    $scope.view.loading = false;
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    console.error('Error while search productWarehouse.');
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
                regStatus: '',
                countryCode: '',
                buyerStatus: '',
                dateFrom: '',
                dateTo: '',
                userEmail: '',
                buyerName: '',
                productName:'',
                pageIndex: 1,
                pageSize: 10
            };
        };
        //
        ////yucheng.sun, init the page.
        $scope.page(1);
        $scope.loading = false;
        //
        ////link to detail page
        $scope.gotoPage = function(pageState, supplierId) {
            if (pageState) {
                $state.go(pageState, {
                    id: supplierId
                });
            };
        }

        $scope.enable = function(buyerId,enable,flagEnable){
            var buyerAccount ={id:'',flagEnable:""};
            if(buyerId != null && buyerId >0){
                buyerAccount.id = buyerId;
            }
            else{
                buyerAccount.id = -1;
            }

            if (enable){
                if(flagEnable==1){
                    toaster.pop('info',"已处于启用状态");
                    return;
                };
                buyerAccount.flagEnable = 1;
            }
            else{
                if(flagEnable==0){
                    toaster.pop('info',"已处于关闭状态");
                    return;
                };
                buyerAccount.flagEnable = 0;
            }

            buyerService.updateBuyerFlagEnable(buyerAccount).then(
                function(data) {
                    if (data.status == '200') {
                        var res = data;
                        toaster.pop('success',"修改买家状态成功");
                    } else {
                        toaster.pop('error', '修改买家状态失败，原因：' + data.msg);
                    }
                    $scope.view.loading = false;
                },
                function(errResponse) {
                    $scope.view.loading = false;
                    console.error('Error while updateBuyerFlagEnable.');
                }
            );
        };

        $scope.pageChanged = function(){
            $scope.page($scope.view.result.pageIndex);
        }

    }];
});
