define(['common/config'], function(config) {
    return ['projectService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        var checkResource = $resource('http://172.21.1.205:8090/console-product-hzq', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            check: checkResource,
        }
    }]]
});
