define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    	$rootScope.crumbs = [];
    	ph.mark($rootScope, {
    		disabled: true,
            state: 'logistics',
            title: '物流管理'
        });

    }];
});
