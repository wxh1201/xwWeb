define([
    'angular',
    '../services/ErrorService',
    '../services/AuthService',
    '../services/ExampleService',
    '../services/ServiceService',
    '../services/RequirementService',
    '../directives/scrollThumb/ScrollThumbDirective'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('exampleDetailController', ['$stateParams', 'CONFIG', 'errorService', 'authService', 'exampleService', 'serviceService', 'requirementService', exampleDetailController]);

    function exampleDetailController($stateParams, CONFIG, errorService, authService, exampleService, serviceService, requirementService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.serviceId = $stateParams.serviceId;
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;

        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";

        vm.currentPage = 1;
        vm.totalCount = 0;
        vm.pageSize = 10;

        vm.pluginId = "";
        vm.detail = {};//案例详情
        vm.photoUrls = [];//案例图片url列表
        vm.serviceDetail = {};//服务详情
        vm.requirementList = [];//需求列表

        vm.getList = getList;//获取需求列表


        get();

        function get() {
            exampleService.get(sessionId, vm.serviceId).then(function (result) {
                vm.detail = result;
                if (result.photos) {
                    for (var i = 0, length = result.photos.length; i < length; i++) {
                        vm.photoUrls.push(result.photos[i]['url']);
                    }
                }
                //服务详情
                serviceService.get(sessionId, vm.serviceId).then(function (result) {
                    vm.serviceDetail = result;
                    vm.pluginId = result.pluginId;
                });
                //需求列表
                getList();
            }, function (error) {
                errorService.processError(error);
            });


        }

        function getList() {
            requirementService.getList(sessionId, vm.serviceId, 2, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.requirementList = result.objects;
                vm.totalCount = result.totalCount;
            }, function (error) {
                errorService.processError(error);
            })
        }


    }
});
