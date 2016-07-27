define(['service/config'], function(config) {
    return ['PcService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {

            //add category
            /**
             * 品类-添加
             * @param category
             * @author:eric.gao
             */
            addCategory: function(formData) {
                $.ajax({
                    url: config.pc_domain + '/cat/',
                    type: "POST",
                    data: formData,
                    dataType: "text",
                    processData: false, // 告诉jQuery不要去处理发送的数据
                    contentType: false, // 告诉jQuery不要去设置Content-Type请求头

                    success: function(data) {
                        data = eval('(' + data + ')');
                        alert(data.msg);
                    },
                    xhr: function() { //在jquery函数中直接使用ajax的XMLHttpRequest对象
                        var xhr = new XMLHttpRequest();

                        xhr.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                console.log("正在提交." + percentComplete.toString() + '%'); //在控制台打印上传进度
                            }
                        }, false);

                        return xhr;
                    }
                });
            },
            saveCategory: function(formData) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/cat/',
                        data: formData,
                        headers: {
                            'Content-Type': undefined
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
                            console.error('Error while modifying category');
                            return $q.reject(errResp);
                        }
                    );
                // $.ajax({
                //     url: config.pc_domain + '/cat/',
                //     type: "POST",
                //     data: formData,
                //     dataType: "text",
                //     processData: false, // 告诉jQuery不要去处理发送的数据
                //     contentType: false, // 告诉jQuery不要去设置Content-Type请求头

                //     success: function(data) {
                //         data = eval('(' + data + ')');
                //         alert(data.msg);
                //     },
                //     xhr: function() { //在jquery函数中直接使用ajax的XMLHttpRequest对象
                //         var xhr = new XMLHttpRequest();

                //         xhr.upload.addEventListener("progress", function(evt) {
                //             if (evt.lengthComputable) {
                //                 var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                //                 console.log("正在提交." + percentComplete.toString() + '%'); //在控制台打印上传进度
                //             }
                //         }, false);

                //         return xhr;
                //     }
                // });
            },

            /**
             * 品类-编辑修改
             * @param category
             * @author:eric.gao
             */
            modifyCategory: function(category) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/category/',
                        data: category,
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
                            console.error('Error while modifying category');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 移除品类的属性
             * @param category
             * @author:eric.gao
             */
            removeCatAttr: function(catAttrId) {
                return $http({
                        method: 'DELETE',
                        url: config.pc_domain + '/categoryattrs/' + catAttrId,
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
                            console.error('Error while modifying category');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 绑定属性到品类上
             * @param category
             * @author:eric.gao
             */
            bindAttrs2Cat: function(categoryAttrs) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/categoryattrs/',
                        data: categoryAttrs,
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
                            console.error('Error while adding categoryAttrs');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 修改品类的某个属性
             * @param category
             * @author:eric.gao
             */
            modifyCatAttr: function(categoryAttrs) {
                console.log(categoryAttrs.standard + categoryAttrs.required);

                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/modCatAttr/',
                        data: categoryAttrs,
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
                            console.error('Error while adding categoryAttrs');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 批量删除品类的属性s
             * @param attrIds : id列表
             * @author:eric.gao
             */
            batchDelCatAttr: function(attrIds) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/delCatAttrs/',
                        data: attrIds,
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
                            console.error('Error while adding categoryAttrs');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 品类-查找  根据code查询其子品类列表
             * @param category_code
             * @author:eric.gao
             */
            findChildrenByCat: function(category_code) {
                return $http({
                    method: 'GET',
                    url: config.pc_domain + '/catmenus/' + category_code
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while creating category');
                        return $q.reject(errResp);
                    }
                );
            },

            /**
             * 品类属性-查找   根据category的code查询其属性列表
             * @param category_code
             * @author:eric.gao
             */
            findAttrsByCat: function(category_code) {
                return $http({
                    method: 'GET',
                    url: config.pc_domain + '/categoryattrs/' + category_code
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while creating category');
                        return $q.reject(errResp);
                    }
                );
            },


            /**
             * 品类-删除
             * @param category_code
             * @author:eric.gao
             */
            deleteCategory: function(category_code) {
                return $http({
                    method: 'DELETE',
                    url: config.pc_domain + '/category/' + category_code
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while deleting category');
                        return $q.reject(errResp);
                    }
                );
            },

            //add category
            /**
             * 属性管理
             */
            /**
             * 属性管理--品类添加用到的搜索
             * @param attribute 属性对象
             * @param categoryCode 品类编码
             * @returns {*}
             */
            searchAttributeByCategoryCode: function(condition, categoryCode) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/attribute/page/' + categoryCode,
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
             * 属性管理--搜索
             * @param attribute 属性对象
             * @returns {*}
             */

            searchAttribute: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/attribute/serach/page',
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
             * 属性管理--删除
             * @param code 属性编码
             * @returns {*}
             */
            deleteAttribute: function(code) {
                return $http({
                        method: 'DELETE',
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
                            console.error('Error while creating attribute');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             *产品库管理
             */
            /**
             * 产品库管理--搜索
             * @param attribute 属性对象
             * @returns {*}
             */
            searchProductWarehouse: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/productWarehouse/page',
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
                            console.error('Error while creating attribute');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             *产品库管理--加载单条产品库记录
             */
            loadProductWarehouseData: function(code) {
                return $http({
                        method: 'GET',
                        url: config.pc_domain + '/productWarehouse/' + code
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
             * 产品库管理--添加
             * @param warehouse
             * @returns {*}
             */
            addWarehouse: function(warehouse) {
                return $http({
                        method: 'POST',
                        url: config.pc_domain + '/productWarehouse/',
                        data: warehouse
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
             * 产品库管理--编辑
             * @param attribute
             * @returns {*}
             */
            editWarehouse: function(warehouse) {
                return $http({
                        method: 'PUT',
                        url: config.pc_domain + '/productWarehouse/',
                        data: warehouse
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
             * 产品库管理--删除
             * @param code
             * @returns {*}
             */
            deleteWarehouse: function(code) {
                return $http({
                        method: 'DELETE',
                        url: config.pc_domain + '/productWarehouse/' + code
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
                            console.error('Error while creating wareHouse');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 加载快速提交文件信息
             * roy.liu
             * @constructor
             */
            supplierFilesList: function($scope, earchParam) {
                return $http({
                        method: "POST",
                        url: config.pc_domain + '/supplierFiles/list',
                        data: earchParam
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
             * 加载产品品类信息
             */
            categoryDataList: function() {
                return $http({
                        method: "POST",
                        url: config.pc_domain + '/category'
                    })
                    .success(function(data, status, headers, config) {
                        if (data && data.status === 200) {
                            //需要根据供应商ID返回供应商公司名称
                            alert(data.items);
                            //$scope.queryResult.Items = data.items;

                        } else {
                            abp.notify.error(data.msg);
                        }
                        $scope.searching = false;
                    })
                    .error(function(data, status) {
                        abp.notify.error("查询失败");
                        $scope.searching = false;
                    });
            },


            /**
             * 根据ID删除操作
             * roy.liu
             * @param $socpe
             * @param id
             */
            delSupplierFiles: function($scope, id) {
                alert(id);
                return $http({
                        method: "DELETE",
                        url: config.pc_domain + '/supplierFiles/' + id
                    })
                    .success(function(data, status, headers, config) {
                        if (data && data.status === 200) {
                            abp.notify.error("删除成功");
                        } else {
                            abp.notify.error(data.msg);
                        }
                        $scope.searching = false;
                    })
                    .error(function(data, status) {
                        abp.notify.error("删除失败");
                        $scope.searching = false;
                    });
            },

            /**
             * search supplier files
             * @param  {object} $scope     [search condition]
             */
            supplierFilesList: function(condition) {
                return $http({
                        method: "POST",
                        url: config.pc_domain + '/supplierFiles/list',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * upload file
             * @param  {FormData} formData form data object
             */
            uploadFile: function(formData) {
                return $http({
                        //url: config.pc_domain + '/esin/uploadFile',
                        url: config.pc_domain + '/pc/uploadImages',
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

            /**
             * search esin list
             * @param  {[type]} condition [description]
             * @return {[type]}           [description]
             */
            searchEsin: function(condition) {
                return $http({
                        url: config.pc_domain + '/esin/list',
                        method: 'POST',
                        data: condition
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get esin detail info
             * @param  {string} code 
             */
            getEsin: function(code) {
				console.log(code);
                return $http({
                        url: config.pc_domain + '/esin/getEsinByCode/' + encodeURI(code),
                        method: 'GET'
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get esin detail info
             * @param  {string} code 
             */
            createEsin: function(data) {
                return $http({
                        url: config.pc_domain + '/esin/createEsin',
                        method: 'POST',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get esin detail info
             * @param  {string} code 
             */
            updateEsin: function(data) {
                return $http({
                        url: config.pc_domain + '/esin/updateEsin',
                        method: 'POST',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * get esin detail info
             * @param  {string} code 
             */
            cacheEsin: function(data) {
                return $http({
                        url: config.pc_domain + '/esin/cacheEsin',
                        method: 'POST',
                        data: data
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            },

            /**
             * delete sku data
             * @param  {string} code 
             */
            deleteSku: function(id) {
                return $http({
                        url: config.pc_domain + '/esin/sku/' + id,
                        method: 'DELETE'
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }

        };

    }]]
});
