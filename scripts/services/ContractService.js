/**
 * Created by Administrator on 2016/4/20.
 */
define([
    'angular',
    '../services/JsonRpcService'
],function (angular) {
    contractService.$inject = ['jsonRpcService'];
    return angular.module('xwWeb')
        .$register.factory('contractService', contractService);

    function contractService(jsonRpcService) {
        return {
            getContract: getContract
        };

        function getContract(sessionId, serviceId) {
            console.log(sessionId);
            return jsonRpcService.request('contract_getByServiceId',{
                sessionId: sessionId,
                serviceId: serviceId
            })
        }
    }

});
