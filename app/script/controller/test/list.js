define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', function($rootScope, $scope, $state, $stateParams, $timeout) {
        ph.mark($rootScope, {
            state: 'terminal.list',
            title: '终端管理'
        });

        $scope.listVM = {
            condition: $stateParams.condition || {},
            processing: false,
            statusList: [{
                value: 1,
                text: '开发测试'
            }, {
                value: 2,
                text: '试运营'
            }, {
                value: 3,
                text: '正式运营'
            }, {
                value: 4,
                text: '已下线'
            }],
            paginate: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 0
            }
        };


        $scope.treeData = {
            showTree: false,
            setting: {
                data: {
                    key: {
                        title: "t"
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function(event, treeId, treeNode, clickFlag) {
                        $timeout(function() {
                            if (!treeNode.isLeaf) {
                                return false;
                            }
                            var paths = treeNode.getPath();
                            var categoryNamePath = '';
                            if (paths && paths.length > 0) {
                                categoryNamePath = paths.map(function(item) {
                                    return item.name;
                                }).join(' - ');
                            }
                            $scope.listVM.category = categoryNamePath;
                            $scope.treeData.showTree = false;
                            //toggle有点变态
                            //临时方案，解决关闭toggle层
                            $(document).click();
                        });
                    }
                }
            }
        };

        var paging = function(p) {
            $scope.listVM.processing = true;

            $timeout(function() {
                $scope.listVM.items = [{
                    id: 1,
                    name: 'GOEXW',
                    status: '运营',
                    creator: 'USEA',
                    version: '1.0',
                    createTime: '2015-11-23 22:23:25'
                }, {
                    id: 2,
                    name: 'IOS',
                    status: '运营',
                    creator: 'USEA',
                    version: '1.0',
                    createTime: '2015-11-23 22:23:25'
                }, {
                    id: 3,
                    name: 'ANDROID',
                    status: '运营',
                    creator: 'USEA',
                    version: '1.0',
                    createTime: '2015-11-23 22:23:25'
                }, {
                    id: 4,
                    name: 'EXIAO',
                    status: '运营',
                    creator: 'USEA',
                    version: '1.0',
                    createTime: '2015-11-23 22:23:25'
                }, {
                    id: 5,
                    name: 'WAP',
                    status: '运营',
                    creator: 'USEA',
                    version: '1.0',
                    createTime: '2015-11-23 22:23:25'
                }];

                $scope.listVM.paginate = {
                    currentPage: p,
                    pageSize: 10,
                    totalItems: 335
                };
                $scope.listVM.processing = false;
            }, 1000);
        };
        paging(1);

        $scope.search = function() {
            $scope.listVM.paginate.currentPage = 1;
            paging(1);
        };


        $scope.pageChanged = function() {
            paging($scope.listVM.paginate.currentPage);
        };

        $scope.reset = function() {
            $scope.listVM.condition = {};
        };

        $scope.edit = function(id) {
            $state.go('test.edit', {
                id: id,
                condition: $scope.listVM.condition
            });
        };

        //
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker',
            showWeeks: false
        };
    }];
});
