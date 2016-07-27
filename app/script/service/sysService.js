define(['service/config'], function(config) {
    return ['sysService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };

        return {
            /**
             * search role list
             * @param  {object} condition [query condition]
             */
            searchRole: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/role/page',
                        data: condition,
                        withCredentials: true,
                        crossDomain: true
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get role detail info from server
             * @param  {int} id [role id]
             */
            getRole: function(id) {
                return $http({
                        method: "GET",
                        url: config.sys_domain + '/role/' + id
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * add or update role info
             * @param  {object} data   [role object]
             * @param  {string} method [post/put]
             */
            saveRole: function(data, method) {
                return $http({
                        method: method,
                        url: config.sys_domain + '/role',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * delete role
             * @param  {int} id [role id]
             */
            delRole: function(id) {
                return $http({
                    url: config.sys_domain +  '/role/' + id,
                    method: 'DELETE'
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * search user list
             * @param  {object} condition [query condition]
             */
            searchUser: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/user/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get department list
             */
            getDepartmentList: function() {
                return $http({
                        url: config.sys_domain + '/department/getList',
                        method: 'GET',
                        withCredentials: false
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });

            },

            /**
             * get role list
             */
            getRoleList: function() {
                return $http({
                        url: config.sys_domain + '/role/getRoleList',
                        method: 'GET',
                        withCredentials: false
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * add or update user info
             * @param  {object} data   [user object]
             * @param  {string} method [post/put]
             */
            saveUser: function(data, method) {
                return $http({
                        method: method,
                        url: config.sys_domain + '/user',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get user detail info from server
             * @param  {int} id [user id]
             */
            getUser: function(id) {
                return $http({
                        method: "GET",
                        url: config.sys_domain + '/user/' + id
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * delete user
             * @param  {int} id [user id]
             */
            delUser: function(id) {
                return $http({
                        url: config.sys_domain + '/user/del/' + id,
                        method: "DELETE"
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * delete user
             * @param  {int} id [user id]
             */
            activeUser: function(id) {
                return $http({
                    url: config.sys_domain + '/user/active/' + id,
                    method: "POST"
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * delete user
             * @param  {int} id [user id]
             */
            forbidUser: function(id) {
                return $http({
                    url: config.sys_domain + '/user/forbid/' + id,
                    method: "POST"
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * search system log
             * @param  {object} condition [search condition]
             */
            searchLog: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/sysLog/list/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * search meta data
             * @param  {object} condition [search condition]
             */
            searchMeta: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/metadata/list/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * change password
             * @param  {object} condition [search condition]
             */
            searchMeta: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/metadata/list/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * change my password
             * @param  {object} model [password object]
             */
            changePsw: function(model) {
                return $http({
                        method: 'POST',
                        url: config.sys_domain + "/user/changePsw",
                        data: model
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * change password
             * @param  {object} model [password object]
             */
            changeUserPsw: function(model) {
                return $http({
                    method: 'POST',
                    url: config.sys_domain + "/user/changeUserPsw",
                    data: model
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            searchPermission: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/permission/list/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            getPermission: function(id) {
                return $http({
                        method: "GET",
                        url: config.sys_domain + '/permission/' + id
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * add or update permission info
             * @param  {object} data   [permission object]
             * @param  {string} method [post/put]
             */
            savePermission: function(data, method) {
                return $http({
                        method: method,
                        url: config.sys_domain + '/permission',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            delPermission: function(id) {
                return $http({
                        url: config.sys_domain + '/permission/' + id,
                        method: "DELETE"
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            searchAuthorize: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/authorize/page',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            rolesInfo: function() {
                return $http({
                        url: config.sys_domain + '/role/getRoleList',
                        method: 'GET',
                        withCredentials: false
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            delAuthorize: function(id) {
                return $http({
                        url: config.sys_domain + '/authorize/' + id,
                        method: "DELETE"
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            searchAuthorizeByRoleNotExist: function(condition) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/authorize/queryByRoleNotExistpage',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            saveAuthorize: function(permissionIds, roleId) {
                return $http({
                        method: "POST",
                        url: config.sys_domain + '/authorize/' + permissionIds + "/" + roleId
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            delMeta: function(id) {
                return $http({
                        url: config.sys_domain + '/meta/' + id,
                        method: "DELETE"
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            getMeta: function(id) {
                return $http({
                        method: "GET",
                        url: config.sys_domain + '/meta/' + id
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            saveMeta: function(data, method) {
                return $http({
                        method: method,
                        url: config.sys_domain + '/meta',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * search schedule list
             * @param  {object} condition [query condition]
             */
            searchSchedule: function(condition) {
                return $http({
                    method: "POST",
                    url: config.sys_domain + '/scheduleJob/page',
                    data: condition
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get schedule detail info from server
             * @param  {int} id [user id]
             */
            getSchedule: function(id) {

                return $http({
                    method: "GET",
                    url: config.sys_domain + '/scheduleJob/' + id
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * add or update schedule info
             * @param  {object} data   [user object]
             * @param  {string} method [post/put]
             */
            saveSchedule: function(data, method) {

                return $http({
                    method: method,
                    url: config.sys_domain + '/scheduleJob',
                    data: data
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * add or update schedule info
             * @param  {object} data   [user object]
             * @param  {string} method [post/put]
             */
            delSchedule: function(id) {

                return $http({
                    method: "POST",
                    url: config.sys_domain + '/scheduleJob/forbid/'+ id
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },
            /**
             * create index
             * @param  {object} data   [ object]
             * @param  {string} method [post]
             */
            solrindexBuild: function(type) {
                return $http({
                    method: "POST",
                    url: config.sys_domain + '/solr/index/'+type
                })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },


        };
    }]];
});
