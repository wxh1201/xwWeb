/**
 * Created by xiajingsi on 2016/5/10.
 */
(function(){
    angular.module('xwWeb')
        .directive('suitableIndustry', function() {
            var linkFn = function(scope, element) {
                scope.remove = function() {
                    element.remove();
                };
                scope.removeSuitableIndustry = function (id) {
                    for (var i = 0, length = scope.suitableIndustryIds.length; i < length; i++) {
                        if (scope.suitableIndustryIds[i] == id) {
                            scope.suitableIndustryIds.splice(i, 1);
                            break;
                        }
                    }
                }
            };
            return {
                restrict: 'A',
                scope: true,
                link: linkFn,
                template:'<a href="javascript:void(0)" ng-click="remove();removeSuitableIndustry(suitableIndustryId)">{{suitableIndustryId | industryName}}<i class="glyphicon glyphicon-remove"></i>&nbsp;</a>'
            };
        })
})();
