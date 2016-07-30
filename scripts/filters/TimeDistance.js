(function() {
  angular.module('xwWeb')
    .filter('timeDistance', function() {
      return function(input) {
        if (typeof input == "undefined") {
          return "";
        }
        var date = new Date();
        var currentMilliseconds = date.getTime();
        if (input <= currentMilliseconds) {
          return '0天';
        }
        var distance = input - currentMilliseconds;
        var minutes = Math.floor(distance/1000/60);
        if (minutes >= 24 * 60) {
          return Math.floor(minutes/(24*60)) + '天';
        } else if (minutes >= 60) {
          return Math.floor(minutes / 60) + '小时';
        } else {
          return minutes + '分钟';
        }
      }
    })
})();