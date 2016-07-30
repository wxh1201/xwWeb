/**
 * Created by Administrator on 2016/4/18.
 */
define([
    'angular',
    'services/JsonRpcService'
], function(angular) {
    return angular.module('xwWeb')
        .$register.factory('shopService', ['jsonRpcService', shopService]);

    function shopService(jsonRpcService) {
        return {
            getShopInfo: getShopInfo, //获取店铺信息
            refresh: refresh
        }

        function getShopInfo(sessionId, shopId) {
            return jsonRpcService.request('shop_getShopInfo', {
                sessionId: sessionId,
                shopId: shopId
            })
        }

        function refresh(sessionId, shopId) {
            return jsonRpcService.request('shop_refresh', {
                sessionId: sessionId,
                shopId: shopId
            })
        }
    }
});
