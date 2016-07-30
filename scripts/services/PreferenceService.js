define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    angular.module('xwWeb')
        .$register.factory('preferenceService', ['jsonRpcService', preferenceService]);

    function preferenceService(jsonRpcService) {
        return {
            add: add,
            getPreferenceList: getPreferenceList,
            getPreferenceInfo: getPreferenceInfo
        };

        function add(sessionId, resourceId, pluginId, content) {
            return jsonRpcService.request('preference_add', {
                sessionId: sessionId,
                resourceId: resourceId,
                pluginId: pluginId,
                content: content
            })
        }

        function getPreferenceList(sessionId, resourceId, pluginId, pageNo, pageSize) {
            return jsonRpcService.request('preference_getList', {
                sessionId: sessionId,
                resourceId: resourceId,
                pluginId: pluginId,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getPreferenceInfo(sessionId, id) {
            return jsonRpcService.request('preference_get', {
                sessionId: sessionId,
                id: id
            })
        }


    }
});
