(function() {
  angular.module('xwWeb')
    .filter('postStatus', function() {
      return function(input) {
        var postStatus = {
          "0":"待领取",
          "1":"业务中",
          "2":"已收费",
          "3":"已过期"
        }
        input = typeof input != "undefined" ? input.toString() : "";
        return postStatus[input] ? postStatus[input] : '';
      }
    })
})();