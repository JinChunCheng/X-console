define(['common/config'], function(config) {
    return ['financialService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        //提现出款
        var withdrawCashTable = $resource('http://172.21.20.13:8080/cashout/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //满标出款
        var endBiddingCashTable = $resource('http://172.21.20.13:8080/cashout/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
       //出款指令列表
        var cashDirectiveTable = $resource('http://172.21.20.13:8080/cashout/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var cashDetailsTable = $resource('http://172.21.20.13:8080/cashout/:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //划款打印
        var transferCashPrintTable = $resource('http://172.21.20.12:8080/capitalAccountRemitePrint/showCapitalAccountRemiteList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'GET' } });
        //提现出款监控
        var withdrawCashMonitorTable = $resource('http://172.21.20.16:8080/paymentMonitor/allList', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var monitorDetailsTable = $resource('http://172.21.20.16:8080/paymentMonitor:id', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });

        return {

            withdrawCashTable:withdrawCashTable,
            endBiddingCashTable:endBiddingCashTable,
            cashDirectiveTable:cashDirectiveTable,
            cashDetailsTable:cashDetailsTable,
            transferCashPrintTable:transferCashPrintTable,
            withdrawCashMonitorTable:withdrawCashMonitorTable,
            monitorDetailsTable:monitorDetailsTable,
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
            withdrawAccept: function(ids, exeChannel) {
                    return $http({
                        method: 'PUT',
                        url: 'http://172.21.20.13:8080/cashout/withdraw/accept/' + ids + '/' + exeChannel
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
            fullAccept: function(ids) {
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
            fullAccept: function(ids) {
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
            senfAccept: function(id) {
                return $http({
                    method: 'PUT',
                    url: 'http://172.21.20.16:8080/paymentMonitor/senf/' + id
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
            receiptAccept: function(id) {
                return $http({
                    method: 'PUT',
                    url: 'http://172.21.20.16:8080/paymentMonitor/receipt/' + id
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
