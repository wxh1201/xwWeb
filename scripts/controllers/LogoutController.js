define([
    'angular',
    '../services/AuthService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('logoutController', ['authService', logoutController]);

    function logoutController(authService) {
        authService.logout();
    }
})
