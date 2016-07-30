define([
    'angular'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('jsonRpcService', jsonRpcService);

    jsonRpcService.$inject = ['$http', '$q', '$log', 'CONFIG'];

    function jsonRpcService($http, $q, $log, CONFIG) {
        var service = this;
        service.url = CONFIG.rpcServiceUrl;
        service.id = 1;
        service.jsonRpc = "2.0";
        return {
            request: request
        }

        function request(method, params) {
            var deferred = $q.defer();
            $http.post(service.url, {
                id: service.id,
                jsonrpc: service.id,
                method: method,
                params: params,
            }).then(function (response) {
                var responseData = response.data;
                var result = null;
                if (typeof responseData['result'] != "undefined") {
                    deferred.resolve(responseData['result']);
                } else {
                    deferred.reject(responseData['error']);
                }
            }, function (response) {
                $log.debug(response);
                var result = {
                    code: 500,
                    message: "request failed!",
                }
                deferred.reject(result);
            });
            return deferred.promise;
        }
    }
});
