(function() {
  angular.module('xwWeb')
    .filter('transferType', function() {
      return function(input) {
        var transferTypes = {
          "1":"店铺转让",
          "2":"出租招商"
        }
        input = typeof input != "undefined" ? input.toString() : "";
        return transferTypes[input] ? transferTypes[input] : '';
      }
    })
})();