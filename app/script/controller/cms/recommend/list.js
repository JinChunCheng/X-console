define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$modal', 'defaultService', 'metaService','recommendService','toaster', 'pageService', function($rootScope, $scope, $state, $timeout, $stateParams, $modal, defaultService, metaService,recommendService,toaster, pageService) {

        //必须传入终端参数和页面id参数
        if (!$stateParams.p)
            $state.go('error');

        $scope.listVM = recommendService.default;
        $scope.listVM.condition = $stateParams.condition || {};
        $scope.listVM.condition.pageCode = $stateParams.p;
        $scope.listVM.condition.name = '';
        $scope.listVM.condition.status = -1;

        $scope.processing = {};
        $scope.processing.batchUp = false;
        $scope.processing.batchDown = false;

        var positionType = [
            {text:'图片列表', value:1},
            {text:'商品列表-常规', value:2},
            {text:'商品列表-首大图', value:3}
        ];

        $scope.listVM.positionType = positionType;

        // 运营状态
        metaService.getMeta('YMZT', function(data) {
            $scope.listVM.statusList = data;
        });
        
        $scope.checkAll = function() {
            if ($scope.listVM.checkedAll){
                $scope.listVM.selectedList = $scope.listVM.items.map(function(item) {
                    return item.id;
                });
            }else{
                $scope.listVM.selectedList = [];
            }
        };

        // 上线或下线
        var fnPublish = function(publisStatus,modalInstance,itemId){
            publisStatus == 0 ? $scope.processing.batchUp = true : $scope.processing.batchDown = true;
            if(itemId){
                $scope.listVM.selectedList = [];
                $scope.listVM.selectedList.push(itemId);
            }
            
            recommendService.publish($scope.listVM.selectedList,publisStatus).then(
                function(data){
                    if (data.status == '200' && data.items == true) {
                        
                        $scope.listVM.selectedList.forEach(function(selectedId){
                            $scope.listVM.items.forEach(function(item){
                                if(item.id == selectedId){
                                    item.status = publisStatus;
                                }
                            });
                        });

                        $scope.listVM.selectedList = [];
                        $scope.listVM.checkedAll = false;
                        $scope.processing.batchUp = false;
                        $scope.processing.batchDown = false;
                        if(modalInstance) modalInstance.dismiss();
                    }else{
                        toaster.pop('error', data.msg);
                        modalInstance.dismiss();
                    }
                },
                function(errCode) {
                    toaster.pop('error', '服务器请求异常！');
                    console.error('Error while publishing positionId:' + positionId);
                }
            );
        };

        // 上线或下线
        $scope.publish = function(publisStatus){
            fnPublish(publisStatus);
        };

        // 分页查询
        var paging = function(pageNo) {
            $scope.listVM.processing = true;
            $scope.listVM.condition.pageNo = pageNo;
            $scope.listVM.condition.pageSize = $scope.listVM.paginate.pageSize;
            recommendService.getList($scope.listVM.condition).then(function(data) {
                    $scope.loading = false;
                    $scope.listVM.processing = false;
                    if (data.status == '200') {
                        $scope.listVM.items = data.items;
                        $scope.listVM.paginate = {
                            currentPage: pageNo,
                            pageSize: 10,
                            totalItems: data.paginate.totalItemsCount
                        }
                    }
                },
                function(errCode) {
                    $scope.loading = false;
                    $scope.listVM.processing = false;
                    console.error('Error while search terminal.');
                });
        };

        // 分页事件
        $scope.pageChanged = function() {
            paging($scope.listVM.paginate.currentPage);
        };

        paging(1);

        $scope.search = function() {
            $scope.listVM.paginate.currentPage = 1;
            paging(1);
        };

        // 重置查询表单
        $scope.reset = function() {
            $scope.listVM.condition.name = '';
            $scope.listVM.condition.status = -1;
        };

        // 面包屑
        ph.mark($rootScope, {state: 'recommend.list', title: '推荐位管理',params:{p:$stateParams.p}});

        // 新增
        $scope.add = function() {
            recommendService.getCode().then(function(data){ // 获取推荐位code
                if(data.status == '200'){
                    showModal(undefined,data.items);
                }else{
                    toaster.pop('error', '服务器请求异常！');
                }
            });
        };

        // 修改
        $scope.edit = function(item) {
            showModal(item,'');
        };

        // 弹出新增修改表单
        var showModal = function(item,positionCode) {
            var title = item ? "修改推荐位" : "新增推荐位";
            $modal.open({
                templateUrl: 'view/cms/recommend/edit.html',
                controller: function($scope, $modalInstance) {
                    $scope.recommendVM = {
                        title: title,
                        processing: false,
                        typeList: positionType,
                        categoryList: [],
                        data: item || {
                            id: null,
                            pageCode: $stateParams.p,
                            code: positionCode,
                            name: '',
                            type: null,
                            remarks:'',
                            createUser:$scope.curUser.id,
                            categoryCode: ''
                        }
                    };

                    // 修改时首先加载一级品类
                    if(item && $scope.recommendVM.data.type == 5){
                        pageService.supplierCategory().then(function (data) {
                            $scope.recommendVM.categoryList = data.items;
                        });
                    }

                    $scope.typeChanged = function () {
                        var type = $scope.recommendVM.data.type;
                        if(type == 5 && $scope.recommendVM.categoryList.length == 0){
                            pageService.supplierCategory().then(function (data) {
                                $scope.recommendVM.categoryList = data.items;
                            });
                        }
                    };
                    
                    $scope.ok = function(valid) {
                        if(! valid){
                            return false;
                        }
                        $scope.recommendVM.processing = true;
                        if(item){ // 修改
                            recommendService.update($scope.recommendVM.data).then(function(data){
                                if(data.status == '200' && data.items){
                                    $modalInstance.dismiss();
                                }else{
                                    toaster.pop('error', data.msg);
                                    $scope.recommendVM.processing = false;
                                }
                            });
                        }
                        if(!item){ // 新增
                            recommendService.create($scope.recommendVM.data)
                                .then(function(data){
                                    if(data.status == '200' && data.items > 0){
                                        $modalInstance.dismiss();
                                        paging(1);
                                    }else{
                                        toaster.pop('error', data.msg);
                                        $scope.recommendVM.processing = false;
                                    }
                                },
                                function(err) {
                                    $scope.listVM.searching = false;
                                    toaster.pop('error', '服务器请求异常！');
                                });
                        }
                        return true;
                    };

                    $scope.cancel = function() {
                        $modalInstance.close();
                        return false;
                    };
                }
            });
        };

        // 上线或下线
        $scope.confirm = function(text,item) {
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
                    };

                    $scope.ok = function() {
                        $scope.confirmData.processing = true;
                        fnPublish(item.status == 0 ? 1 : 0,$modalInstance,item.id);
                        return true;
                    };
                }
            });
        }
    }];
});
