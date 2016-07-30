(function(){
  angular.module('xwWeb')
    .directive('mobile', function() {
      var REGEXP = /^1\d{10}$/;
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$validators.mobile = function(modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              return true;
            }
            if (REGEXP.test(viewValue)) {
              return true;
            }
            return false;
          }
        }
      }
    })
})();