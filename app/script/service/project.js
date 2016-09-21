define(['common/config'], function(config) {
    return ['projectService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var projectResource = $resource(config.RPOJECT_CONSOLE + '/hzq/project/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var repaymentResource = $resource(config.RPOJECT_CONSOLE + '/hzq/projectRepaymentPlan/allList', null, { 'query': { isArray: false } });
        //var repaymentResource = $resource('http://172.21.20.16:8083/hzq/projectRepaymentPlan/allList', null, { 'query': { isArray: false } });
        return {
            project: projectResource,
            repayment: repaymentResource,
            finishAudit: function(data) {
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
            }
        }
    }]]

});
