angular.module('ui.pagination', [])
    .controller('UibPaginationController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
        var self = this,
            ngModelCtrl = {
                $setViewValue: angular.noop
            }, // nullModelCtrl
            setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

        this.init = function(ngModelCtrl_, config) {
            ngModelCtrl = ngModelCtrl_;
            this.config = config;

            ngModelCtrl.$render = function() {
                self.render();
            };

            if ($attrs.itemsPerPage) {
                $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
                    self.itemsPerPage = parseInt(value, 10);
                    $scope.totalPages = self.calculateTotalPages();
                    updatePage();
                });
            } else {
                this.itemsPerPage = config.itemsPerPage;
            }

            $scope.$watch('totalItems', function(newTotal, oldTotal) {
                if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
                    $scope.totalPages = self.calculateTotalPages();
                    updatePage();
                }
            });
        };

        this.calculateTotalPages = function() {
            var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
            return Math.max(totalPages || 0, 1);
        };

        this.render = function() {
            $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
            $scope.gotoPage = $scope.page;
        };

        $scope.selectPage = function(page, evt) {

            if (evt) {
                evt.preventDefault();
            }

            var clickAllowed = !$scope.ngDisabled || !evt;
            if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
                if (evt && evt.target) {
                    evt.target.blur();
                }
                ngModelCtrl.$setViewValue(page);
                ngModelCtrl.$render();
            }
        };

        $scope.getText = function(key) {
            return $scope[key + 'Text'] || self.config[key + 'Text'];
        };

        $scope.noPrevious = function() {
            return $scope.page === 1;
        };

        $scope.noNext = function() {
            return $scope.page === $scope.totalPages;
        };

        function updatePage() {
            setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

            if ($scope.page > $scope.totalPages) {
                $scope.selectPage($scope.totalPages);
            } else {
                ngModelCtrl.$render();
            }
        }
    }])

.constant('uibPaginationConfig', {
    itemsPerPage: 10,
    boundaryLinks: false,
    directionLinks: true,
    firstText: '首页',
    previousText: '上一页',
    nextText: '下一页',
    lastText: '末页',
    rotate: true
})

.directive('uibPagination', ['$parse', 'uibPaginationConfig', function($parse, paginationConfig) {
    return {
        restrict: 'EA',
        scope: {
            totalItems: '=',
            firstText: '@',
            previousText: '@',
            nextText: '@',
            lastText: '@',
            ngDisabled: '='
        },
        require: ['uibPagination', '?ngModel'],
        controller: 'UibPaginationController',
        controllerAs: 'pagination',
        templateUrl: function(element, attrs) {
            return attrs.templateUrl || 'view/shared/pagination.html';
        },
        replace: true,
        link: function(scope, element, attrs, ctrls) {
            var paginationCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            // Setup configuration parameters
            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

            paginationCtrl.init(ngModelCtrl, paginationConfig);

            if (attrs.maxSize) {
                scope.$parent.$watch($parse(attrs.maxSize), function(value) {
                    maxSize = parseInt(value, 10);
                    paginationCtrl.render();
                });
            }

            // Create page object used in template
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }

            function getPages(currentPage, totalPages) {
                var pages = [];

                // Default page limits
                var startPage = 1,
                    endPage = totalPages;
                var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

                // recompute if maxSize
                if (isMaxSized) {
                    if (rotate) {
                        // Current page is displayed in the middle of the visible ones
                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                        endPage = startPage + maxSize - 1;

                        // Adjust if limit is exceeded
                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = endPage - maxSize + 1;
                        }
                    } else {
                        // Visible pages are paginated with maxSize
                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                        // Adjust last page if limit is exceeded
                        endPage = Math.min(startPage + maxSize - 1, totalPages);
                    }
                }

                // Add page number links
                for (var number = startPage; number <= endPage; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }

                // Add links to move between page sets
                if (isMaxSized && !rotate) {
                    if (startPage > 1) {
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }

                    if (endPage < totalPages) {
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                }

                return pages;
            }

            var originalRender = paginationCtrl.render;
            paginationCtrl.render = function() {
                originalRender();
                if (scope.page > 0 && scope.page <= scope.totalPages) {
                    scope.pages = getPages(scope.page, scope.totalPages);
                }
            };
        }
    };
}])
.run(["$templateCache", function($templateCache) {
    $templateCache.put("view/shared/pagination.html",
        "<ul class=\"page\">\n" +
        "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"fl pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
        "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"fl pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
        "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{f_page_red: page.active,disabled: ngDisabled&&!page.active}\" class=\"fl pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
        "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"fl pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
        "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"fl pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
        "  <li class=\"fl total\">共{{totalPages}}页</li>\n" +
        "  <li class=\"fl end\">到 <input type=\"text\" ng-model=\"gotoPage\" style=\"text-align:center;\" /> 页 <input class=\"btn\" value=\"确定\" ng-click=\"selectPage(gotoPage, $event)\" type=\"button\"></li>\n" +
        "</ul>\n" +
        "");
}]);

