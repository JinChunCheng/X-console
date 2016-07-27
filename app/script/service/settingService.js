define(['service/config'], function(config) {
    return ['SettingService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {
            //保存物流参数
            saveLogisticsParameter: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/automaticPricing/logistics",
                    data: data
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while modifying category');
                        return $q.reject(errResp);
                    }
                )
            },
            //加载物流参数
            loadLogisticsParameter: function () {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/automaticPricing/logistics"
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while modifying category');
                        return $q.reject(errResp);
                    }
                )
            },
            //保存财务参数
            saveFinanceParameter: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/automaticPricing/finance",
                    data:data
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while modifying category');
                        return $q.reject(errResp);
                    }
                )
            },
            //加载财务参数
            loadFinanceParameter: function () {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/automaticPricing/finance"
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while modifying category');
                        return $q.reject(errResp);
                    }
                )
            }
        }
    }]]
});
