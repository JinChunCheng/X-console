//yucheng, added, for supplier feedback page
//exiaoMgrApp.controller("supplierFeedbackDetail",['$scope','$http', '$routeParams','$location','sessionService',
//    function($scope, $http, $routeParams, $location,sessionService){
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state','toaster', 'supService','metaService','$stateParams',
    function($rootScope, $scope, $state,toaster,supService, metaService,$stateParams) {
        ph.mark($rootScope, {
            state: 'supplier.feedback.detail',
            title: '反馈详情'
        });

        $scope.feedbackId = $stateParams.id;
        $scope.feedback={};
        //session
        var user = $rootScope.curUser;

        $scope.getPage = function(){
            $scope.loading = true;
            //URI: {baseUri}/supplier/ getSupplierDetails /{supplierId}
            supService.getFeedback($scope.feedbackId).then(
                function(res){
                    $scope.feedback = res.items;
                    $scope.loading = false;
                },
                function(errResponse){
                    toaster.pop('error',"加载菜单列表失败 " +errResponse.message);
                    $scope.loading = false;
                }
            );
        };

        $scope.getPage();

        $scope.savesuc=false;

        $scope.putFeedback = function(){
            $scope.loading = true;
            $scope.feedback.handleUser = user.userName;
            //check
            supService.saveFeedback($scope.feedback).then(
                function(res){
                    if(res.status == 200){
                        $scope.savesuc = true;
                        toaster.pop('success',"修改成功");
                    }
                    $scope.loading = false;
                },
                function(errResponse){
                    toaster.pop('error',"修改失败 " +errResponse.message);
                    $scope.loading = false;
                }
            );

        };

        $scope.back = function(){
            $state.go('supplier.feedback.list');
        };

        $scope.itemchanged = function() {
            $scope.savesuc = false;
        };

    }];
});
