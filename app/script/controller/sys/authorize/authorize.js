define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {

        ph.mark($rootScope, {
            state: 'sys.authorize.list',
            title: '授权列表'
        });

    }];
});
