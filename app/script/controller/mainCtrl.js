define(['common/session', 'common/path-helper'], function(session, ph) {
    return ['$rootScope', '$scope', '$state', '$timeout', '$modal', '$filter', '$websocket', 'pluginsService', 'applicationService', 'builderService',
        function($rootScope, $scope, $state, $timeout, $modal, $filter, $websocket, pluginsService, applicationService, builderService) {

            /**
             * data used in html pages
             */
            $scope.appView = {
                title: '汇和金服运营管理平台',
                user: session.getLoginUserInfo(),
                isFull: false,
                isActive: function(states) {
                    return isStateActive(states);
                },
                getSubMenuStyle: function(states) {
                    return isStateActive(states) ? 'display:"block";' : '';
                },
                today: $filter('date')(new Date(), 'yyyy-MM-dd'),
                tomorrow:$filter('date')(new Date(new Date().setDate(new Date().getDate()+1)), 'yyyy-MM-dd'),
            };

            $rootScope.dateOptions = {
                formatYear: 'yyyy',
                formatMonth: 'MM',
                startingDay: 1,
                class: 'datepicker',
                showWeeks: false
            };

            $scope.$on('$viewContentLoaded', function() {
                initMenus();
                $timeout(function() {
                    $('.loader-overlay').addClass('loaded');
                    $('body > section').animate({
                        opacity: 1,
                    }, 200);
                }, 500);
            });

            $rootScope.parseInt = function(number) {
                return parseInt(number, 10);
            }

            function initMenus() {
                if ($scope.appView.menus && $scope.appView.menus.length > 0) {
                    return false;
                }
                applicationService.menuResource.query().$promise.then(function(res) {
                    $scope.appView.menus = res.data;
                    //加延迟处理，数据绑定之后初始化dom样式结构（如：滚动条）
                    $timeout(function() {
                        //pluginsService.init();
                        applicationService.init();
                        builderService.init();
                    }, 200);
                });
            }

            /**
             * if state name is current or not
             * @param  {string|array}  states state name or state list
             * @return {Boolean}
             */
            function isStateActive(states) {
                function stateMatched(state) {
                    var starIndex = state.lastIndexOf('*');
                    var arr = state.split('*');
                    if (arr.length == 2) {
                        return $state.current.name.indexOf(arr[0]) >= 0;
                    }
                    return state === $state.current.name;
                }

                if (typeof states === 'string') {
                    return stateMatched(states);
                } else if (states instanceof Array) {
                    var active = false;
                    for (var i = 0; i < states.length; i++) {
                        var item = states[i];
                        if (stateMatched(item)) {
                            active = true;
                            break;
                        }
                    }
                    return active;
                }
                return false;
            }

            $scope.$on('login', function(event, userInfo) {
                $scope.appView.user = userInfo;
                // // Open a WebSocket connection
                // var dataStream = $websocket('ws://172.21.20.17:8080/websocket');
                //
                // var collection = [];
                //
                // dataStream.onMessage(function(message) {
                //   //collection.push(JSON.parse(message.data));
                //   console.log(message);
                // });
            });

            $scope.logout = function() {
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    //backdrop: true,
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: '确定注销？',
                            processing: false
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            session.logout();
                            $modalInstance.dismiss();
                            $state.go('login')
                            return true;
                        }
                    }
                });
            };

        }
    ];
});
