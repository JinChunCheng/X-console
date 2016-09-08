define(['common/config'], function(config) {
    return ['accountService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var accountList = $resource(config.CAPITAL_ACCOUNT_CONSOLE + '/capitalAccount/findAll', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var accountDetailLabel = $resource(config.CAPITAL_ACCOUNT_CONSOLE + '/capitalAccount/getById/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var accountDetailTable = $resource(config.CAPITAL_ACCOUNT_CONSOLE + '/capitalAccountLog/findAll', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var accountListUpdate = $resource(config.CAPITAL_ACCOUNT_CONSOLE + '/capitalAccount/editCapitalAccount', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var accountQueryList = $resource(config.CAPITAL_ACCOUNT_CONSOLE + '/capitalAccountLog/findAll', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            //
            accountList: accountList,
            //
            accountDetailLabel: accountDetailLabel,
            //
            accountDetailTable: accountDetailTable,
            //
            accountListUpdate: accountListUpdate,
            //
            accountQueryList: accountQueryList,


            /**
             * get account list
             * @param  {string} data 
             */
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
                return accountRes.query(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            save: function(params) {
                return accountRes.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return accountRes.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
        }
    }]]
});
