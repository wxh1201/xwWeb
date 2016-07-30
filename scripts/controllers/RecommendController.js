define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/RecommendService',
    '../services/ErrorService',
    '../services/OpportunityService'
], function (angular) {
    angular.module('xwWeb')
        .registerController('recommendController', ['$stateParams', 'authService', 'recommendService', 'errorService', recommendController]);

    function recommendController($stateParams, authService, recommendService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.systemRecommend = 0;//推荐类型-系统推荐
        vm.salesmanRecommend = 1;//推荐类型-业务员推荐
        vm.selfRecommend = 2;//推荐类型-自荐
        vm.userRecommend = 3;//推荐类型-用户推荐
        vm.businessId = $stateParams.businessId;

        vm.currentPage = 1;
        vm.pageSize = 30;
        vm.totalCount = 0;
        vm.list = [];//推荐列表

        vm.getList = getList;//获取推荐列表

        getList();

        function getList() {
            recommendService.getList(sessionId, vm.businessId, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.totalCount = result.totalCount;
                vm.list = result.objects;
            }, function (error) {

            })
        }
    }
});
