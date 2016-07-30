define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    angular.module('xwWeb')
        .$register.factory('exampleService', ['jsonRpcService', exampleService]);

    function exampleService(jsonRpcService) {
        return {
            getList: getList,
            get: get,
            setServiceExample: setServiceExample
        }

        function getList(sessionId, pluginId, pageNo, pageSize) {
            return jsonRpcService.request('example_getList', {
                sessionId: sessionId,
                pluginId: pluginId,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function get(sessionId, serviceId) {
            return jsonRpcService.request('example_get', {
                sessionId: sessionId,
                serviceId: serviceId
            })
        }

        function setServiceExample(sessionId, serviceId, photos, procedure) {
            return jsonRpcService.request('example_set2', {
                sessionId: sessionId,
                serviceId: serviceId,
                photos: photos,
                procedure: procedure
            })
        }


    }
});
