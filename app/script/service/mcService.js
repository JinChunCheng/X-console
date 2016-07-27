define(['service/config'], function(config) {
    return ['McService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        return {

            //根据父code查找品类列表
            queryMcCategoryListByParentCode: function (parameter) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/mcCategoryByParent/"+ parameter
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while queryList category');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据code查找品类
            queryMcCategoryByCode: function (code) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/mcCategory/"+ code
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while query category by code');
                        return $q.reject(errResp);
                    }
                )
            },

            //修改品类
            updateMcCategory: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/mcCategory/edit",
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
                        console.error('Error while update category');
                        return $q.reject(errResp);
                    }
                )
            },

            //save品类
            saveMcCategory: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/mcCategory/add",
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
                        console.error('Error while save category');
                        return $q.reject(errResp);
                    }
                )
            },

            //删除品类
            deleteByCode: function (code) {
                return $http({
                    method: 'DELETE',
                    url: config.mc_domain + "/mcCategory/"+ code
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while delete category');
                        return $q.reject(errResp);
                    }
                )
            },

            //批量查询商品
            queryGoods: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/item/list",
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
                        console.error('Error while query goods');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据code查询商品
            queryGoodsByCode: function (code) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/items/"+ code
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while query goods');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据code查询商品操作记录
            queryDealByCode: function (code) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/items/deal/"+ code
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while query goods');
                        return $q.reject(errResp);
                    }
                )
            },

            //修改商品
            updateGoods: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/item/update",
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
                        console.error('Error while query goods');
                        return $q.reject(errResp);
                    }
                )
            },

            //批量修改商品
            batchUpdateGoods: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/item/batchUpdate",
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
                        console.error('Error while query goods');
                        return $q.reject(errResp);
                    }
                )
            },

            //批量查询活动
            queryActives: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/promotion/list",
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
                        console.error('Error while query active');
                        return $q.reject(errResp);
                    }
                )
            },

            //保存活动
            saveActives: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/promotion/add",
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
                        console.error('Error while save active');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据id查询活动
            getActiveById: function (id) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/promotion/" + id
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while save active');
                        return $q.reject(errResp);
                    }
                )
            },

            //修改活动
            updateActives: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/promotion/update",
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
                        console.error('Error while save active');
                        return $q.reject(errResp);
                    }
                )
            },

            /**
             * upload file
             * @param  {FormData} formData form data object
             */
            uploadFile: function(formData) {
                return $http({
                    url: config.mc_domain + "/mcCategory/uploadFile",
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
                        console.error('Error while upload file');
                        return $q.reject(res);
                    });
            },

            //批量查询市场跟踪
            queryCampaigns: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/campaignByParam",
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
                        console.error('Error while query campaign');
                        return $q.reject(errResp);
                    }
                )
            },

            //保存运营活动
            saveCampaign: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/campaign/create",
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
                        console.error('Error while save active');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据id查询运营活动
            queryCampaignById: function (id) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/campaign/"+ id
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while query campaign');
                        return $q.reject(errResp);
                    }
                )
            },

            //修改运营活动
            updateCampaign: function (data) {
                return $http({
                    method: 'POST',
                    url: config.mc_domain + "/campaign/updateById",
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
                        console.error('Error while update campaign');
                        return $q.reject(errResp);
                    }
                )
            },

            //根据key查询有效时间
            queryConfigByKey: function (id) {
                return $http({
                    method: 'GET',
                    url: config.mc_domain + "/mcCampaignConfig/"+ id
                }).then(
                    function (resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function (errResp) {
                        console.error('Error while query dayConfig');
                        return $q.reject(errResp);
                    }
                )
            },

            //修改有效时间
            updateConfig: function (data) {
                return $http({
                    method: 'PATCH',
                    url: config.mc_domain + "/mcCampaignConfig",
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
                        console.error('Error while update dayConfig');
                        return $q.reject(errResp);
                    }
                )
            }

        }
    }]]
});
