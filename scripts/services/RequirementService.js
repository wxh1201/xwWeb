define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('requirementService', ['jsonRpcService', requirementService]);

    function requirementService(jsonRpcService) {
        return {
            getList: getList,
            getRequirementDetail: getRequirementDetail,
            update: update,
            refresh: refresh

        };

        function getList(sessionId, serviceId, status, pageNo, pageSize) {
            return jsonRpcService.request('requirement_list', {
                sessionId: sessionId,
                serviceId: serviceId,
                status: status,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getRequirementDetail(requirementId) {
            return jsonRpcService.request('requirement_get', {
                requirementId: requirementId
            })
        }

        function update(sessionId, requirementId, pluginId, content) {
            return jsonRpcService.request('requirement_update', {
                sessionId: sessionId,
                requirementId: requirementId,
                pluginId: pluginId,
                content: content
            })
        }

        function refresh(sessionId, requirementId) {
            return jsonRpcService.request('requirement_refresh', {
                sessionId: sessionId,
                requirementId: requirementId
            })
        }
    }
})
