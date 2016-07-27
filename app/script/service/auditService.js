define(['service/config'], function(config) {
    return ['auditService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {


            /**
             * 属性管理--搜索
             * @param attribute 属性对象
             * @returns {*}
             */

            searchAuditList: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/esin/searchAuditList',
                        data: condition
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
                            console.error('Error while searching attribute');
                            return $q.reject(errResp);
                        }
                    );
            },
            searchNewproductList: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/esin/newEsinList',
                        data: condition
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
                            console.error('Error while searching attribute');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * batch import attribute with file
             * @param  {formData} data [form data]
             */
            importAttribute: function(data) {
                return $http({
                    url: config.pc_domain + '/attribute/Import',
                    method: "POST",
                    data: data,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
                .then(function(res) {
                    return res ? res.data : serverErrorData;
                }, function(res) {
                    return $q.reject(res);
                });
            },

            /**
             *属性管理--加载单条属性记录
             */

            loadAttributeData: function(code) {
                return $http({
                        method: 'GET',
                        url: config.pc_domain + '/attribute/' + code
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
                            console.error('Error while creating warehouse');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             * 属性管理--添加
             * @param attribute 属性对象
             * @returns {*}
             */
            addAttribute: function(attribute) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/attribute/',
                        data: attribute
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
                            console.error('Error while creating attribute');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 属性管理--编辑
             * @param attribute 属性对象
             * @returns {*}
             */
            editAttribute: function(attribute) {
                return $http({
                        method: 'PUT',
                        url: config.pc_domain + '/attribute/',
                        data: attribute
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
                            console.error('Error while creating attribute');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 属性管理--保存(新增、修改)
             * @param attribute 属性对象
             * @param method PUT、POST
             */
            saveAttribute: function(attribute, method) {
                return $http({
                        method: method,
                        url: config.pc_domain + '/attribute/',
                        data: attribute
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * 审核管理--审核esin
             * @param code 属性编码
             * @returns {*}
             */
            auditPass: function(auditData) {
                return $http({
                    method: 'POST',
                    url: config.pc_domain + '/esin/auditEsin/' ,
                    data:auditData
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
                        console.error('Error while creating attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 审核管理--提交审核
             * @param code 属性编码
             * @returns {*}
             */
            submitEsinAudit: function(auditData) {
                return $http({
                    method: 'POST',
                    url: config.pc_domain + '/esin/submitEsinAudit/' ,
                    data:auditData
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
                        console.error('Error while creating attribute');
                        return $q.reject(errResp);
                    }
                );
            },
            /**
             * 审核管理--审核不通过
             * @param code 属性编码
             * @returns {*}
             */
            auditNoPass: function(code) {
                return $http({
                    method: 'POST',
                    url: config.pc_domain + '/esin/auditNoPass' + code
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
                        console.error('Error while creating attribute');
                        return $q.reject(errResp);
                    }
                );
            }

        };

    }]]
});
