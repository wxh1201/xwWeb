define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/ExampleService',
    '../services/ErrorService',
    '../services/OpportunityService'
], function (angular) {
    angular.module('xwWeb')
        .registerController('exampleController', ['$stateParams', 'CONFIG', 'authService', 'businessService', 'exampleService', 'errorService', exampleController]);

    function exampleController($stateParams, CONFIG, authService, businessService, exampleService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.businessId = $stateParams.businessId;
        vm.defaultPicUrl = CONFIG.postDefaultPic;

        vm.pluginId = "";
        vm.currentPage = 1;
        vm.pageSize = 10;
        vm.totalCount = 0;
        vm.list = [];//案例列表

        vm.getList = getList;//获取案例列表

        init();

        function init() {
            businessService.get(sessionId, vm.businessId).then(function (result){
                vm.pluginId = result.pluginId;
                getList();
            },function(error){

            });
        }

        function getList(){
            exampleService.getList(sessionId, vm.pluginId, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.totalCount = result.totalCount;
                vm.list = result.objects;
            }, function (error) {
                errorService.processError(error);
            });
        }
    }
});
