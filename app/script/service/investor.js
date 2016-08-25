define([], function(config) {
    return ['investorService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.investor_CONSOLE + '/hzq/project/:id'
        var investorRes = $resource('script/data/investor-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return investorRes;

        var investorListTable = $resource('http://172.21.20.12:8080/investor/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var investorDetailLabel = $resource('http://172.21.20.12:8080/investor/getInvestorDetailsById/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        
        var investorDetailTable = $resource('http://172.21.20.12:8080/investor/getAccountLogByAccountNo', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //修改投资人信息
        var updateInvestor = $resource('http://172.21.20.12:8080/investor/getInvestorByInvestorId/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //新增投资人信息
        var createInvestor = $resource('http://172.21.20.12:8080/investor/', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });

        return {
            resource: investorRes,
            //借款人列表
            investorListTable:investorListTable,
            investorDetailLabel:investorDetailLabel,
            investorDetailTable:investorDetailTable,
            updateInvestor:updateInvestor,
            createInvestor:createInvestor,
            /**
             * get investor list
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
                return investorRes.query(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            save: function(params) {
                return investorRes.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return investorRes.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
        }
    }]]
});
