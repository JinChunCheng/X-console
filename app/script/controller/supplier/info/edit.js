define(['common/session', 'service/config', 'common/path-helper'], function (session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'supService', 'metaService', '$stateParams',
        function ($rootScope, $scope, $state, toaster, supService, metaService, $stateParams) {
            ph.mark($rootScope, {
                state: 'supplier.info.edit',
                title: '供应商详情'
            });

            $scope.supplierId = $stateParams.id;
            $scope.isEdit=$stateParams.edit==1?false:true;
            $scope.supplierBaseInfo = {
                authStatus: -1,
                authTime: "",
                bankAccount: "",
                companyName: "",
                createTime: "",
                email: "",
                emailVerified: 0,
                emailVerifiedTime: "",
                enabled: 0,
                grade: "初级",
                id: 0,
                lastLoginTime: "",
                logicalDel: 0,
                mobilePhone: "",
                netsuiteId: 0,
                regTime: "",
                supplierId: "",
                updateTime: "",
                auditUser: "",// 审核人员
                auditremark: "" //审核备注
            };
            $scope.supplierAuthInfo = {
                authStatus: 0,
                bankAccount: "",
                branchBankName: "",
                businessCategory: "",
                businessLicenseNumber: "",
                businessLicenseNumberUrl: "",
                companyAddress: "",
                contactEmail: "",
                contactMobilephone: "",
                contactPerson: "",
                contactPhone: "",
                createTime: "",
                currency: "",
                id: 0,
                importExportPermit: 0,
                logicalDel: 0,
                organizationCode: "",
                organizationCodeUrl: "",
                regProvince: "",
                settlementMethod: 0,
                shopAddress: "",
                supplierCategory: 0,
                supplierId: "",
                supplierName: "",
                taxRegistrationNumber: "",
                taxRegistrationNumberUrl: "",
                taxpayerQualification: 0,
                updateTime: "",
                vatInvoiceAbility: 0,
                otherQualifications: [] //自定义资质
            };


            $scope.supplierAudit = {};
            $scope.loading = false;
            var hostname = config.supplier_domain;

            //yes no
            metaService.getMeta('YESORNOT', function (list) {
                $scope.yesNoMapping = list;
            });
            //currency
            metaService.getMeta('JYBZ', function (list) {
                $scope.defaultCurrency = list;
            });
            //YN value list
            metaService.getMeta('YN', function (list) {

                $scope.defaultImportExportPermit = list;
            });
            //发票相关
            metaService.getMeta('FPXG', function (list) {
                $scope.defaultVatInvoiceAbility = list;

            });
            //suplier category value list
            metaService.getMeta('SUPCTG', function (list) {
                $scope.defaultSupplierCategory = list;
            });
            //tax payer value list
            metaService.getMeta('NSRZG', function (list) {
                $scope.defaultTaxpayerQualification = list;
            });
            //supplier audit status value list
            metaService.getMeta('SUPAUDITSTS', function (list) {
                $scope.defaultAuditStatus = list;
            });

            //公共数据
            $scope.view = {
                selectedBusinessCategory: [],
                supplierCategoryList: [],
                taxpayerQualificationList: [],
                settlementMethodList: [],
                businessCategoryList: [],
                provinces: [],
                authStatusList: [],
                imgSupHostName: config.img_supplier_domain,
                categoryListLoadFinished: false,
                supplierCategoryLoadFinished: false,
                cleanSupCatInProcess: false,
                fetchedNoAuthInfo: false,
                savingSuc: false,
                loadingTexPic: false,
                loadingOrgPic: false,
                loadingPermPic: false,

            };
            //结算方式
            metaService.getMeta('JSFS', function (list) {
                $scope.view.settlementMethodList = list;
            });
            //已售市场
            metaService.getMeta('YSSC', function(list) {
                $scope.view.soldMarketList = list

            });
            //经营品类
            //获取一级品类
            var getCategary = function () {
                supService.supplierCategory().then(
                    function (data) {
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                $scope.view.businessCategoryList.push({
                                    value: data[i].name,
                                    text: (data[i].des == null ? data[i].name : data[i].des)
                                })
                            }
                            ;
                        } else {
                            toaster.pop('error', '加载产品品类列表失败，原因：' + data.msg);
                        }
                        ;
                        console.log($scope.view.businessCategoryList);
                    },
                    function (errResponse) {
                        toaster.pop('error', '加载产品品类列表失败，原因：' + data.msg);
                    }
                );
            };
            getCategary();

            //选中的 经营品类转化为数组
            var toBusinessCategoryList = function (value) {
                var result = [];
                if (value) {
                    result = value.split('|');
                }
                return result;
            };


            //省份
            metaService.getProvinces(function (list) {
                $scope.view.provinces = list;
            });

            $scope.productNum = 0;
            $scope.orderNum = 0;
            //查询产品数量
            var getProductQuantity = function () {
                $scope.view.productQuantityLoading = true;
                supService.supplierProductCount($scope.supplierId).then(
                    function (res) {
                        if (res && res.status == 200) {
                            $scope.productNum = res.items;
                        } else {
                            toaster.pop('error', res ? ('status ' + res.status + ', msg: ' + res.msg) : 'get product count error !');
                        }
                        $scope.view.productQuantityLoading = false;
                    },
                    function (errResponse) {
                        toaster.pop('error', errResponse.message);
                        $scope.view.productQuantityLoading = false;
                    }
                );
            };
            getProductQuantity();


            //查询执行中订单数量
            var getOrderQuantity = function () {
                $scope.view.orderDataLoading = true;
                supService.supplierPoCount($scope.supplierId).then(
                    function (res) {
                        if (res && res.status == 200) {
                            $scope.orderNum = res.items.quantity;
                        } else {
                            toaster.pop('error', res ? ('status ' + res.status + ', msg: ' + res.msg) : 'get order count error !');
                        }
                        $scope.view.productQuantityLoading = false;
                    },
                    function (errResponse) {
                        toaster.pop('error', errResponse.message);
                        $scope.view.productQuantityLoading = false;
                    }
                );
            };
            getOrderQuantity();

            $scope.page = function (pageNum) {
                //URI: {baseUri}/supplier/ getSupplierDetails /{supplierId}
                $scope.view.savingSuc = false;
                $scope.loading = true;
                supService.viewBasicInfo($scope.supplierId).then(
                    function (data) {
                        $scope.supplierBaseInfo = data;
                        // 选中的经营品类
                        $scope.view.selectedBusinessCategory = $scope.supplierBaseInfo.businessCategory.split("|");

                    },
                    function (errMsg) {
                        toaster.pop('error', errMsg);
                    });
                //get supplier authority info in case of supplier exists correctly
                supService.viewAuthInfo($scope.supplierId).then(
                    function (data) {
                        if(data){
                            $scope.supplierAuthInfo = data;
                            //其他资质
                            $scope.supplierAuthInfo.otherQualifications =!data.otherQualifications?[]: angular.fromJson(data.otherQualifications);
                            $scope.view.selectSoldMarketList= $scope.supplierAuthInfo.soldMarket.split('|');
                        }
                        else {
                            //mark the request feedback successfully, but did not make sure it can return authinfo
                            $scope.view.fetchedNoAuthInfo = true;
                            $scope.supplierAuthInfo={};
                        }
                        ;
                    },
                    function (errMsg) {
                        toaster.pop('error', errMsg);
                    });

            };
            $scope.page(1);

            //save changed audit info
            $scope.save = function (isValid) {
                if (!isValid) {
                    toaster.pop('error', "请按要求完善属性信息！");
                    return false;
                }
                ;
                if (!$scope.supplierBaseInfo || $scope.supplierBaseInfo.emailVerified != 1) {
                    toaster.pop('error', "信息不完整或者邮箱未验证！");
                    return false;
                }
                ;
                $scope.isSaving = true;
                $scope.loading = true;

                if (($scope.supplierBaseInfo && $scope.view.fetchedNoAuthInfo) ||
                    ($scope.supplierAuthInfo && $scope.supplierAuthInfo.authType == 1 && ($scope.supplierBaseInfo.authStatus == 0 || $scope.supplierBaseInfo.authStatus == 3))) {
                    $scope.supplierAuthInfo.supplierId = $scope.supplierId;
                    var tempSubmitData = AuthInfoSubmitExtend($scope.supplierAuthInfo);
                    supService.insertSupplierAuthInfo(tempSubmitData).then(
                        function (data) {
                            if (data) {
                                toaster.pop('info', "提交成功！");
                            }
                            else {
                                toaster.pop('error', "提交失败！");
                                $scope.view.fetchedNoAuthInfo = true;
                            };
                        },
                        function (errMsg) {
                            toaster.pop('error', errMsg);
                        }
                    );

                }
                else if ($scope.supplierAuthInfo && $scope.supplierBaseInfo && !$scope.supplierAuthInfo.authType && $scope.supplierBaseInfo.authStatus == 2) {
                    var tempSubmitData = AuthInfoSubmitExtend($scope.supplierAuthInfo);
                    supService.updateSupplierAuthInfo(tempSubmitData).then(
                        function (data) {
                            if (data) {
                                toaster.pop('info', "提交成功！");
                            }
                            else {
                                toaster.pop('error', "提交失败！");
                                $scope.view.fetchedNoAuthInfo = true;
                            }
                            ;
                        },
                        function (errMsg) {
                            toaster.pop('error', errMsg);
                        }
                    );


                }
                else {
                    $scope.loading = false;
                    $scope.isSaving = false;
                    toaster.pop('info', "不能修改！");
                }
                ;
                //init the flag again
                $scope.view.fetchedNoAuthInfo = false;
                $scope.isSaving = false;
            };
            //认证信息 提交前的扩展
            var AuthInfoSubmitExtend = function (authInfo) {
                if (authInfo) {
                    var tempAuth = angular.copy(authInfo);
                    tempAuth.otherQualifications = angular.toJson(tempAuth.otherQualifications);
                    tempAuth.soldMarket=$scope.view.selectSoldMarketList?$scope.view.selectSoldMarketList.join('|'):'';
                    return tempAuth;
                }
            }


            $scope.updateRegistInfo = function (isValid) {
                if (!isValid) {
                    toaster.pop('error', "请按要求完善属性信息！");
                    return false;
                }
                SupplierService.updateBaseInfo($scope.supplierBaseInfo).then(
                    function (data) {
                        if (data.status == '200') {
                            alert("修改成功！");
                        } else {
                            alert("修改失败，原因：" + data.msg);
                        }
                        ;
                    },
                    function (errResponse) {
                        console.error('Error while creatting attribute.');
                    }
                );
            };

            $scope.goPoList = function () {
                $state.go('supplier.order.list', {id: $scope.supplierId});
            };
            $scope.goProdList = function () {
                $state.go('supplier.product.list', {id: $scope.supplierId});
            };
            $scope.back = function () {
                $state.go('supplier.info.list');

            };

            //check pic attributes, which must fullfile ERP request.
            var checkPicAtr = function (file) {
                if (file.size > 5000000) {
                    alert("请上传小于5M的图片文件！");
                    return false;
                }
                ;
                if (!file.type.endsWith("/jpg") && !file.type.endsWith("/jpeg") && !file.type.endsWith("/gif") && !file.type.endsWith("/png")) {
                    alert("请上传图片类型为：.jpg 或 .jpeg 或 .gif 或 .png 的图片！");
                    return false;
                }
                ;
                return true;
            };

            //营业执照
            $scope.blFileSuccess = function (file, data, formData) {
                if (!checkPicAtr(file)) {
                    return;
                }
                ;

                $scope.view.loadingPermPic = true;
                supService.uploadImgWithCallBack(formData, function (res) {
                    if(!$scope.supplierAuthInfo){
                        $scope.supplierAuthInfo={};
                    }
                    $scope.supplierAuthInfo.businessLicenseNumberUrl = res.data.items;
                    $scope.view.loadingPermPic = false;

                });
            };
            //税务登记号
            $scope.taxFileSuccess = function (file, data, formData) {
                if (!checkPicAtr(file)) {
                    return;
                }
                ;
                $scope.view.loadingTexPic = true;
                supService.uploadImgWithCallBack(formData, function (res) {
                    if(!$scope.supplierAuthInfo){
                        $scope.supplierAuthInfo={};
                    }
                    $scope.supplierAuthInfo.taxRegistrationNumberUrl = res.data.items;
                    $scope.view.loadingTexPic = false;

                });
            };
            //组织机构代码证件
            $scope.orgCodeFileSuccess = function (file, data, formData) {
                if (!checkPicAtr(file)) {
                    return;
                };
                $scope.view.loadingOrgPic = true;
                supService.uploadImgWithCallBack(formData, function (res) {
                    if(!$scope.supplierAuthInfo){
                        $scope.supplierAuthInfo={};
                    }
                    $scope.supplierAuthInfo.organizationCodeUrl = res.data.items;
                    $scope.view.loadingOrgPic = false;

                });
            };
            //自定义资质上传
            $scope.otherFileSuccess = function (file, data, formData, item) {
                if (!checkPicAtr(file)) {
                    return;
                }
                ;

                supService.uploadImgWithCallBack(formData, function (res) {

                    item.imgurl = res.data.items;

                });
            };

            //get pic url
            $scope.getPicUrl = function (strPicUrl) {
                if (!strPicUrl) {
                    return "content/images/gender_0.png";
                }
                else if (strPicUrl.indexOf("http://") >= 0) {
                    return strPicUrl;
                }
                else {
                    return $scope.view.imgSupHostName + "/" + strPicUrl;
                }
                ;
            };

            //open pic in its original size
            $scope.viewOriginalPic = function (url) {
                var picurl = $scope.getPicUrl(url);
                if (picurl == null || picurl.length <= 0) {
                    return;
                }
                ;
                OpenWindow = window.open("", "picwin", "height=750, width=1050,toolbar=no,scrollbars=yes" + ",menubar=no");
                OpenWindow.document.write("<TITLE></TITLE>");
                OpenWindow.document.write("<BODY BGCOLOR=#ffffff>");
                OpenWindow.document.write("<h1></h1>");
                OpenWindow.document.write('<img src="' + picurl + '" height=100%, width=100%></img>');
                OpenWindow.document.write("</BODY>");
                OpenWindow.document.write("</HTML>");
                OpenWindow.document.close()
            };


        }];
});
