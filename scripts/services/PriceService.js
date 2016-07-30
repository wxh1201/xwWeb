/**
 * Created by xiajingsi on 2016/4/27.
 */
define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('priceService', ['jsonRpcService', priceService]);

    function priceService(jsonRpcService) {
        return {
            get: get
        };

        function get(pluginId, param) {
            return jsonRpcService.request('price_get', {
                pluginId: pluginId,
                param: param
            })
        }
    }
});
