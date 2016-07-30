/**
 * 日期过滤器，使用方法如{{createTime | date: 'yyyy-MM-dd HH:mm:ss'}}
 */
(function() {
  angular.module('xwWeb')
    .filter('date', function() {
      return function(input, fmt) {
        if(typeof input == "undefined") {
          return "";
        }
        var date = new Date(input);
        var o = {
          "M+" : date.getMonth()+1, //月份
          "d+" : date.getDate(), //日
          "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //12小时
          "H+" : date.getHours(), //24小时
          "m+" : date.getMinutes(), //分
          "s+" : date.getSeconds(), //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S" : date.getMilliseconds() //毫秒
        };

        if(/(y+)/.test(fmt)){
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
          if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          }
        }
        return fmt;
      }
    })
})();