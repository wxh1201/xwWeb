define([
    'angular',
    '../services/AuthService',
    '../services/RecommendService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('recommendDetailController', ['$stateParams', 'CONFIG', 'authService', 'recommendService', 'errorService', recommendDetailController]);

    function recommendDetailController($stateParams, CONFIG, authService, recommendService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.pageName = "detail";
        vm.recommendId = $stateParams.id;
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;

        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";

        vm.pluginId = "";//插件ID
        vm.detail = {};//推荐详情
        vm.preference = {};//偏好
        get();

        function get() {
            recommendService.get(sessionId, vm.recommendId).then(function (result) {
                vm.detail = result;
                vm.pluginId = result.requirement.pluginId;
                vm.preference = result.resource.preference;
            }, function (error) {
                errorService.processError(error);
            });

        }
    }
});
