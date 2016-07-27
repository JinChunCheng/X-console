define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'PcService', 'toaster', function($rootScope, $scope, $state, $stateParams, $http, PcService, toaster) {

        $scope.title = $stateParams.code ? '修改品类' : '添加品类';
        ph.mark($rootScope, {
            state: 'pc.category.edit',
            title: $scope.title
        });

        $scope.loading = false;
        $scope.category = {};
        // if ($routeParams.section == 'category' && ($routeParams.action == 'index')) { //需要菜单的action加在这里
        //     $scope.hasMenu = true;
        // } else {
        //     $scope.hasMenu = false;
        // }

        if ($stateParams.code) { //需要预加载一条品类信息
            $scope.showCategoryInfo = true;
        } else {
            $scope.showCategoryInfo = false;
        }

        $scope.back = function() {
            $state.go('pc.category.index');
        };

        /**
         * 品类-保存新增品类
         * @author: eric.gao
         */
        $scope.addCategory = function(valid) {
            var form = document.forms[0];
            var formData = new FormData(form);
            console.log($scope.category.grade);

            //如果重新选择了品类
            if ($scope.category.currSel != undefined) {
                if ($scope.category.grade == 1) { //如果是一级品类
                    if ($scope.category.leaf == 1) {
                        toaster.pop('error', '一级品类不能是叶子节点！');
                        return false;
                    }
                } else {
                    formData.append("parentCode", $scope.category.currSel);
                }
            } else {
                if ($scope.category.grade == 999 && $scope.category.currSel == null) { //选择了,但又重置了
                    toaster.pop('error', '请从头重新选择！');
                    return false;
                }

                //如果是一级品类
                if ($scope.category.parentCode == '' || $scope.category.parentCode == undefined) {
                    if ($scope.category.leaf == 1) {
                        toaster.pop('error', '一级品类不能是叶子节点！');
                        return false;
                    }
                } else {
                    formData.append("parentCode", $scope.category.parentCode);
                }
            }
            if (!$scope.category.des) {
                toaster.pop('error', '品类中文名称为必填项！');
                return false;
            }
            //校验表单
            if (!valid) {
                toaster.pop('error', '请按要求完善品类信息！');
                return false;
            }


            $scope.isSaving = true;
            //查询属性列表
            PcService.saveCategory(formData).then(function(res) {
                if (res && res.status == 200)
                    toaster.pop('success', '保存成功！');
                else
                    toaster.pop('error', (res && res.msg) ? res.msg : '服务器连接失败，请检查服务是否可用或联系管理员！');

                $scope.isSaving = false;
            });
        };

        /**
         * 品类-查询
         * 详情页时会自动加载。根据category_code加载品类信息
         * @author eric.gao
         */
        var findCategoryByCode = function() {
            var categoryCode = $stateParams.code;
            $scope.loading = true;
            $http({
                    method: "GET",
                    url: config.pc_domain + '/category/' + categoryCode
                })
                .success(function(data, status, headers, config) {
                    $scope.category = data;
                    $scope.loading = false;
                })
                .error(function(data, status) {
                    toaster.pop('error', '加载品类信息失败');
                    $scope.loading = false;
                });
        };
        if ($scope.showCategoryInfo) findCategoryByCode();

        /**
         * 级联菜单 - 用在品类添加和修改时
         * @param level:当前级别
         * @param currSel:选中值
         * @author:eric.gao
         */

        //存储各个级别menu的data
        $scope.selectDatas = [];
        $scope.getOptions = function(gradeIndex) {
            return $scope.selectDatas[gradeIndex].options;
        };

        $scope.cascadeMenu = function(level, currSel) {
            $scope.category.currSel = currSel;
            if (level == undefined && currSel == undefined) { /***初始化时***/
                $scope.category.grade = 1;
                url = config.pc_domain + '/cascadeMenu/gradeone';
            } else { /***选择下拉时***/
                if (level == 0 && currSel == null) { //又回到一级'请选择'时
                    $scope.category.grade = 1;
                    return;
                }

                if (!level) level = 0;
                if (level > 0 && currSel == null) { //又回到其它级的'请选择'时
                    $scope.category.grade = 999;
                } else {
                    $scope.category.grade = level + 1 + 1; //level是从0开始的,所以先+1,新品类level又+1
                }
                url = config.pc_domain + '/cascadeMenu/' + $scope.category.currSel;
            }
            $scope.isCascading = true;
            $http({
                    method: "GET",
                    url: url
                })
                .success(function(data, status, headers, config) {
                    //$scope.selectDatas[0].options = data;
                    var options = {
                        id: level + 1,
                        options: data
                    };
                    //构造select循环的数据结构
                    //删除下级
                    if ($scope.selectDatas.length > level + 1)
                        $scope.selectDatas.splice(level + 1, $scope.selectDatas.length - level - 1);
                    //绑定下级
                    if (options && options.options != "") {
                        $scope.selectDatas.push(options);
                    }
                    $scope.isCascading = false;

                })
                .error(function(data, status) {
                    toaster.pop('error', '加载品类列表失败');
                    $scope.isCascading = false;
                });
        };

        if (!$scope.showCategoryInfo)
            $scope.cascadeMenu();
    }];
});
