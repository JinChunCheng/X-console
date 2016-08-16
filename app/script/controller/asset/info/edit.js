define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', 'borrowerService', 'metaService',
        function($scope, $timeout, $state, $stateParams, borrowerService, metaService) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.vm = {
                action: action,
                title: $stateParams.id ? '修改资产信息' : '新增资产信息',
                data: {},
                cancel: function() {
                    $state.go('asset.info.list');
                },
                provinceChange: function() {
                    $scope.vm.data.city = null;
                    $scope.vm.data.area = null;
                    console.log($scope.vm.data.province);
                },
                cityChange: function() {
                    $scope.vm.data.area = null;
                    console.log($scope.vm.data.city);
                }
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                borrowerService.get({ id: id }).$promise.then(function(res) {
                    $scope.vm.data = res.data;
                }, function(err) {

                });
            })($stateParams.id);

            function initMetaData() {
                metaService.getProvinces(function(res) {
                    $scope.vm.provinces = res;
                    // var p_list = $.grep(res, function(n, i) {
                    //     return n.level == 1;
                    // });

                    // p_list.forEach(function(p) {
                    //     var c_list = $.grep(res, function(n, i) {
                    //         return n.sheng == p.sheng && n.level == 2;
                    //     });

                    //     c_list.forEach(function(c) {
                    //         var a_list = $.grep(res, function(n, i) {
                    //             return n.sheng == p.sheng && n.di == c.di && n.level == 3;
                    //         });
                    //         if (a_list && a_list.length > 0) {
                    //             a_list.forEach(function(a) {
                    //                 delete a.sheng;
                    //                 delete a.di;
                    //                 delete a.xian;
                    //                 delete a.level;
                    //             });
                    //             c.children = a_list;
                    //         }
                    //         delete c.sheng;
                    //         delete c.di;
                    //         delete c.xian;
                    //         delete c.level;
                    //     });
                    //     if (c_list && c_list.length > 0) {
                    //         p.children = c_list;
                    //     }
                    //     delete p.sheng;
                    //     delete p.di;
                    //     delete p.xian;
                    //     delete p.level;
                    // });
                    // console.log(JSON.stringify(p_list));
                });
            }
        }
    ];
});
