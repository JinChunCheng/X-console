define(['common/path-helper'],function(pathHelper){
    return ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

        $rootScope.crumbs = [];
        pathHelper.mark($rootScope, {
            disabled: true,
            state: 'order',
            title: '订单管理'
        });

    }];
});