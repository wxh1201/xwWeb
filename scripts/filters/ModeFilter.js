/**
 * Created by Xiajingsi on 2016/4/20. 服务方式过滤器
 */
(function() {
    angular.module('xwWeb')
        .filter('modeFilter', function() {
            return function(input) {
                var mode = {
                    "0": "服务到",
                    "1":"按次",
                    "2":"服务到"
                 };
                input = typeof input != "undefined" ? input.toString() : "";
                return mode[input] ? mode[input] : '';
            }
        })
})();

