define(['ztree/jquery.ztree.all-3.5.min'], function() {
    return ['zTree', ['$timeout', '$parse',
        function($timeout, $parse) {
            return {
                restrict: 'A',
                scope: true,
                link: function(scope, element, attrs, ngModel) {
                    var setting = $parse(attrs.setting)(scope.$parent);
                    var nodes = $parse(attrs.zNodes)(scope.$parent);

                    $timeout(function() {
                        $.fn.zTree.init(element, setting, nodes);
                    });
                }
            }
        }
    ]];
});
