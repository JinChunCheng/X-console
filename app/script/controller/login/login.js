define(['common/session', 'service/config', 'jquery'], function(session, config, $) {
    return ['$scope', '$state', '$stateParams', '$timeout', '$http', function($scope, $state, $stateParams, $timeout, $http) {
        //到登录页后先注销
        session.logout();

        //用户信息
        $scope.loginUser = session.getLoginUserInfo() || {};
        $scope.loginVM = {
            processing: false,
            authError: '',
            data: {
                username: $scope.loginUser.loginName,
                rememberMe: '1'
            }
        };

        $scope.login = function(valid) {
            if (!valid || $scope.loginVM.processing)
                return false;
            $scope.loginVM.authError = '';
            $scope.loginVM.processing = true;

            $http({
                    url: config.sys_domain + '/login',
                    //url: 'http://10.100.21.196:9993/mgr-sys/login',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $scope.loginVM.data,
                    transformRequest: function(data, headeres) {
                        if (data === undefined) {
                            return data;
                        }
                        return $.param(data);
                    }
                })
                .success(function(res) {
                    if (res && res.status == 200 && res.header && res.data) {
                        //广播到父级控制器做相关处理
                        $scope.$emit('login', res.data);
                        var returnUrl = $stateParams.r || '';
                        location.href = returnUrl;

                    } else {
                        $scope.loginVM.authError = (res && res.msg) ? res.msg : '登录失败，请重试！';
                        $scope.loginVM.processing = false;
                    }
                })
                .error(function(res) {
                    $scope.loginVM.authError = '登录出错，请联系管理员！';
                    $scope.loginVM.processing = false;
                });
        };
    }];
});
