define(['service/config'], function(config) {
    //元数据服务
    return ['metaService', ['$http', function($http) {

        //元数据键值对
        var metas = [{
            key: 'RZZT',
            value: [{
                value: 0,
                text: '待认证'
            }, {
                value: 1,
                text: '出口供应商认证审核中'
            }, {
                value: 2,
                text: '已通过出口供应商认证'
            }, {
                value: 3,
                text: '未通过出口供应商认证'
            }, {
                value: 4,
                text: '修改认证信息审核中'
            }]
        }, {
            key: 'YESORNOT',
            value: [{
                value: 1,
                text: '是'
            }, {
                value: 0,
                text: '否'
            }]
        }, {
            key: 'GYSLB', //供应商类别
            value: [{
                value: 1,
                text: '生产厂家'
            }, {
                value: 2,
                text: '贸易公司'
            }, {
                value: 3,
                text: '总代'
            }, {
                value: 4,
                text: '品牌商'
            }, {
                value: 5,
                text: '其他'
            }]
        }, {
            key: 'NSRZG', //纳税人资格
            value: [{
                value: 1,
                text: '一般纳税人'
            }, {
                value: 2,
                text: '小规模纳税人'
            }, {
                value: 3,
                text: '双定户'
            }]
        }, {
            key: 'JSFS', //结算方式
            value: [
              {value:1,text:'附属账户服务'},
             {value:2,text:'其他方式'}
            // {
            //     value: 1,
            //     text: '即期'
            // }, {
            //     value: 2,
            //     text: '0-30天'
            // }, {
            //     value: 3,
            //     text: '31-60天'
            // }, {
            //     value: 4,
            //     text: '61-90天'
            // }, {
            //     value: 5,
            //     text: '91-120天'
            // }, {
            //     value: 6,
            //     text: '121-150天'
            // }
            ]
        }, {
            key: 'JYPL', //经营品类
            value: [
                {   value: '1',
                    text: '时尚饰品及鞋类'
                }, {
                    value: '2',
                    text: '消费电子及电脑'
                }, {
                    value: '3',
                    text: '服装及布料'
                }, {
                    value: '4',
                    text: '电子配件及组件'
                }, {
                    value: '5',
                    text: '汽车用品及交通运输'
                }, {
                    value: '6',
                    text: '礼品/运动及玩具'
                }, {
                    value: '7',
                    text: '美容/个人护理及保健'
                }, {
                    value: '8',
                    text: '家居/建材及照明'
                }, {
                    value: '9',
                    text: '机械及五金工具'
                }, {
                    value: '10',
                    text: '其他品类'
                }]
        },
            { key: 'RZLX', //认证类型
                value: [{Id:1,Name:'首次认证'},
                    {Id:2,Name:'修改信息'}
                ]
            },
            {key: 'CPZT', //产品状态
                value: [
                    {
                        Id: '0',
                        Name: '新添加'
                    },{
                        Id: '1',
                        Name: '待审核'
                    },{
                        Id: '2',
                        Name: '审核通过'
                    },{
                        Id: '3',
                        Name: '审核失败'
                    },{
                        Id: '4',
                        Name: '发布'
                    }, {
                        Id: '5',
                        Name: '发取消布'
                    }
                ]
            },
            {key: 'JYBZ',
                value: [
                    {Id:"CNY",Name:"人民币元"},
                    {Id:"USD",Name:"美元"}
                    //目前就两种
                    //{Id: "EURD", Name: "欧元"},
                    //{Id: "AUD", Name: "澳元"},
                    //{Id: "HKD", Name: "港币"},
                    //{Id: "JPY", Name: "日元"}
                ]
            },
            {key: 'YN', //YN for supplier edit
                value: [
                    {Id:1,Name:"是"},
                    {Id:0,Name:"否"}
                ]
            },
            {key: 'SUPCTG', //supplier category for supplier edit
                value: [
                    {Id:1,Name:'生产厂家'},
                    {Id:2,Name:'贸易公司'},
                    {Id:3,Name:'总代'},
                    {Id:4,Name:'品牌商'},
                    {Id:5,Name:'其他'}
                ]
            },
            {key: 'SUPTAXPAY', //supplier tax payer for supplier edit
                value: [
                    {Id:1,Name:"一般纳税人"},
                    {Id:2,Name:"小规模纳税人"},
                    {Id:3,Name:"双定户"}
                ]
            },
            {key: 'SUPAUDITSTS', //supplier audit status for supplier edit
                value: [
                    {Id:1,Name:'首次认证'},
                    {Id:2,Name:'修改信息'},
                    {Id:-1,Name:''}
                ]
            },
            {key: 'FBTYPE', //YN for supplier edit
                value: [
                    {Id:'注册认证',Name:'注册认证'},
                    {Id:'资金账户',Name:'资金账户'},
                    {Id:'后台功能',Name:'后台功能'},
                    {Id:'订单交易',Name:'订单交易'},
                    {Id:'物流相关',Name:'物流相关'},
                    {Id:'产品相关',Name:'产品相关'},
                    {Id:'活动公告',Name:'活动公告'},
                    {Id:'技术问题',Name:'技术问题'},
                    {Id:'推广营销',Name:'推广营销'},
                    {Id:'其他',Name:'其他'},
                    {Id:'全部',Name:'全部'}
                ]
            }, {
            key: "FPXG", //add by chy 发票相关元数据
            value: [{
                value: 0,
                "text": "可开增值税专用发票"
            }, {
                value: 1,
                "text": "可开普通发票"
            }, {
                value: 2,
                "text": "可开非中国大陆税务发票"
            }, {
                value: 3,
                "text": "无法提供发票"
            }]
        },{
        	key: 'YMZT',
        	value:[{
        		value:0,
        		text: '运营'
        	},
        	{
        		value:1,
        		text: '下线'
        	}
        	]
        },
            {
                key: 'ISENABLE',
                value:[{
                    value:0,
                    text: '启用'
                },
                    {
                        value:1,
                        text: '禁用'
                    }
                ]
            },
            {
                key: 'BUYERREGSTATUS',
                value:[
                    {
                        value:1,
                        text: '完成注册'
                    },
                    {
                        value:2,
                        text: '未作邮箱验证'
                    },
                    {
                        value:3,
                        text: '已做邮箱验证'
                    }
                ]
            },
            {
                key: 'BUYERENABLEFLG',
                value:[
                    {
                        value:1,
                        text: '启用'
                    },
                    {
                        value:0,
                        text: '禁用'
                    }
                ]
            },
            {
                key: "YSSC",
                value: [{
                    value: "0",
                    "text": "欧洲"
                }, {
                    value: "1",
                    "text": "北美洲"
                }, {
                    value: "2",
                    "text": "南美洲"
                }, {
                    value: "3",
                    "text": "大洋洲"
                }, {
                    value: "4",
                    "text": "亚洲"
                }, {
                    value: "5",
                    "text": "非洲"
                }]
            },
            {
                key: "DDZT",
                value: [
                    {value:'Pending Approval',text:'Pending Approval'},
                    {value:'Pending Fulfillment',text:'Pending Fulfillment'},
                    {value:'Cancelled',text:'Cancelled'},
                    {value:'Pending Billing',text:'Pending Billing'},
                    {value:'Closed',text:'Closed'},
                    {value:'Completed ',text:'Completed '},
                    {value:'Billed',text:'Billed'}
                ]
            }
        ];

        //获取某项元数据列表
        var getMetaItem = function(code) {
            for (var i = 0; i < metas.length; i++) {
                if (metas[i].key.toUpperCase() == code.toUpperCase()) {
                    return metas[i].value;
                }
            }
            return null;
        };
        var provinces = [];

        return {
            getMeta: function(code, callback) {
                var value = getMetaItem(code);
                if (value != null) {
                    if (typeof callback == 'function') {
                        callback(value)
                    }
                    return false;
                }
                $http({
                        url: config.sys_domain + '/metadata/' + code,
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        if (res && res.status == 200) {
                            //防止请求过程中已经设置了该元数据
                            if (getMetaItem(code) == null) {
                                metas.push({
                                    key: code,
                                    value: res.data
                                });
                            }
                            if (typeof callback == 'function')
                                callback(res.data);
                        } else
                            console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !');
                    });
            },

            getProvinces: function(callback) {
                if (provinces && provinces.length > 0) {
                    if (typeof callback == 'function')
                        callback(provinces);
                    return false;
                }
                $http({
                    url: config.sys_domain + '/area/province',
                    method: 'GET',
                    withCredentials: false
                })
                    .success(function(res, msg, headers, cfg) {
                        if (res && res.status == 200) {
                            provinces = res.items;
                            if (typeof callback == 'function')
                                callback(res.items);
                        } else
                            console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !'+err);
                    });
            }
        };
    }]];
});
