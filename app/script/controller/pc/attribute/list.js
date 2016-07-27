define([], function() {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$modal', 'PcService', 'toaster', function($rootScope, $scope, $state, $stateParams, $modal, PcService, toaster) {

        //already have listVM data or not
        var hasCache = $stateParams.listVM ? true : false;
        $scope.listVM = $stateParams.listVM || {
            condition: {
                pageNo: 1,
                pageSize: 10,
                sorting:'create_time desc'
            },
            paginate: {
                pageSize: 10,
                pageNumber: 1,
                pagesCount: 0,
                totalItemsCount: 0
            },
            items: [],
            isAllChecked: false,
            checkedAttributeCodes: []
        };

        var search = function() {
            $scope.listVM.searching = true;
            $scope.listVM.checkedAttributeCodes = [];
            PcService.searchAttribute($scope.listVM.condition).then(function(data) {
                if (data && data.status === 200) {
                    if (data.items && data.items.length > 0) {
                        for (var i = 0; i < data.items.length; i++) {
                            var attributeVal = data.items[i].attributeVal;
                            if (attributeVal) {
                                try {
                                    data.items[i].attributeVal = JSON.parse(attributeVal);
                                } catch (err) {
                                    data.items[i].attributeVal = '';
                                }
                            }
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
        if (!hasCache)
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

        $scope.doSort = function(sortType, field) {
            $scope.listVM.condition.sorting = field + "  " + sortType;
            $scope.page(1);
        };

        /**
         * reset search form data
         */
        $scope.reset = function() {
            $scope.listVM.condition = {
                pageNo: 1,
                pageSize: 10,
                sorting:'create_time desc'
            }
        };

        //处理是否选中
        var processItemsChecked = function(items) {
            var isAll = true;
            if (items && $scope.listVM.checkedAttributeCodes) {
                for (var i = 0; i < items.length; i++) {
                    if (isItemChecked(items[i].code)) {
                        items[i].IsChecked = true;
                    } else
                        isAll = false;
                }
            }
            $scope.listVM.isAllChecked = isAll;
        };

        var processChecked = function(item) {
            var hasChecked = isItemChecked(item.code);
            if (item.IsChecked && !hasChecked) {
                //当前选中，之前未选，在已选中添加
                $scope.listVM.checkedAttributeCodes.push(item.code);
            } else if (!item.IsChecked && hasChecked) {
                //当前未选中，之前已选，在已选中移除
                for (var j = 0; j < $scope.listVM.checkedAttributeCodes.length; j++) {
                    if ($scope.listVM.checkedAttributeCodes[j] == item.code) {
                        $scope.listVM.checkedAttributeCodes.splice(j, 1);
                        break;
                    }
                }
            }
        };
        $scope.sortClass = function(field) {
            if ($scope.listVM.condition.sorting) {
                var sortArr = $scope.listVM.condition.sorting.split(' ');
                if (field == sortArr[0]) {
                    var cls = 'text-success ';
                    switch (sortArr[1]) {
                        case 'asc':
                            cls += 'fa-caret-up';
                            break;
                        case 'desc':
                        default:
                            cls += 'fa-caret-down';
                            break;
                    }
                    return cls;
                }
            }
            return 'fa-unsorted';
        };
        /**
         * reSort search list
         * @param  {string} field database field name
         */
        $scope.reSort = function(field) {
            if ($scope.loading)
                return false;
            var sortingArr = $scope.listVM.condition.sorting.split(' ');
            var preField = sortingArr[0];
            var preOrderMode = sortingArr[1];

            var newOrderMode = 'desc';
            if (field == preField) {
                newOrderMode = (preOrderMode == 'asc' ? 'desc' : 'asc');
            }

            $scope.listVM.condition.sorting = field + ' ' + newOrderMode;
            $scope.page(1);
        };
        //选中、取消事件
        $scope.processCheckedItem = function(item) {
            processChecked(item);
            $scope.listVM.isAllChecked = allChecked();
        };

        //是否已选中
        var isItemChecked = function(code) {
            for (var j = 0; j < $scope.listVM.checkedAttributeCodes.length; j++) {
                if ($scope.listVM.checkedAttributeCodes[j] == code) {
                    return true;
                }
            }
            return false;
        };

        //是否已全选
        var allChecked = function() {
            for (var i = 0; i < $scope.listVM.items.length; i++) {
                if (!$scope.listVM.items[i].IsChecked)
                    return false;
            }
            return true;
        };

        //全选、反选事件
        $scope.selectAll = function() {
            var isSelect = $scope.listVM.isAllChecked;
            for (var i = 0; i < $scope.listVM.items.length; i++) {
                $scope.listVM.items[i].IsChecked = !isSelect;
                processChecked($scope.listVM.items[i]);
            }
            $scope.listVM.isAllChecked = !isSelect;
        };

        /**
         * batch process attribute data
         * @param  {int} status [attribute status]
         */
        $scope.batchProcess = function(status) {
            if ($scope.listVM.checkedAttributeCodes.length == 0) {
                toaster.pop("error", "请选择要删除的记录！");
                return;
            }
            var text = '确定批量删除这' + $scope.listVM.checkedAttributeCodes.length + '条属性？';
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
                        batchProcess(status, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        //批量处理
        var batchProcess = function(status, batchScope, modalInstance) {
            if (status == '3') {
                batchScope.confirmData.processing = true;
                PcService.deleteAttribute($scope.listVM.checkedAttributeCodes).then(
                    function(data) {
                        batchScope.confirmData.processing = false;
                        if (data.status == '200') {
                            $scope.listVM.checkedAttributeCodes = [];
                            toaster.pop("success", "删除成功！");
                        } else {
                            toaster.pop("error", "删除失败，原因：" + data.msg);
                        }
                        modalInstance.dismiss();
                        search();
                    },
                    function(errResponse) {
                        batchScope.confirmData.processing = true;
                        toaster.pop("error", "服务器请求异常！");
                    }
                );
            }
        };

        /**
         * delete single attribute with confirm dialog
         * @param  {object} item [attribute data]
         */
        $scope.delAttribute = function(item) {
            var text = '确定删除该属性？';
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
                        delAttribute(item.code, $scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        var delAttribute = function(code, confirmScope, modalInstance) {
            confirmScope.confirmData.processing = true;
            PcService.deleteAttribute(code).then(function(res) {
                if (res && res.status == 200) {
                    toaster.pop('success', '删除成功！');
                    modalInstance.dismiss();
                    search();
                } else
                    toaster.pop('error', res.msg);

                confirmScope.confirmData.processing = false;
            }, function(err) {
                toaster.pop('error', '服务器请求异常！')
                confirmScope.confirmData.processing = false;
            });
        };

        /**
         * show import dialog
         */
        $scope.import = function() {
            $modal.open({
                templateUrl: 'view/pc/attribute/import.html',
                size: 'md',
                controller: function($scope, $modalInstance) {
                    $scope.importVM = {
                        title: '批量导入属性',
                        saving: false,
                        excelErrors: []
                    };

                    /**
                     * 下载产品属性导入模板
                     */
                    $scope.downloadTemplet = function() {
                        window.location.href = "../view/pc/attribute/attributeImportTemplate.xlsm";
                    }

                    $scope.fileChange = function() {
                        
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss();
                        return false;
                    }

                    $scope.ok = function() {
                        $scope.importVM.importMessage = '';
                        $scope.importVM.excelErrors = [];

                        importAttribute($scope, $modalInstance);
                        return true;
                    }
                }
            });
        };

        /**
         * import 
         * @param  {[type]} importScope   [description]
         * @param  {[type]} modalInstance [description]
         * @return {[type]}               [description]
         */
        var importAttribute = function(importScope, modalInstance) {
            var form = document.forms['importForm'];
            var formData = new FormData(form); //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
            var file = importScope.importVM.file;
            if (file.length < 4) {
                importScope.importVM.importMessage = "您还没有选择文件，请点击选择文件按钮选择您要上传的文件";
                return;
            }
            if (file.indexOf('.xls') < 0) {
                importScope.importVM.importMessage = "您选择的文件不是xls格式，请选择xls格式的文件进行操作";
                return;
            }

            importScope.importVM.saving = true;

            PcService.importAttribute(formData).then(function(data) {
                importScope.importVM.saving = false;
                if (data.status == 200) {
                    importScope.importVM.excelErrors = [];
                    //importScope.importVM.importMessage = "批量导入属性操作成功！";
                    toaster.pop('success', '批量导入属性操作成功！');
                    modalInstance.dismiss();
                    search();
                } else {
                    if (data.status == 125308) {
                        importScope.importVM.importMessage = "批量保存属性操作失败，原因： excel文件中的部分数据不合法，请参考错误提示列表进行修正！";
                        importScope.importVM.excelErrors = data.items;
                    } else {
                        importScope.importVM.excelErrors = [];
                        importScope.importVM.importMessage = "批量保存属性操作失败，原因：" + data.msg;
                    }
                }
                importScope.importVM.saving = false;
            }, function(err) {
                importScope.importVM.saving = false;
                toaster.pop('error', '服务器请求异常！')
            });
        };
    }];
});
