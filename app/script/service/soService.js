define(['service/config'], function(config) {
    return ['soService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {
            /**
             * 订单列表
             * gavin.miao
             * @constructor
             */
            list: function(condition) {
                return $http({
                    method: "POST",
                    url: config.so_domain + '/saleorders/',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取国家集合
             * yucheng.sun
             * @constructor
             */
            getCountroyList: function() {
                return $http({
                    method: "GET",
                    url: config.api_logistics_domain + '/meta/countryList',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting countryList');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 更新订单状态
             * gavin.miao
             * @constructor
             */
            updateOrderStatus: function(orderNo,orderStatus) {
                return $http({
                    method: "PATCH",
                    url: config.so_domain + '/saleorders/'+orderNo,
                    data: orderStatus,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while updating so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             *
             */
            updateFinanceConfirmStatus:function(orderNo,financeConfirmStatus){
                return $http({
                    method: "PATCH",
                    url: config.so_domain + '/saleorders/financeConfirmStatus/'+orderNo,
                    data: financeConfirmStatus,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while update so financeConfirmStatus');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 列表页面中，点击审核时，调用此“收款”功能
             */
            capture:function(condition){
                return $http({
                    method: "POST",
                    url: config.so_domain + '/capture',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 列表页面中，点击Cancel时，调用此“取消授权”功能
             */
            authorizationReversal:function(condition){
                return $http({
                    method: "POST",
                    url: config.so_domain + '/authorizationReversal',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 列表页面中，点击refund时，调用此“退款”功能
             */
            refunds:function(condition){
                return $http({
                    method: "POST",
                    url: config.so_domain + '/refunds',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 订单详情，支付信息部分，需要显示“支付交易”的transactionId
             */
            getTransactionDetail:function(paymentType,orderNo){
                return $http({
                    method: "get",
                    url: config.so_domain + '/transactiondetail'+'/'+paymentType+'/'+orderNo,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取某个订单
             * gavin.miao
             * @constructor
             */
            getOrderDetail: function(orderId) {
                return $http({
                    method: "GET",
                    url: config.so_domain + '/saleorders/'+orderId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting so order detail');
                        return $q.reject(errResp);
                    }
                );
            }

        };

    }]]
});
