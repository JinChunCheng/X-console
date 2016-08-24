define(['text'],
    function() {
        var controllerProvider, serviceProvider, compileProvider, filterProvider;

        function init() {
            controllerProvider = arguments[0][0];
            serviceProvider = arguments[0][1];
            compileProvider = arguments[0][2];
            filterProvider = arguments[0][3];
        };

        function configCtrls(ctrls) {
            if (ctrls && ctrls.length) {
                ctrls.forEach(function(item) {
                    if (angular.isDefined(item.path)) {
                        require([item.path], function(ctrl) {
                            controllerProvider.register(item.name, ctrl);
                        });
                    }
                });
            }
        }

        function config(url, templatePath, controllerPath, lazyResources, abstract) {

            var defer, result = {};
            result.url = url;
            result.templateUrl = templatePath.replace("../", "") + '?r=' + (new Date()).getTime();
            result.controller = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);
            result.params = lazyResources ? lazyResources.params : null;
            result.abstract = abstract;
            result.resolve = {
                deps: function($q) {
                    defer = $q.defer();
                    var dependencies = ["text!" + templatePath, controllerPath];
                    if (lazyResources) {
                        if (lazyResources.directives)
                            dependencies = dependencies.concat(lazyResources.directives);
                        if (lazyResources.services)
                            dependencies = dependencies.concat(lazyResources.services);
                        if (lazyResources.filters)
                            dependencies = dependencies.concat(lazyResources.filters);
                    }
                    require(dependencies, function() {
                        var indicator = 0;
                        var template = arguments[indicator++];
                        if (angular.isDefined(controllerPath)) {
                            controllerProvider.register(controllerPath.substring(controllerPath.lastIndexOf("/") + 1), arguments[indicator]);
                            indicator++;
                        }
                        if (lazyResources) {
                            if (angular.isDefined(lazyResources.directives)) {
                                for (var i = 0; i < lazyResources.directives.length; i++) {
                                    compileProvider.directive.apply(null, arguments[indicator]);
                                    indicator++;
                                }
                            }
                            if (angular.isDefined(lazyResources.services)) {
                                for (var i = 0; i < lazyResources.services.length; i++) {
                                    serviceProvider.service.apply(null, arguments[indicator]);
                                    indicator++;
                                }
                            }
                            if (angular.isDefined(lazyResources.filters)) {
                                for (var i = 0; i < lazyResources.filters.length; i++) {
                                    var filterItem = arguments[indicator];
                                    //如果是二维数组，则是多个过滤器
                                    if (Object.prototype.toString.call(filterItem[0]) === '[object Array]') {
                                        for (var j = 0; j < filterItem.length; j++) {
                                            filterProvider.register.apply(null, filterItem[j]);
                                        }
                                    } else {
                                        filterProvider.register.apply(null, filterItem);
                                    }
                                    indicator++;
                                }
                            }

                        }
                        defer.resolve();
                    });
                    return defer.promise;
                }
            };
            return result;
        };
        return {
            init: init,
            config: config,
            configCtrls: configCtrls
        };
    }
);
