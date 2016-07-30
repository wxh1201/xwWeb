/**
 * Created by xiajingsi on 2016/4/13.
 */

define([
    'angular',
    '../services/RequirementService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('requirementDetailController', ['$stateParams', 'CONFIG', 'requirementService', 'errorService', requirementDetailController]);

    function requirementDetailController($stateParams, CONFIG, requirementService, errorService) {
        var vm = this;
        vm.requirementId = $stateParams.id;
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;

        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";

        vm.detail = {};
        vm.photos = [];

        get();

        function get() {
            requirementService.get(vm.requirementId).then(function (result) {
                vm.detail = result;
                if (result.pluginId == vm.transferPluginId || result.pluginId == vm.recruitmentPluginId) {
                    for (var i = 0, length = result.content.photos.length; i < length; i++) {
                        vm.photos.push(result.content.photos[i]['url']);
                    }
                }
            }, function (error) {
                errorService.processError(error);
            });
        }
    }
});
