define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'toaster', function($rootScope, $scope, $state, $stateParams, $timeout, toaster) {
        ph.mark($rootScope, {
            state: 'terminal.add',
            title: '添加管理'
        });

        $scope.terminalVM = {
            content: '<h1>那啥，这是内容</h1>',
            category: ''
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
                            $scope.terminalVM.category = categoryNamePath;
                            $scope.treeData.showTree = false;
                            //toggle有点变态
                            //临时方案，解决关闭toggle层
                            $(document).click();
                        });
                    }
                }
            },
            zNodes: [{
                id: 1,
                pId: 0,
                name: "普通的父节点",
                t: "我很普通，随便点我吧",
                open: false,
                isLeaf: false
            }, {
                id: 11,
                pId: 1,
                name: "叶子节点 - 1",
                t: "我很普通，随便点我吧",
                isLeaf: true
            }, {
                id: 12,
                pId: 1,
                name: "叶子节点 - 2",
                t: "我很普通，随便点我吧",
                isLeaf: true
            }, {
                id: 13,
                pId: 1,
                name: "叶子节点 - 3",
                t: "我很普通，随便点我吧",
                isLeaf: true
            }, {
                id: 2,
                pId: 0,
                name: "NB的父节点",
                t: "点我可以，但是不能点我的子节点，有本事点一个你试试看？",
                open: false,
                isLeaf: false
            }, {
                id: 21,
                pId: 2,
                name: "叶子节点2 - 1",
                t: "你哪个单位的？敢随便点我？小心点儿..",
                click: false,
                isLeaf: true
            }, {
                id: 22,
                pId: 2,
                name: "叶子节点2 - 2",
                t: "我有老爸罩着呢，点击我的小心点儿..",
                click: false,
                isLeaf: true
            }, {
                id: 23,
                pId: 2,
                name: "叶子节点2 - 3",
                t: "好歹我也是个领导，别普通群众就来点击我..",
                click: false,
                isLeaf: true
            }, {
                id: 3,
                pId: 0,
                name: "郁闷的父节点",
                t: "别点我，我好害怕...我的子节点随便点吧...",
                open: false,
                click: false,
                isLeaf: false
            }, {
                id: 31,
                pId: 3,
                name: "叶子节点3 - 1",
                t: "唉，随便点我吧",
                isLeaf: true
            }, {
                id: 32,
                pId: 3,
                name: "叶子节点3 - 2",
                t: "唉，随便点我吧",
                isLeaf: true
            }, {
                id: 33,
                pId: 3,
                name: "叶子节点3 - 3",
                t: "唉，随便点我吧",
                isLeaf: true
            }]
        };

        $scope.submit = function(valid) {
            toaster.pop('success', '保存成功');
        };

        //返回
        $scope.back = function() {
            $state.go('terminal.list', {
                condition: $stateParams.condition
            });
        };
    }];
});
