/**
 * Created by Xiajingsi on 2016/4/22.
 */

(function() {
    angular.module('xwWeb')
        .filter('cycleFilter', function() {
            return function(input) {
                var cycle = {
                    "30":"1个月",
                    "60":"2个月",
                    "90":"3个月",
                    "180":"半年",
                    "365":"1年"
                }
                input = typeof input != "undefined" ? input.toString() : "";
                return cycle[input] ? cycle[input] : '';
            }
        })
})();
