define(['common/path-helper', 'common/session'], function(ph, session) {
    return ['$rootScope', '$scope', 'sysService', 'toaster', function($rootScope, $scope, sysService, toaster) {

        ph.mark($rootScope, {
            state: 'my.password',
            title: '修改密码'
        });

        $scope.pwdVM = {
            title: '修改密码',
            data: {
                id: session.getLoginUserInfo().id
            }
        };

        /**
         * save my password
         * @param  {bool} valid [if form is valid]
         */
        $scope.save = function(valid) {
            $scope.pwdVM.submitted = true;
            if (!valid || !verify())
                return false;

            $scope.pwdVM.saving = true;
            sysService.changePsw($scope.pwdVM.data).then(function(res) {
                if (res && res.status == 200 && res.items == true) {
                    toaster.pop('success', '密码修改成功！');
                    resetForm();
                } else
                    toaster.pop('error', res.msg);
                $scope.pwdVM.saving = false;
            }, function(err) {
                $scope.pwdVM.saving = false;
            });
        };

        /**
         * verify password form is valid or not
         * @return {[type]} [description]
         */
        var verify = function() {
            if ($scope.pwdVM.data.newPsd != $scope.pwdVM.data.confirmPsw) {
                return false;
            }
            return true;
        };

        $scope.confirmPswValid = function() {
            return $scope.pwdVM.data.newPsd == $scope.pwdVM.data.confirmPsw;
        };


        //重置表单
        var resetForm = function() {
            $scope.pwdVM.data = {
                id: session.getLoginUserInfo().id
            };
            $scope.pwdform.$setPristine();
            $scope.pwdVM.submitted = false;
        };

    }];
});
