(function() {
  angular.module('xwWeb')
    .filter('remarkWarn', function() {
      return function(input) {
        if (typeof input == "undefined") {
          return "";
        }
        var currentMilliseconds = new Date().getTime();//当前时间毫秒数
        var warnTimeMilliseconds = input + 5*24*3600*1000;//最后备注时间加5天后的毫秒数
        var distanceMilliseconds = warnTimeMilliseconds - currentMilliseconds;
        var remarkWarn = "";
        if (distanceMilliseconds/1000/3600/24 < 2 && distanceMilliseconds/1000/3600/24 >= 1) {//大于等于1天小于等于2天
          remarkWarn += "1天";
          if (Math.floor(distanceMilliseconds/1000/3600%24) != 0) {
            remarkWarn += Math.floor(distanceMilliseconds/1000/3600%24) + "小时"
          }
          return remarkWarn;
        } else if (distanceMilliseconds/1000/3600 >= 1) {//大于等于1小时小于1天
          return Math.floor(distanceMilliseconds/1000/3600) + "小时";
        } else {//小于1小时
          return Math.floor(distanceMilliseconds/1000/60) + "分钟";
        }
      }
    })
})();