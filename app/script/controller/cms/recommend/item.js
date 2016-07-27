define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$modal', 'defaultService', 'metaService','recommendItemService','recommendService','toaster', function($rootScope, $scope, $state, $timeout, $stateParams, $modal, defaultService, metaService,recommendItemService,recommendService,toaster) {

        //必须传入推荐位id参数
        if (!$stateParams.r || !$stateParams.p)
            $state.go('error');


        $scope.listVM = recommendItemService.default;
        $scope.listVM.condition = $stateParams.condition || {};
        $scope.listVM.condition.recommendCode = $stateParams.r;
        $scope.listVM.condition.pageCode = $stateParams.p;
        $scope.listVM.positionList = {};

        var getPositionList = function(pageCode){
            recommendService.getListByPageCode(pageCode).then(function(data) {
                    if (data.status == '200') {
                        $scope.listVM.positionList = data.items;
                    }
                },
                function(errCode) {
                    console.error('Error while getListByPageId' + pageId);
                });
        };
        getPositionList($stateParams.p);

        // 操作按钮状态
        $scope.operating = {};
        $scope.operating.publish = false;
        $scope.operating.offline = false;

        // 启用、禁用
        metaService.getMeta('ISENABLE', function(data) {
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
        $scope.publish = function(status){
            status == 0 ? $scope.operating.publish = true : $scope.operating.offline = true;
            var items = $scope.listVM.selectedList.map(function(selectedId){
                var temp;
                $scope.listVM.items.forEach(function(item){
                    if(item.id == selectedId){
                        temp =item;
                    }
                });
                return temp;
            });

            recommendItemService.publish($stateParams.r,items,status).then(
                function(data){
                    if (data.status == '200' && data.items == true) {    
                        $scope.listVM.selectedList = [];
                        $scope.listVM.checkedAll = false;
                        $scope.operating.publish = false;
                        $scope.operating.offline = false; 
                        paging(1);

                    }else{
                        $scope.operating.publish = false;
                        $scope.operating.offline = false;
                        toaster.pop('error', data.msg);
                    }
                },
                function(errCode) {
                    toaster.pop('error', '服务器请求异常！');
                    $scope.operating.publish = false;
                    $scope.operating.offline = false; 
                    console.error('Error while publishing positionItem:' + items);
                }
            );
        };

        $scope.setTop = function(itemId,isTop){
            recommendItemService.setTop(itemId,isTop == 1).then(
                function(data){
                    if (data.status == '200' && data.items == true) {
                        paging(1);
                    }else{
                        alert(data.msg);
                    }
                },
                function(errCode) {
                    console.error('Error while setTop itemId:' + itemId);
                    $state.go('error');
                }
            );
        };

        // 分页查询
        var paging = function(pageNo) {
            $scope.listVM.processing = true;
            $scope.listVM.condition.pageNo = pageNo;
            $scope.listVM.condition.pageSize = $scope.listVM.paginate.pageSize;
            recommendItemService.getList($scope.listVM.condition).then(function(data) {
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

        // 面包屑
        ph.mark($rootScope, {
            state: 'recommend.list',
            title: '推荐位图片管理',
            params: { r: $stateParams.r, p: $stateParams.p }
        });

        // 新增
        $scope.addPic = function() {
            showPicModal();
        };

        // 修改
        $scope.editPic = function(item) {
            showPicModal(item);
        };

        // 查看图片内容
        $scope.showPic = function(item){
            $modal.open({
                templateUrl: 'view/cms/recommend/picture/show.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.picVM = {
                        prefix: config.img_pc_domain,
                        data: item
                    };

                    $scope.cancelPic = function() {
                        $modalInstance.dismiss();
                        return false;
                    }
                }
            });
        };

        $scope.deleteById = function (id){
            recommendItemService.deleteById(id).then(function(data) {
                    if (data.status == '200' && data.items == true) {
                        paging(1);
                    }
                },
                function(errCode) {
                    console.error('Error while delete positionItem.'+errCode);
                    toaster.pop('error', data.msg);
                });
        };

        // 弹出新增修改表单
        var showPicModal = function(item) {
            var title = item ? "修改图片" : "新增图片";
            $modal.open({
                templateUrl: 'view/cms/recommend/picture/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.picVM = {
                        prefix: config.img_pc_domain,
                        title: title,
                        processing: false,
                        data: item || {
                            id: null,
                            positionCode: $stateParams.r,
                            title: '',
                            imgUrl: '',
                            skipUrl: '',
                            remarks: '',
                            createUser:$scope.curUser.id
                        }
                    };

                    $scope.okPic = function(valid) {
                        if($scope.picVM.data.imgUrl == ''){
                            toaster.pop('error', '图片必须上传。');
                            return false;
                        }
                        if(! valid || $scope.picVM.data.imgUrl == ''){
                            return false;
                        }
                        $scope.picVM.processing = true;
                        if(item){ // 修改
                            recommendItemService.update($scope.picVM.data).then(function(data){
                                if(data.status == '200' && data.items){
                                    $modalInstance.dismiss();
                                }else{
                                    alert(data.msg);
                                    $scope.recommendVM.processing = false;
                                }
                            });
                        }
                        if(!item){ // 新增
                            recommendItemService.create($scope.picVM.data)
                                .then(function(data){
                                    if(data.status == '200' && data.items > 0){
                                        $modalInstance.dismiss();
                                        paging(1);
                                    }else{
                                        alert(data.msg);
                                        $scope.recommendVM.processing = false;
                                    }
                                });
                        }
                        return true;
                    }

                    $scope.cancelPic = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    // 图片上传
                    $scope.fileSuccess = function(file, data, formData) {
                        recommendItemService.uploadFile(formData).then(function(res) {
                            $scope.picVM.data.imgUrl = res.items;
                        }, function(err) {
                            toaster.pop('error', '上传失败');
                        });
                    }

                }
            });
        };



    }];
});
