define([
  'angular'
], function(angular) {
  return angular.module('xwWeb')
    .$register.factory('errorMessageService', errorMessageService);

  errorMessageService.$inject = [];

  function errorMessageService() {
    var codeMessageMap = {
      "-32602":"参数错误",
      "-31996":"内部错误",
      "-31997":"密码错误",
      "-31998":"用户不存在",
    };
    return {
      getMessage: getMessage
    }

    function getMessage(code) {
      return codeMessageMap[code.toString()];
    }
  }
})