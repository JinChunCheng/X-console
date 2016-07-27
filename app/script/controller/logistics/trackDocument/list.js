define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$modal', 'toaster', 'LogisticsService', function($rootScope, $scope, $state, $modal, toaster, LogisticsService) {

        ph.mark($rootScope, {
            state: 'logistics.tracking.list',
            title: '物流文件列表'
        });

        
        $scope.isSaving = false;
        //默认分页配置
        $scope.defualResult = {
            PageIndex: 1,
            PageSize: 10,
            PageAmount: 0,
            TotalCount: 0,
            Items: []
        };
        
        var self = this;
        $scope.queryResult = $scope.defualResult;
        $scope.loading = false;

        $scope.condition = {
            orderKey:'',
            orderType:'',
            blNo:'',
            trackNo:'',
            transoportMod:'',
            status:'',
            pageNo: $scope.queryResult.PageIndex,
            pageSize: $scope.queryResult.PageSize,
            PageIndex: $scope.queryResult.PageIndex,
            PageSize: $scope.queryResult.PageSize,
            PageAmount: $scope.queryResult.PageAmount,
            TotalCount: $scope.queryResult.TotalCount,
            Items: []
        };

        
       // 跳转到第n页
        $scope.GoToPage = $scope.queryResult.PageIndex;
        

        
        //翻页
        $scope.page = function(index) {
            //$scope.condition.PageIndex = index || 1;
            $scope.condition.pageNo = index || 1;
            $scope.searchTrackDocument();
        };

        //重置查询条件
        $scope.reset = function() {
            $scope.condition.orderKey = '';
            $scope.condition.orderType = '';
            $scope.condition.blNo='';
            $scope.condition.trackNo='';
            $scope.condition.transoportMod = '';
            $scope.condition.status = '';
        };

         //分页查询
        $scope.pageChanged = function() {
            $scope.page($scope.queryResult.PageIndex);
        };

        //
        $scope.openBegin = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openB = true;
        };

        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openE = true;
        };
        

        
       //  var self = this;
        $scope.searchTrackDocument = function() {
            $scope.loading = true;
            $scope.searching = false;
            LogisticsService.searchTrackDocument($scope.condition).then(
                function(data) {
                    if (data.status == '200') {
                        $scope.loading = false;
                        $scope.queryResult.Items = data.items;
                        $scope.queryResult.PageSize = data.paginate.pageSize;
                        $scope.queryResult.PageAmount = data.paginate.pagesCount;
                        $scope.queryResult.TotalCount = data.paginate.totalItemsCount;
                        $scope.queryResult.PageIndex = data.paginate.pageNumber;
                        $scope.queryResult.pageNo = data.paginate.pageNumber;
                        $scope.GoToPage = data.paginate.pageNumber;
                        $scope.searching = false;
                    } else {
                        toaster.pop('error', '加载物流文件列表失败，原因：' + data.msg);
                        $scope.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.loading = false;
                    console.error('Error while searching trackings.');
                }
            );
        };
        // 进入页面第一次查询
        $scope.searchTrackDocument();

         $scope.modify=function(trackDoc){
            var trackDocInfo={
                trackDocId:'',
                trackDetailId:''
            }
            trackDocInfo=trackDoc;
            $modal.open({
                templateUrl: 'view/logistics/trackDocument/edit.html',
                size: 'lg',
                controller: function($scope, $modalInstance) {
                    $scope.trackDoc = {
                        title: '物流文件上传'
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        uploadDoc($scope,$modalInstance,trackDocInfo);
                        return true;
                    }
                }
            });
        };

        //上传文件
        var uploadDoc=function(trackDocScope, modalInstance,trackDocInfo){
            trackDocScope.saving = true;
             var form = document.forms['trackDocForm'];
             var formData = new FormData(form);
             formData.append("trackDetailId",trackDocInfo.trackDetailId);
             if (trackDocInfo.trackDocId==null ) {
                     LogisticsService.insertTrackDoc(formData,trackDocInfo.trackDetailId).then(
                        function(data){
                            if (data.status == 200) {
                                toaster.pop('success', '成功保存！')
                                $scope.page($scope.queryResult.PageIndex);
                                modalInstance.dismiss();
                            } else {
                                if (data.status == 125308) {
                                     toaster.pop('error', '操作错误')
                                } else {
                                    toaster.pop('error','保存失败，原因'+data.msg)
                                }
                            }
                        }, function(err) {
                            toaster.pop('error', '服务器请求异常！')
                        });
                }else{
                     LogisticsService.uploadTrackDoc(formData,trackDocInfo.trackDocId).then(
                        function(data){
                            if (data.status == 200) {
                                toaster.pop('success', '成功保存！')
                                 $scope.page($scope.queryResult.PageIndex);
                                modalInstance.dismiss();
                            } else {
                                if (data.status == 125308) {
                                     toaster.pop('error', '操作错误')
                                } else {
                                    toaster.pop('error','保存失败，原因'+data.msg)
                                }
                            }
                        }, function(err) {
                            toaster.pop('error', '服务器请求异常！')
                        });
                }
        };
        
    }];
});