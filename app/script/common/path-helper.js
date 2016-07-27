define([], function() {
    return {
        mark: function($scope, data) {
            if ($scope.crumbs) {
                $scope.crumbs.forEach(function(item, index) {
                    if(item.state == data.state) {
                        $scope.crumbs.splice(index);
                        return;
                    }
                });
                $scope.crumbs.push(data);
            }
        }
    };
});
