define([
  'angular',
    'services/UtilService'
], function(angular) {
  return angular.module('xwWeb')
    .$register.factory('errorService', ['CONFIG', 'utilService',  errorService]);

  function errorService(CONFIG, utilService) {
    var notLoginCode = CONFIG.notLoginCode;
    var indexUrl = CONFIG.indexUrl;
    var errorMessage = {
      "-32602":"参数错误",
      "-31996":"内部错误",
      "-31997":"密码错误",
      "-31998":"用户不存在",
    };

    return {
      processError: processError
    };

    function processError(error) {
      if (error.code == notLoginCode) {
        alert("用户没有登录/或者Session过期");
          //utilService.showPrompt("用户没有登录/或者Session过期");
        window.location.href = indexUrl;
      } else {
        if (errorMessage[error.code.toString()]) {
          alert(errorMessage[error.code.toString()]);
        } else {
          alert(error.message);
        }
      }
    }

  }
});
