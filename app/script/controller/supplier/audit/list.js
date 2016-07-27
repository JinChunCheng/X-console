//exiaoMgrApp.controller("supplierAuditList",['$scope','$http', '$routeParams','$location','metaService',
//    function($scope, $http, $routeParams, $location,metaService){
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','toaster', 'supService','metaService', '$stateParams',
    function($rootScope, $scope, $state,toaster,supService, metaService,$stateParams) {
        ph.mark($rootScope, {
            state: 'supplier.audit.list',
            title: '审核列表'
        });
        //already have listVM data or not
        //var hasCache = $stateParams.listVM ? true : false;
        //$scope.listVM = $stateParams.listVM || {
        //        condition: {
        //            pageNo: 1,
        //            pageSize: 10
        //        },
        //        paginate: {
        //            pageSize: 10,
        //            pageNumber: 1,
        //            pagesCount: 0,
        //            totalItemsCount: 0
        //        },
        //        items: [],
        //        isAllChecked: false,
        //        checkedAttributeCodes: []
        //    };
        $scope.condition={pageSize:10,pageNo:1,companyName:"",authType:"",businessCategory:""}; //新加经营品类
        $scope.supplierList=[];
        $scope.paginate = {};
        $scope.businessCategory=[];

        //audit TYPE
        metaService.getMeta('RZLX', function(list) {
            $scope.supAuthTypeList = list;
        });
        //supplier category
        metaService.getMeta('GYSLB', function(list) {
            $scope.supllierCategary = list;
        });

        //Y/N list
        metaService.getMeta('YN', function(list) {
            $scope.defaultVatInvoiceAbility = list;
        });

        //获取一级品类
        var getCategary = function () {
            supService.supplierCategory().then(
                function (data) {
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.businessCategory.push({
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

        $scope.selectedType ="";
        $scope.queryResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };

        $scope.view={
            loading:false
        };

        $scope.page = function(pageNum){
            $scope.view.loading = true;

            $scope.condition.pageNo= pageNum;
            if($scope.selectedType==null || $scope.selectedType.length==0){
                $scope.condition.authType= "";
            }
            else{
                $scope.condition.authType= $scope.selectedType;
            };
            if ($scope.queryResult.PageSize>0){
                $scope.condition.pageSize = $scope.queryResult.PageSize>100?100:$scope.queryResult.PageSize;
            };
            //if($scope.condition.businessCategory){
            //
            //}
            supService.getAuditList($scope.condition).then(
                function(res){
                    $scope.feedbackList = res.items;
                    $scope.queryResult.Items = res.items;
                    $scope.queryResult.PageSize = res.paginate.pageSize;
                    $scope.queryResult.PageAmount = res.paginate.pagesCount;
                    $scope.queryResult.TotalCount = res.paginate.totalItemsCount;
                    $scope.queryResult.PageIndex = res.paginate.pageNumber;
                    $scope.view.loading = false;
                    //toaster.pop('success',"加载列表成功");
                },
                function(errResponse){
                    toaster.pop('error',"加载列表失败 " +errResponse.message);
                    $scope.view.loading = false;
                }
            );

        };

        $scope.reset = function(){
            $scope.condition={pageSize:10,pageNo:1,companyName:"",authType:""};
            $scope.supplierList=[];
            $scope.selectedType="";
        };

        // init the page.
        $scope.page(1);
        $scope.loading = false;
        
        /**
         * page changed
         */
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        //accept the applier registion.
        $scope.passInfo={id:-1,auditRemark:"审核通过",auditUser:$rootScope.curUser.loginName};
        $scope.accept= function(item){
            $scope.loading=true;
            $scope.passInfo.id=item.id.toString();
            $scope.passInfo.supplierId=item.supplierId;
            $scope.passInfo.supplierName=item.supplierName;
            $scope.passInfo.settlementMethod=item.settlementMethod;


            supService.auditAccept($scope.passInfo).then(
                function(res){
                    if (res.status==200){
                        toaster.pop('success',"审核通过");
                        $scope.page(1);
                    }
                    else{
                        toaster.pop('error','审核通过错误：'+ res.status +' --'+res.msg);
                    };
                    $scope.loading = false;
                },
                function(errResponse){
                    toaster.pop('error',"审核失败 " +errResponse.message);
                    $scope.loading = false;
                }
            );
        };

        $scope.gotoPage = function(root,feedbackId){
            $state.go(root,{id:feedbackId});
        };

    }];
});