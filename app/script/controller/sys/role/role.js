define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {
    	
    	    ph.mark($rootScope, {
            state: 'sys.role',
            title: '角色管理'
        });

    }];
});
