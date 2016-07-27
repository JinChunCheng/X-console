define(['common/path-helper'], function(ph) {
    return ['$rootScope', '$scope', function($rootScope, $scope) {

        ph.mark($rootScope, {
            state: 'pc.attribute.list',
            title: '属性列表'
        });

    }];
});
