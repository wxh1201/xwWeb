/**
 * Created by Xiajingsi on 2016/5/26.
 */
define([
    'angular',
], function (angular) {
    return angular.module('xwWeb')
        .$register.factory('paginationService', paginationService);

    paginationService.$inject = ['$location', '$window'];

    function paginationService($location, $window) {
        return {
            paginationPushStatus:paginationPushStatus
        };

        /**
         * 把当前页面放入浏览器的status
         * @param currentPage 当前页面
         * @param title 当前页面的名字
         */
        function paginationPushStatus(currentPage, title) {
            $window.history.pushState({"currentPage": currentPage}, title, $location.absUrl());
        }

    }
});
