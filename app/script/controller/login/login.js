define(['common/session'], function(session) {
    return ['$scope', '$state', '$location', '$timeout', function($scope, $state, $location, $timeout) {

        $scope.loginVM = {
        	processing: false,
            name: session.getCookie('username') || ''
        };

        $scope.$on('$viewContentLoaded', function() {
            var $ph = $('#page-signin-bg'),
                $img = $ph.find('> img');

            resizeBG();

            $(window).on('resize', function() {
                resizeBG();
            });

            function resizeBG() {
                $img.attr('style', '');
                if ($img.height() < $ph.height()) {
                    $img.css({
                        height: '100%',
                        width: 'auto'
                    });
                }
            }
        });


        $scope.login = function() {
            $scope.loginVM.processing = true;
            $timeout(function() {
                session.setCookie('username', $scope.loginVM.name);
            	var user = {id: 1, name: $scope.loginVM.name };
            	session.rememberLoginUser(user);
                //广播到父级控制器做相关处理
                $scope.$emit('login', user);
                $state.go('dashboard');
            }, 500);
        };
    }];
});