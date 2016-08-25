define(['common/config'], function(config) {
    return ['assetService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var channelResource = $resource(config.ASSET_CONSOLE + '/assetchannel/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var assetResource = $resource(config.ASSET_CONSOLE + '/asset/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            channel: channelResource,
            asset: assetResource,
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
            },
            findAsset: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.ASSET_CONSOLE + '/asset/list',
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
