define([], function() {
    // 数组[0]是指令的名字，数组[1][0]是需注入服务的全称,数组[1][1]是构造函数
    return ['errorSrc', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ngModelController) {
                element.bind('error', function() {
                    angular.element(this).attr("src", attrs.errorSrc);
                    //in case of drop-dead halt
                    element.unbind('error');
                });
            }
        };
    }]];
});
