/**
 * Created by Administrator on 2016/5/7.
 */

/**
 * Created by xiajingsi on 2016/5/7.
 */
define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('serviceRemarkService', ['jsonRpcService', serviceRemarkService]);

    function serviceRemarkService(jsonRpcService) {
        return {
            add: add,
            getList: getList
        }

        function add(sessionId, serviceId, remark) {
            return jsonRpcService.request('serviceRemark_add', {
                sessionId: sessionId,
                serviceId: serviceId,
                remark: remark
            })
        }

        function getList(sessionId, serviceId, pageNo, pageSize) {
            return jsonRpcService.request('serviceRemark_getList', {
                sessionId: sessionId,
                serviceId: serviceId,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }
    }
});
