/**
 * 简短时间，如1小时前，3分钟前
 */
(function() {
  angular.module('xwWeb')
    .filter('recommendTime', function() {
      return function(input) {
        if (typeof input == "undefined") {
          return "";
        }
        var date = new Date();
        var currentMilliseconds = date.getTime();
        if (input >= currentMilliseconds) {
          return "";
        }
        var distance = currentMilliseconds - input;
        var minutes = Math.floor(distance/1000/60);
        if (minutes == 0) {
          return "刚刚";
        } else if (minutes < 60) {
          return minutes + '分钟前';
        } else if (minutes >= 60 && minutes < 24 * 60) {
          return Math.floor(minutes / 60) + '小时前';
        } else {
          var date = new Date(input);
          var year = date.getFullYear();

          var month = date.getMonth() + 1;
          if (month.toString().length == 1) {
            month = "0" + month
          }
          var day = date.getDate()
          if (day.toString().length == 1) {
            day = "0" + day;
          }

          return year + "-" + month + "-" + day;

        }
      }
    })
})();