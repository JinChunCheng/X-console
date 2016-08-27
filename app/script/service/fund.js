define([], function(config) {
    return ['fundService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.fund_CONSOLE + '/hzq/project/:id'
        var fundRes = $resource('script/data/fund-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return fundRes;

        var chargeListTable = $resource('http://172.21.20.16:8080/recharge', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var chargeDetailLabel = $resource('http://172.21.20.16:8080/recharge/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawListTable = $resource('http://172.21.20.13:8080/withdraw/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawDetailLabel = $resource('http://172.21.20.13:8080/withdraw/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawBackLabel = $resource('http://172.21.20.8:8080/withdrawback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckTable = $resource('http://172.21.20.8:8080/withdrawback/fallback/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckOneDetail = $resource('http://172.21.20.8:8080/withdrawback/fallback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            resource: fundRes,
            //充值列表
            chargeListTable: chargeListTable,
            chargeDetailLabel: chargeDetailLabel,
            //提现列表
            withdrawListTable: withdrawListTable,
            withdrawDetailLabel: withdrawDetailLabel,
            //提现回退
            withdrawBackLabel: withdrawBackLabel,
            //回退审核Table
            backCheckTable:backCheckTable,
            //回退审核One
            backCheckOneDetail:backCheckOneDetail,
            query: function(data) {
                return $http({
                        url: 'script/data/data1.json',
                        method: 'GET',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            getAll: function(params) {
                return fundRes.query(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            save: function(params) {
                return fundRes.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return fundRes.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
        }
    }]]
});
