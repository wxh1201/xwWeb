(function(){
  angular.module('xwWeb')
    .directive('position', function() {
      var linkFn = function(scope, element, attrs) {
        scope.remove = function() {
          element.remove();
        }
      };
      return {
        restrict: 'E',
        scope: {
          positionId: "@id",
          removePosition: "&remove"
        },
        link: linkFn,
        template:'<a href="javascript:void(0)" ng-click="remove();removePosition({id:positionId})">{{positionId | positionName}}<i class="glyphicon glyphicon-remove"></i>&nbsp;</a>'
      };
    })
})();
