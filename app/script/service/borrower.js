define([], function(config) {
    return ['borrowerService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.BORROWER_CONSOLE + '/hzq/project/:id'
        var borrowerRes = $resource('script/data/borrower-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return borrowerRes;

        var borrowerDetail = $resource('http://172.21.20.8:8080/borrower/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var borrowerDetailTable = $resource('http://172.21.20.8:8080/borrower/list_account', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var borrowerListTable = $resource('http://172.21.20.8:8080/borrower/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var createBorrower = $resource('http://172.21.20.8:8080/borrower/account', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });
        var updateBorrower = $resource('http://172.21.20.8:8080/borrower/account', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var borrowerRepaymentList = $resource('http://172.21.20.8:8080/borrower/repayment/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var borrowerRepaymentDetail = $resource('http://172.21.20.8:8080/borrower/repayment', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {
            resource: borrowerRes,
            //借款人详情label
            borrowerDetail:borrowerDetail,
            //借款人详情table
            borrowerDetailTable:borrowerDetailTable,
            //借款人列表
            borrowerListTable:borrowerListTable,
            //新增借款人接口
            createBorrower:createBorrower,
            //修改借款人信息
            updateBorrower:updateBorrower,
            //借款人还款列表
            borrowerRepaymentList:borrowerRepaymentList,
            //借款人还款详情label
            borrowerRepaymentDetail:borrowerRepaymentDetail,

            /**
             * get borrower list
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
                return borrowerRes.query(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            save: function(params) {
                return borrowerRes.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return borrowerRes.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
        }
    }]]
});
