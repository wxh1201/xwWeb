/**
 * Created by Xiajingsi on 2016/5/23.
 */
(function(){
    angular.module('xwWeb')
        .directive('recPreference', function() {
            var linkFn = function(scope, element, attrs) {
                scope.remove = function() {
                    element.remove(); 
                }
            };
            return {
                restrict: 'E',
                scope: {
                    recomemdation: "&",
                    removePosition: "&remove"
                },
                link: linkFn,
                template:'<div class="preference-item"><input type="radio" name="" value="perference.id" ng-model="recomemdation.preference"><span></span></div>'
            };
        })
})();
