define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$compile', '$modal', '$filter', 'toaster', 'supService', 'PcService', 'metaService', 'areaService',
        function($rootScope, $scope, $state, $stateParams, $timeout, $compile, $modal, $filter, toaster, supService, PcService, metaService, areaService) {

            var title = '添加产品信息';
            var isAdd = false;
            var isEdit = false;
            var sysPrefix = "PJA";
            var productWarehouseCode = "0001";

            /**
             * init default data
             */
            var init = (function() {
                switch ($state.current.name) {
                    case 'pc.product.add':
                        title = '添加产品信息';
                        isAdd = true;
                        break;
                    case 'pc.product.edit':
                        title = '修改产品信息';
                        isEdit = true;
                        break;
                    default:
                        break;
                }

                /**
                 * breadscrumb
                 * @type {String}
                 */
                ph.mark($rootScope, {
                    state: 'pc.product.edit',
                    title: title
                });
            })();

            /**
             * view data
             * @type {Object}
             */
            $scope.view = {
                isAdd: isAdd,
                isEdit: isEdit,
                suppliers: [], //supplier dropdown control data
                title: title, //page view title
                // descAttrs: [], //description attributes
                // specAttrs: [], //specification attributes
                // descAttrValues: [], //values of description attributes
                deliveryFlags: {
                    vals: [],
                    selectedItems: []
                },
                provinces: [],
                tabsError: [false, false, false, false, false, false, false, false] //tab has error or not
            };

            /**
             * default product data
             * @type {Object}
             */
            $scope.product = {
                customAttributeList: [],
                productAttrss: [],
                productPrices: [],
                productPics: [],
                skus: []
            };

            /**
             * open confirm dialog: common method
             * @param  {string} text       message of modal dialog
             * @param  {function} okCallback callback after click ok button
             */
            var openConfirm = function(data, okCallback) {
                data = data || { text: '确认操作？', autoClose: true };
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: data.text,
                            processing: false
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            if (typeof okCallback === 'function') {
                                okCallback($scope, $modalInstance);
                            }
                            if (data.autoClose) {
                                $modalInstance.dismiss();
                            }
                            return true;
                        }
                    }
                });
            };

            var loadDeliveryPlace = function() {
                var viewDeliveryPlace = '';
                var stateCode = $scope.product.deliveryProvince;
                var cityCode = $scope.product.deliveryCity;
                var deliveryPlace = $scope.product.deliveryPlace;
                if (!$scope.view.deliveryPlace && $scope.view.provinces.length > 0 && deliveryPlace) {
                    var province = getProvince(stateCode);
                    var city = getCity(province, cityCode);
                    if (province && province.stateName)
                        deliveryPlace = deliveryPlace.replace(province.stateName, '');
                    if (city && city.cityName)
                        deliveryPlace = deliveryPlace.replace(city.cityName, '');
                    viewDeliveryPlace = deliveryPlace.replace(/^\s+|\s+$/gm, '');
                }
                $scope.view.deliveryPlace = viewDeliveryPlace;
            };

            /**
             * init meta data
             */
            var initMetaData = function() {
                // 获取元数据
                var unitCode = "DHDW"; //订货单位   DHDW
                var skuPackstyleCode = "DJBZFS"; //单件包装方式   DJBZFS
                var packTypeCode = "WLBZFS"; //物流包装方式   WLBZFS
                var deliveryFlagsCode = "TSPSBJ"; //特殊配送标记  TSPSBJ
                var currencyTypeCode = "JSBZ"; //结算币种   JBBZ
                var netweightUnitCode = 'DJCPZLDW'; //单件产品重量单位  DJCPZLDW
                var sizeUnitCode = 'DJCPCCDW'; //单件产品尺寸单位   DJCPCCDW
                var packWeightUnitCode = 'BZHZLDW'; //包装后重量单位   BZHZLDW
                var packSizeUnitCode = 'BZHCCDW'; //包装后尺寸单位     BZHCCDW
                var vatRateCode = 'ZZSL'; //增值税率  ZZSL

                metaService.getMeta(unitCode, function(list) {
                    $scope.view.unitList = list;
                });
                metaService.getMeta(skuPackstyleCode, function(list) {
                    $scope.view.skuPackstyleList = list;
                });
                metaService.getMeta(packTypeCode, function(list) {
                    $scope.view.packTypeList = list;
                });
                metaService.getMeta(deliveryFlagsCode, function(list) {
                    $scope.view.deliveryFlags.vals = list;
                    $scope.view.deliveryFlags.selectedItems = [];
                });
                metaService.getMeta(currencyTypeCode, function(list) {
                    $scope.view.currencyList = list;
                });
                metaService.getMeta(netweightUnitCode, function(list) {
                    $scope.view.netweightUnitList = list;
                });
                metaService.getMeta(sizeUnitCode, function(list) {
                    $scope.view.sizeUnitList = list;
                });
                metaService.getMeta(packWeightUnitCode, function(list) {
                    $scope.view.packWeightUnitList = list;
                });
                metaService.getMeta(packSizeUnitCode, function(list) {
                    $scope.view.packSizeUnitList = list;
                });
                metaService.getMeta(vatRateCode, function(list) {
                    $scope.view.vatRateCodeList = list;
                });

                //get cities of china
                areaService.getDepartureCities(function(list) {
                    //debugger
                    $scope.view.provinces = list;
                    loadDeliveryPlace();
                });
            };
            initMetaData();

            /*
                change sample_max while moq changed 
            */
            $scope.moqChanged = function() {
                if ($scope.product.moq > 1) {
                    $scope.product.sampleMax = Math.min($scope.product.moq - 1, 10);
                }
            };

            $scope.getCities = function() {
                var cities = [];
                var stateCode = $scope.product.deliveryProvince;
                if (stateCode) {
                    for (var i = 0; i < $scope.view.provinces.length; i++) {
                        var p = $scope.view.provinces[i];
                        if (p.stateCode == stateCode) {
                            cities = p.cities;
                            break;
                        }
                    };
                }
                return cities;
            };

            var getProvince = function(stateCode) {
                var province = null;
                for (var i = 0; i < $scope.view.provinces.length; i++) {
                    var p = $scope.view.provinces[i];
                    if (p.stateCode == stateCode) {
                        province = p;
                        break;
                    }
                };
                return province;
            };

            var getCity = function(province, cityCode) {
                var city = null;
                if (province) {
                    for (var i = 0; i < province.cities.length; i++) {
                        var c = province.cities[i];
                        if (c.cityCode == cityCode) {
                            city = c;
                            break;
                        }
                    };
                }
                return city;
            };

            /**
             * 异步加载supplier下拉查询控件
             * @param  {string} sup [supplier name or email]
             */
            $scope.refreshSupplier = function(sup) {
                if (!sup)
                    return false;

                $scope.view.supplierLoading = true;

                var params = {
                    email: sup,
                    companyName: sup
                }
                supService.filterSupplier(params).then(function(res) {
                    if (res.status == 200) {
                        $scope.view.suppliers = res.items;
                    }
                    $scope.view.supplierLoading = false;
                }, function(err) {
                    $scope.view.supplierLoading = false;
                    toaster.pop('error', '服务器请求异常！');
                });
            };


            // 品类数据
            $scope.treeData = {
                loading: true,
                settings: {
                    async: {
                        enable: true,
                        url: config.pc_domain + '/catActiveMenu/',
                        autoParam: ["id"],
                        type: 'POST'
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onAsyncSuccess: onAsyncSuccess,
                        onAsyncError: onAsyncError,
                        onClick: afterClick
                    }
                }
            };

            //异步加载品类成功
            function onAsyncSuccess(event, treeId, treeNode, msg) {
                $timeout(function() {
                    $scope.treeData.loading = false;
                });
                return true;
            }

            /**
             * 异步加载品类失败
             */
            function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
                $timeout(function() {
                    $scope.treeData.loading = false;
                });
                toaster.pop('error', '加载产品品类数据出错，请重试！');
            }

            /**
             * after select category node
             */
            function afterClick(event, treeId, treeNode) {
                $timeout(function() {
                    // $scope.categoryCode = treeNode.id;
                    $scope.product.categoryAllName = "";
                    $scope.product.categoryName = "";
                    $scope.product.categoryCode = "";
                    // $scope.view.descAttrs = [];
                    // $scope.view.specAttrs = [];

                    if (treeNode.leaf) { //如果是叶子节点
                        // 获取品类名称
                        var paths = treeNode.getPath();
                        var categoryNamePath = '';
                        if (paths && paths.length > 0) {
                            categoryNamePath = paths.map(function(item) {
                                return item.name;
                            }).join(' - ');
                        }
                        $scope.product.categoryAllName = categoryNamePath;
                        $scope.product.categoryName = treeNode.name;
                        $scope.product.categoryCode = treeNode.id;
                        //toggle有点变态
                        //临时方案，解决关闭toggle层
                        $(document).click();

                        //get description attributes & specification attributes
                        queryAttributes(treeNode.id);
                    }
                });
            };

            /**
             * query description attributes & specification attribute by category code
             * @param  {string} categoryCode: category code
             */
            var queryAttributes = function(categoryCode, callback) {
                $scope.view.attrLoading = true;
                //查询属性列表
                PcService.findAttrsByCat(categoryCode).then(
                    function(data) {

                        $scope.product.customAttributeList = $scope.product.customAttributeList || [];
                        // delete all attributes from category & leave the custom behind
                        for (var i = $scope.product.customAttributeList.length - 1; i >= 0; i--) {
                            var item = $scope.product.customAttributeList[i];
                            if (!item.isCustom) {
                                $scope.product.customAttributeList.splice(i, 1);
                            }
                        };

                        if (data) {
                            data.forEach(function(item) {
                                try {
                                    item.attributeVal = angular.fromJson(item.attributeVal);
                                } catch (e) {
                                    item.attributeVal = {
                                        cnValue: item.attributeVal,
                                        enValue: item.attributeVal
                                    };
                                }
                            });
                            //merge with existed data
                            $scope.product.customAttributeList = data.concat($scope.product.customAttributeList);
                            if (callback && typeof callback == 'function') {
                                callback();
                            }
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
             * 清空已选品类
             * 清空品类相关属性
             */
            $scope.clearCategory = function() {
                $scope.product.categoryName = undefined;
                $scope.product.categoryAllName = undefined;
                $scope.product.categoryCode = undefined;

                //clear description attributes & specification attributes of custom

            };

            // $scope.address = {
            //     province: '',
            //     city: '',
            //     district: ''
            // };
            // //声明省市联动数据
            // var initArea = function() {
            //     require(['script/controller/pc/references/areaData.js'], function() {
            //         $scope.division = division;
            //     });
            // };
            // initArea();

            /**
             * if can add specification attribute value or not
             * @param  {object} item: current specification attribute
             * @return {bool}
             */
            $scope.canAddSpecAttrVal = function(item) {
                //自定义
                if (item.isCustom && item.attributeVal.length >= 20) {
                    return false;
                } else if (!item.isCustom) {
                    var customCount = 0;
                    item.attributeVal.forEach(function(valItem) {
                        if (valItem.isCustom) {
                            customCount++;
                        }
                    });
                    if (customCount >= 10) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * show description attribute value dialog
             * @param  {int} index: index of current description attribute
             */
            $scope.addDescAttrVal = function(item) {
                showAttrValDialog(1, item);
            };

            /**
             * show specification attribute value dialog
             * @param  {int} index: index of current description attribute
             */
            $scope.addSpecAttrVal = function(item) {
                showAttrValDialog(2, item);
            };

            /**
             * show attribute value dialog
             * @param  {int} type: 1,description attribute; 2,specification attribute
             * @param  {object} attr: data of current attribute
             */
            var showAttrValDialog = function(type, attr) {
                var title = '新增描述属性值';
                switch (type) {
                    case 1:
                        title = '新增描述属性值';
                        break;
                    case 2:
                    default:
                        title = '新增规格属性值';
                        break;
                }

                $modal.open({
                    templateUrl: 'view/pc/product/addAttrVal.html',
                    size: 'md',
                    controller: function($scope, $modalInstance) {

                        $scope.attrValVM = {
                            title: title,
                            attr: attr,
                            data: {
                                isCustom: 1
                            }
                        };

                        //cancel
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        // save
                        $scope.save = function(invalid) {
                            if (invalid)
                                return;

                            var enValue = $scope.attrValVM.data.enValue;
                            var cnValue = $scope.attrValVM.data.cnValue;

                            for (var i = 0; i < attr.attributeVal.length; i++) {
                                if (attr.attributeVal[i].enValue == enValue) {
                                    $scope.attrValVM.errorMsg = '属性值已经存在!';
                                    return;
                                }
                            }

                            attr.attributeVal.push({
                                enValue: enValue,
                                cnValue: cnValue || enValue,
                                isCustom: 1
                            });

                            $modalInstance.dismiss();
                            return true;
                        }
                    }
                });
            };

            //描述属性删除子项
            $scope.delDescAttrVal = function(item, index, event) {
                var confirmText = '确定删除属性值[' + item.attributeVal[index].enValue + ']？';
                var confirmData = {
                    text: confirmText,
                    autoClose: true
                };
                openConfirm(confirmData, function(confirmScope, confirmInstance) {
                    if (item.attributeVal[index].isCustom) {
                        if (item.checkedVal && item.checkedVal.enValue == item.attributeVal[index].enValue) {
                            item.checkedVal = {};
                        }

                        if (item.checkedList) {
                            for (var i = 0; i < item.checkedList.length; i++) {
                                if (item.attributeVal[index].enValue == item.checkedList[i].enValue)
                                    item.checkedList.splice(i, 1);
                            }
                        }
                        item.attributeVal.splice(index, 1);
                    }
                });
                event.stopPropagation();
                event.preventDefault();
            };

            var delSpecAttrVal = function(item, index) {

                var delVal = item.attributeVal[index].enValue;

                for (var i = 0; i < $scope.product.skus.length; i++) {
                    for (var j = 0; j < $scope.product.skus[i].productAttrss.length; j++) {
                        if ($scope.product.skus[i].productAttrss[j]) {
                            if (item.attributeEnName == $scope.product.skus[i].productAttrss[j].attributeEnName && delVal == $scope.product.skus[i].productAttrss[j].attributeVal) {
                                $scope.product.skus[i].productAttrss[j].attributeVal = '';
                                if ($scope.product.skus[i].enName) {
                                    $scope.product.skus[i].enName = $scope.product.enName;
                                    $scope.product.skus[i].name = $scope.product.enName;
                                    for (var k = 0; k < $scope.product.skus[i].productAttrss.length; k++) {
                                        if (!$scope.product.skus[i].productAttrss[k]) {
                                            continue;
                                        }
                                        if (!$scope.product.skus[i].productAttrss[k].attributeVal) {
                                            continue;
                                        }
                                        $scope.product.skus[i].enName += ' ' + angular.fromJson($scope.product.skus[i].productAttrss[k]).attributeVal + angular.fromJson($scope.product.skus[i].productAttrss[k]).suffix;
                                        $scope.product.skus[i].name += ' ' + angular.fromJson($scope.product.skus[i].productAttrss[k]).attributeVal + angular.fromJson($scope.product.skus[i].productAttrss[k]).suffix;
                                    }
                                }
                            }
                        }
                    }
                }

                if (item.attributeVal[index].isCustom) {
                    if (item.checkedVal && item.checkedVal.enValue == item.attributeVal[index].enValue) {
                        item.checkedVal = {};
                    }

                    if (item.checkedList) {
                        for (var i = 0; i < item.checkedList.length; i++) {
                            if (item.attributeVal[index].enValue == item.checkedList[i].enValue)
                                item.checkedList.splice(i, 1);
                        }
                    }
                    item.attributeVal.splice(index, 1);
                }
            };

            //描述属性删除子项
            $scope.delSpecAttrVal = function(item, index, event) {
                var delValue = item.attributeVal[index].cnValue || item.attributeVal[index].enValue;
                var confirmText = '确定删除属性值[' + delValue + ']？';
                var confirmData = {
                    text: confirmText,
                    autoClose: true
                };
                openConfirm(confirmData, function(confirmScope, confirmInstance) {
                    delSpecAttrVal(item, index);
                });
                event.stopPropagation();
                event.preventDefault();
            };

            /**
             * show description attribute dialog
             */
            $scope.addDescAttr = function() {
                showAttrDialog(1);
            };

            /**
             * show specification attribute dialog
             */
            $scope.addSpecAttr = function() {
                showAttrDialog(2);
            };

            /**
             * show attribute dialog
             * @param  {type} type: 1,description attribute; 2,specification attribute
             */
            var showAttrDialog = function(type) {

                var title = '新增描述属性';
                switch (type) {
                    case 1:
                        title = '新增描述属性';
                        break;
                    case 2:
                    default:
                        title = '新增规格属性';
                        break;
                }

                $modal.open({
                    templateUrl: 'view/pc/product/addAttr.html',
                    size: 'md',
                    controller: function($scope, $modalInstance) {

                        $scope.attrVM = {
                            title: title,
                            type: type,
                            data: {
                                attributeVal: [{
                                    isCustom: true
                                }],
                                isCustom: true
                            }
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.addValue = function() {
                            $scope.attrVM.data.attributeVal.push({
                                isCustom: true
                            });
                        };
                        $scope.delValue = function(index) {
                            $scope.attrVM.data.attributeVal.splice(index, 1);
                        };

                        //save
                        $scope.save = function(invalid) {
                            if (type == 1) {
                                $scope.attrVM.submitted = true;
                                $scope.resp = saveDescAttr($scope.attrVM.data, invalid);
                            } else {
                                $scope.attrVM.submitted = true;
                                $scope.resp = saveSpecAttr($scope.attrVM.data, invalid);
                            }
                            if ($scope.resp.errorFlag) return false;
                            $modalInstance.dismiss();
                            return true;
                        }
                    }
                });
            }

            // 添加描述属性
            var saveDescAttr = function(newAttr, invalid) {
                var resp = {
                    errorFlag: false,
                    errorName: ''
                };
                resp.errorFlag = false;
                if (invalid)
                    resp.errorFlag = true;
                if (!resp.errorFlag) {
                    var descAttrs = $filter('filter')($scope.product.customAttributeList, {
                        standard: 0
                    });
                    descAttrs.forEach(function(item) {
                        if (item.attributeEnName == newAttr.attributeEnName) {
                            resp.errorName = '属性名已经存在!';
                            resp.errorFlag = true;
                        }
                    });
                }

                if (!resp.errorFlag) {
                    if (!newAttr.attributeName)
                        newAttr.attributeName = newAttr.attributeEnName;
                    if (!newAttr.attributeVal[0].cnValue)
                        newAttr.attributeVal[0].cnValue = newAttr.attributeVal[0].enValue;

                    newAttr.standard = 0;
                    newAttr.fieldType = 1;
                    newAttr.proAttr = {
                        isCustom: 1,
                        attributeCode: '',
                        attributeName: newAttr.attributeEnName,
                        attributeEnName: newAttr.attributeEnName,
                        attributeVal: newAttr.attributeVal[0].enValue,
                        fieldType: 1,
                        nsStandard: 0
                    };
                    $scope.product.customAttributeList.push(newAttr);
                }
                return resp;
            };

            // 添加规格属性
            var saveSpecAttr = function(newAttr, invalid) {
                var resp = {
                    errorFlag: false,
                    errorName: ''
                };
                resp.errorFlag = false;
                if (invalid)
                    resp.errorFlag = true;
                if (!resp.errorFlag) {
                    var descAttrs = $filter('filter')($scope.product.customAttributeList, {
                        standard: 1
                    });
                    descAttrs.forEach(function(item) {
                        if (item.attributeEnName == newAttr.attributeEnName) {
                            resp.errorName = '属性名已经存在!';
                            resp.errorFlag = true;
                        }
                    });
                }

                if (!resp.errorFlag) {
                    newAttr.attributeVal.forEach(function(item, index) {
                        if (index == 0)
                            return;
                        for (var i = 0; i < index; i++) {
                            if (item.enValue == newAttr.attributeVal[i].enValue) {
                                item.errorMsg = '属性值已经存在!';
                                resp.errorFlag = true;
                            }
                        }
                    });
                }

                if (!resp.errorFlag) {
                    if (!newAttr.attributeName)
                        newAttr.attributeName = newAttr.attributeEnName;
                    newAttr.attributeVal.forEach(function(item) {
                        if (!item.cnValue)
                            item.cnValue = item.enValue;
                    });
                    newAttr.standard = 1;
                    newAttr.fieldType = 3;
                    $scope.product.customAttributeList.push(newAttr);
                }
                return resp;
            };

            // 删除自定义描述属性
            $scope.delDescAttr = function(attr) {
                var confirmText = '确定删除描述属性[' + (attr.attributeName || attr.attributeEnName) + ']？';
                var confirmData = {
                    text: confirmText,
                    autoClose: true
                };
                openConfirm(confirmData, function(confirmScope, confirmInstance) {
                    for (var i = $scope.product.customAttributeList.length - 1; i >= 0; i--) {
                        var item = $scope.product.customAttributeList[i];
                        if (attr.standard == 0 && !item.attributeCode && attr.attributeEnName == item.attributeEnName) {
                            $scope.product.customAttributeList.splice(i, 1);
                            return;
                        }
                    }
                });
            };

            /**
             * delete specification attribute
             * @param  {object} attr attribute object
             */
            var delSpecAttr = function(attr) {
                var findOne = false;
                //the length of specification attribute template
                var specAttrs = $filter('filter')($scope.product.customAttributeList, {
                    standard: 1
                });
                var specAttrsIndex = specAttrs.length;
                for (var i = $scope.product.customAttributeList.length - 1; i >= 0; i--) {
                    var item = $scope.product.customAttributeList[i];
                    if (item.standard == 1) {
                        specAttrsIndex--;
                    }
                    if (item.attributeCode && item.attributeCode == attr.attributeCode) {
                        findOne = true;
                    } else if (!item.attributeCode && item.attributeEnName == attr.attributeEnName) {
                        findOne = true;
                    }
                    if (findOne) {
                        $scope.product.customAttributeList.splice(i, 1);
                        delSkuProductAttrbute(item, specAttrsIndex);
                        break;
                    }
                }
            };

            //删除自定义规格属性
            $scope.delSpecAttr = function(attr) {
                var confirmText = '确定删除规格属性[' + (attr.attributeName || attr.attributeEnName) + ']？';
                var confirmData = {
                    text: confirmText,
                    autoClose: true
                };
                openConfirm(confirmData, function(confirmScope, confirmInstance) {
                    delSpecAttr(attr);
                });
            };

            /**
             * delete sku's product attribute by specification attribute
             * @param  {[type]} specAttr [description]
             */
            var delSkuProductAttrbute = function(specAttr, index) {
                //delete sku's checked value
                $scope.product.skus.forEach(function(item) {
                    if (item.productAttrss && item.productAttrss.length > index) {
                        item.productAttrss.splice(index, 1);
                        item.enName = $scope.product.enName;
                        item.name = $scope.product.enName;
                        for (var i = 0; i < item.productAttrss.length; i++) {
                            if (!item.productAttrss[i]) {
                                continue;
                            }
                            if (!item.productAttrss[i].attributeVal) {
                                continue;
                            }
                            item.productAttrss[i].attributeVal = '';
                            // item.enName += ' ' + angular.fromJson(item.productAttrss[i]).attributeVal + angular.fromJson(item.productAttrss[i]).suffix;
                            // item.name += ' ' + angular.fromJson(item.productAttrss[i]).attributeVal + angular.fromJson(item.productAttrss[i]).suffix;
                        }
                    }
                });
            };

            $scope.addPrice = function() {
                addPrice($scope.product.productPrices);
            }
            $scope.delPrice = function(index) {
                delPrice($scope.product.productPrices, index);
            }
            $scope.cleanPriceErrorMsg = function() {
                if ($scope.view.submitted)
                    cleanPriceErrorMsg($scope.product.productPrices);
            };
            // 梯度价格,添加一行
            var addPrice = function(productPrices) {
                $scope.priceObj = {
                    "startCount": "",
                    "endCount": "",
                    "price": "",
                    "tradeClause": "",
                    "error": ''
                };
                productPrices.push($scope.priceObj);
            }
            $scope.addPrice();

            // 删除一行梯度价格
            var delPrice = function(productPrices, index) {
                productPrices.splice(index, 1);
            }

            // 优惠数量校验
            var cleanPriceErrorMsg = function(productPrices) {
                productPrices.forEach(function(item, index) {
                    if (index != 0) {
                        var currCount = parseInt(item.startCount);
                        var preCount = parseInt(productPrices[index - 1].startCount);
                        if (currCount <= preCount) {
                            item.errorMsg = '当前优惠数量不能小于等于已有优惠数量！';
                        } else {
                            item.errorMsg = '';
                        }
                    }
                });
            }

            /**
             * upload image
             * @param  {int}  type        image type
             * @param  {object}  formData    form data 
             * @param  {object}  imgSources  image list
             * @param  {function} callback: callback function
             */
            var uploadFile = function(type, formData, imgSources, callback) {
                PcService.uploadFile(formData).then(function(res) {
                    if (res && res.status == 200) {
                        addImg(type, imgSources, res.items);
                        if (typeof callback == 'function') {
                            callback(true);
                        }
                    } else {
                        toaster.pop('error', '图片上传失败，请重新上传！');
                    }
                }, function(err) {
                    toaster.pop('error', '图片上传失败！');
                    if (typeof callback == 'function') {
                        callback(false);
                    }
                });
            };

            /**
             * push one image to product pictures list
             * @param {int} picType: 2,产品图片；4,明细图；6,资质图
             */
            var addImg = function(picType, imgSources, picUrl) {
                var picsOfType = $filter('filter')($scope.product.productPics, {
                    picType: picType
                });
                imgSources.push({
                    picIndex: picsOfType.length + 1,
                    picUrl: picUrl,
                    picType: picType
                });
            };

            /**
             * delete image
             * @param  {int} picType: 2,产品图片;4,明细图;6,资质图
             * @param  {int} index: index of product images with type
             */
            $scope.delImg = function(picType, index) {
                var typeIndex = -1;
                for (var i = 0; i < $scope.product.productPics.length; i++) {
                    var pic = $scope.product.productPics[i];
                    if (pic.picType == picType) {
                        typeIndex++;
                        if (typeIndex == index) {
                            $scope.product.productPics.splice(i, 1);
                            return;
                        }
                    }
                };
            };

            /**
             * set primary image
             * @param  {int} picType: 2,产品图片;4,明细图;6,资质图
             * @param  {int} index: index of product images with type
             */
            $scope.setPrimaryImg = function(picType, index) {
                if (index == 0)
                    return;

                var pics = $filter('filter')($scope.product.productPics, { picType: 2 });

                var tempUrl = pics[index].picUrl;
                pics[index].picUrl = pics[0].picUrl;
                pics[0].picUrl = tempUrl;
            };

            /**
             * upload image file
             * @param  {object} file     
             * @param  {string} data     base 64 data string
             * @param  {object} formData form data
             */
            $scope.mainImgSuccess = function(file, data, formData) {
                $scope.view.mainImgUploading = true;
                uploadFile(2, formData, $scope.product.productPics, function(isSuccess) {
                    $scope.view.mainImgUploading = false;
                });
            };

            /**
             * upload detail image file
             * @param  {object} file     file data
             * @param  {string} data     base64 data
             * @param  {object} formData form data
             */
            $scope.detailImgSuccess = function(file, data, formData) {
                $scope.view.detailImgUploading = true;
                uploadFile(4, formData, $scope.product.productPics, function(isSuccess) {
                    $scope.view.detailImgUploading = false;
                });
            };

            /**
             * upload qulification image
             * @param  {object} file     file data
             * @param  {string} data     base64 data
             * @param  {object} formData form data
             */
            $scope.qualificationImgSuccess = function(file, data, formData) {
                $scope.view.qualificationImgUploading = true;
                uploadFile(6, formData, $scope.product.productPics, function(isSuccess) {
                    $scope.view.qualificationImgUploading = false;
                });
            };

            /**
             * add a new sku line
             */
            $scope.addSku = function() {
                $scope.product.skus.push({
                    enName: $scope.product.enName,
                    name: $scope.product.enName,
                    hasCustom: 0,
                    productAttrss: []
                });
            };

            /**
             * delete current sku
             * @param  {int} index: the index of current sku
             */
            $scope.removeSku = function(index, sku) {
                if (sku.id) {
                    var text = '删除后将不能恢复，确定删除此SKU？';
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
                                deleteSku(index, sku.id, $scope, $modalInstance);
                                return true;
                            }
                        }
                    });
                } else
                    $scope.product.skus.splice(index, 1);
            };

            var deleteSku = function(index, id, confirmScope, modalInstance) {
                confirmScope.confirmData.processing = true;
                PcService.deleteSku(id).then(function(res) {
                    if (res && res.status == 200) {
                        toaster.pop('success', '删除成功！');
                        modalInstance.dismiss();
                        $scope.product.skus.splice(index, 1);
                    } else
                        toaster.pop('error', res.msg);

                    confirmScope.confirmData.processing = false;
                }, function(err) {
                    toaster.pop('error', '服务器请求异常！')
                    confirmScope.confirmData.processing = false;
                });
            };

            /**
             * customsize current sku data
             * @param  {object} skuObj: sku data
             * @param  {int} index: the index of current sku
             */
            $scope.editSku = function(skuObj) {
                showEditSkuDialog(skuObj);
            };

            /**
             * reset sku data to default
             * @param  {index} index: index of current sku
             */
            $scope.resetSku = function(sku) {
                sku.hasCustom = 0;
                sku.hasError = false;
                //clear custom data
            };

            /**
             * show sku data dialog
             * @param  {object} skuObj: sku data
             */
            var showEditSkuDialog = function(skuObj) {
                var netweightUnitList = $scope.view.netweightUnitList;
                var sizeUnitList = $scope.view.sizeUnitList;
                var packWeightUnitList = $scope.view.packWeightUnitList;
                var currencyList = $scope.view.currencyList;
                var packSizeUnitList = $scope.view.packSizeUnitList;
                $modal.open({
                    templateUrl: 'view/pc/product/editSku.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance, toaster) {
                        $scope.skuVM = {
                            title: '自定义SKU',
                            netweightUnitList: netweightUnitList,
                            sizeUnitList: sizeUnitList,
                            packWeightUnitList: packWeightUnitList,
                            currencyList: currencyList,
                            packSizeUnitList: packSizeUnitList,
                            sku: initCustomSkuData(skuObj)
                        };

                        //阶梯价格添加一行
                        $scope.addSkuPrice = function() {
                            addPrice($scope.skuVM.sku.productPrices);
                        };
                        //阶梯价格删除一行
                        $scope.delSkuPrice = function(index) {
                            delPrice($scope.skuVM.sku.productPrices, index);
                        };

                        //init on empty product price
                        if (!$scope.skuVM.sku.productPrices || $scope.skuVM.sku.productPrices.length == 0) {
                            addPrice($scope.skuVM.sku.productPrices);
                        }

                        //upload main image
                        $scope.skuImgSuccess = function(file, data, formData) {
                            $scope.skuVM.mainImgUploading = true;
                            uploadFile(2, formData, $scope.skuVM.sku.productPics, function(isSuccess) {
                                $scope.skuVM.mainImgUploading = false;
                            });
                        };

                        $scope.delSkuImg = function(index) {
                            //$scope.skuVM.sku.productPics.splice(index, 1);
                            var typeIndex = -1;
                            for (var i = 0; i < $scope.skuVM.sku.productPics.length; i++) {
                                var pic = $scope.skuVM.sku.productPics[i];
                                if (pic.picType == 2) {
                                    typeIndex++;
                                    if (typeIndex == index) {
                                        $scope.skuVM.sku.productPics.splice(i, 1);
                                        return;
                                    }
                                }
                            };
                        };

                        //返回
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        };

                        //save
                        $scope.save = function(invalid) {
                            $scope.skuVM.submitted = true;
                            if (invalid) {
                                // toaster.pop("请完善信息!");
                                // return true;
                            }
                            saveSku(skuObj, $scope.skuVM.sku);

                            $modalInstance.dismiss();
                            return false;
                        };
                    }
                });
            };

            /**
             * init custom sku data
             * @param  {object} sku: current sku
             */
            var initCustomSkuData = function(sku) {
                if (!sku.hasCustom) {
                    var result = {};
                    var esin = angular.copy($scope.product);
                    buildCustomSkuData(result, esin);
                    return result;
                }
                return sku;
            };

            /**
             * build custom sku data
             * used in custom sku dialog & save esin data
             * @param  {object} sku: sku data
             * @param  {object} esin: esin data
             */
            var buildCustomSkuData = function(sku, skuFrom) {
                //sale
                sku.moq = skuFrom.moq;
                sku.moqSupplytime = skuFrom.moqSupplytime;
                sku.settlementCurrency = skuFrom.settlementCurrency;
                sku.samplePrice = skuFrom.samplePrice;
                sku.price = skuFrom.price;
                sku.isGrads = skuFrom.isGrads;
                sku.productPrices = skuFrom.productPrices;

                //logistics
                sku.netweight = skuFrom.netweight;
                sku.netweightUnit = skuFrom.netweightUnit;
                sku.sizeUnit = skuFrom.sizeUnit;
                sku.length = skuFrom.length;
                sku.width = skuFrom.width;
                sku.height = skuFrom.height;
                sku.packAmount = skuFrom.packAmount;
                sku.packWeight = skuFrom.packWeight;
                sku.packWeightUnit = skuFrom.packWeightUnit;
                sku.packSizeUnit = skuFrom.packSizeUnit;
                sku.packLength = skuFrom.packLength;
                sku.packWidth = skuFrom.packWidth;
                sku.packHeight = skuFrom.packHeight;

                var imgs = angular.copy(skuFrom.productPics || []);

                //main images
                sku.productPics = sku.productPics || [];

                //delete origin main images then push the custom
                for (var i = sku.productPics.length - 1; i >= 0; i--) {
                    var img = sku.productPics[i];
                    if (img.picType == 2) {
                        sku.productPics.splice(i, 1);
                    }
                }
                //add custom main images
                var mainImgs = $filter('filter')(imgs, {
                    picType: 2
                });
                for (var i = 0; i < mainImgs.length; i++) {
                    var img = mainImgs[i];
                    sku.productPics.push({
                        productCode: sku.code || '',
                        picUrl: img.picUrl,
                        picType: 2,
                        picIndex: i + 1
                    });
                }
            };

            /**
             * save custom sku data
             * @param  {object} originSku: origin sku data
             * @param  {object} customSku: custom sku data
             */
            var saveSku = function(originSku, customSku) {
                originSku.hasCustom = 1;
                buildCustomSkuData(originSku, customSku);
            };

            $scope.editSkuAttr = function(specAttr, pIndex, index) {
                var skus = $scope.product.skus;
                var specCount = 0;

                var specAttrs = $filter('filter')($scope.product.customAttributeList, {
                    standard: 1
                });

                specCount = specAttrs.length;

                var currSkuSpecAttr = skus[pIndex].productAttrss;

                for (var i = 0; i < skus.length; i++) {
                    var tempSkuSpecAttr = skus[i].productAttrss;
                    if (i == pIndex || currSkuSpecAttr.length < specCount || tempSkuSpecAttr.length < specCount)
                        continue;

                    var repeatError = 1;

                    for (var j = 0; j < currSkuSpecAttr.length; j++) {
                        if (currSkuSpecAttr[j] && tempSkuSpecAttr[j]) {
                            if (currSkuSpecAttr[j].attributeVal != tempSkuSpecAttr[j].attributeVal) {
                                repeatError = 0;
                                break;
                            }
                        }
                    }

                    if (repeatError) {
                        skus[pIndex].productAttrss[index].attributeVal = '';
                        break;
                    }
                }


                if (skus[pIndex].enName) {
                    skus[pIndex].enName = $scope.product.enName;
                    skus[pIndex].name = $scope.product.enName;
                    for (var i = 0; i < skus[pIndex].productAttrss.length; i++) {
                        if (!skus[pIndex].productAttrss[i]) {
                            continue;
                        }
                        if (!skus[pIndex].productAttrss[i].attributeVal) {
                            continue;
                        }
                        skus[pIndex].productAttrss[index].attributeEnName = specAttr.attributeEnName;
                        skus[pIndex].productAttrss[index].suffix = specAttr.suffix == undefined ? '' : specAttr.suffix;
                        skus[pIndex].enName += ' ' + angular.fromJson(skus[pIndex].productAttrss[i]).attributeVal + angular.fromJson(skus[pIndex].productAttrss[i]).suffix;
                        skus[pIndex].name += ' ' + angular.fromJson(skus[pIndex].productAttrss[i]).attributeVal + angular.fromJson(skus[pIndex].productAttrss[i]).suffix;
                    }
                }
            };

            // 货号排重
            $scope.isExistSupplierSku = function(p, index) {
                p.existSupplierSku = '';
                if (undefined == p.supplierSku || "" == p.supplierSku) {
                    p.existSupplierSku = '必填项!';
                    return;
                }
                for (var i = 0; i < $scope.product.products.length; i++) {
                    if (index == i)
                        continue;
                    if (p.supplierSku == $scope.product.products[i].supplierSku) {
                        p.existSupplierSku = '货号重复!';
                    }
                }
            };

            // SKU名称排重
            $scope.isExistSkuName = function(p, index) {
                p.existSkuName = '';
                if (undefined == p.enName || "" == p.enName) {
                    p.existSkuName = '必填项!';
                    return;
                }
                for (var i = 0; i < $scope.product.products.length; i++) {
                    if (index == i)
                        continue;
                    if (p.enName == $scope.product.products[i].enName) {
                        p.existSkuName = 'SKU名称重复!';
                    }
                }
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
             * process product attribute of esin's sku
             * @param  {object} esin: esin data
             */
            var loadSkus = function(esin) {
                esin.skus.forEach(function(sku) {
                    var proAttrList = [];
                    var specAttributeList = $filter('filter')(esin.customAttributeList, {
                        standard: 1
                    });

                    specAttributeList.forEach(function(specAttr) {
                        //match sku's product attribute value to specification attribute dropdown list
                        var valueObj = {
                            attributeVal: '',
                            nsStandard: 1
                        };
                        var findOne = false;
                        for (var i = 0; i < sku.productAttrss.length; i++) {
                            var skuProAttr = sku.productAttrss[i];
                            if (specAttr.attributeCode && specAttr.attributeCode == skuProAttr.attributeCode) {
                                findOne = true;
                            } else if (!specAttr.attributeCode && specAttr.attributeEnName == skuProAttr.attributeName) {
                                findOne = true;
                            }

                            if (findOne) {
                                valueObj = angular.copy(skuProAttr);
                                break;
                            }
                        };
                        proAttrList.push(valueObj);
                    });

                    sku.productAttrss = proAttrList;
                });
            };

            var processCustomAttribute = function() {
                //process description attributes & specification attributes
                $scope.product.customAttributeList.forEach(function(item) {
                    //description attribute 
                    if (item.standard == 0) {
                        $scope.product.productAttrss.forEach(function(proAttr) {
                            if (proAttr.nsStandard == 0) {
                                //checkbox list
                                if (proAttr.fieldType == 4)
                                    proAttr.attributeValList = proAttr.attributeVal.split(',');
                            }
                            //match template and value with attribute code if existed
                            if (item.attributeCode && item.attributeCode == proAttr.attributeCode) {
                                item.proAttr = proAttr;
                            } else if (item.attributeEnName == proAttr.attributeName) {
                                //match template and value with attributeEnName if code not existed
                                //remark: there's no attributeEnName field in product attribute 
                                //        & attributeName field is saved in english
                                item.proAttr = proAttr;
                            }
                        });
                    }
                });
                //process sku data
                loadSkus($scope.product);
            };

            /**
             * load product detail info
             */
            var loadProduct = function() {
                $scope.view.loading = true;

                PcService.getEsin($stateParams.code).then(function(res) {
                    if (res && res.status == 200) {
                        $scope.view.supplier = {
                            supplierId: res.items.supplierId,
                            companyName: res.items.supplierName
                        };
                        //rebuild categoryAllName field
                        if (res.items.categoryAllName)
                            res.items.categoryAllName = res.items.categoryAllName.split(config.splitCharacter).join(' - ');

                        //init one empty product price
                        if (!res.items.productPrices || res.items.productPrices.length == 0) {
                            res.items.productPrices = [];
                            addPrice(res.items.productPrices);
                        }

                        //resort with picIndex
                        res.items.productPics = sortDatas(res.items.productPics, 'picIndex', false);
                        $scope.product = res.items;

                        //remove province name and city name to edit
                        loadDeliveryPlace();

                        //convert delivery flags to array
                        //check box bound to view.deliveryFlags.selectedItems attribute
                        $scope.view.deliveryFlags.selectedItems = res.items.deliveryFlag ? res.items.deliveryFlag.split(',') : [];

                        //load attribute template from custom attribute field if existed
                        if (res.items.customAttribute && res.items.customAttribute.length > 2) {
                            //convert custom attributes string to object
                            $scope.product.customAttributeList = angular.fromJson(res.items.customAttribute || '[]');

                            processCustomAttribute();
                        } else {
                            //to be continue...
                            queryAttributes(res.items.categoryCode, function() {
                                processCustomAttribute();
                            });
                        }
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '产品加载失败，请刷新重试！');
                    }

                    $scope.view.loading = false;
                }, function(err) {
                    toaster.pop('error', '服务器请求异常！');
                    $scope.view.loading = false;
                });
            };
            if (isEdit)
                loadProduct();

            /**
             * go back to list view with list view model
             * @return {[type]} [description]
             */
            $scope.back = function() {
                var fromState = 'pc.product.list';
                var listVM = $stateParams.listVM;
                if (listVM && listVM.fromState) {
                    fromState = listVM.fromState;
                }
                $state.go(fromState, {
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
                var modalInstance = $modal.open({
                    templateUrl: 'view/pc/product/customAttributeView.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.modalVM = {
                            title: 'SKU自定义属性'
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }
                    }
                });
            };


            /**
             * save temp esion data
             * @param  {bool} invalid: product form is invalid
             */
            $scope.cacheEsin = function(invalid) {
                try {
                    $scope.view.submitted = false;
                    if (!validCommon()) {
                        return false;
                    }
                    var esin = buildEsin();
                    $scope.view.caching = true;
                    PcService.cacheEsin(esin).then(cacheSuccess, saveError);
                } catch (e) {
                    $scope.view.caching = false;
                    toaster.pop('error', '暂存出错，请联系管理员！');
                    console.log(e);
                }
            };

            /**
             * save & submit esin data
             * @param  {bool} invalid: product form is invalid
             */
            $scope.submitEsin = function(invalid) {
                try {
                    $scope.view.submitted = true;
                    validTabs();
                    if (invalid) {
                        toaster.pop('error', '请按要求完善产品信息！');
                        return false;
                    }
                    if (!validSubmit()) {
                        return false;
                    }
                    var esin = buildEsin();
                    $scope.view.submitting = true;
                    if (isAdd) {
                        PcService.createEsin(esin).then(submitSuccess, saveError);
                    } else if (isEdit) {
                        PcService.updateEsin(esin).then(submitSuccess, saveError);
                    }
                } catch (e) {
                    $scope.view.submitting = false;
                    toaster.pop('error', '提交出错，请联系管理员！');
                    console.log(e);
                }
            };

            /**
             * all tabs are valid or not
             * @return {bool}
             */
            var validTabs = function() {
                for (var i = 0; i < 8; i++) {
                    var tabName = 'tab' + i;
                    $scope.view.tabsError[i] = $scope.esinform[tabName].$invalid;
                }

                //first tab validation
                if (!$scope.view.supplier || !$scope.product.enName || !$scope.product.categoryCode) {
                    $scope.view.tabsError[0] = true;
                }

                //main images validation
                var mainImgs = $filter('filter')($scope.product.productPics, {
                    picType: 2
                });
                if (mainImgs.length < 1 || mainImgs.length > 5) {
                    //toaster.pop('error', '至少上传1张产品图片，最多不超过5张！');
                    $scope.view.tabsError[4] = true;
                }
                //detail images validation
                var detailImgs = $filter('filter')($scope.product.productPics, {
                    picType: 4
                });
                if (detailImgs.length < 1 || detailImgs.length > 25) {
                    //toaster.pop('error', '至少上传1张产品图片，最多不超过25张！');
                    $scope.view.tabsError[5] = true;
                }

                //specification attributes validation
                var specAttrList = $filter('filter')($scope.product.customAttributeList, {
                    standard: 1
                });
                if (!specAttrList || specAttrList.length == 0) {
                    $scope.view.tabsError[7] = true;
                }
                //skus validation
                if (!$scope.product.skus || $scope.product.skus.length == 0) {
                    //toaster.pop('error', 'SKU不能为空！');
                    $scope.view.tabsError[7] = true;
                }

                // var isValid = true;
                // $scope.view.tabsError.forEach(function(hasError) {
                //     if (hasError) {
                //         isValid = false;
                //         return;
                //     }
                // });
                // return isValid;
            };

            /**
             * esin form is valid or not
             */
            var validCommon = function() {
                if (!$scope.view.supplier) {
                    toaster.pop('error', '请选择供应商！');
                    return false;
                }
                if (!$scope.product.enName) {
                    toaster.pop('error', '请输入英文名称！');
                    return false;
                }
                if (!$scope.product.categoryCode) {
                    toaster.pop('error', '请选择品类！');
                    return false;
                }
                var specAttrList = $filter('filter')($scope.product.customAttributeList, {
                    standard: 1
                });
                if (specAttrList.length > 4) {
                    toaster.pop('error', '规格属性最多只能有4个！');
                    return false;
                }
                for (var i = 0; i < $scope.product.skus.length; i++) {
                    // if (!$scope.product.skus[i].supplierSku) {
                    //     toaster.pop('error', '请完善sku信息！');
                    //     return false;
                    // }
                    if (!$scope.product.skus[i].enName) {
                        toaster.pop('error', '请完善sku信息！');
                        return false;
                    }
                    if (!$scope.product.skus[i].productAttrss) {
                        toaster.pop('error', '请完善sku信息！');
                        return false;
                    }
                    if ($scope.product.skus[i].productAttrss.length < specAttrList.length) {
                        toaster.pop('error', '请完善sku信息！');
                        return false;
                    }
                    for (var j = 0; j < $scope.product.skus[i].productAttrss.length; j++) {
                        if (!$scope.product.skus[i].productAttrss[j]) {
                            toaster.pop('error', '请完善sku信息！');
                            return false;
                        }
                    }
                }



                return true;
            };

            /**
             * validate form when submit esin
             * @return {bool} : if esin form can be submitted or not
             */
            var validSubmit = function() {
                var product = $scope.product;

                if (!validCommon()) {
                    return false;
                }

                if (product.isGrads && product.productPrices.length > 0 && product.moq > product.productPrices[0].startCount) {
                    toaster.pop('error', '梯度价格优惠数量不能小于最小起订量！');
                    return false;
                }

                for (var i = 1; i < product.productPrices.length; i++) {
                    var currCount = parseInt(product.productPrices[i].startCount);
                    var preCount = parseInt(product.productPrices[i - 1].startCount);
                    if (currCount <= preCount) {
                        product.productPrices[i].errorMsg = '当前优惠数量不能小于等于已有优惠数量！';
                        toaster.pop('error', '优惠数量不正确！');
                        return false;
                    }
                }

                //main images validation
                var mainImgs = $filter('filter')(product.productPics, {
                    picType: 2
                });
                if (mainImgs.length < 1 || mainImgs.length > 5) {
                    toaster.pop('error', '至少上传1张产品图片，最多不超过5张！');
                    return false;
                }
                //detail images validation
                var detailImgs = $filter('filter')(product.productPics, {
                    picType: 4
                });
                if (detailImgs.length < 1 || detailImgs.length > 25) {
                    toaster.pop('error', '至少上传1张细节图，最多不超过25张！');
                    return false;
                }

                var specAttrList = $filter('filter')(product.customAttributeList, {
                    standard: 1
                });
                if (!specAttrList || specAttrList.length == 0) {
                    toaster.pop('error', '规格属性不能为空！');
                    return false;
                }
                //skus validation
                if (!product.skus || product.skus.length == 0) {
                    toaster.pop('error', 'SKU不能为空！');
                    return false;
                }
                //valid custom sku fields
                //to be continue...
                for (var i = 0; i < product.skus.length; i++) {
                    var sku = product.skus[i];
                    if (sku.hasCustom) {
                        if (sku.isGrads && sku.productPrices && sku.productPrices.length > 0 && sku.moq > sku.productPrices[0].startCount) {
                            sku.hasError = true;
                            toaster.pop('error', 'SKU梯度价格优惠数量不能小于最小起订量！');
                            return false;
                        }
                    }
                }
                return true;
            };

            var goBack = function(action) {
                //edit
                if (isEdit) {
                    var fromState = 'pc.product.list';
                    if ($stateParams.from) {
                        fromState = $stateParams.from;
                    }
                    $state.go(fromState, {}, {
                        reload: true
                    });
                    return false;
                }
                //add
                switch (action) {
                    case 'cache':
                        $state.go('pc.product.newProductList', {}, {
                            reload: true
                        });
                        break;
                    case 'submit':
                        $state.go('pc.product.add', {}, {
                            reload: true
                        });
                        break;
                    default:
                        break;
                }
            };

            /**
             * save esin data success
             * @param  {object} res: response data object
             */
            var cacheSuccess = function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '产品暂存成功！');
                    goBack('cache');
                } else {
                    toaster.pop('error', (res && res.msg) ? res.msg : '产品暂存失败！');
                    $scope.view.caching = false;
                }
            };

            /**
             * save esin data success
             * @param  {object} res: response data object
             */
            var submitSuccess = function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '产品提交成功！');
                    goBack('submit');
                } else {
                    toaster.pop('error', (res && res.msg) ? res.msg : '产品提交失败！');
                    $scope.view.submitting = false;
                }
            };

            /**
             * save esin data error
             * @param  {object} err: error response data
             * @return {[type]}     [description]
             */
            var saveError = function(err) {
                $scope.view.caching = false;
                $scope.view.submitting = false;
                toaster.pop('error', '服务器请求异常！');
            };

            /**
             * rebuild esin data for the interface
             * @return {object} esin object data
             */
            var buildEsin = function() {
                var esin = angular.copy($scope.product);

                esin.sysPrefix = sysPrefix;
                esin.productWarehouseCode = productWarehouseCode;
                esin.supplierId = $scope.view.supplier.supplierId;
                esin.supplierName = $scope.view.supplier.companyName;
                if (!esin.categoryName && esin.categoryAllName) {
                    var categoryNames = esin.categoryAllName.split(' - ');
                    if (categoryNames && categoryNames.length > 0) {
                        esin.categoryName = categoryNames[categoryNames.length - 1];
                    };
                };
                esin.deliveryFlag = $scope.view.deliveryFlags.selectedItems.join(',');
                var province = getProvince(esin.deliveryProvince);
                var city = getCity(province, esin.deliveryCity);
                esin.deliveryPlace = (province ? province.stateName : '') + ' ' + (city ? city.cityName : '') + ' ' + $scope.view.deliveryPlace;
                //copy customAttributeList
                //delete the fields of custom attribute those are not used
                var newCustomAttributeList = [];
                var tempCustomAttributeList = angular.copy(esin.customAttributeList);
                tempCustomAttributeList.forEach(function(item) {
                    var newCustomAttribute = {
                        attributeVal: item.attributeVal,
                        attributeName: item.attributeName,
                        attributeEnName: item.attributeEnName,
                        fieldType: item.fieldType,
                        suffix: item.suffix,
                        standard: item.standard,
                        required: item.required
                    };
                    if (item.isCustom)
                        newCustomAttribute.isCustom = item.isCustom;
                    if (item.categoryCode)
                        newCustomAttribute.categoryCode = item.categoryCode;
                    if (item.attributeCode)
                        newCustomAttribute.attributeCode = item.attributeCode;
                    newCustomAttributeList.push(newCustomAttribute);
                });
                esin.customAttribute = angular.toJson(newCustomAttributeList); // angular.toJson($scope.view.descAttrs.concat($scope.view.specAttrs));

                //selected attribute values
                var productAttrsOfDescAttrs = buildProductAttrsOfDescAttrs(esin);
                esin.productAttrss = productAttrsOfDescAttrs;

                //build product prices
                buildProductPrices(esin);

                //build esin images
                buildEsinImgs(esin);

                //build product attributes of sku list
                buildSkus(esin);

                return esin;
            };

            var buildProductPrices = function(esin) {
                if (!esin.isGrads) {
                    esin.productPrices = [];
                }
                if (esin.productPrices) {
                    esin.productPrices.forEach(function(priceItem) {
                        priceItem.productCode = esin.code || '';
                    });
                }
            };

            /**
             * get description attribute values
             */
            var buildProductAttrsOfDescAttrs = function(esin) {
                var result = [];
                var descAttributeList = $filter('filter')(esin.customAttributeList, {
                    standard: 0
                });

                descAttributeList.forEach(function(item) {
                    var proAttr = item.proAttr || {};
                    var val = proAttr.attributeVal || '';
                    if (item.fieldType == 4 && proAttr.attributeValList)
                        val = proAttr.attributeValList.join(',');
                    //do not save the empty attribute
                    if (val) {
                        result.push({
                            productCode: esin.code || '',
                            attributeCode: item.attributeCode || '',
                            attributeName: item.attributeEnName,
                            attributeVal: val,
                            nsStandard: 0,
                            fieldType: item.fieldType
                        });
                    }
                });
                return result;
            };

            /**
             * build sku data
             * @param  {Object} esin: esin data
             */
            var buildSkus = function(esin) {
                for (var i = 0; i < esin.skus.length; i++) {
                    var sku = esin.skus[i];
                    esin.skus[i] = buildSkuData(angular.copy(sku), angular.copy(esin));
                };
            };

            /**
             * buildSkuData description
             * @param  {Object} sku: sku data
             * @param  {Object} esin: esin data
             */
            var buildSkuData = function(sku, esin) {
                var result = esin;
                if (sku.hasCustom) {
                    buildCustomSkuData(esin, sku);
                    buildProductPrices(sku);
                }
                result.skus = [];
                result.groupCode = sku.groupCode || '';
                result.id = sku.id;
                result.hasCustom = sku.hasCustom;
                result.enName = sku.enName;
                result.name = sku.enName;
                result.code = sku.code || '';
                result.status = sku.status;
                result.supplierSku = sku.supplierSku;
                //copy esin's description attributes
                var descAttrs = angular.copy($filter('filter')(esin.productAttrss, {
                    nsStandard: 0
                }));
                result.productAttrss = sku.productAttrss;
                //build sku specification attribute
                buildSkuAttribute(result, descAttrs);

                return result;
            };

            /**
             * build sku specification attribute
             * @param  {sku} sku: single sku data
             */
            var buildSkuAttribute = function(sku, descAttrs) {
                sku.productAttrss = sku.productAttrss || [];
                descAttrs = descAttrs || [];
                for (var i = 0; i < sku.productAttrss.length; i++) {
                    var attrVal = sku.productAttrss[i];
                    var specAttrList = $filter('filter')($scope.product.customAttributeList, {
                        standard: 1
                    });
                    var curAttr = specAttrList[i];
                    var attr = {
                        productCode: sku.code || '',
                        attributeCode: curAttr.attributeCode || '',
                        attributeName: curAttr.attributeEnName,
                        attributeVal: attrVal.attributeVal,
                        nsStandard: 1,
                        fieldType: curAttr.fieldType
                    };
                    sku.productAttrss[i] = attr;
                }
                //copy esin's description attributes to sku
                descAttrs.forEach(function(attrItem) {
                    attrItem.productCode = sku.code || '';
                    sku.productAttrss.push(attrItem);
                });
            };

            /**
             * build esin images
             * @param  {object} esin: esin data object
             */
            var buildEsinImgs = function(esin) {

                //resort images
                var mainIndex = 0;
                var detailIndex = 0;
                var qualificationIndex = 0;
                esin.productPics.forEach(function(pic) {
                    pic.productCode = esin.code || '';
                    switch (pic.picType) {
                        case 2:
                            pic.picIndex = ++mainIndex;
                            break;
                        case 4:
                            pic.picIndex = ++detailIndex;
                            break;
                        case 6:
                            pic.picIndex = ++qualificationIndex;
                            break;
                        default:
                            break;
                    }
                });
            };

            /**
             * if esin can be cached or not
             * @return {bool} 
             */
            $scope.canCacheEsin = function() {
                return isAdd || $scope.product.status == 0;
            };

            /**
             * if can add image or not
             * @param  {int} picType: 2:main, 4:detail, 6:qualification
             */
            $scope.canAddImg = function(picType) {
                var result = false;
                switch (picType) {
                    case 2:
                        var mainImgs = $filter('filter')($scope.product.productPics, { picType: 2 });
                        result = !$scope.view.mainImgUploading && mainImgs.length < 5;
                        break;
                    case 4:
                        var detailImgs = $filter('filter')($scope.product.productPics, { picType: 4 });
                        result = !$scope.view.detailImgUploading && detailImgs.length < 25;
                        break;
                    case 6:
                        var qualificationImgs = $filter('filter')($scope.product.productPics, { picType: 6 });
                        result = !$scope.view.qualificationImgUploading && qualificationImgs.length < 10;
                        break;
                    default:
                        break;
                }
                return result;
            };
        }
    ];
});
