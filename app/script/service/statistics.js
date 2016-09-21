define(['common/config'], function(config) {
    return ['statisticsService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var userResource = $resource(config.INVESTMENT_CONSOLE + '/investment/report/statistics', null, { 'query': { isArray: false } });
        //var userResource = $resource('http://172.21.20.16:8088/investment/report/statistics', null, { 'query': { isArray: false } });
        return {
            findProfit: function(start, end) {
                return $http({
                        method: "GET",
                        url: config.REPORTS_CONSOLE + "/reports/profit/date/" + start + "/" + end
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
            findUser: function(start, end) {
                return userResource.query({ where: JSON.stringify({ data: { createDatetimeStart: start, createDatetimeEnd: end } }) }).$promise;
            }
        }
    }]]
});
