define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'toaster', 'metaService', '$modal', 'McService', function($rootScope, $scope, $state, $stateParams, toaster, metaService, $modal, McService) {
        ph.mark($rootScope, {
            state: 'mc.campaign.list',
            title: '市场跟踪'
        });

        var defaultCondition = {
            pageNo: 1,
            pageSize: 10
        };

        /**
         * common data
         * @type {Object}
         */
        $scope.listVM = {
            condition: angular.copy(defaultCondition),
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: [],
            source: [],
            medium: []
        };

        //获取市场跟踪来源数据项
        metaService.getMeta('SCGZLY', function(list) {
            $scope.listVM.source = list;
        });

        //获取市场跟踪媒介数据项
        metaService.getMeta('SCGZMJ', function(list) {
            $scope.listVM.medium = list;
        });

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = angular.copy(defaultCondition);
        };

        //查询运营活动
        var search = function(page) {
            $scope.listVM.loading = true;
            $scope.listVM.items = [];
            McService.queryCampaigns($scope.listVM.condition).then(
                function(res) {
                    if (res && res.status == 200) {
                        $scope.listVM.items = res.items;
                        $scope.listVM.paginate = res.paginate;
                    } else {
                        toaster.pop('error', (res && res.msg) ? res.msg : '查询出错！');
                    }
                    $scope.listVM.loading = false;
                },
                function(err) {
                    $scope.listVM.loading = false;
                    toaster.pop('error', '服务器请求异常！');
                }
            );
        };

        //打开页面时自动加载
        search();

        /**
         * 分页控件翻页事件
         */
        $scope.pageChanged = function() {
            $scope.page($scope.listVM.paginate.pageNumber);
        };

        /**
         * search
         * @param  {[int]} index [description]
         */
        $scope.page = function(index) {
            $scope.listVM.condition.pageNo = index || 1;
            search();
        };

        //弹出添加商品模态框
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: "view/mc/campaign/resetDay.html",
                controller: function($scope, $modalInstance){

                    $scope.config = {'configKey':'campaign_expire_date_days','configValue':''};

                    McService.queryConfigByKey($scope.config.configKey).then(
                        function(res) {
                            if (res && res.status == 200) {
                                $scope.config.configValue = res.items;
                            } else {
                                toaster.pop('error', (res && res.msg) ? res.msg : '查询有效时间出错！');
                            }
                        },
                        function(err) {
                            toaster.pop('error', '服务器请求异常！');
                        }
                    );

                    $scope.ok = function () {
                        if($scope.config.configValue == ''|| !$scope.config.configValue){
                            toaster.pop('info','天数不能为空！');
                            return;
                        }
                        McService.updateConfig($scope.config).then(
                            function(res) {
                                if (res && res.status == 200) {
                                    toaster.pop('info','保存成功！');
                                    $modalInstance.dismiss('cancel');
                                } else {
                                    toaster.pop('error', (res && res.msg) ? res.msg : '修改出错！');
                                }
                            },
                            function(err) {
                                toaster.pop('error', '服务器请求异常！');
                            }
                        );
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: "",
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

    }];
});
