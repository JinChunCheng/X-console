define(['common/session', 'service/config', 'common/path-helper'], function(session, config, ph) {
    return ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'toaster', function($rootScope, $scope, $state, $stateParams, $http, toaster) {

        ph.mark($rootScope, {
            state: 'pc.product.batch-upload',
            title: '批量上传'
        });

        $scope.vm = {
        	uploading: false,
            filePath:'D:/images/',
            uploadType:'1',
            codePrefix:'PBU'
        };

        $scope.batchUpload = function() {
        	$scope.vm.uploading = true;
            var paramJsonObj = {
                "filePath":$scope.vm.filePath,
                "uploadType":$scope.vm.uploadType,
                "codePrefix":$scope.vm.codePrefix
            };
            $http({
                    method: 'POST',
                    data:JSON.stringify(paramJsonObj),
                    url: config.pc_domain + '/img/localUpload'
                })
                .success(function(res) {
                    if (res && res.status == 200) {
                        toaster.pop('success', '成功!');
                    } else {
                        toaster.pop('success', (res && res.msg) ? res.msg : '上传失败！');
                    }
                    $scope.vm.uploading = false;
                })
                .error(function(res) {
                	toaster.pop('error', (res && res.msg) ? res.msg : '访问服务器异常！');
                    $scope.vm.uploading = false;
                });
        };

    }];
});
