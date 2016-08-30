define(['common/config'], function(config) {
    return ['assetService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var channelResource = $resource(config.ASSET_CONSOLE + '/assetchannel/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var assetResource = $resource("http://172.21.22.31:8080" + '/asset/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var assetResource = $resource(config.ASSET_CONSOLE + '/asset/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var platformResource = $resource('http://172.21.20.8:8089/saleplatform/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            channel: channelResource,
            asset: assetResource,
            platform: platformResource,
            findChannel: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.ASSET_CONSOLE + '/assetchannel/list',
                        data: condition
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
            findAsset: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.ASSET_CONSOLE + '/asset/list',
                        data: condition
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
            /**
             * verify asset
             * @param  {string} id      asset id
             * @param  {int} status     -1,0,1,2,3
             */
            verifyAsset: function(id, status) {
                return $http({
                        method: 'POST',
                        url: config.ASSET_CONSOLE + '/asset/verify',
                        data: { id: id, status: status }
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
            /**
             * verify asset
             * @param  {string} ids      platform id list
             * @param  {int} status     
             */
            batchUpdatePlatform: function(data) {
                return $http({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        url: 'http://172.21.20.8:8089/saleplatform/batch',
                        data: $.param(data)
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
