define([
  'angular',
  'services/JsonRpcService'
], function(angular) {
  return angular.module('xwWeb')
    .$register.factory('userService', userService);

  userService.$inject = ['jsonRpcService'];

    function userService(jsonRpcService) {
        return {
            getProfile: getProfile,
            setCity: setCity,
            getUserInfo: getUserInfo
        }

    function getProfile(sessionId) {
      return jsonRpcService.request('user_getProfile', {
        sessionId: sessionId
      })
    }

    function setCity(sessionId, cityId) {
      return jsonRpcService.request('user_setCity', {
        sessionId: sessionId,
        cityId: cityId
      })
    }

        function getUserInfo(sessionId,userId){
            return jsonRpcService.request('user_getUserInfo', {
                sessionId: sessionId,
                userId: userId
            })
        }
    }
});