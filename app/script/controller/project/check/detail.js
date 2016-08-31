define([], function() {
    return ['$scope', '$state', '$stateParams',  'projectService',
        function($scope, $state, $stateParams, projectService) {
        $scope.vm = {
            data: {},
            cancel: function() {
                $state.go('project.check.check');
            },
            status:{},
            project_id:{},
            pass:function(){
                    alert("aa");
                //$state.go('project.check.check');
            },
            refuse:function(){
                alert('bb');
                //$state.go('project.check.check');
            }
        };


        function getDetail(id) {
            projectService.project.get({ id: id }).$promise.then(function(res) {
                $scope.vm.data = res.data;
            });
        }
        getDetail($stateParams.id);

    }];
});

