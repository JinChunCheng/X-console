
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','toaster', 'supService','metaService', '$stateParams',
        function($rootScope, $scope, $state,toaster,supService, metaService,$stateParams) {

    ph.mark($rootScope, {
        state: 'supplier.order.detail',
        title: '订单详情'
    });

    $scope.loading = false;
    $scope.purchaseOrder = { id: $stateParams.id };


    var loadData = function () {
        $scope.loading = true;
        supService.getPoDetail($scope.purchaseOrder.id).then(
            function(data) {
                if (data && data.status == 200) {
                    $scope.purchaseOrder = data.items;
                    toaster.pop('success','加载成功');
                } else {
                    toaster.pop('error',data.msg);
                }
                $scope.loading = false;
            },
            function(errResponse) {
                toaster.pop('error', '加载失败' + data.msg);
                $scope.searching = false;
            }
        );
    };

    loadData();

    //get pic url
    $scope.getPicUrl = function(strPicUrl){
        if (!strPicUrl){
            return "content/images/gender_0.png";
        }
        else if("http://".indexOf(strPicUrl+"") != -1){
            return strPicUrl;
        }
        else {
            return img_supplier_domain+"/"+strPicUrl;
        };
    };


    $scope.back = function () {
        $state.go('supplier.order.list',{id:$scope.purchaseOrder.supplierId});
    };

    $scope.detail = {};
    $scope.showItemDetail = function(item){
        $scope.detail = {
            picUrl:"",
            attrs:"",
            quantity:0,
            name:"",
            price:0.0,
            total:0.0,
            enName:"",
            supplierSku:"",
            packLength:"",
            packWidth:"",
            packHeight:"",
            packWeight:"",
            deliveryFlag:"",
            packType:"",
            deliveryPlace:"",
            productQa:"",
            description:"",
            expectedReceiptDate:"",
            settlementCurrency:"",
            unit:""
        };
        $scope.detail.name = item.item;
        $scope.detail.supplierSku = item.supplierSku;
        $scope.detail.exiaoProductCode = item.exiaoProductCode;
        $scope.detail.packunit = item.packunit;
        $scope.detail.expectedReceiptDate = item.expectedReceiptDate;
        $scope.detail.quantity = item.quantity;

        $scope.detail.quantityReceived = item.quantityReceived;
        $scope.detail.quantityBilled = item.quantityBilled;
        $scope.detail.units = item.units;
        //$scope.detail.price = item.price;
        $scope.detail.rate = item.rate;
        $scope.detail.taxAmount = item.taxAmount;


    }

    }];
});
