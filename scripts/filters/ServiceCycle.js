/**
 * 服务周期
 */
(function() {
  angular.module('xwWeb')
    .filter('serviceCycle', function() {
      return function(input) {
        if (typeof input == "undefined") {
          return "";
        }
        var result = "";
        var days = input/1000/60/60/24;
        if (days/30 >= 1) {
          result += Math.floor(days/30) + "个月";
        }
        if (days%30 >= 1) {
          result += Math.floor(days%30) + "天";
        }
        return result;

      }
    })
})();