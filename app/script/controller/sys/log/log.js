define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {
    	
    	    ph.mark($rootScope, {
            state: 'sys.log.list',
            title: '日志列表'
        });

    }];
});
