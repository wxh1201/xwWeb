(function () {
    angular.module('xwWeb')
        .directive('thumb', function () {
            var linkFn = function (scope, element, attrs) {
                scope.remove = function () {
                    element.remove();
                }

            };
            return {
                restrict: 'E',
                scope: {
                    photoId: "@id",
                    thumbUrl: "@url",
                    removeThumb: "&remove"
                },
                link: linkFn,
                templateUrl: 'scripts/directives/thumb/thumb.html',
            };
        })
})();
