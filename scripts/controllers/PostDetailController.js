define([
    'angular',
    '../services/AuthService',
    '../services/PostService',
    '../services/ErrorService',
    '../directives/scrollThumb/ScrollThumbDirective'
], function (angular) {
    return angular.module('xwWeb')

        .registerController('postDetailController', ['$location', '$stateParams', 'CONFIG', 'authService', 'postService', 'errorService', postDetailController]);

    function postDetailController($location, $stateParams, CONFIG, authService, postService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.pageName = "detail";
        vm.opportunityId = $stateParams.id;
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;

        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.take = take;//领取业务

        vm.waitTake = 0;//待领取
        vm.inBusiness = 1;//业务中
        vm.hasFee = 2;//已收费
        vm.hasTimeout = 3//已过期
        vm.detail = {};//商机详情
        vm.postPhotos = [];//商机图片URL集合


        get();

        function get() {
            postService.get(sessionId, parseInt(vm.opportunityId)).then(function (result) {
                vm.detail = result;
                if (result.pluginId == vm.transferPluginId || result.pluginId == vm.recruitmentPluginId || result.pluginId == vm.reservationPluginId) {
                    for (var i = 0, length = result.content.photos.length; i < length; i++) {
                        vm.postPhotos.push(result.content.photos[i]['url']);
                    }
                }
            }, function (error) {
                errorService.processError(error);
            });
        }

        function take() {
            postService.take(sessionId, parseInt(vm.opportunityId)).then(function (result) {
                var businessId = result;
                $location.path("/businessDetail/" + businessId);
            }, function (error) {
                errorService.processError(error);
                get();
            });
        }
    }
});
