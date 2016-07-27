define(['common/session', 'service/config', 'common/path-helper'], function (session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'toaster', 'supService', 'metaService', '$stateParams',
        function ($rootScope, $scope, $state, toaster, supService, metaService, $stateParams) {
            ph.mark($rootScope, {
                state: 'supplier.audit.edit',
                title: '审核详情'
            });
            //页面用的到元数据
            $scope.metaData = {
                //发票相关的元数据
                vatInvoiceAbilityData: []

            };
            //初始化 发票相关元数据
            metaService.getMeta('FPXG', function (list) {
                $scope.metaData.vatInvoiceAbilityData = list;
            });


            $scope.passInfo = {id: -1, auditRemark: "", auditUser: ""};
            $scope.supplierAuth = {

            };
            $scope.supplierAuthlog = {settlementMethod: 1};

            //session
            var user = $rootScope.curUser;

            //supplier category
            metaService.getMeta('GYSLB', function (list) {
                $scope.supllierCategary = list;
            });
            //yes no
            metaService.getMeta('YESORNOT', function (list) {
                $scope.yesNoMapping = list;
            });
            //taxpayer qualification
            metaService.getMeta('NSRZG', function (list) {
                $scope.defaultTaxpayerQualification = list;
            });
            //settlement method
            metaService.getMeta('JSFS', function (list) {
                $scope.defaultSettlementMethod = list;
            });
            //audit type
            metaService.getMeta('RZLX', function (list) {
                $scope.defaultAuditStatus = list;
            });
            //currency
            metaService.getMeta('JYBZ', function (list) {
                $scope.defaultCurrency = list;
            });
            //已售市场
            metaService.getMeta('YSSC', function(list) {
                $scope.soldMarketList = list

            });

            $scope.selectedType = {};

            //公共数据
            $scope.view = {
                authId: $stateParams.id,
                loading: false,
                acceptSuc: false,
                rejectSuc: false,
                selectedBusinessCategory: [],
                supplierCategoryList: [],
                taxpayerQualificationList: [],
                settlementMethodList: [],
                businessCategoryList: [],
                provinces: [],
                authStatusList: [],
                showDataBeforeAudit: true,
                errorMsg: "",
                auditBtnEnable: true,
                imgSupHostName: config.img_supplier_domain,
                //自定义的认证处理业务
                customZZ: {
                    //提交api 字符串的分隔符
                    splitchar:{
                        propertychar:',',//属性之间的分隔符
                        objectchar:'|'//对象之间的分隔符
                    },
                    data:[], //数据源
                    zzindex:0,   //索引计数器
                    //根据字符串初始化data
                    init:function(strvalue){
                        if(strvalue){
                            var objs=strvalue.split(this.splitchar.objectchar);
                            this.zzindex=objs.length;
                            for (var i=0;i<objs.length;i++){
                                var propertys=objs[i].split(this.splitchar.propertychar);
                                this.data[i]={index:i,title:propertys[0],imgurl:propertys[1],uploading:false};
                            }

                        }
                    },
                    //获取需要提交的字符串
                    getdatastring:function(){
                        var result="";
                        if(this.data.length>0){
                            for(var  i=0;i<this.data.length;i++){
                                result=result+this.data[i].title+this.splitchar.propertychar+this.data[i].imgurl;
                                result=result+this.splitchar.objectchar;
                            }
                        }
                        return result;
                    }
                }
            };



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
                    },
                    function (errResponse) {
                        toaster.pop('error', '加载产品品类列表失败，原因：' + data.msg);
                    }
                );
            };
            getCategary();

            //经营品类
            var toBusinessCategoryList = function (value) {
                var result = [];
                if (value) {
                    result = value.split('|');
                }
                return result;
            };

            //$scope.view.authId=$routeParams.id;
            $scope.page = function (pageNum) {
                $scope.loading = true;
                supService.getAuditDetail($scope.view.authId).then(
                    function (res) {
                        if (res.status == 200) {
                            if(!res.auth){
                                res.auth={};
                            }
                            $scope.supplierAuth = res.auth;
                            $scope.supplierAuthlog = res.authlog;

                            $scope.supplierAuthlog.otherQualifications=angular.fromJson(res.authlog.otherQualifications||'[]');
                            $scope.selectSoldMarketListLog=res.authlog.soldMarket.split('|');
                            if(res.auth){
                                $scope.supplierAuth.otherQualifications=angular.fromJson(res.auth.otherQualifications||'[]');
                                $scope.selectSoldMarketList=res.auth.soldMarket.split('|');
                            }

                            //hide history of audit if new
                            if ($scope.supplierAuth != null && $scope.supplierAuth.supplierId != null) {
                                $scope.view.showDataBeforeAudit = true;


                            } else {
                                $scope.view.showDataBeforeAudit = false;
                            }
                            ;
                            toaster.pop('success', "加载成功");
                        }
                        else {
                            $scope.supplierAuth = {};
                            $scope.supplierAuthlog = {};
                            toaster.pop('error', "加载错误:" + res.status + ", " + res.msg);
                        }
                        ;
                        $scope.loading = false;
                    },
                    function (errResponse) {
                        toaster.pop('error', '加载产品品类列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                );
            };
            $scope.page(1);

            //
            $scope.accept = function () {
                $scope.view.loading = true;
                $scope.passInfo.id = $scope.view.authId;
                $scope.passInfo.supplierId = $scope.supplierAuthlog.supplierId;
                $scope.passInfo.supplierName = $scope.supplierAuthlog.supplierName;
                $scope.passInfo.settlementMethod = $scope.supplierAuthlog.settlementMethod;
                $scope.passInfo.auditUser = user.loginName;

                supService.auditAccept($scope.passInfo).then(
                    function (res) {
                        if (res.status == 200) {
                            $scope.view.acceptSuc = true;
                            //alert('审核成功');
                            toaster.pop('success', "审核成功！");
                            $state.go('supplier.audit.list');

                        }
                        else {
                            toaster.pop('error', '审核通过错误：' + res.status + ' --' + res.msg);
                        }
                        ;
                        $scope.view.loading = false;
                    },
                    function (errResponse) {
                        toaster.pop('error', "审核失败 " + errResponse.message);
                        $scope.view.loading = false;
                    }
                );
                //refresh current page
                $scope.page(1);
            };

            //
            $scope.reject = function () {
                $scope.view.loading = true;
                $scope.passInfo.id = $scope.view.authId;
                $scope.passInfo.auditUser = user.loginName;
                supService.auditReject($scope.passInfo).then(
                    function (res) {
                        if (res.status == 200) {
                            $scope.view.acceptSuc = true;
                            //toaster.pop('success', "驳回审核完成！");
                            alert('审核成功');
                            $state.go('supplier.audit.list');
                        }
                        else {
                            toaster.pop('error', '驳回审核错误：' + res.status + ' --' + res.msg);
                        }
                        $scope.view.loading = false;
                    },
                    function (errResponse) {
                        toaster.pop('error', "更新失败 " + errResponse.message);
                        $scope.view.loading = false;
                    }
                );
                //refresh current page
                $scope.page(1);
            };


            //back to list
            $scope.back = function () {
                $state.go("supplier.audit.list");
               // $location.path('/supplier/audit/list/');
            };

            //help supplier to regist a financial virtual account
            $scope.regAccount = function () {
                $scope.view.processing = true;
                //once click, disable button
                $scope.view.btnDisable = true;
                $scope.view.Msg = "";



            };

            //replace product scope to string
            $scope.transferProductScope = function (strCode) {
                if (strCode == null || strCode.length == 0) {
                    return "";
                }
                ;
                var codeList = strCode.split(',');
                var strName = [];
                for (var j = 0; j < codeList.length; j++) {
                    for (var i = 0; i < $scope.view.businessCategoryList.length; i++) {
                        if ($scope.view.businessCategoryList[i].value == codeList[j]) {
                            strName.push($scope.view.businessCategoryList[i].text);
                        }
                    }
                }
                ;

                return strName.join(',');
            };

            //get pic url
            $scope.getPicUrl = function (strPicUrl) {
                if (strPicUrl == null) {
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
                OpenWindow.document.write('<img src="' + picurl + '" ></img>');
                OpenWindow.document.write("</BODY>");
                OpenWindow.document.write("</HTML>");
                OpenWindow.document.close()
            };

        }];
});