define(['common/session', 'common/path-helper'], function(session, ph) {
    return ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'pluginsService', 'applicationService', 'builderService',
        function($rootScope, $scope, $state, $timeout, $modal, pluginsService, applicationService, builderService) {

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
                }
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
                applicationService.menuResource.query().$promise.then(function(res) {
                    $scope.appView.menus = res.data.items;
                    $timeout(function() {
                        //pluginsService.init();
                        applicationService.init();
                        builderService.init();
                    });
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
