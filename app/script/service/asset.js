define(['common/config'], function(config) {
    return ['assetService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var channelResource = $resource(config.ASSET_CONSOLE + '/assetchannel', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            channel: channelResource,
            findChannel: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.ASSET_CONSOLE + '/assetchannel/list',
                        data: condition
                    })
                    .then(function(resp) {
                            if (resp) {
                                return resp.data;
                            } else {
                                return serverErrorData;
                            }
                        },
                        function(errResp) {
                            return $q.reject(errResp);
                        }
                    );
            }
        }
    }]]
});
