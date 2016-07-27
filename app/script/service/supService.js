define(['service/config'], function(config) {
    return ['supService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {
            /**
             * 供应商列表
             * yucheng.sun
             * @constructor
             */
            supplierList: function($scope, earchParam) {
                return $http({
                        method: "POST",
                        url: config.supplier_domain + '/supplier/auth/pageList',
                        data: JSON.stringify($scope.condition)
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
             * pc 一级品类
             * yucheng.sun
             * @constructor
             */
            supplierCategory: function(callback) {
                return $http({
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'GET',
                        url: config.pc_domain + '/productCategoryMenu/gradeone'
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
             * pc count
             * yucheng.sun
             * @constructor
             */
            supplierProductCount: function(supplierId) {
                return $http({
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'GET',
                        url: config.supplier_domain + '/supplier/pcCount/' + supplierId
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
             * supplier po数量
             * yucheng.sun
             * @constructor
             */
            supplierPoCount: function(supplierId) {
                return $http({
                        method: 'GET',
                        url: config.po_domain + '/purchaseOrder/quantity?supplierId=' + supplierId,
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
                            console.error('Error while creating attribute');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             * supplier pic upload
             * yucheng.sun
             * @constructor
             */
            uploadImg: function(formData) {
                return $http({
                        url: config.supplier_domain + '/supplierpic',
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
            uploadImgWithCallBack: function(formData,callback) {
                return $http({
                    url: config.supplier_domain + '/supplierpic',
                    method: 'POST',
                    data: formData,
                    headers: {
                        //文件上传multipart必须使用空格式
                        'Content-Type': undefined
                    }
                })
                    .then(function(res) {
                        if(callback){
                            callback(res);
                        }
                       // return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * supplier basic info
             * yucheng.sun
             * @constructor
             */
            viewBasicInfo: function(supplierId) {
                return $http({
                        method: "GET",
                        url: config.supplier_domain + '/supplier/' + supplierId,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(
                        function(resp) {
                            if (resp) {
                                return resp.data.items;
                            } else {
                                return serverErrorData;
                            }
                        },
                        function(errResp) {
                            console.error('Error while getting supplier basic info');
                            return $q.reject(errResp);
                        });
            },
            /**
             * supplier auth info
             * yucheng.sun
             * @constructor
             */
            viewAuthInfo: function(supplierId) {
                return $http({
                    method: "GET",
                    url: config.supplier_domain + '/supplierAuth/' + supplierId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data.items;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier auth info');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier insert auth info
             * yucheng.sun
             * @constructor
             */
            insertSupplierAuthInfo: function(supplierAuthInfo) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/supplierAuth/apply',
                    data: JSON.stringify(supplierAuthInfo),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data.items;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier auth info');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier update auth info
             * yucheng.sun
             * @constructor
             */
            updateSupplierAuthInfo: function(supplierAuthInfo) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/supplierAuth/applymodifyauth',
                    data: JSON.stringify(supplierAuthInfo),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data.items;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier auth info');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier feedback list
             * yucheng.sun
             * @constructor
             */
            feedbackList: function(condition) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/feedback/page',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier feedback list');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier feedback list
             * yucheng.sun
             * @constructor
             */
            getFeedback: function(feedbackId) {
                return $http({
                    method: "GET",
                    url: config.supplier_domain + '/feedback/' + feedbackId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier feedback list');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier feedback saving
             * yucheng.sun
             * @constructor
             */
            saveFeedback: function(feedback) {
                return $http({
                    method: "PUT",
                    url: config.supplier_domain + '/feedback',
                    data:JSON.stringify(feedback),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while putting supplier feedback');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier audit list
             * yucheng.sun
             * @constructor
             */
            getAuditList: function(condition) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/supplier/authLog/pageList',
                    data: JSON.stringify(condition),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while getting supplier audit list');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier audit list
             * yucheng.sun
             * @constructor
             */
            auditAccept: function(passInfo) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/supplierAuth/pass',
                    data: JSON.stringify(passInfo),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier audit info and detail
             * yucheng.sun
             * @constructor
             */
            getAuditDetail: function(authId) {
                return $http({
                    method: "GET",
                    url: config.supplier_domain + '/supplierAuth/logInfo/' + authId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier audit info and detail
             * yucheng.sun
             * @constructor
             */
            auditReject: function(passInfo) {
                return $http({
                    method: "POST",
                    url: config.supplier_domain + '/supplierAuth/unpass',
                    data: JSON.stringify(passInfo),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            },
            /**
             * supplier PO detail
             * yucheng.sun
             * @constructor
             */
            getPoDetail: function(supplierId) {
                return $http({
                    method: "GET",
                    url: config.po_domain + '/purchaseOrder/' + supplierId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            },

            /**
             * get po list
             * @param  {[type]} condition [description]
             */
            getPoList: function(condition, supplierId, critera) {
                return $http({
                        method: "GET",
                        url: config.po_domain + '/purchaseOrder?pageNo=' +
                            condition.PageInfo.PageIndex +
                            '&pageSize=' + condition.PageInfo.PageSize +
                            '&supplierId=' + supplierId + critera
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * supplier Pc detail
             * yucheng.sun
             * @constructor
             */
            getPcDetail: function(productCode) {
                return $http({
                    method: "GET",
                    url: config.pc_domain + '/product/' + productCode
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            },

            /**
             * get product list of supplier
             * @param  {object} condition  [condition]
             * @param  {guid} supplierId [supplier id]
             */
            getProductList: function(condition, supplierId) {
                return $http({
                        method: "POST",
                        url: config.supplier_domain + '/supplier/pcPage/' + supplierId,
                        data: JSON.stringify(condition)
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * @param  {object}
             * @return {}
             * 此接口有点变态，接收的是modelattribute，需要传form数据并且要转换请求格式
             */
            filterSupplier: function(params) {
                return $http({
                    url: config.supplier_domain + '/supplier/by/email/companyName',
                    method: 'POST',
                    data: params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(data, headeres) {
                        if (data === undefined) {
                            return data;
                        }
                        return $.param(data);
                    }
                }).then(function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while saving supplier audit result');
                        return $q.reject(errResp);
                    });
            }

        };

    }]]
});
