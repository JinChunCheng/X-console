define(['common/config'], function(config) {
    return ['statisticsService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        return {
            findProfit: function(start, end) {
                return $http({
                        method: "POST",
                        url: "http://172.21.20.13:8080/reports/profit/date/" + start + "/" + end
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
