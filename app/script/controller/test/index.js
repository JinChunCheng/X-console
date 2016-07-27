define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	$rootScope.crumbs = [];
        ph.mark($rootScope, {state: 'terminal.list', title: '终端管理'});
    }];
});
