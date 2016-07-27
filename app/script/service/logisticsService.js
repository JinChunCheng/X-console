define(['service/config'], function(config) {
    return ['LogisticsService', ['$http', '$q', function($http, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        return {

            
            /**
             *销售订单查询
             */
            /**
             * 销售订单--搜索
             * @param attribute 属性对象
             * @returns {*}
             */
            searchSaleOrders: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/saleOrders/getSaleOrdersList',
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
             * 加载单个销售订单信息
             * yucheng.sun
             * @constructor
             */
            loadSaleOrderInfo: function(orderId) {
                return $http({
                        method: "GET",
                        url: config.logistics_domain + '/saleOrders/saleOrderDetail/' + orderId,
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
                            console.error('Error while getting saleOrders basic info');
                            return $q.reject(errResp);
                        });
            },

            // 加载某个销售订单的明细
            loadSaleOrderInfoDeatil: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/saleOrders/getSoDetailList',
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
                            console.error('Error while getting saleOrders Detail info');
                            return $q.reject(errResp);
                        });
            },

            //加载采购单信息
            loadPurchaseOrderInfo:function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/PurchaseOrder/getPoList',
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
                            console.error('Error while getting PurchaseOrder  info');
                            return $q.reject(errResp);
                        });
            },

            //加载采购单详情信息
            loadPurchaseOrderDetail:function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/PurchaseOrder/getPoDetailList',
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
                            console.error('Error while getting PurchaseOrder Detail info');
                            return $q.reject(errResp);
                        });
            },

             //加载用户日志信息
            loadOperateLogDetail:function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/saleOrders/operateLog',
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
                            console.error('Error while getting PurchaseOrder Detail info');
                            return $q.reject(errResp);
                        });
            },

            /**
             * 销售订单保存--编辑
             * @param attribute
             * @returns {*}
             */
            editSaleOrdersInfo: function(saleOrder) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/saleOrders/modify',
                        data: saleOrder
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
                            console.error('Error while saving SaleOrdersInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 销售订单保存--确认
             * @param attribute
             * @returns {*}
             */
            comfirmSaleOrders: function(saleOrder) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/saleOrders/confirmSaleOrder',
                        data: saleOrder
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
                            console.error('Error while confirm SaleOrdersInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 物流运单查询
             * @param WaybillSearchParam 运单查询对象
             * @returns {*}
             */
            searchWaybills: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/waybill/getPageList',
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
                            console.error('Error while searching waybill list');
                            return $q.reject(errResp);
                        }
                    );
            },


            /**
             * 物流运单跟踪查询
             * @param TrackingSearchParam 运单跟踪查询对象
             * @returns {*}
             */
            searchTrackings: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/tracking/getPageList',
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
                            console.error('Error while searching tracking list');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 物流子运单列表查询
             * @param trackId 运单ID
             * @returns {*}
             */
            getSubWaybillList: function(trackId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/subWaybills/' + trackId
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
                            console.error('Error while retrieving sub waybill list');
                            return $q.reject(errResp);
                        }
                    );
            },

            //加载运单操作日志信息
            loadWaybillLogs:function(trackId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/waybillLog/'  + trackId
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
                            console.error('Error while getting waybill operation logs');
                            return $q.reject(errResp);
                        });
            },

            /**
             * 获取一子运单明细
             * @param trackDetailId 子运单ID
             * @returns {*}
             */
            loadSubWaybill: function(trackDetailId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/subWaybill/' + trackDetailId
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
                            console.error('Error while retrieving sub waybill detail');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 获取一子运单的track明细
             * @param trackDetailId 子运单ID
             * @returns {*}
             */
            loadSubWaybillDetail: function(trackDetailId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/trackDetail/' + trackDetailId
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
                            console.error('Error while retrieving track detail');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 移除一个子运单
             * @param trackDetailId
             */
            removeSubWaybill: function(trackDetailId) {
                return $http({
                        method: 'DELETE',
                        url: config.logistics_domain + '/subWaybill/' + trackDetailId,
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
                            console.error('Error while removing a sub-waybill');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 修改订舱信息
             * @param subWaybillDetail
             * @returns {*}
             */
            editSubWaybill: function(subWaybillDetail) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/subWaybill',
                        data: subWaybillDetail
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
                            console.error('Error while saving Sub-waybill information');
                            return $q.reject(errResp);
                        }
                    );
            },

             /**
             * 获取物流供应商列表
             * @returns {*}
             */
            loadVendorList: function() {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/vendorList'
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
                            console.error('Error while retrieving vendors information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 获取国家列表
             * @returns {*}
             */
            loadCountries: function() {
                return $http({
                        method: 'GET',
                        url: config.api_logistics_domain + '/meta/countryList'
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
                            console.error('Error while retrieving countries information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 获取国家州省列表
             * @returns {*}
             */
            loadCountryStates: function(countryCode) {
                return $http({
                        method: 'GET',
                        url: config.api_logistics_domain + '/meta/stateList/' + countryCode
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
                            console.error('Error while retrieving states information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 获取国家州省列表
             * @returns {*}
             */
            loadCities: function(countryCode, stateCode) {
                return $http({
                        method: 'GET',
                        url: config.api_logistics_domain + '/meta/cityList/' + countryCode + '/' + stateCode
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
                            console.error('Error while retrieving cities information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 测试跨域访问
             * @returns {*}
             */
            testCrossDomain: function() {
                return $http({
                        method: 'GET',
                        url: config.api_logistics_domain + '/meta/cnCities',
                    })
                    .then(
                        function(resp) {
                            alert('123');
                            if (resp) {
                                alert(resp.data);
                                return resp.data;
                            } else {
                                return serverErrorData;
                            }
                        },
                        function(errResp) {
                            alert('error');
                            alert(errResp.msg);
                            console.error(errResp);
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 修改订舱信息
             * @param blMaster
             * @returns {*}
             */
            editTrackSchedule: function(blMaster) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/trackSchedule',
                        data: blMaster
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
                            console.error('Error while saving tracking schedule information');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             * 运单跟踪信息修改
             * @param blMaster
             * @returns {*}
             */
            updateTrackDetail: function(blMaster) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/trackDetail',
                        data: blMaster
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
                            console.error('Error while updating track detail information');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
             * 完成运单跟踪
             * @param blMaster
             * @returns {*}
             */
            finishTracking: function(blMaster) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/finishTrack',
                        data: blMaster
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
                            console.error('Error while finishing track');
                            return $q.reject(errResp);
                        }
                    );
            },

             //查询物流文件列表
            searchTrackDocument:function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/track/getTrackDocumentList' ,
                        data:condition
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
                            console.error('Error while getting track Document List');
                            return $q.reject(errResp);
                        });
            },

            //上传物流文件(插入)
            insertTrackDoc: function(formData,trackDetailId) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/track/insertTrackDoc',
                        data: formData,
                        headers: {
                            //文件上传multipart必须使用空格式
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
                            console.error('Error while getting track Document List');
                            return $q.reject(errResp);
                        });
            },

            //上传物流文件(更新)
            uploadTrackDoc: function(formData,trackDocId) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/track/uploadTrackDoc/'+trackDocId,
                        data: formData,
                        headers: {
                            //文件上传multipart必须使用空格式
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
                            console.error('Error while getting track Document List');
                            return $q.reject(errResp);
                        });
            },

                        /**
             * 生成运单号
             * @param attribute
             * @returns {*}
             */
            createTrack: function(orderId) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/saleOrders/createTracking/'+orderId,
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
                            console.error('Error while confirm SaleOrdersInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 物流跟踪列表查询
             * @param WaybillSearchParam 运单查询对象
             * @returns {*}
             */
            searchLogisticsTracks: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/logisticsTracking',
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
                            console.error('Error while searching logistics tracking list');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 新增子订舱信息
             * @param blMaster
             * @returns {*}
             */
            insertSubwaybill: function(subWaybill) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/subWaybill/add',
                        data: subWaybill
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
                            console.error('Error while inserting SubWaybill information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 新增子订舱的物流信息
             * @param blMaster
             * @returns {*}
             */
            insertBLMaster: function(blMaster) {
                return $http({
                        method: 'PUT',
                        url: config.logistics_domain + '/trackDetail/add',
                        data: blMaster
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
                            console.error('Error while inserting BLMaster information');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *物流订单物流明细
            *
            */
            loadTrackDetail:function(trackId){
                return $http({
                        method: "GET",
                        url: config.logistics_domain + '/tracking/getTrackingDetail/' + trackId,
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
                            console.error('Error while getting saleOrders basic info');
                            return $q.reject(errResp);
                        });
            },


            /**
            *更新采购单明细的时间
            */
            updatePoDetailDates:function(poDetailInfo){
                return $http({
                        method: "POST",
                        url: config.logistics_domain + '/PurchaseOrder/updatePoDetailDates',
                        data:poDetailInfo,
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
                            console.error('Error while getting saleOrders basic info');
                            return $q.reject(errResp);
                        });
            },

            /**
            *查询物流运费区间
            */
            searchWeightInterval: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/weightInterval/getweightIntervalList',
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
                            console.error('Error to get WeightInterval.');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *查看物流费率信息
            */
            loadWeightIntervalInfo: function(weightIntervalId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/weightInterval/getWeightIntervalInfo/'+weightIntervalId,
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
            *更新物流费率信息
            */
            updateWeightIntervalInfo: function(weightIntervalInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/weightInterval/updateWeightIntervalInfo',
                        data: weightIntervalInfo,
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
                            console.error('Error while update WeightInterval');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *增加物流费率信息
            */
            addWeightIntervalInfo: function(weightIntervalInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/weightInterval/addWeightIntervalInfo',
                        data: weightIntervalInfo,
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
                            console.error('Error while add WeightInterval');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 物流供应商--搜索
             * @param LogisticsVendorSearchParam 搜索条件对象
             * @returns {*}
             */
            searchVendorList: function(condition) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/vendor/list',
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
                            console.error('Error while retrieving logistics vendor list');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *加载物流供应商明细信息
            */
            loadVendorDetail: function(vendorId) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/vendorDetail/'+vendorId,
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
            *更新物流供应商
            */
            updateVendor: function(vendorDetail) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/vendor/edit',
                        data: vendorDetail,
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
                            console.error('Error while update logistics vendor');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *增加物流供应商
            */
            addVendor: function(vendorDetail) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/vendor/add',
                        data: vendorDetail,
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
                            console.error('Error while add logistics vendor');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
             * 移除一个子运单
             * @param trackDetailId
             */
            deleteVendor: function(vendorId) {
                return $http({
                        method: 'DELETE',
                        url: config.logistics_domain + '/vendor/' + vendorId,
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
                            console.error('Error while removing a vendor');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            * 获取国家信息
            */
            loadCountryInfo: function() {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/InterTransportInfo/getCountryInfo',
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
                            console.error('Error while get CountryInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            * 获取州\省信息
            */
            loadStatesInfo: function(countryCode) {
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/InterTransportInfo/getStateInfo/'+countryCode,
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
                            console.error('Error while load states info');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            * 获取城市\港口信息
            */
            loadPortsInfo:function(condition,type){
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/getPortInfo/'+type,
                        data:condition,
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
                            console.error('Error while load port info');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            * 获取重量区间的信息
            */
            loadWeightIntervalsInfo:function(condition){
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/getWeightIntervalsInfo',
                        data:condition,
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
                            console.error('Error while load weightInterval info');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
            * 获取计费单位的信息
            */
            loadCalUnitsInfo:function(condition){
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/getCalUnitsInfo',
                        data:condition,
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
                            console.error('Error while load calUnit info');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
            * 获取国际运费
            */
            searchInterSeaAirTransportRateInfo:function(condition){
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/getInterTransportRateList',
                        data:condition,
                        headers: {
                            'Content-Type': ' application/json'
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
                            console.error('Error while load InterTransport info');
                            return $q.reject(errResp);
                        }
                    );
            },
             /**
            * 获取国际快递运费
            */
            searchInterExpressTransportRateInfo:function(condition){
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterExpressTranRate/getInterExpressTranRateList',
                        data:condition,
                        headers: {
                            'Content-Type': ' application/json'
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
                            console.error('Error while load InterExpressTranRate info');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            * 获取国际海空快递运费
            */
            getInterTransportRateInfoByID:function(freightChargeId,serviceType){
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/InterTransportInfo/getInterTransportRateInfo/'+serviceType+'/'+freightChargeId,
                        headers: {
                            'Content-Type': ' application/json'
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
                            console.error('Error while load InterTranRate info');
                            return $q.reject(errResp);
                        }
                    );
            },
            /**
            *更新国际海空运费率信息
            */
            updateInterTransportRateInfo: function(interTransportInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/updateTransportRateInfo',
                        data: interTransportInfo,
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
                            console.error('Error while update interTransportInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *增加国际海空运费率信息
            */
            addInterTransportRateInfo: function(interTransportInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterTransportInfo/addTransportRateInfo',
                        data: interTransportInfo,
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
                            console.error('Error while add interTransportInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *增加国际快递运费率信息
            */
            addInterExpressTransportRateInfo: function(interExpressTransportInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterExpressTranRate/addInterExpressTranRate',
                        data: interExpressTransportInfo,
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
                            console.error('Error while add InterExpressTransInfo');
                            return $q.reject(errResp);
                        }
                    );
            },


            /**
            * 获取国际快递运费
            */
            getInterExpressTransportRateInfoByID:function(expresschargeId){
                return $http({
                        method: 'GET',
                        url: config.logistics_domain + '/InterExpressTranRate/getInterExpressTranRateInfo/'+expresschargeId,
                        headers: {
                            'Content-Type': ' application/json'
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
                            console.error('Error while load InterExpressTranRate info');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *更新国际快递运费率信息
            */

            updateInterExpressTransportRateInfo: function(interExpressTransportInfo) {
                return $http({
                        method: 'POST',
                        url: config.logistics_domain + '/InterExpressTranRate/updateInterExpressTranRateInfo',
                        data: interExpressTransportInfo,
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
                            console.error('Error while update  InterExpressTransInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *删除国际快递运费率信息
            */

            deleteInterExpressTransportRateInfo: function(expresschargeId) {
                return $http({
                        method: 'DELETE',
                        url: config.logistics_domain + '/InterExpressTranRate/deleteInterTransportRateInfo/'+expresschargeId,
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
                            console.error('Error while update  InterExpressTransInfo');
                            return $q.reject(errResp);
                        }
                    );
            },

            /**
            *删除国际海空运费率信息
            */

            deleteInterTransportRateInfo: function(freightchargeId) {
                return $http({
                        method: 'DELETE',
                        url: config.logistics_domain + '/InterTransportInfo/deleteTransportRateInfo/'+freightchargeId,
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
                            console.error('Error while update  InterExpressTransInfo');
                            return $q.reject(errResp);
                        }
                    );
            }


        };

    }]]
});
