define([], function(config) {
    return ['assetService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var channelResource = $resource('http://172.21.1.205', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            channel: channelResource
        }
    }]]
});
