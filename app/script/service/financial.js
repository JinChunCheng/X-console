define(['common/config'], function(config) {
    return ['financialService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //var channelResource = $resource(config.FINANCIAL_CONSOLE + '/financialchannel/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var financialResource = $resource(config.FINANCIAL_CONSOLE + '/financial/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawCashTable = $resource('http://172.21.20.13:8080/cashout/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var withdrawCashTable = $resource('http://172.21.20.12:8080/investor/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            withdrawCashTable:withdrawCashTable,
            findChannel: function(condition) {
                return $http({
                    method: 'POST',
                    url: config.FINANCIAL_CONSOLE + '/financialchannel/list',
                    data: condition
                })
                    .then(function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        return $q.reject(errResp);
                    }
                );
            },
            findFinancial: function(condition) {
                return $http({
                    method: 'POST',
                    url: config.FINANCIAL_CONSOLE + '/financial/list',
                    data: condition
                })
                    .then(function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        return $q.reject(errResp);
                    }
                );
            }
        }
    }]]
});
