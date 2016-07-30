
/**
 * Created by xiajingsi on 2016/5/7.
 */
define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('serviceHistoryService', ['jsonRpcService', serviceHistoryService]);

    function serviceHistoryService(jsonRpcService) {
        return {
          add: add,
          getList: getList
        }

        function add(sessionId, serviceId, content) {
            return jsonRpcService.request('serviceHistory_add', {
                sessionId: sessionId,
                serviceId: serviceId,
                content: content
            })
        }

        function getList(sessionId, serviceId, pageNo, pageSize) {
            return jsonRpcService.request('serviceHistory_getList', {
                sessionId: sessionId,
                serviceId: serviceId,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }
    }
});
