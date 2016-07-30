define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('resourceService', ['jsonRpcService', resourceService]);

    function resourceService(jsonRpcService) {
        return {
            add: add,
            getResourceList: getResourceList,
            getResourceInfo: getResourceInfo,
            matchTransfer: matchTransfer,
            matchSiting: matchSiting,
            getResourceInfo: getResourceInfo
        };

        function add(sessionId, mobile, name) {
            return jsonRpcService.request('resource_add', {
                sessionId: sessionId,
                mobile: mobile,
                name: name
            })
        }

        function getResourceList(sessionId, mobile, pageNo, pageSize) {
            return jsonRpcService.request("resource_getList", {
                sessionId: sessionId,
                mobile: mobile,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getResourceInfo(sessionId, resourceId) {
            return jsonRpcService.request("resource_getInfo", {
                sessionId: sessionId,
                resourceId: resourceId
            })
        }

        function matchTransfer(sessionId, serviceId, resourceMatch, pageNo, pageSize) {
            return jsonRpcService.request("resource_matchTransfer", {
                sessionId: sessionId,
                serviceId: serviceId,
                resourceMatch: resourceMatch,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function matchSiting(sessionId, serviceId, resourceMatch, pageNo, pageSize) {
            return jsonRpcService.request("resource_matchSiting", {
                sessionId: sessionId,
                serviceId: serviceId,
                resourceMatch: resourceMatch,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getResourceInfo(sessionId, resourceId) {
            return jsonRpcService.request("resource_getInfo", {
                sessionId: sessionId,
                resourceId: resourceId
            })
        }
    }
});
