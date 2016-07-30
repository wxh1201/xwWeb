(function() {
  angular.module('xwWeb')
    .filter('shopStatus', function() {
      return function(input) {
        var shopStatus = {
          "0":"未知",
          "1":"营业中",
          "2":"未营业"
        }
          if(input != null ) {
              input = typeof input != "undefined" ? input.toString() : "";
              return shopStatus[input] ? shopStatus[input] : '';
          } else {
              console.log(input);
          }

      }
    })
})();
