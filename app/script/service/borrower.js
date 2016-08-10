define([], function(config) {
    return ['borrowerService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.BORROWER_CONSOLE + '/hzq/project/:id'
        var borrowerRes = $resource('script/data/borrower-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return borrowerRes;

        // return {
        //     /**
        //      * get borrower list
        //      * @param  {string} data 
        //      */
        //     query: function(data) {
        //         return $http({
        //                 url: 'script/data/data1.json',
        //                 method: 'GET',
        //                 data: data
        //             })
        //             .then(function(res) {
        //                 return res ? res.data : serverErrorData;
        //             }, function(res) {
        //                 return $q.reject(res);
        //             });
        //     },
        //     getAll: function(params) {
        //         return borrowerRes.query(params).$promise
        //             .then(function(res) {
        //                 return res ? res : serverErrorData;
        //             }, function(res) {
        //                 return $q.reject(res);
        //             });
        //     },
        //     save: function(params) {
        //         return borrowerRes.save(params).$promise
        //             .then(function(res) {
        //                 return res ? res : serverErrorData;
        //             }, function(res) {
        //                 return $q.reject(res);
        //             });
        //     },
        //     update: function(params) {
        //         return borrowerRes.put(params).$promise
        //             .then(function(res) {
        //                 return res ? res : serverErrorData;
        //             }, function(res) {
        //                 return $q.reject(res);
        //             });
        //     }
        // }
    }]]
});
