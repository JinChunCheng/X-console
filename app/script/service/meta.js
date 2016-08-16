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
