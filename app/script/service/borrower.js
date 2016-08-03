define([], function() {
    return ['borrowerService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {

            /**
             * get borrower list
             * @param  {string} data 
             */
            get: function(data) {
                return $http({
                        url: config.pc_domain + '/esin/cacheEsin',
                        method: 'POST',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

        }
    }]]
});
