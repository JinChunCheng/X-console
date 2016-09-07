define(['common/config', 'common/session'], function(config, session) {
    return ['$scope', '$state', '$location', '$timeout', '$http', 'toaster', function($scope, $state, $location, $timeout, $http, toaster) {

        $scope.loginVM = {
            processing: false,
            userName: session.getCookie('username') || ''
        };

        $scope.$on('$viewContentLoaded', function() {

            $(window).on('resize', function() {
                resizeBG();
            });

            function resizeBG() {
                var $ph = $('#page-signin-bg'),
                    $img = $ph.find('> img');
                $img.attr('style', '');
                if ($img.height() < $ph.height()) {
                    $img.css({
                        height: '100%',
                        width: 'auto'
                    });
                }
            }

            $timeout(function() {
                $(window).resize();
            }, 200);
        });


        $scope.login = function() {
            $scope.loginVM.processing = true;
            $http({
                url: config.OPERATION_CONSOLE + '/mgr/login',
                method: 'POST',
                data: {
                    userName: $scope.loginVM.userName,
                    password: $scope.loginVM.password
                }
            }).success(function(res) {
                if (res.code == 200) {
                    session.setTicket(res.data.token);
                    session.setCookie('username', $scope.loginVM.userName);
                    var user = { id: 1, name: $scope.loginVM.userName };
                    session.rememberLoginUser(user);
                    //广播到父级控制器做相关处理
                    $scope.$emit('login', user);
                    $state.go('dashboard');
                }
                else {
                    toaster.pop('error', res.msg);
                }
                $scope.loginVM.processing = false;

            }).error(function(err) {
                toaster.pop('error', '服务器连接失败，请联系管理员！')
                $scope.loginVM.processing = false;

            });
            // $timeout(function() {
            //     session.setCookie('username', $scope.loginVM.name);
            //     var user = { id: 1, name: $scope.loginVM.name };
            //     session.rememberLoginUser(user);
            //     //广播到父级控制器做相关处理
            //     $scope.$emit('login', user);
            //     $state.go('dashboard');
            // }, 500);
        };
    }];
});
