/*
    公共模块
*/
'use strict';

angular.module('mgr.bootstrap', [])
    .directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
        return {
            restrict: 'AC',
            template: '<span class="bar"></span>',
            link: function(scope, el, attrs) {
                el.addClass('butterbar hide');
                scope.$on('$stateChangeStart', function(event) {
                    $anchorScroll();
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                    event.targetScope.$watch('$viewContentLoaded', function() {
                        el.addClass('hide').removeClass('active');
                    })
                });
            }
        };
    }])
    .service('uiLoad', ['$document', '$q', '$timeout', function($document, $q, $timeout) {

        var loaded = [];
        var promise = false;
        var deferred = $q.defer();

        /**
         * Chain loads the given sources
         * @param srcs array, script or css
         * @returns {*} Promise that will be resolved once the sources has been loaded.
         */
        this.load = function(srcs) {
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            var self = this;
            if (!promise) {
                promise = deferred.promise;
            }
            angular.forEach(srcs, function(src) {
                promise = promise.then(function() {
                    return src.indexOf('.css') >= 0 ? self.loadCSS(src) : self.loadScript(src);
                });
            });
            deferred.resolve();
            return promise;
        }

        /**
         * Dynamically loads the given script
         * @param src The url of the script to load dynamically
         * @returns {*} Promise that will be resolved once the script has been loaded.
         */
        this.loadScript = function(src) {
            if (loaded[src]) return loaded[src].promise;

            var deferred = $q.defer();
            var script = $document[0].createElement('script');
            script.src = src;
            script.onload = function(e) {
                $timeout(function() {
                    deferred.resolve(e);
                });
            };
            script.onerror = function(e) {
                $timeout(function() {
                    deferred.reject(e);
                });
            };
            $document[0].body.appendChild(script);
            loaded[src] = deferred;

            return deferred.promise;
        };

        /**
         * Dynamically loads the given CSS file
         * @param href The url of the CSS to load dynamically
         * @returns {*} Promise that will be resolved once the CSS file has been loaded.
         */
        this.loadCSS = function(href) {
            if (loaded[href]) return loaded[href].promise;

            var deferred = $q.defer();
            var style = $document[0].createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = href;
            style.onload = function(e) {
                $timeout(function() {
                    deferred.resolve(e);
                });
            };
            style.onerror = function(e) {
                $timeout(function() {
                    deferred.reject(e);
                });
            };
            $document[0].head.appendChild(style);
            loaded[href] = deferred;

            return deferred.promise;
        };
    }])
    .directive('uiFullscreen', ['uiLoad', '$document', '$window', function(uiLoad, $document, $window) {
        return {
            restrict: 'AC',
            template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
            link: function(scope, el, attr) {
                el.addClass('hide');
                uiLoad.load('library/components/screenfull.min.js').then(function() {
                    // disable on ie11
                    if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
                        el.removeClass('hide');
                    }
                    el.on('click', function() {
                        var target;
                        attr.target && (target = $(attr.target)[0]);
                        screenfull.toggle(target);
                    });
                    if (screenfull && screenfull.raw) {
                        $document.on(screenfull.raw.fullscreenchange, function() {
                            if (screenfull.isFullscreen) {
                                el.addClass('active');
                            } else {
                                el.removeClass('active');
                            }
                        });
                    }
                });
            }
        };
    }])
    .directive('uiNav', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                var _window = $(window),
                    _mb = 768,
                    wrap = $('.app-aside'),
                    next,
                    backdrop = '.dropdown-backdrop';
                // unfolded
                el.on('click', 'a', function(e) {
                    next && next.trigger('mouseleave.nav');
                    var _this = $(this);
                    _this.parent().siblings(".active").toggleClass('active');
                    _this.next().is('ul') && _this.parent().toggleClass('active') && e.preventDefault();
                    // mobile
                    _this.next().is('ul') || ((_window.width() < _mb) && $('.app-aside').removeClass('show off-screen'));
                });

                // folded & fixed
                el.on('mouseenter', 'a', function(e) {
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                    if (!$('.app-aside-fixed.app-aside-folded').length || (_window.width() < _mb) || $('.app-aside-dock').length) return;
                    var _this = $(e.target),
                        top, w_h = $(window).height(),
                        offset = 50,
                        min = 150;

                    !_this.is('a') && (_this = _this.closest('a'));
                    if (_this.next().is('ul')) {
                        next = _this.next();
                    } else {
                        return;
                    }

                    _this.parent().addClass('active');
                    top = _this.parent().position().top + offset;
                    next.css('top', top);
                    if (top + next.height() > w_h) {
                        next.css('bottom', 0);
                    }
                    if (top + min > w_h) {
                        next.css('bottom', w_h - top - offset).css('top', 'auto');
                    }
                    next.appendTo(wrap);

                    next.on('mouseleave.nav', function(e) {
                        $(backdrop).remove();
                        next.appendTo(_this.parent());
                        next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
                        _this.parent().removeClass('active');
                    });

                    $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next) {
                        next && next.trigger('mouseleave.nav');
                    });

                });

                wrap.on('mouseleave', function(e) {
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                });
            }
        };
    }])
    .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                el.on('click', function(e) {
                    e.preventDefault();
                    var classes = attr.uiToggleClass.split(','),
                        targets = (attr.target && attr.target.split(',')) || Array(el),
                        key = 0;
                    angular.forEach(classes, function(_class) {
                        var target = targets[(targets.length && key)];
                        (_class.indexOf('*') !== -1) && magic(_class, target);
                        $(target).toggleClass(_class);
                        key++;
                    });
                    $(el).toggleClass('active');

                    function magic(_class, target) {
                        var patt = new RegExp('\\s' +
                            _class.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
                            '\\s', 'g');
                        var cn = ' ' + $(target)[0].className + ' ';
                        while (patt.test(cn)) {
                            cn = cn.replace(patt, ' ');
                        }
                        $(target)[0].className = $.trim(cn);
                    }
                });
            }
        };
    }])
    .directive('focusIf', ['$timeout', function($timeout) {
        function link($scope, $element, $attrs) {
            var dom = $element[0];
            if ($attrs.focusIf) {
                $scope.$watch($attrs.focusIf, focus);
            } else {
                focus(true);
            }

            function focus(condition) {
                if (condition) {
                    $timeout(function() {
                        dom.focus();
                    }, $scope.$eval($attrs.focusDelay) || 0);
                }
            }
        }
        return {
            restrict: 'A',
            link: link
        };
    }])
    .service('toaster', ['$rootScope', function($rootScope) {
        this.pop = function(type, title, body, timeout, bodyOutputType, clickHandler) {
            this.toast = {
                type: type,
                title: title,
                body: body,
                timeout: timeout,
                bodyOutputType: bodyOutputType,
                clickHandler: clickHandler
            };
            $rootScope.$broadcast('toaster-newToast');
        };

        this.clear = function() {
            $rootScope.$broadcast('toaster-clearToasts');
        };
    }])
    .constant('toasterConfig', {
        'limit': 0, // limits max number of toasts 
        'tap-to-dismiss': true,
        'close-button': false,
        'newest-on-top': true,
        //'fade-in': 1000,            // done in css
        //'on-fade-in': undefined,    // not implemented
        //'fade-out': 1000,           // done in css
        // 'on-fade-out': undefined,  // not implemented
        //'extended-time-out': 1000,    // not implemented
        'time-out': 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
        'icon-classes': {
            error: 'toast-error',
            info: 'toast-info',
            wait: 'toast-wait',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        'body-output-type': '', // Options: '', 'trustedHtml', 'template'
        'body-template': 'toasterBodyTmpl.html',
        'icon-class': 'toast-info',
        'position-class': 'toast-top-right',
        'title-class': 'toast-title',
        'message-class': 'toast-message'
    })
    .directive('toasterContainer', ['$compile', '$timeout', '$sce', 'toasterConfig', 'toaster',
        function($compile, $timeout, $sce, toasterConfig, toaster) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true, // creates an internal scope for this directive
                link: function(scope, elm, attrs) {

                    var id = 0,
                        mergedConfig;

                    mergedConfig = angular.extend({}, toasterConfig, scope.$eval(attrs.toasterOptions));

                    scope.config = {
                        position: mergedConfig['position-class'],
                        title: mergedConfig['title-class'],
                        message: mergedConfig['message-class'],
                        tap: mergedConfig['tap-to-dismiss'],
                        closeButton: mergedConfig['close-button']
                    };

                    scope.configureTimer = function configureTimer(toast) {
                        var timeout = typeof(toast.timeout) == "number" ? toast.timeout : mergedConfig['time-out'];
                        if (timeout > 0)
                            setTimeout(toast, timeout);
                    };

                    function addToast(toast) {
                        toast.type = mergedConfig['icon-classes'][toast.type];
                        if (!toast.type)
                            toast.type = mergedConfig['icon-class'];

                        id++;
                        angular.extend(toast, {
                            id: id
                        });

                        // Set the toast.bodyOutputType to the default if it isn't set
                        toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type'];
                        switch (toast.bodyOutputType) {
                            case 'trustedHtml':
                                toast.html = $sce.trustAsHtml(toast.body);
                                break;
                            case 'template':
                                toast.bodyTemplate = toast.body || mergedConfig['body-template'];
                                break;
                        }

                        scope.configureTimer(toast);

                        if (mergedConfig['newest-on-top'] === true) {
                            scope.toasters.unshift(toast);
                            if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
                                scope.toasters.pop();
                            }
                        } else {
                            scope.toasters.push(toast);
                            if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
                                scope.toasters.shift();
                            }
                        }
                    }

                    function setTimeout(toast, time) {
                        toast.timeout = $timeout(function() {
                            scope.removeToast(toast.id);
                        }, time);
                    }

                    scope.toasters = [];
                    scope.$on('toaster-newToast', function() {
                        addToast(toaster.toast);
                    });

                    scope.$on('toaster-clearToasts', function() {
                        scope.toasters.splice(0, scope.toasters.length);
                    });
                },
                controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                    $scope.stopTimer = function(toast) {
                        if (toast.timeout) {
                            $timeout.cancel(toast.timeout);
                            toast.timeout = null;
                        }
                    };

                    $scope.restartTimer = function(toast) {
                        if (!toast.timeout)
                            $scope.configureTimer(toast);
                    };

                    $scope.removeToast = function(id) {
                        var i = 0;
                        for (i; i < $scope.toasters.length; i++) {
                            if ($scope.toasters[i].id === id)
                                break;
                        }
                        $scope.toasters.splice(i, 1);
                    };

                    $scope.click = function(toaster) {
                        if ($scope.config.tap === true) {
                            if (toaster.clickHandler && angular.isFunction($scope.$parent.$eval(toaster.clickHandler))) {
                                var result = $scope.$parent.$eval(toaster.clickHandler)(toaster);
                                if (result === true)
                                    $scope.removeToast(toaster.id);
                            } else {
                                if (angular.isString(toaster.clickHandler))
                                    console.log("TOAST-NOTE: Your click handler is not inside a parent scope of toaster-container.");
                                $scope.removeToast(toaster.id);
                            }
                        }
                    };
                }],
                template: '<div  id="toast-container" ng-class="config.position">' +
                    '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="click(toaster)" ng-mouseover="stopTimer(toaster)"  ng-mouseout="restartTimer(toaster)">' +
                    '<button class="toast-close-button" ng-show="config.closeButton">&times;</button>' +
                    '<div ng-class="config.title">{{toaster.title}}</div>' +
                    '<div ng-class="config.message" ng-switch on="toaster.bodyOutputType">' +
                    '<div ng-switch-when="trustedHtml" ng-bind-html="toaster.html"></div>' +
                    '<div ng-switch-when="template"><div ng-include="toaster.bodyTemplate"></div></div>' +
                    '<div ng-switch-default >{{toaster.body}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            };
        }
    ])
    .factory('defaultService', [function() {
        //终端数据
        var terminals = [];
        return {
            getTerminals: function() {
                return terminals;
            },
            setTerminals: function(data) {
                terminals = data;
            },
            getTerminal: function(id) {
                var result = null;
                terminals.every(function(terminal) {
                    if (terminal.id == id) {
                        result = terminal;
                        return false;
                    }
                    return true;
                });
                return result;
            }
        };
    }])
    .directive('bindValidity', ['$parse', function($parse) {
        return {
            restrict: 'A',
            scope: false,
            controller: ['$scope', '$attrs', function($scope, $attrs) {
                var assign = $parse($attrs.bindValidity).assign;

                if (!angular.isFunction(assign)) {
                    throw new Error('the expression of bindValidity is not settable: ' + $attrs.bindValidity);
                }

                this.setFormController = function(formCtrl) {
                    if (!formCtrl) {
                        throw new Error('bindValidity requires one of <form> or ng-form');
                    }
                    $scope.$watch(
                        function() {
                            return formCtrl.$invalid;
                        },
                        function(newval) {
                            assign($scope, newval);
                        }
                    );
                };
            }],
            require: ['?form', '?ngForm', 'bindValidity'],
            link: function(scope, elem, attrs, ctrls) {
                var formCtrl, bindValidity;
                formCtrl = ctrls[0] || ctrls[1];
                bindValidity = ctrls[2];
                bindValidity.setFormController(formCtrl);
            }
        };
    }])
    .directive('slPageSizeChanger', function() {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                itemsPerPageList: '=',
                totalItems: '=',
            },
            template: '<ul class="pagination pagination-sm inline"> \
                <li>每页 <select class="form-control input-sm inline w45 p-l-3-o-0" ng-model="itemsPerPage" ng-options="o as o for o in itemsPerPageList" ng-change="selectItemPerPage(o)"></select> 条</li> \
            </ul>',

            //<li><form ng-submit="selectItemPerPage(itemsPerPage)" class="inline"><span class="inline">每页 <input type="text" class="form-control inline no-padding input-sm w30 h28 text-center" ng-model="itemsPerPage" /> 条</span></form></li> \

            // '<ul class="pagination inline"> \
            //   <li ng-repeat="itemValue in itemsPerPageList" ng-class="{active: itemsPerPage == itemValue}"><a href="" ng-click="selectItemPerPage(itemValue)">{{itemValue}}</a></li> \
            //   <li ng-if="totalItems" class="disabled"><a href="">Total : {{totalItems}}</a></li> \
            // </ul>',
            link: function(scope, element, attrs, ngModel) {
                scope.itemsPerPageList = [10, 50, 100, 200];
                ngModel.$viewChangeListeners.push(function() {
                    scope.$eval(attrs.ngChange);
                });
                ngModel.$render = function() {
                    scope.itemsPerPage = ngModel.$modelValue;
                };
                scope.selectItemPerPage = function(value) {
                    //if (value <=0 || isNaN(value)) return false;
                    //if (scope.itemsPerPage !== value) {
                    //scope.itemsPerPage = value;
                    ngModel.$setViewValue(scope.itemsPerPage);
                    //}
                };
            }
        };
    });
