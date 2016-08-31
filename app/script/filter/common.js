/*
    Author: haiyang.you
    Create date: 2015.09.29
    Description: 公共过滤器，支持多个过滤器写在同一文件中（二维数组的形式）
*/
define(['common/config'], function(config) {
    return [
        //数组[0]是过滤器的名字，数组[1][0]是需注入的全部参数，数组[1][1]是构造函数
        //时间过滤器
        ['exDate', ['$filter', function($filter) {
            return function(date, format) {
                if (!date)
                    return '';

                var dateFilter = $filter('date');
                var result = dateFilter(date, format || 'yyyy-MM-dd');
                if (result) {
                    return result
                }

                var newTime;
                if (date.indexOf('/Date(') > -1)
                    newTime = new Date(parseInt(date.slice(6, 19)));
                else {
                    newTime = new Date(date.replace(/-/g, '/')); //firefox不支持横线分隔日期 //.replace('T', ' ').slice(0, 19)
                }
                return dateFilter(newTime, format || 'yyyy-MM-dd');
            };
        }]],
        //普通元数据过滤器
        ['meta', [function() {
            return function(value, list) {

                if (value == undefined || value == null || !list || list.length == 0)
                    return '';

                var result = '';
                for (var i = 0; i < list.length; i++) {
                    val = list[i].value;
                    txt = list[i].text;
                    if (val.toString().toUpperCase() == value.toString().toUpperCase()) {
                        result = txt;
                        break;
                    }
                }
                return result;
            };
        }]],
        //省市县元数据过滤器
        ['metaPCA', [function() {
            return function(value, list) {

                if (value == undefined || value == null || !list || list.length == 0)
                    return '';

                var result = '';
                for (var i = 0; i < list.length; i++) {
                    val = list[i].code;
                    txt = list[i].name;
                    if (val.toString().toUpperCase() == value.toString().toUpperCase()) {
                        result = txt;
                        break;
                    }
                }
                return result;
            };
        }]],
        //加星显示
        ['starReplace', [function() {
            /*
                value: 原始值
                charLength: 保留位数
            */
            return function(value, charLength) {
                try {
                    if (value)
                        value = value.replace(/ /g, '');
                    if (!value || !charLength || value.length <= charLength)
                        return value;

                    var tail = value.substring(value.length - charLength, value.length);
                    var stars = '';
                    for (var i = 0; i < (value.length - charLength); i++)
                        stars += '*';
                    return stars + tail;
                } catch (e) {
                    console.log('starReplace error !');
                    return value;
                }
            };
        }]],
        ['highlight', [function() {
            return function(text, search, caseSensitive) {
                if (text && (search || angular.isNumber(search))) {
                    text = text.toString();
                    search = search.toString();
                    if (caseSensitive) {
                        return text.split(search).join('<span class="ui-match">' + search + '</span>');
                    } else {
                        return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
                    }
                } else {
                    return text;
                }
            };
        }]],
        ['filePath', [function() {
            /**
             * file filter
             * @param  {string} path: origin file path
             * @param  {int} type: file server type:0,supplier;1,mgr
             * @param  {string} suffix: file suffix
             */
            return function(path, type, suffix) {
                if (path) {
                    var host = config.img_supplier_domain;
                    switch (type) {
                        case 0:
                            host = config.img_supplier_domain;
                            break;
                        case 1:
                            host = config.img_pc_domain;
                            break;
                        default:
                            host = config.img_supplier_domain;
                            break;
                    }

                    if (!path || path.indexOf('http://') > -1)
                        return path;
                    //insert suffix
                    if (suffix) {
                        var lastIndexOfDot = path.lastIndexOf('.');
                        var fileName = path.substring(0, lastIndexOfDot);
                        var fileExtension = path.substring(lastIndexOfDot);
                        path = fileName + suffix + fileExtension;
                    }
                    return host + '/' + path;
                } else
                    return 'img/p0.jpg';
            };
        }]],
        ['mainImgPath', [function() {
            /**
             * main image filter
             */
            return function(pics, suffix) {
                var path = '';
                if (pics) {
                    pics.forEach(function(item) {
                        if (item.picType == 2 && item.picIndex == 1) {
                            path = item.picUrl;
                            return;
                        };
                    });
                }
                if (path) {
                    var host = config.img_supplier_domain;
                    if (!path || path.indexOf('http://') > -1)
                        return path;
                    //insert suffix
                    if (suffix) {
                        var lastIndexOfDot = path.lastIndexOf('.');
                        var fileName = path.substring(0, lastIndexOfDot);
                        var fileExtension = path.substring(lastIndexOfDot);
                        path = fileName + suffix + fileExtension;
                    }
                    return host + '/' + path;
                } else
                    return 'img/p0.jpg';
            };
        }]],
        //返回一个对象 或数组第一个对象的 某个属性值，用于在数组或对象中 查找某个属性值
        ['getProValue', [function() {
            return function(source, propertyName) {
                if (source && angular.isObject(source)) {
                    var obj;
                    if (Array.isArray(source)) {
                        if (source.length > 1) {
                            return '';
                        }
                        obj = source[0];
                    }
                    if (obj && propertyName && angular.isObject(obj)) {
                        return obj[propertyName];
                        //return eval("(obj"+"."+propertyName+")");
                    }

                }
                return '';
            };
        }]]
    ];
});
