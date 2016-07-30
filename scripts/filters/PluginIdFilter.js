/**
 * Created by xiajingsi on 2016/4/15.
 */
(function() {
    angular.module('xwWeb')
        .filter('pluginIdFilter', function() {
            return function(input) {
                var puginId = {
                    'xw:transfer': '转店',
                    'xw:siting': '找店',
                    'xw:recruitment': '招聘',
                    'xw:reservation': '消费'
                }
                input = typeof input != "undefined" ? input.toString() : "";
                return puginId[input] ? puginId[input] : '';
            }
        })
})();