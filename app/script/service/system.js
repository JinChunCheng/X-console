define(['common/config'], function(config) {
    return ['systemService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        //var systemResource = $resource('/script/data/borrower-list.json', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var systemResource = $resource('http://172.21.20.17:8083/mgr/operator', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //var systemResource = $resource(config.RPOJECT_CONSOLE + '', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var checkResource = $resource(config.RPOJECT_CONSOLE + '/hzq/project/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });\
        var systemDetail = $resource('http://172.21.20.17:8083/mgr/operator/:id', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        return {
            system: systemResource,
            systemDetail:systemDetail,
            /*finishAudit: function(data) {
                return $http({
                    method: 'POST',
                    url: config.RPOJECT_CONSOLE + '/hzq/project/audit',
                    data: data
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
            }*/
        }
    }]]

});


