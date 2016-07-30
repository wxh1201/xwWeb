define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('businessService', businessService);

    businessService.$inject = ['jsonRpcService'];

    function businessService(jsonRpcService) {
        return {
            getList: getList,//业务列表
            getQuota: getQuota,//获取限额/配额
            get: get,//业务详情
            abort: abort,//关闭业务
            bargain: bargain,//报价
            postpone: postpone,//延期
            take: take//领取
        }

        function getList(sessionId, pluginId, status, orderType, pageNo, pageSize) {
            return jsonRpcService.request('business_getList', {
                sessionId: sessionId,
                pluginId: pluginId,
                status: status,
                orderType: orderType,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getQuota(sessionId) {
            return jsonRpcService.request('business_getQuota', {
                sessionId: sessionId
            })
        }

        function get(sessionId, businessId) {
            return jsonRpcService.request('business_get', {
                sessionId: sessionId,
                businessId: businessId
            })
        }

        function abort(sessionId, businessId, isValid, reason) {
            return jsonRpcService.request('business_abort', {
                sessionId: sessionId,
                businessId: businessId,
                isValid: isValid,
                reason: reason
            })
        }

        function bargain(sessionId, businessId, priceInfo) {
            var params = {
                sessionId: sessionId,
                businessId: businessId,
                priceInfo: priceInfo
            };
            return jsonRpcService.request('business_bargain', params);
        }

        function postpone(sessionId, businessId) {
            return jsonRpcService.request('business_postpone', {
                sessionId: sessionId,
                businessId: businessId
            });
        }

        function take(sessionId, oppId) {
            return jsonRpcService.request('business_take', {
                sessionId: sessionId,
                opportunityId: oppId
            });
        }

    }
});
