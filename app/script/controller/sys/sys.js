define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {
    	
    	$rootScope.crumbs = [];
    	ph.mark($rootScope, {
    		disabled: true,
            state: 'sys',
            title: '系统管理'
        });

    }];
});
