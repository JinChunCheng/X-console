define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', 'toaster', 'metaService', 'PcService', function($rootScope, $scope, $state, $stateParams, toaster, metaService, PcService) {

        var title = $stateParams.code ? '修改属性' : '添加属性';
        ph.mark($rootScope, {
            state: 'pc.attribute.edit',
            title: title
        });

        $scope.attrVM = {
            title: title,
            tagsList: [],
            attributeValueList: [],
            fieldTypeList: [{
                value: 1,
                text: '短文本'
            }, {
                value: 2,
                text: '长文本'
            }, {
                value: 3,
                text: '单项选择'
            }, {
                value: 4,
                text: '多项选择'
            }]
        };

        //属性值类型选项改变时初始化attributeValueList
        $scope.changeFieldType = function() {
            /**roy.liu注释 用于修改属性列表页面，当类型为多项选择的属性修改为单项选择时，其下的值列表全部清空，这个不合理，属性类型从单选和多选之间修改时，值列表应该不变；
             if ($scope.attribute.fieldType > 2 ) {
                $scope.attributeValueList = [{"cnValue": "", "enValue":""}];
            }**/
            /**roy.liu 添加用于修改属性列表页面，当类型为多项选择的属性修改为单项选择时，其下的值列表全部清空，这个不合理，属性类型从单选和多选之间修改时，值列表应该不变；**/
            if ($scope.attrVM.data.fieldType > 2) {
                if (0 == $scope.attrVM.attributeValueList.length) {
                    $scope.attrVM.attributeValueList = [{
                        "cnValue": "",
                        "enValue": ""
                    }];
                }
            }

        }

        /**
         * add one attribute value item
         */
        $scope.add = function() {
            $scope.attrVM.attributeValueList.push({
                cnValue: '',
                enValue: ''
            });
        };

        /**
         * reommve one attribute value item
         * @param  {int} index [item index]
         */
        $scope.remove = function(index) {
            $scope.attrVM.attributeValueList.splice(index, 1);
        };

        var loadAttribute = function() {
            $scope.attrVM.loading = true;
            PcService.loadAttributeData($stateParams.code).then(
                function(data) {
                    if (data.status == '200') {
                        var attributeVal = data.items.attributeVal;
                        if (attributeVal) {
                            try {
                                $scope.attrVM.attributeValueList = JSON.parse(attributeVal);
                            } catch (err) {}
                        }
                        data.items.checkTags = data.items.tags.split(",");
                        $scope.attrVM.data = data.items;
                        $scope.attrVM.loading = false;
                    } else {
                        toaster.pop("error", "加载属性信息失败，原因：" + data.msg);
                        $scope.attrVM.loading = false;
                    }
                },
                function(errResponse) {
                    $scope.attrVM.loading = false;
                    toaster.pop("error", "服务器请求失败！");
                }
            );
        };
        if ($stateParams.code)
            loadAttribute();

        /**
         * get tags list
         * @param  {string} items [meta code]
         */
        var loadTagList = function() {
            $scope.attrVM.tagListLoading = true;
            metaService.getMeta('SXBQ', function(items) {
                $scope.attrVM.tagListLoading = false;
                $scope.attrVM.tagsList = items;
            });
        };
        loadTagList();

        /**
         * go back to list view with listVM data
         */
        $scope.back = function() {
            $state.go('pc.attribute.list', {
                listVM: $stateParams.listVM
            })
        };

        /**
         * save attribute data
         * @param  {bool} valid [if form is valid]
         */
        $scope.save = function(valid) {
            if (!valid) {
                toaster.pop("error", "请按要求完善属性信息！");
                return false;
            }
            if ($scope.attrVM.data.fieldType > 2 && $scope.attrVM.attributeValueList.length < 2) {
                toaster.pop("error", "字段类型是单项或多项时必须有两个以上值列表");
                return false;
            }
            //如果不是单选或多选，属性值置空
            if ($scope.attrVM.data.fieldType < 3)
                $scope.attrVM.data.attributeVal = '';
            else
                $scope.attrVM.data.attributeVal = JSON.stringify($scope.attrVM.attributeValueList);

            $scope.attrVM.data.tags = $scope.attrVM.data.checkTags.toString();

            var method = $stateParams.code ? 'PUT' : 'POST';

            $scope.attrVM.saving = true;
            PcService.saveAttribute($scope.attrVM.data, method).then(
                function(data) {
                    if (data.status == 200) {
                        toaster.pop('success', '保存成功！');
                        $state.go('pc.attribute.list');
                    } else {
                        toaster.pop('error', data.msg);
                    }
                    $scope.attrVM.saving = false;
                },
                function(errResponse) {
                    $scope.attrVM.saving = false;
                    toaster.pop('error', '服务器请求失败！');
                }
            );
        };
    }];
});
