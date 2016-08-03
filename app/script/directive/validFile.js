define([], function() {
    // 数组[0]是指令的名字，数组[1][0]是需注入服务的全称,数组[1][1]是构造函数
    return ['validFile', [function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attrs, ngModel) {
                //change event is fired when file is selected
                el.bind('change', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
                });
            }
        }
    }]];
});
