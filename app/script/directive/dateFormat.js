define([], function() {
    // 数组[0]是指令的名字，数组[1][0]是需注入服务的全称,数组[1][1]是构造函数
    return ['dateFormat', ['$filter', function($filter) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                var format = attrs['dateFormat'] || 'yyyy-MM-dd';
                // //convert data from view format to model format
                // ngModelController.$parsers.push(function(data) {
                //     if (!data)
                //         return data;
                //     return data.toUpperCase(); //converted
                // });

                //convert data from model format to view format
                ngModelController.$formatters.push(function(data) {
                    if (!data)
                        return data;

                    var dateFilter = $filter('date');
                    var result = dateFilter(data, format);
                    if (result) {
                        return result
                    }

                    var newTime;
                    if (data.indexOf('/Date(') > -1)
                        newTime = new Date(parseInt(data.slice(6, 19)));
                    else {
                        newTime = new Date(data.replace(/-/g, '/')); //firefox不支持横线分隔日期 //.replace('T', ' ').slice(0, 19)
                    }
                    return dateFilter(newTime, format);
                });
            }
        };
    }]];
});
