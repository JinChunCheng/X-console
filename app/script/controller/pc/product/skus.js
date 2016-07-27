define(['service/config', 'common/path-helper'], function(config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', '$filter', 'toaster', 'PcService', function($rootScope, $scope, $state, $stateParams, $timeout, $modal, $filter, toaster, PcService) {

        var title = 'SKU列表';

        /**
         * breadscrumb
         * @type {String}
         */
        ph.mark($rootScope, {
            state: 'pc.product.skus',
            title: title
        });

        $scope.skusVM = {
            title: title,
            data: [],
            descAttrValues: []
        };

        $scope.view = {};

        /**
         * load product detail info
         * @param  {[type]} id [product code]
         * @return {[type]}    [description]
         */
        var loadSkus = function() {
            $scope.view.loading = true;

            PcService.getEsin($stateParams.code).then(function(res) {
                if (res && res.status == 200) {
                    $scope.skusVM.data = res.items;
                    //process values of description attributes & specification attributes
                    res.items.productAttrss.forEach(function(item) {
                        //values of description attribute 
                        //there are no values of specification attributes
                        if (item.nsStandard == 0) {
                            //checkbox list
                            if (item.fieldType == 4)
                                item.attributeVal = item.attributeVal.split(',');
                            else
                                item.attributeVal = [item.attributeVal];
                            $scope.skusVM.descAttrValues.push(item);
                        }
                    });
                } else {
                    toaster.pop('error', (res && res.msg) ? res.msg : '产品加载失败，请刷新重试！');
                }

                $scope.view.loading = false;
            }, function(err) {
                toaster.pop('error', '服务器请求异常！');
                $scope.view.loading = false;
            });
        };
        loadSkus();

        /**
         * go back to list view with list view model
         * @return {[type]} [description]
         */
        $scope.back = function() {
            $state.go('pc.product.list', {
                listVM: $stateParams.listVM
            }, {
                reload: true
            });
        };

        /**
         * show modal dialog of sku custom attributes 
         * @param  {[type]} sku [sku id]
         * @return {[type]}     [description]
         */
        $scope.viewCustomAttribute = function(sku) {
            var descAttrValues = $scope.skusVM.descAttrValues;
            var modalInstance = $modal.open({
                templateUrl: 'view/pc/product/customAttributeView.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.modalVM = {
                        title: 'SKU详细信息',
                        descAttrValues: descAttrValues
                    };
                    $scope.modalVM.data = sku;

                    // for(var i=0;i<$scope.modalVM.data.productPics;i++){
                    //     if($scope.modalVM.data.productPics[i].picType==2)
                    //         scope.modalVM.keyImgs = $scope.modalVM.data.productPics[i];
                    //     else if($scope.modalVM.data.productPics[i].picType==4)
                    //         scope.modalVM.detailImgs = $scope.modalVM.data.productPics[i];
                    //     else if($scope.modalVM.data.productPics[i].picType==6)
                    //         scope.modalVM.dsImgs = $scope.modalVM.data.productPics[i];
                    // }

                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }
                }
            });
        };

    }];
});
