define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', 'terminalService', function($rootScope, $scope, $state, terminalService) {
    	$rootScope.crumbs = [];
    }];
});
