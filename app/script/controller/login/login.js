define(['common/config', 'common/session'], function(config, session) {
    return ['$scope', '$state', '$location', '$timeout', '$http', 'toaster', function($scope, $state, $location, $timeout, $http, toaster) {

        $scope.loginVM = {
            processing: false,
            userName: session.getCookie('username') || '',
            inputChanged: function() {
                $scope.loginVM.msg = '';
            }
        };

        $scope.$on('$viewContentLoaded', function() {
            var imgWidth = 3000;
            var imgHeight = 2008;
            var imgWHPercent = imgWidth / imgHeight;

            $(window).on('resize', function() {
                resizeBG();
            });

            function resizeBG() {
                var $ph = $('#page-signin-bg'),
                    $img = $ph.find('> img');

                var pageHeight = $ph.height();
                var pageWidth = $ph.width();

                $img.attr('style', '');

                if (imgWHPercent < pageWidth / pageHeight) {
                    $img.css({
                        height: 'auto',
                        width: '100%'
                    });
                } else {
                    $img.css({
                        height: '100%',
                        width: 'auto'
                    });
                }

                // if ($img.height() < $ph.height()) {
                //     $img.css({
                //         height: '100%',
                //         width: 'auto'
                //     });
                // }
            }

            $timeout(function() {
                $(window).resize();
            }, 200);
        });


        $scope.login = function() {
            session.deleteTicket();
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
                    var user = { name: res.data.name };
                    session.rememberLoginUser(user);
                    //广播到父级控制器做相关处理
                    $scope.$emit('login', user);
                    $state.go('dashboard');
                } else {
                    //toaster.pop('error', res.msg);
                    $scope.loginVM.msg = res.msg;
                }
                $scope.loginVM.processing = false;

            }).error(function(err) {
                //toaster.pop('error', '服务器连接失败，请联系管理员！');
                $scope.loginVM.msg = '服务器连接失败，请联系管理员！';
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
