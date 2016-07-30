(function() {
  angular.module('xwWeb').filter('serviceMode', function() {
    return function(input, pluginId) {
      if (input == 1) {
        if (pluginId == "xw:transfer") {
          return "服务到转出为止";
        } else if (pluginId == "xw:siting") {
          return "服务到找到为止";
        }
      } else if (input == 2) {
        return "服务到指定时间";
      } else if (pluginId == "xw:recruitment") {
        return "服务到指定时间";
      }
      return "";
    }
  })
})();