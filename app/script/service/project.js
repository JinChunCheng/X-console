define(['common/config'], function(config) {
    return ['projectService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var projectResource = $resource(config.RPOJECT_CONSOLE + '/hzq/project/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var checkResource = $resource(config.RPOJECT_CONSOLE + '/check/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            project: projectResource,
            check: checkResource
        }
    }]]
});