define([
    'angular',
    '../services/AuthService',
    '../services/ErrorMessageService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('loginController', ['CONFIG', '$location', 'authService', 'errorMessageService', '$q', loginController]);

    function loginController(CONFIG, $location, authService, errorMessageService, $q) {
        var landingPath = CONFIG.landingPath;
        var vm = this;
        vm.title = "登录";
        vm.username = "";
        vm.password = "";
        vm.errorMessage = "";
        vm.login = login;

        init();

        function init() {
            var sessionId = authService.getSessionId();
            if (sessionId) {
                authService.hasLoggedIn(sessionId).then(function () {
                    $location.path(landingPath);
                }, function () {
                    authService.clearSession();
                });
            }
        }

        function login() {
            if (vm.username == "" || vm.password == "") {
                vm.errorMessage = "用户名或密码不能为空";
                return;
            } else {
                authService.login(vm.username, vm.password).then(function (result) {
                    return authService.storeSession(result);
                }).then(function(){
                    return $location.path(landingPath);
                }).catch(function (error) {
                    vm.errorMessage = errorMessageService.getMessage(error.code);
                    return;
                });
                // $q.when(authService.login(vm.username, vm.password), function (result) {
                //     authService.storeSession(result).then(function () {
                //         $location.path(landingPath);
                //     }, function (error) {
                //         alert("storeSession error");
                //     })
                // }, function (error) {
                //     vm.errorMessage = errorMessageService.getMessage(error.code);
                //     return;
                // });
            }
        }

    }
});
