define(['common/session', 'service/config'], function(session, config) {
    return ['$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
        //面包屑
        $rootScope.crumbs = [];
    }]
});
