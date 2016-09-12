define(['common/config'], function(config) {
    return ['fundService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //config.fund_CONSOLE + '/hzq/project/:id'
        var fundRes = $resource('script/data/fund-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return fundRes;

        var chargeListTable = $resource(config.RECHARGE_CONSOLE + '/recharge', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var chargeDetailLabel = $resource(config.RECHARGE_CONSOLE + '/recharge/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawListTable = $resource(config.WITHDRAW_CONSOLE + '/withdraw/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawDetailLabel = $resource(config.WITHDRAW_CONSOLE + '/withdraw/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var withdrawBackLabel = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckTable = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/fallback/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var backCheckOneDetail = $resource(config.WITHDRAW_CONSOLE + '/withdrawback/fallback/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

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
            //回退审核
            batchUpdatePlatform: function(data, method) {
                return $http({
                        method: method,
                        data: data,
                        //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        url: config.WITHDRAW_CONSOLE + '/withdrawback/fallback/batch',

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
            refuseCheckRows: function(data) {
                return $http({
                        method: 'POST',
                        data: $.param(data),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        url: config.WITHDRAW_CONSOLE + '/withdrawback/fallback/batch',

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
