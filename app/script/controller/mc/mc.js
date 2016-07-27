/**
 * Created by lenovo711 on 2015/12/24.
 */
define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

        $rootScope.crumbs = [];
        ph.mark($rootScope, {
            disabled: true,
            state: 'mc',
            title: '商品中心'
        });

    }];
});