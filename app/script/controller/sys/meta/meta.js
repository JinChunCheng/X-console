define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {

        ph.mark($rootScope, {
            state: 'sys.meta.list',
            title: '元数据列表'
        });

    }];
});
