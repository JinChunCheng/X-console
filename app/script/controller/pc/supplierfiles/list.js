define([], function() {
    return ['$rootScope', '$scope', '$stateParams', '$modal', 'PcService', 'toaster', function($rootScope, $scope, $stateParams, $modal, PcService, toaster) {

        $scope.listVM = {
            condition: $stateParams.condition ? $stateParams.condition : {
                pageNo: 1,
                pageSize: 10
            },
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: []
        };

        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.beginDateOpened = true;
            $scope.listVM.endDateOpened = false;
        };
        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.listVM.endDateOpened = true;
            $scope.listVM.beginDateOpened = false;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };

        var search = function() {
            $scope.listVM.searching = true;
            PcService.supplierFilesList($scope.listVM.condition).then(function(data) {
                if (data && data.status === 200) {
                    if (data.items.length > 0) {
                        for (var i = 0; i < data.items.length; i++) {
                            data.items[i].filePath = data.items[i].filePath.split('|');
                            var fileNames = data.items[i].fileName.split('|');
                            if (null != fileNames && fileNames.length > 0) {
                                if (fileNames[0] == fileNames[1]) {
                                    fileNames[0] = fileNames[0] + " ";
                                }
                            }
                            data.items[i].fileName = fileNames;
                        }
                    }

                    $scope.listVM.items = data.items;
                    $scope.listVM.paginate = data.paginate;
                } else {
                    toaster.pop('error', data.msg);
                }
                $scope.listVM.searching = false;
            }, function(err) {
                $scope.listVM.searching = false;
                toaster.pop('error', '服务器请求异常！');
            });
        };
        //进入页面第一次查询
        search();

        /**
         * 分页控件翻页事件
         * @return {[type]} [description]
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

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = {
                pageNo: 1,
                pageSize: 10
            }
        };

    }];
});
