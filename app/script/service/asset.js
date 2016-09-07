define(['common/config'], function(config) {
    return ['assetService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var channelResource = $resource(config.ASSET_CONSOLE + '/assetchannel/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //var assetResource = $resource("http://172.21.22.31:8080" + '/asset/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var assetResource = $resource(config.ASSET_CONSOLE + '/asset/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var platformResource = $resource(config.SALEPLATFORM_CONSOLE + '/saleplatform/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var productResource = $resource(config.PRODUCT_CONSOLE + '/product/:id', null, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        return {
            channel: channelResource,
            asset: assetResource,
            platform: platformResource,
            product: productResource,
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
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: $.param({ id: id, status: status })
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
            deleteAsset: function(id) {
                return $http({
                        method: 'DELETE',
                        url: config.ASSET_CONSOLE + '/asset/' + id,
                        headers: { 'Content-Type': 'application/json' }, //DELETE方法必须写成JSON
                        data: null //DELETE方法必须写data: null
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
                        url: config.SALEPLATFORM_CONSOLE + '/saleplatform/batch',
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
            },
            findProduct: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.PRODUCT_CONSOLE + '/product/list',
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
            onshelf: function(data) {
                return $http({
                        method: 'POST',
                        url: config.PRODUCT_CONSOLE + '/product/onshelf',
                        data: data
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
            offshelf: function(id) {
                return $http({
                        method: 'POST',
                        url: config.PRODUCT_CONSOLE + '/product/offshelf',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: $.param({ id: id })
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
             * upload file
             * @param  {FormData} formData form data object
             */
            upload: function(formData) {
                return $http({
                        url: config.FILE_UPLOAD_CONSOLE + '/upload',
                        method: 'POST',
                        data: formData,
                        headers: {
                            //文件上传multipart必须使用空格式
                            'Content-Type': undefined
                        }
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
        }
    }]]
});
