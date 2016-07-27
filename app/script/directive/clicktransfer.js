define([], function() {
    // 点击元素触发另外元素的点击事件，用于图片上传 ，需要制定target 属性
    return ['clicktransfer', [function() {
        return {
            restrict: 'A', 
            link: function(scope, el, attrs) {                
                el.bind('click', function() {                 
                    $("#"+attrs.target).click();                   
                });
            }
        }
    }]];
});
