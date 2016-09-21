define(['common/config'], function(config) {
    return ['fundService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.fund_CONSOLE + '/hzq/project/:id'
        var fundRes = $resource('script/data/fund-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return fundRes;

        var chargeListTable = $resource(config.RECHARGE_CONSOLE + '/recharge/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var chargeDetailLabel = $resource(config.RECHARGE_CONSOLE + '/recharge/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawListTable = $resource(config.WITHDRAW_CONSOLE + '/withdraw/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawDetailLabel = $resource(config.WITHDRAW_CONSOLE + '/withdraw/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawBackLabel = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckTable = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/fallback/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckOneDetail = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/fallback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //费率列表
        var rateListTable = $resource(config.METADATA_CONSOLE + '/rate/ShowRatelist', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var getRateDetail=$resource(config.METADATA_CONSOLE + '/rate/getRateByRateId/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var updateRate=$resource(config.METADATA_CONSOLE + '/rate/editRate', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var createRate=$resource(config.METADATA_CONSOLE + '/rate/addRate', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        
        //提现审核
        var withdrawCheckTable = $resource(config.WITHDRAW_CONSOLE + '/withdraw/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

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
            backCheckTable: backCheckTable,
            //回退审核One
            backCheckOneDetail: backCheckOneDetail,
            //费率
            rateListTable: rateListTable,
            getRateDetail:getRateDetail,
            updateRate:updateRate,
            createRate:createRate,
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
            },
            //回退审核(单一审核，批准、拒绝)
            fallbackCheckOne: function(data, method) {
                return $http({
                        method: method,
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        //url: config.WITHDRAW_CONSOLE + '/withdrawback/fallback/one',
                        url: 'http://172.21.20.8:8080/withdrawback/fallback/one'
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
            //回退审核(批量审核，批准、拒绝)
            fallbackCheckRows: function(data, method) {
                return $http({
                        method: method,
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        //url: config.WITHDRAW_CONSOLE + '/withdrawback/fallback/batch',
                        url: 'http://172.21.20.8:8080/withdrawback/fallback/batch'

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
            //回退申请
            fallbackApply: function(data, method) {
                return $http({
                        method: method,
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        url: config.WITHDRAW_CONSOLE + '/withdrawback/fallback',
                        // url:'http://172.21.20.8:8080/withdrawback/fallback'

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
            //提现审核
            refuseWithdraw: function(data) {
                return $http({
                        method: "POST",
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

                        url: config.WITHDRAW_CONSOLE + "/withdraw/reject",

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
            approveWithdraw: function(data) {
                return $http({
                        method: "POST",
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

                        url: config.WITHDRAW_CONSOLE + "/withdraw/approve",

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
        }
    }]]
});
