define(['common/session', 'common/path-helper'], function(session, ph) {
    return ['$scope', '$state', '$timeout', 'pluginsService', 'applicationService', 'builderService', function($scope, $state, $timeout, pluginsService, applicationService, builderService) {

        $scope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                $('.loader-overlay').addClass('loaded');
                $('body > section').animate({
                    opacity: 1,
                }, 200);
            }, 500);
            //pluginsService.init();
            applicationService.init();
            builderService.init();
        });
        
        /**
         * data used in html pages
         */
        $scope.appView = {
            title: '汇和金服运营管理平台',
            isActive: function(states) {
                return isStateActive(states);
            },
            getSubMenuStyle: function(states) {
                return isStateActive(states) ? 'display:"block";' : '';
            }
        };

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

    }];
});
