(function() {
  angular.module('xwWeb')
    .filter('businessStatus', function() {
      return function(input) {
        var statuses = {
          "1":"业务中",
          "2":"签约中",
          "3":"已成交",
          "4":"已关闭"
        }
        input = typeof input != "undefined" ? input.toString() : "";
        return statuses[input] ? statuses[input] : '';
      }
    })
})();