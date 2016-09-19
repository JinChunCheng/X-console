define(['common/config'], function(config) {
    return ['investorService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.investor_CONSOLE + '/hzq/project/:id'
        var investorRes = $resource('script/data/investor-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return investorRes;

        var investorListTable = $resource(config.INVESTOR_CONSOLE + '/investor/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var investorDetailLabel = $resource(config.INVESTOR_CONSOLE + '/investor/getInvestorDetailsById/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });

        var investorDetailTable = $resource(config.INVESTOR_CONSOLE + '/investor/getAccountLogByAccountNo', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //修改投资人信息
        var updateInvestorDetail = $resource(config.INVESTOR_CONSOLE + '/investor/getInvestorById/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var updateInvestor = $resource(config.INVESTOR_CONSOLE + '/investor/editInvestor/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //新增投资人信息
        var createInvestor = $resource(config.INVESTOR_CONSOLE + '/investor/register', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });
        //投资人修改审核
        var investorCheckTable = $resource(config.INVESTOR_CONSOLE + '/investorUpdate/list', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });

        //银行账号获取银行名称
        var getBankName = $resource(config.METADATA_CONSOLE + '/bank/card/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });



        //投标列表
        var investorList = $resource(config.INVESTOR_CONSOLE + '/investor/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //投资人银行账户列表
        var bankListTable = $resource(config.INVESTOR_CONSOLE + '/investor/getInvestorBankCard/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //新增投资人银行信息
        var createBankAcc = $resource(config.INVESTOR_CONSOLE + '/investor/addInvestorBank', { id: "@id" }, { 'query': { isArray: false }, 'save': { method: 'POST' } });
        //投标列表
        var tenderList = $resource(config.PURCHASE_CONSOLE + '/bidding/allList', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var tenderDetail = $resource(config.PURCHASE_CONSOLE + '/bidding/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var tenderCancel = $resource(config.PURCHASE_CONSOLE + '/bidding/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //投资列表
        var infoList = $resource(config.INVESTMENT_CONSOLE + '/investment/allList', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var infoDetail = $resource(config.INVESTMENT_CONSOLE + '/investment/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //var infoRepayList = $resource(config.INVESTMENT_CONSOLE + '/investment/getRepaymentPlanById', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        var infoRepayList = $resource(config.INVESTMENT_CONSOLE +'/investment/getRepaymentPlanList', null, { 'query': { isArray: false }, 'update': { method: 'GET' } });

        return {
            resource: investorRes,
            //投标人列表
            investorListTable: investorListTable,
            investorDetailLabel: investorDetailLabel,
            investorDetailTable: investorDetailTable,
            updateInvestorDetail: updateInvestorDetail,
            getBankName: getBankName,
            updateInvestor: updateInvestor,
            createInvestor: createInvestor,
            bankListTable: bankListTable,
            createBankAcc: createBankAcc,
            //投资人修改审核
            investorCheckTable: investorCheckTable,
            tenderList: tenderList,
            tenderDetail: tenderDetail,
            tenderCancel:tenderCancel,
            infoList: infoList,
            infoDetail: infoDetail,
            infoRepayList: infoRepayList,
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
                        url: config.INVESTOR_CONSOLE + '/investor/editInvestor',

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
                        url: config.CASHOUT_CONSOLE + '/cashout/project/accept/' + ids
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
            finishCancel:function(id, id1, id2){
                return $http({
                    method: 'PUT',
                    url: config.PURCHASE_CONSOLE + '/bidding/undoBidding/' + id + '/'+id1 + '/' + id2
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
                        url: config.INVESTOR_CONSOLE + '/investorUpdate/getByInvestorUpdateId/' + id
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
                        url: config.INVESTOR_CONSOLE + '/investorUpdate/approveInvestorUpdate/' + id
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
                        url: config.INVESTOR_CONSOLE + '/investorUpdate/rejectInvestorUpdate/' + id
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
            repayList: function(id) {
                return $http({
                        method: 'GET',
                        url: config.INVESTMENT_CONSOLE + '/investment/getRepaymentPlanList'
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
