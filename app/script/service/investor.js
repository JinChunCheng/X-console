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
        var updateInvestorDetail = $resource('http://172.21.20.12:8080/investor/getInvestorById/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var updateInvestor = $resource('http://172.21.20.12:8080/investor/editInvestor/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //新增投资人信息
        var createInvestor = $resource('http://172.21.20.12:8080/investor/register', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });
        //投资人修改审核
        var investorCheckTable = $resource('http://172.21.20.12:8080/investorUpdate/list', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });
       //银行账号获取银行名称
        var getBankName = $resource('http://172.21.20.8:8088/bank/card/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });



        //投标列表
        var investorList = $resource('http://172.21.20.12:8080/investor/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //投资人银行账户列表
        var bankListTable=$resource('http://172.21.20.12:8080/investor/getInvestorBankCard/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //新增投资人银行信息
        var createBankAcc=$resource('http://172.21.20.12:8080/investor/addInvestorBank', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });

        var tenderList = $resource('http://172.21.20.13:8080/bidding/allList', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var tenderDetail = $resource('http://172.21.20.13:8080/bidding/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //投资列表
        var infoList=$resource('http://172.21.20.16:8080/investment/allList', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var infoDetail=$resource('http://172.21.20.16:8080/investment/4755', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });

        return {
            resource: investorRes,
            //投标人列表
            investorListTable:investorListTable,
            investorDetailLabel:investorDetailLabel, 
            investorDetailTable:investorDetailTable,
            updateInvestorDetail:updateInvestorDetail,
            getBankName:getBankName,
            updateInvestor:updateInvestor,
            createInvestor:createInvestor,
            bankListTable:bankListTable,
            createBankAcc:createBankAcc,
            //投资人修改审核
            investorCheckTable:investorCheckTable,
            tenderList:tenderList,
            tenderDetail:tenderDetail,
            infoList:infoList,
            infoDetail:infoDetail,
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
            },
            investorUpdate: function(data) {
                return $http({
                        method: 'POST',
                        url: 'http://172.21.20.12:8080/investor/editInvestor',
                       
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
            checkAccept: function(ids) {
                return $http({
                    method: 'PUT',
                    url: 'http://172.21.20.13:8080/cashout/project/accept/' + ids
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
            getUpdateInvestor: function(id) {
                return $http({
                    method: 'GET',
                    url: 'http://172.21.20.12:8080/investorUpdate/getByInvestorUpdateId/' + id
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
            approvalInvestor: function(id) {
                return $http({
                    method: 'GET',
                    url: 'http://172.21.20.12:8080/investorUpdate/approveInvestorUpdate/' + id
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
                });
            },
            rejectInvestor: function(id) {
                return $http({
                    method: 'GET',
                    url: 'http://172.21.20.12:8080/investorUpdate/rejectInvestorUpdate/' + id
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
                    });
            }
        }
    }]]
});
