/**
 * Created by Administrator on 2016/4/21.
 */
(function() {
    angular.module('xwWeb')
        .filter('reqBusinessStatus', function() {
            return function(input) {
                var reqBusinessStatus = {
                    "1":"营业中",
                    "2":"为营业"
                }
                input = typeof input != "undefined" ? input.toString() : "";
                return reqBusinessStatus[input] ? reqBusinessStatus[input] : '';
            }
        })
})();
