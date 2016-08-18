define(['common/config'], function(config) {
    //元数据服务
    return ['metaService', ['$http', function($http) {

        //元数据键值对
        var metas = [{
            key: 'XB', //性别
            value: [
                { value: 'male', text: '男' },
                { value: 'female', text: '女' },
                { value: 'other', text: '其他' },
            ]
        }, {
            key: 'SF', //是否
            value: [
                { value: '1', text: '是' },
                { value: '0', text: '否' }
            ]
        }, {
            key: 'YW', //有无
            value: [
                { value: '1', text: '有' },
                { value: '0', text: '无' }
            ]
        }, {
            key: 'ZCLX', //资产类型
            value: [
                { value: '1', text: '车贷' },
                { value: '2', text: '房贷' },
                { value: '3', text: '信用贷' },
                { value: '4', text: '企业贷' },
                { value: '99', text: '其他' },
            ]
        }, {
            key: 'HYZK', //婚姻状况
            value: [
                { value: '0', text: '未婚' },
                { value: '1', text: '已婚' }
            ]
        }, {
            key: 'HKLX', //户口类型
            value: [
                { value: '1', text: '城镇' },
                { value: '2', text: '农村' }
            ]
        }, {
            key: 'JYSP', //教育水平
            value: [
                { value: '1', text: '高中' },
                { value: '2', text: '中专' },
                { value: '3', text: '大专' },
                { value: '4', text: '本科' },
                { value: '5', text: '本科以上' }
            ]
        }, {
            key: 'JZQK',
            value: [
                { value: '1', text: '租房' },
                { value: '2', text: '自有住房' },
                { value: '3', text: '父母同住' }
            ]
        }, {
            key: 'DWXZ',
            value: [
                { value: '1', text: '私企' },
                { value: '2', text: '国企' },
                { value: '3', text: '外企' },
                { value: '4', text: '自营' }
            ]
        }, {
            key: 'QYHY',
            value: [
                { value: '1', text: '农、林、牧、渔业'},
                { value: '2', text: '采矿业'},
                { value: '3', text: '制造业'},
                { value: '4', text: '电力、热力、燃气及水的生产和供应业'},
                { value: '5', text: '环境和公共设置管理业'},
                { value: '6', text: '建筑业'},
                { value: '7', text: '交通运输、仓储业和邮政业'},
                { value: '8', text: '信息传输、计算机服务和软件业'},
                { value: '9', text: '批发和零售业'},
                { value: '10', text: '住宿和餐饮业'},
                { value: '11', text: '金融和保险业'},
                { value: '12', text: '房地产业'},
                { value: '13', text: '租赁和商务服务业'},
                { value: '14', text: '科学研究、技术服务和地质勘查业'},
                { value: '15', text: '水利、环境和公共设施管理业'},
                { value: '16', text: '居民服务和其他服务业'},
                { value: '17', text: '教育业'},
                { value: '18', text: '卫生、社会保障和社会服务业'},
                { value: '19', text: '文化、体育和娱乐业'},
                { value: '20', text: '综合类（含投资类、主业不明显）'},
                { value: '21', text: '其他'}
            ]
        }, {
            key: 'QYGM',
            value: [
                { value: '1', text: '50人以下' },
                { value: '2', text: '50-100' },
                { value: '3', text: '100-500' },
                { value: '4', text: '500以上' },
            ]
        }, {
            key: 'JKLX',
            value: [
                { value: '1', text: '信用类' },
                { value: '2', text: '固产类' },
                { value: '3', text: '其他' }
            ]
        }, {
            key: 'YTLB',
            value: [
                { value: '1', text: '流动资金' },
                { value: '2', text: '固定投资' }
            ]
        }, {
            key: 'XYJB',
            value: [
                { value: '1', text: '优质' },
                { value: '2', text: '良好' },
                { value: '3', text: '一般' },
            ]
        }, {
            key: 'HKFS',
            value: [
                { value: '1', text: '到期还本付息' },
                { value: '2', text: '等本等费' },
                { value: '3', text: '先息后本' }
            ]
        }, {
            key: 'HKLY',
            value: [
                { value: '1', text: '经营收入' },
                { value: '2', text: '工资收入' },
                { value: '3', text: '投资收入' }
            ]
        }];

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
                        url: 'script/data/p-c-a.json',
                        //url: 'script/data/cities.json',
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        provinces = res;
                        if (typeof callback == 'function')
                            callback(res);
                        // if (res && res.status == 200) {
                        //     provinces = res.items;
                        //     if (typeof callback == 'function')
                        //         callback(res.items);
                        // } else
                        //     console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !' + err);
                    });
            }
        };
    }]];
});
