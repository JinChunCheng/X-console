define(['service/config'], function(config) {
    //元数据服务
    return ['areaService', ['$http', function($http) {
        var cnCities = [];
        var departureCities = [];

        return {
            getCnCities: function(callback) {
                if (cnCities && cnCities.length > 0) {
                    if (typeof callback == 'function') {
                        callback(cnCities)
                    }
                    return false;
                }
                $http({
                        url: config.api_logistics_domain + '/meta/cnCities',
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        if (res && res.status == 200) {
                            cnCities = res.items;
                            if (typeof callback == 'function')
                                callback(res.items);
                        } else
                            console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !');
                    });
            },
            getDepartureCities: function(callback) {
                if (departureCities && departureCities.length > 0) {
                    if (typeof callback == 'function') {
                        callback(departureCities)
                    }
                    return false;
                }
                $http({
                        url: config.api_logistics_domain + '/meta/departureCities',
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        if (res && res.status == 200) {
                            departureCities = res.items;
                            if (typeof callback == 'function')
                                callback(res.items);
                        } else
                            console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !');
                    });
            }
        };
    }]];
});
