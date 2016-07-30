define([
    'angular',
    'services/UserService',
    'services/JsonRpcService'
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('authService', authService);

    authService.$inject = ['CONFIG', '$location', '$cookies', 'userService', 'jsonRpcService', '$q'];

    function authService(CONFIG, $location, $cookies, userService, jsonRpcService, $q) {
        var indexUrl = CONFIG.indexUrl;
        var service = this;
        service.sessionName = CONFIG.sessionName;

        return {
            login: login,
            hasLoggedIn: hasLoggedIn,
            logout: logout,
            storeSession: storeSession,
            restoreSession: restoreSession,
            clearSession: clearSession,
            getSessionId: getSessionId,
            getSession: getSession,
            loginRequired: loginRequired,
            getUserId: getUserId,
            getNickname: getNickname,
            getMobile: getMobile,
            getGender: getGender,
            getPromoCode: getPromoCode,
            getAvatar: getAvatar,
            getAvatarId: getAvatarId,
            getResourceId: getResourceId,
            getCityId: getCityId
        }

        function login(username, password) {
            return jsonRpcService.request('user_login', {
                account: username,
                password: password
            });
        }

        function hasLoggedIn(sessionId) {
            return jsonRpcService.request('user_hasLoggedIn', {
                sessionId: sessionId
            });
        }

        function logout() {
            var sessionId = getSessionId();
            if (sessionId) {
                jsonRpcService.request('user_logout', {
                    sessionId: sessionId
                }).then(function (result) {
                    clearSession();
                    window.location.href = indexUrl;
                }, function (error) {
                    clearSession();
                    window.location.href = indexUrl;
                });
            } else {
                window.location.href = indexUrl;
            }
        }


        function storeSession(sessionId) {
            $cookies.put(service.sessionName, sessionId);
            //获取用户信息
           return userService.getProfile(sessionId).then(function (result) {
                $cookies.putObject(sessionId, result);
                return ;
            }, function () {
                alert("保存session失败");
            });
        }

        function restoreSession(sessionId) {
            storeSession(sessionId);
        }

        function clearSession() {
            var sessionId = getSessionId();
            $cookies.remove(service.sessionName);
            $cookies.remove(sessionId);
        }

        function getSessionId() {
            return $cookies.get(service.sessionName);
        }

        function getSession() {
            var sessionId = getSessionId();
            return $cookies.getObject(sessionId);
        }

        function loginRequired() {
            var sessionId = getSessionId();
            if (sessionId) {
                hasLoggedIn(sessionId).then(function (result) {
                }, function () {
                    clearSession();
                    window.location.href = indexUrl;
                });
            } else {
                window.location.href = indexUrl;
            }

        }

        function getUserId() {
            var session = getSession();
            return session.userId;
        }

        function getNickname() {
            var session = getSession();
            return session.nickname;
        }

        function getMobile() {
            var session = getSession();
            return session.mobile;
        }

        function getGender() {
            var session = getSession();
            return session.gender;
        }

        function getPromoCode() {
            var session = getSession();
            return session.promoCode;
        }

        function getAvatar() {
            var session = getSession();
            return session.avatar;
        }

        function getAvatarId() {
            var session = getSession();
            return session.avatarId;
        }

        function getResourceId() {
            var session = getSession();
            return session.resourceId;
        }

        function getCityId() {
            var session = getSession();
            return session.cityId;
        }
    }
});
