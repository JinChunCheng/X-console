define(['service/config'], function(config) {
    return ['buyerService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {
            /**
             * 询价列表
             * yucheng.sun
             * @constructor
             */
            quoteList: function(condition) {
                return $http({
                    method: "POST",
                    url: config.buyer_domain + '/buyer/getQuote',
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
                        console.error('Error while getting buyer quote');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 更新询价状态
             * yucheng.sun
             * @constructor
             */
            updateQuoteStatusFinish: function(quoteId) {
                return $http({
                    method: "PATCH",
                    url: config.buyer_domain + '/buyer/getQuote/'+ quoteId ,
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
                        console.error('Error while updating buyer quote');
                        return $q.reject(errResp);
                    }
                );
            },

            /**
             * 更新询价状态
             * yucheng.sun
             * @constructor
             */
            updateSourcingStatusFinish: function(id) {
                return $http({
                    method: "PATCH",
                    url: config.buyer_domain + '/buyer/freeSourcing/'+ id ,
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
                        console.error('Error while updating buyer sourcing');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 买家列表
             * yucheng.sun
             * @constructor
             */
            buyerList: function(condition) {
                return $http({
                        method: "POST",
                        url: config.buyer_domain + '/buyer/pagination',
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
                            console.error('Error while getting buyer attribute');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             * 更新买家状态
             * yucheng.sun
             * @constructor
             */
            updateBuyerFlagEnable: function(buyerAccount) {
                return $http({
                    method: "POST",
                    url: config.buyer_domain + '/buyer/enable',
                    data: JSON.stringify(buyerAccount),
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
                        console.error('Error while updating buyer attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取验证url
             * yucheng.sun
             * @constructor
             */
            getUrl: function(parameter) {
                return $http({
                    method: "POST",
                    url: config.buyer_domain + '/mailTrace/registerVerifyUrl',
                    data: JSON.stringify(parameter),
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
                        console.error('Error while getUrl');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取买家账户
             * yucheng.sun
             * @constructor
             */
            getBuyerAccount: function(buyerId) {
                return $http({
                    method: "GET",
                    url: config.buyer_domain + '/buyer/'+buyerId,
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
                        console.error('Error while getting buyer account');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取买家详情
             * yucheng.sun
             * @constructor
             */
            getBuyerInfo: function(buyerId) {
                return $http({
                    method: "GET",
                    url: config.buyer_domain + '/buyer/'+buyerId+'/info',
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
                        console.error('Error while getting buyer info');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取买家公司认证
             * yucheng.sun
             * @constructor
             */
            getBuyerCmpCert: function(buyerId) {
                return $http({
                    method: "GET",
                    url: config.buyer_domain + '/buyer/'+buyerId+'/companyCert',
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
                        console.error('Error while getting buyer company certifications');
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
             * 获取省市集合
             * yucheng.sun
             * @constructor
             */
            getStateList: function(countryCode) {
                return $http({
                    method: "GET",
                    url: config.api_logistics_domain + '/meta/stateList/'+ countryCode,
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
                        console.error('Error while getting stateList');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取城市集合
             * yucheng.sun
             * @constructor
             */
            getCityList: function(countryCode, stateCode) {
                return $http({
                    method: "GET",
                    url: config.api_logistics_domain + '/meta/cityList/'+ countryCode+'/'+stateCode,
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
                        console.error('Error while getting cityList');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取买家地址详情
             * yucheng.sun
             * @constructor
             */
            getBuyerAddress: function(buyerId) {
                return $http({
                    method: "GET",
                    url: config.buyer_domain + '/buyer/'+buyerId+'/address',
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
                        console.error('Error while getting buyer address');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 更新买家地址
             * yucheng.sun
             * @constructor
             */
            updateBuyerAddress: function(buyerAddress) {
                return $http({
                    method: "PUT",
                    url: config.buyer_domain + '/address',
                    data: JSON.stringify(buyerAddress),
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
                        console.error('Error while updating buyer address');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 获取询价列表
             * yucheng.sun
             * @constructor
             */
            getFreeSourcingList: function(condition) {
                return $http({
                    method: "POST",
                    url: config.buyer_domain + '/buyer/freeSourcing',
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
                        console.error('Error while getting buyer free-sourcing list');
                        return $q.reject(errResp);
                    }
                );
            }
        };

    }]]
});
