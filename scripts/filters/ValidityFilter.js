/**
 * Created by Minghang Long on 2016/5/30.
 */
(function() {
    angular.module('xwWeb')
        .filter('validutyFilter', function() {
            return function(input) {
                var validity = {
                    "0":"待确认",
                    "1":"有效",
                    "2":"无效",
                    "3":"成交"
                }
                input = typeof input != "undefined" ? input.toString() : "";
                return validity[input] ? validity[input] : '';
            }
        })
})();
