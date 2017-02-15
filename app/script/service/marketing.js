define(['common/config'], function(config) {
    return ['marketingService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        var marketingRes = $resource('script/data/marketing-list.json', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //return marketingRes;

        //加息券模板管理
        var marketingTable = $resource(config.MARKETING_CONSOLE + '/marketing/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        var marketingListTable = $resource(config.MARKETING_CONSOLE + '/marketing/list', { id: "@id" }, { 'query': { isArray: false }, 'update': { method: 'PUT' } });
        //加息劵发布管理
        var marketingReleaseTable = $resource(config.MARKETING_RELEASE_CONFIG + 'marketing/list',{id: "@id"}, {'query': {isArray:false},'update': {method: 'PUT'}});


        return {
            resource: marketingRes,
            //加息券模板管理
            marketingTable: marketingTable,
            marketingListTable:marketingListTable,
            //加息劵发布管理
            marketingReleaseTable: marketingReleaseTable,
            /**
             * get marketing list
             * @param  {string} data
             */
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
                return marketingRes.query(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            save: function(params) {
                return marketingRes.save(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            update: function(params) {
                return marketingRes.put(params).$promise
                    .then(function(res) {
                        return res ? res : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            marketingUpdate: function(data) {
                return $http({
                    method: 'POST',
                    url: config.MARKETING_CONSOLE + '/marketing/editMarketing',

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
            checkAccept: function(ids) {
                return $http({
                    method: 'PUT',
                    url: config.CASHOUT_CONSOLE + '/cashout/project/accept/' + ids
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
            finishCancel:function(id, id1, id2){
                return $http({
                    method: 'PUT',
                    url: config.PURCHASE_CONSOLE + '/bidding/undoBidding/' + id + '/'+id1 + '/' + id2
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
            getUpdateMarketing: function(id) {
                return $http({
                    method: 'GET',
                    url: config.MARKETING_CONSOLE + '/marketingUpdate/getByMarketingUpdateId/' + id
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
            approvalMarketing: function(id) {
                return $http({
                    method: 'GET',
                    url: config.MARKETING_CONSOLE + '/marketingUpdate/approveMarketingUpdate/' + id
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
                    });
            },
            rejectMarketing: function(id) {
                return $http({
                    method: 'GET',
                    url: config.MARKETING_CONSOLE + '/marketingUpdate/rejectMarketingUpdate/' + id
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
                    });
            }
        }
    }]]
});
