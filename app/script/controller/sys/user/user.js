define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {
    	
    	    ph.mark($rootScope, {
            state: 'sys.user',
            title: '用户管理'
        });

    }];
});
