define([
    'angular',
    '../services/AuthService',
    '../services/PostService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('searchController', ['$stateParams', 'CONFIG', 'authService', 'postService', 'errorService', searchController]);

    function searchController($stateParams, CONFIG, authService, postService, errorService) {
        authService.loginRequired();
        var sessionId = authService.getSessionId();
        var vm = this;
        //页面所需基本数据
        //vm.userId = authService.getUserId();
        vm.nickname = authService.getNickname();
        vm.cityId = authService.getCityId();
        vm.defaultPicUrl = CONFIG.postDefaultPic;
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.allStatus = "all";
        vm.waitTake = 0;
        vm.inBusiness = 1;
        vm.hasFee = 2;
        vm.hasTimeout = 3
        //查询参数
        vm.cursor = -1;
        vm.pageNo = 0;
        vm.currentPage = 1;
        vm.pageSize = CONFIG.pageSize;
        //query相关参数
        vm.keyword = $stateParams.keyword;
        vm.pluginId = vm.allPluginId;
        vm.status = vm.allStatus;
        vm.orderBy = 1;

        //搜索结果
        vm.totalCount = 0;
        vm.searchResult = [];

        vm.search = search;
        vm.newSearch = newSearch;//重新搜索
        vm.changePlugin = changePlugin;
        vm.changeStatus = changeStatus;
        vm.take = take;//领取业务


        search();

        function search() {
            var query = {
                keyword: vm.keyword,
                cityId: vm.cityId,
                longitude: 0,
                latitude: 0,
                pluginId: vm.pluginId,
                orderBy: vm.orderBy,
            };
            if (vm.status != "all") {
                query['status'] = vm.status;
            }
            postService.search(sessionId, query, vm.cursor, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.totalCount = result.totalCount;
                vm.cursor = result.cursor;
                vm.searchResult = result.objects;
            }, function (error) {
                errorService.processError(error);
            })
        }

        function newSearch() {
            if (vm.keyword != "") {
                vm.pluginId = vm.allPluginId;
                vm.orderBy = 1;
                vm.status = vm.allStatus;
                vm.cursor = -1;
                vm.currentPage = 1;
                search();
            }
        }

        function changePlugin(pluginId) {
            vm.pluginId = pluginId;
            search();
        }

        function changeStatus(status) {
            vm.status = status;
            search();
        }

        function take(opportunityId) {
            postService.take(sessionId, opportunityId).then(function (result) {
                alert("领取成功");
                search();
            }, function (error) {
                errorService.processError(error);
            });
        }

    }
});
