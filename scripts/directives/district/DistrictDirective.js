(function () {
    angular.module('xwWeb')
        .directive('district', function () {
            var linkFn = function (scope, element) {
                scope.remove = function () {
                    element.remove();
                }
            };
            return {
                restrict: 'E',
                //scope: true,
                scope: {
                    districtId: "=",
                    removeDistrict: "&"
                },
                link: linkFn,
                template: '<a href="javascript:void(0)" ng-click="remove();removeDistrict({id:districtId})">{{districtId | districtName}} {{districtId | cityName}}<i class="glyphicon glyphicon-remove"></i>&nbsp;</a>'
            };
        })
})();
