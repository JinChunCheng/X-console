define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {

        ph.mark($rootScope, {
            state: 'sys.permission.list',
            title: '权限管理列表'
        });

    }];
});
