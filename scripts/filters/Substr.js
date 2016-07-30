(function() {
  angular.module('xwWeb')
    .filter('substr', function() {
      return function(input, start, length) {
        input = typeof input != "undefined" ? input.toString() : "";
        return input.substr(start, length);
      }
    })
})();