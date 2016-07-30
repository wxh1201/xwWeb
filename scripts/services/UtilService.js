/**
 * Created by Xiajingsi on 2016/6/13.
 */
define([
    'angular',
], function(angular) {
    return angular.module('xwWeb')
        .$register.factory('utilService', utilService);

    utilService.$inject = ['$timeout'];

    function utilService($rootScope, $timeout) {
        $rootScope.prompt = false;

        return {
            showPrompt: showPrompt
        };

        function showPrompt(text) {
            $rootScope.promptText = text;
            if($rootScope.prompt == false) {
                $rootScope.prompt = true;
                $timeout(function () {
                    $rootScope.prompt = false;
                }, 2000);
            }
        }
    }
});
