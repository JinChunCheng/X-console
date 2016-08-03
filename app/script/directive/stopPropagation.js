define([], function() {
    return ['stopPropagation', [function() {
        return {
            restrict: 'AC',
            link: function(scope, element, attrs) {
                $(element).on('click', function(event) {
                    event.stopPropagation();
                });
            }
        };
    }]];
});
