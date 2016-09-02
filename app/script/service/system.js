define(['common/config'], function(config) {
    return ['systemService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '����������ʧ�ܣ���������Ƿ���û���ϵ����Ա��'
        };
        var systemResource = $resource('/script/data/borrower-list.json', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var systemResource = $resource(config.RPOJECT_CONSOLE + '', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var checkResource = $resource(config.RPOJECT_CONSOLE + '/hzq/project/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            system: systemResource,
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


