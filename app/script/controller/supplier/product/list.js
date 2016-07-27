//yucheng, added, for supplier check page
//exiaoMgrApp.controller("supplierProductsCtrl",['$scope','$http', '$routeParams','$location','metaService','$timeout',
//    function($scope, $http, $routeParams, $location,metaService,$timeout){
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'toaster', 'supService', 'metaService', '$stateParams',
        function($rootScope, $scope, $state, $stateParams, toaster, supService, metaService, $stateParams) {
            ph.mark($rootScope, {
                state: 'supplier.product.list',
                title: '列表'
            });
            //id 做缓存，为了从产品详情跳回
            if(!$stateParams.id){
                if(window.localStorage&&window.localStorage.tempSupplierId){
                    $stateParams.id=window.localStorage.tempSupplierId;
                    $state.go('supplier.product.list',{id:$stateParams.id});
                }
            }
            else {
                window.localStorage.tempSupplierId=$stateParams.id;
            }

            $scope.supplierId = $stateParams.id;
            $scope.condition = {
                status: '',
                pageSize: 10,
                pageNo: 1
            };
            $scope.productList = [];
            $scope.queryResult = {
                PageIndex: 1,
                PageSize: 10,
                PageAmount: 0,
                TotalCount: 0,
                Items: []
            };

            $scope.view = {
                loading: false,
                status: {}
            };

            //audit TYPE
            metaService.getMeta('CPZT', function(list) {
                $scope.view.pcStatusList = list;
            });

            var hostname = config.supplier_domain;

            $scope.page = function(pageNum) {
                $scope.view.loading = true;

                $scope.condition.pageNo = pageNum;
                //$scope.condition.supplierId= $scope.supplierId;
                if ($scope.view.status != null && $scope.view.status >= 0) {
                    $scope.condition.status = $scope.view.status;
                };
                supService.getProductList($scope.condition, $scope.supplierId).then(function(res) {
                    if (res != null && res.status == 200) {
                        res.items.forEach(function(e) {
                            var samplePrice = e.samplePrice;
                            if (!samplePrice) {
                                samplePrice = '0.00';
                            };
                            var purchasePrice = e.price;
                            if (!purchasePrice) {
                                purchasePrice = '0.00';
                            };
                            if (e.isGrads == '1') {
                                e.text = '<div style="position:absolute;width:15%;z-index:9999; border:2px solid #000;border-color:gray; background:white;"><table class="table"  >';
                                e.text = e.text + '<tr><th class="text-center"  colspan="2" style="background-color:lightgrey;">样品价格</th></tr>';
                                e.text = e.text + '<tr><td class="text-center" colspan="2">' + samplePrice + '元</td></tr>';
                                e.text = e.text + '<tr><th class="text-center"  colspan="2" style="background-color:lightgrey;">采购价格</th></tr>';
                                e.text = e.text + '<tr><td class="text-center" colspan="2">' + purchasePrice + '元</td></tr>';
                                e.text = e.text + '<tr><th class="text-center"  colspan="2"  style="background-color:lightgrey;">阶梯价格</th></tr>';
                                e.text = e.text + '<tr><td class="text-center">购买数量</td><td class="text-center">价格</td></tr>';
                                e.productPrices.forEach(function(t) {
                                    e.text = e.text + '<tr class="text-center"><td class="text-center">' + t.endCount + '</td><td class="text-center">' + t.price + '元</td></tr>';
                                })

                                e.text = e.text + '</table></div>';
                            } else {
                                e.text = '<div style="position:absolute;width:15%;z-index:9999; border:2px solid #000;border-color:gray; background:white"><table class="table" > '
                                e.text = e.text + '<tr><th class="text-center"  colspan="2" style="background-color:lightgrey;">样品价格</th></tr>';
                                e.text = e.text + '<tr><td class="text-center" colspan="2" >' + samplePrice + '元</td></tr>';
                                e.text = e.text + '<tr><th class="text-center"  colspan="2" style="background-color:lightgrey;">采购价格</th></tr>';
                                e.text = e.text + '<tr><td class="text-center" colspan="2">' + purchasePrice + '元</td></tr></table></div';
                            };
                            //getSupplierName(e.supplierId);
                        });

                        $scope.queryResult.Items = res.items;
                        $scope.queryResult.PageSize = res.paginate.pageSize;
                        $scope.queryResult.PageAmount = res.paginate.pagesCount;
                        $scope.queryResult.TotalCount = res.paginate.totalItemsCount;
                        $scope.queryResult.PageIndex = res.paginate.pageNumber;
                    }
                    $scope.view.loading = false;
                }, function(err) {
                    $scope.view.loading = false;
                    toaster.pop('error', '服务器请求出错！');
                });
            };

            $scope.page(1);

            $scope.back = function() {
                $location.path('/supplier/info/list/');
            };

            $scope.goToProd = function(proCode) {
                $state.go('pc.product.view',{code:proCode,from:'supplier.product.list'});
                //window.$location.path('/pc/product/view/' + proCode+'?from=supplier/product/list/'+ $stateParams.id);

            };

            $scope.reset = function() {
                $scope.condition.pageNo = 1;
                $scope.condition.status = '';

            };
            $scope.pageChanged = function() {
                $scope.page($scope.queryResult.PageIndex);
            };
            //绑定气泡提示
            $scope.showPopver = function() {
                $timeout(function() {
                    $('div[name = popovers-demo1]').popover({
                        "title": "价格梯度"
                    });
                }, 0)
            };

        }
    ];
});
