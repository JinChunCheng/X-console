define(['common/config'], function(config) {
    return ['systemService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        //var systemResource = $resource('/script/data/borrower-list.json', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var systemResource = $resource(config.OPERATION_CONSOLE + '/mgr/operator', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //var systemResource = $resource(config.RPOJECT_CONSOLE + '', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var checkResource = $resource(config.RPOJECT_CONSOLE + '/hzq/project/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });\
        var systemDetail = $resource(config.OPERATION_CONSOLE + '/mgr/operator/:id', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //修改
        var updateDetail = $resource(config.OPERATION_CONSOLE + '/mgr/operator/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var updateSystem = $resource(config.OPERATION_CONSOLE + '/mgr/operator/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //新增
        var createSystem = $resource(config.OPERATION_CONSOLE + '/mgr/operator',null, { 'query': { isArray: false }, 'save': { method: 'POST' } });
        return {
            system: systemResource,
            systemDetail: systemDetail,
            updateDetail: updateDetail,
            updateSystem: updateSystem,
            createSystem: createSystem,
            updateSystemDetail: function(id) {
                return $http({
                        method: 'GET',
                        url: config.OPERATION_CONSOLE + '/mgr/operator/' + id
                    })
                    .then(function(res) {
                            if (res) {
                                return res.data;

                            } else {
                                return serverErrorData;
                            }
                        },
                        function(errRes) {
                            return $q.reject(errRes);
                        }
                    );
            },
            save: function(params) {
                return systemResource.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return systemResource.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
        }
    }]]

});
