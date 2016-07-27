define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$compile', '$modal', '$filter', 'toaster', 'supService',
        'PcService', 'metaService', 'auditService',
        function($rootScope, $scope, $state, $stateParams, $timeout, $compile, $modal, $filter, toaster, supService, PcService, metaService, auditService) {

            var title = '产品详细信息';

            /**
             * view data
             * @type {Object}
             */
            $scope.view = {
                suppliers: [], //supplier dropdown control data
                title: title, //page view title
                descAttrs: [], //description attributes
                specAttrs: [], //specification attributes
                descAttrValues: [], //values of description attributes
                deliveryFlags: []
            };

            $scope.product = {};

            /**
             * init default data
             */
            var init = function() {
                /**
                 * breadscrumb
                 * @type {String}
                 */
                ph.mark($rootScope, {
                    state: 'pc.product.edit',
                    title: title
                });

                var deliveryFlagsCode = "TSPSBJ"; //特殊配送标记  TSPSBJ
                metaService.getMeta(deliveryFlagsCode, function(list) {
                    $scope.view.deliveryFlags = list;
                });
            };
            init();

            $scope.getDeliveryFlagString = function(value) {
                if (!value)
                    return '';
                var arr = value.split(',');
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    for (var j = 0; j < $scope.view.deliveryFlags.length; j++) {
                        if (arr[i] == $scope.view.deliveryFlags[j].contentEn) {
                            item = $scope.view.deliveryFlags[j].contentCn;
                            break;
                        }
                    }
                    result.push(item);
                }
                return result.join(' , ');
            };


            /**
             * query description attributes & specification attribute by category code
             * @param  {string} categoryCode: category code
             */
            var queryAttributes = function(categoryCode) {
                $scope.view.attrLoading = true;
                //查询属性列表
                PcService.findAttrsByCat(categoryCode).then(
                    function(data) {
                        if (data) {
                            data.forEach(function(item) {
                                item.attributeVal = JSON.parse(item.attributeVal);
                                if (item.standard == 1) {
                                    $scope.view.specAttrs.push(item);
                                } else {
                                    $scope.view.descAttrs.push(item);
                                }
                            });
                        }
                        $scope.view.attrLoading = false;
                    },
                    function(errResponse) {
                        $scope.view.attrLoading = false;
                        toaster.pop('error', '属性加载失败，服务器请求异常，请刷新重试！');
                    }
                );
            };

            /**
             * sort data
             * @param  {array} datas   the data to be sorted
             * @param  {bool} reverse asc or desc
             * @return {array}         data after sorted
             */
            var sortDatas = function(datas, field, reverse) {
                var result = [];
                if (datas && datas.length > 0) {
                    result = $filter('orderBy')(datas, field, reverse);
                };
                return result;
            };

            /**
             * process description  attribute
             * @param  {object} attr attribute data
             */
            var processDescAttribute = function(attr) {
                //values of description attribute 
                //there are no values of specification attributes
                if (attr.nsStandard == 0) {
                    //checkbox list
                    if (attr.fieldType == 4)
                        attr.attributeVal = attr.attributeVal.split(',');
                    else
                        attr.attributeVal = [attr.attributeVal];
                }
            };

            /**
             * load product detail info
             */
            var loadProduct = (function() {
                $scope.view.loading = true;

                PcService.getEsin($stateParams.code).then(function(res) {
                    if (res && res.status == 200) {
                        //rebuild categoryAllName field
                        if (res.items.categoryAllName)
                            res.items.categoryAllName = res.items.categoryAllName.split(',').join(' - ');
                        //resort with picIndex
                        res.items.productPics = sortDatas(res.items.productPics, 'picIndex', false);
                        $scope.product = res.items;
                        //convert custom attributes string to object
                        $scope.product.customAttribute = JSON.parse(res.items.customAttribute || '[]');

                        //process description attributes & specification attributes
                        $scope.product.customAttribute.forEach(function(item) {
                            //description attribute 
                            if (item.standard == 0) {
                                $scope.view.descAttrs.push(item);
                            } else //standard attribute
                                $scope.view.specAttrs.push(item);
                        });

                        //process values of description attributes & specification attributes
                        $scope.product.productAttrss.forEach(function(attrItem) {
                            //values of description attribute 
                            //there are no values of specification attributes
                            processDescAttribute(attrItem);
                            if (attrItem.nsStandard == 0) {
                                $scope.view.descAttrValues.push(attrItem);
                            }
                        });
                        $scope.product.skus.forEach(function(skuItem) {
                            skuItem.productAttrss.forEach(function(skuAttrItem) {
                                processDescAttribute(skuAttrItem);
                            });
                        });
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '产品加载失败，请刷新重试！');
                    }

                    $scope.view.loading = false;
                }, function(err) {
                    toaster.pop('error', '服务器请求异常！');
                    $scope.view.loading = false;
                });
            })();

            /**
             * go back to list view with list view model
             */
            $scope.back = function() {
                var fromState = $stateParams.from || 'pc.product.list';
                $state.go(fromState, {
                    listVM: $stateParams.listVM
                }, {
                    reload: true
                });
            };

            /**
             * if current esin can be audited or not
             */
            $scope.canAudit = function() {
                var from = $stateParams.from;
                if (from == 'pc.product.auditList' && $scope.product.status == 1) {
                    return true;
                }
                return false;
            };


            /**
             * show modal dialog of sku custom attributes 
             * @param  {[type]} sku [sku id]
             * @return {[type]}     [description]
             */
            $scope.viewCustomAttribute = function(sku) {
                var descAttrValues = $filter('filter')(sku.productAttrss, {
                    nsStandard: 0
                });

                var modalInstance = $modal.open({
                    templateUrl: 'view/pc/product/customAttributeView.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.modalVM = {
                            title: 'SKU详细信息',
                            descAttrValues: descAttrValues,
                            data: sku
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }
                    }
                });
            };

            //    审核esin
            $scope.auditOption = {
                vals: []
            };
            metaService.getMeta("CPSHX", function(backList) {
                if (backList == null || backList.length == 0) {
                    $scope.auditOption.vals = ["产品价格", "产品图片", "物流信息", "产品专利", "品类归属", "产品品牌", "产品质保期", "产品说明"];
                } else {
                    $scope.auditOption.vals = backList;
                }
                $scope.auditOption.selectedItems = [];
            });
            $scope.auditVM = {
                title: "审核esin",
                codes: '1',
                auditOption: $scope.auditOption,
                auditPass: false,
                //fromState: '0',
                remark: ''
            };
            // if ($rootScope.listVM.fromState) {
            //     $scope.auditVM.fromState = $rootScope.listVM.fromState;
            // }
            $timeout(function() {
                var auditOption = $scope.auditOption;
                $scope.auditVM.auditOption.selectedItems = [];
                auditOption.vals.forEach(function(item) {
                    $scope.auditVM.auditOption.selectedItems.push(item.contentCn);
                });
            }, 0)

            $scope.auditEsin = function(status) {
                $scope.auditData = {
                    codes: [$scope.product.code],
                    auditOptions: $scope.auditVM.auditOption.selectedItems,
                    remark: $scope.auditVM.remark,
                    openEmail: $rootScope.curUser.loginName,
                    status: status
                };

                auditService.auditPass($scope.auditData).then(
                    function(data) {
                        if (data.status == 200) {
                            var result = data.items;
                            if (result.status == "123100") {
                                toaster.pop("success", result.msg + result.items);
                            } else {
                                toaster.pop("error", result.msg + result.items);
                            }
                            // back to audit list 
                            if ($stateParams.listVM) {
                                $stateParams.listVM.reload = true;
                            }
                            $state.go('pc.product.auditList', {
                                listVM: $stateParams.listVM
                            }, {
                                reload: true
                            });
                        } else {
                            toaster.pop("error", +data.msg);
                        }
                    },
                    function(errResponse) {
                        batchScope.confirmData.processing = true;
                        toaster.pop("error", "服务器请求异常！");
                    }
                );
            }

        }
    ];
});
