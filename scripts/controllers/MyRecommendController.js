/**
 * Created by Xiajingsi on 2016/6/12.
 */
define([
    'angular',
    '../services/AuthService',
    '../services/ErrorService',
    '../services/RecommendService',
    '../services/OpportunityService',
    '../services/PaginationService',
    '../services/UtilService'
], function (angular) {

    'use strict';

    return angular.module('xwWeb')
        .registerController('myRecommendController', ['CONFIG', '$stateParams', 'authService', 'errorService', '$window', '$location', 'recommendService', 'OpportunityService', 'paginationService', 'utilService', myRecommendController]);

    function myRecommendController(CONFIG, $stateParams, authService, errorService, $window, $location, recommendService, OpportunityService, paginationService, utilService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        var serviceId = $stateParams.serviceId;
        var check = $stateParams.check;
        var cursor = 0;

        //基本参数
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.check =  $stateParams.check == 'true'? true:false ;
        console.log(typeof vm.check, "vm.check");

        //查询参数
        vm.currentPage = 1;//必须是1，插件会自动调用当前页数来显示
        vm.pageSize = CONFIG.pageSize;
        vm.checkStatus = -1;

        //查询结果
        vm.totalCount = 0;
        vm.numPages = 1;
        vm.myRecommendList = [];

        //提供给view的方法
        vm.pageGetMyRecommendList = pageGetMyRecommendList;//添加无刷新改链接后的获取服务列表方法
        vm.getRecommendInfo = getRecommendInfo;//推荐详情
        vm.closeDetail = closeDetail;//关闭详情
        vm.checkRecommend = checkRecommend;//处理推荐

        pageGetMyRecommendList();//获取服务列表，同分页的一样

        ///////////////////////

        function pageGetMyRecommendList() {
            paginationService.paginationPushStatus(vm.currentPage, '我的推荐');
            getMyRecommendList();
        }


        function getMyRecommendList() {
            if(check == 'true') {
                vm.checkStatus = 0;
            } else {
                vm.checkStatus = -1;//审核状态 (0 还未审核， 1 审核完了 ,  2 不需要审核 , -1 所有)
            }
            recommendService.getListOfService(sessionId, serviceId, vm.checkStatus, vm.currentPage - 1, vm.pageSize, cursor).then(function (result) {
                vm.myRecommendList = result["objects"];
                vm.totalCount = result.totalCount;
                vm.complete = true;
                if(vm.myRecommendList.length > 0) {
                    for(var i = 0, length = vm.myRecommendList.length; i < length; i ++  ){
                        getOpportunityInfo(vm.myRecommendList[i].resourceId, vm.myRecommendList[i]);
                    }
                }
                cursor = result.cursor;
            }).catch( function (error) {
                errorService.processError(error);
            });
        }

        function getOpportunityInfo(requirementId, recommendObj) {
            OpportunityService.getInfo(sessionId, requirementId).then(function (result) {
                if(result.content.industryId){
                    recommendObj.industryId = result.content.industryId;
                }

                if(result.pluginId == vm.transferPluginId) {
                    recommendObj.area = result.content.area
                } else if(result.pluginId == vm.sitingPluginId) {
                    recommendObj.minArea = result.content.minArea;
                    recommendObj.maxArea = result.content.maxArea;
                }
            }).catch(function (error) {
                errorService.processError(error);
            })
        }

        function getRecommendInfo(id) {
            var recommendObj;
            for(var i = 0, length = vm.myRecommendList.length; i < length; i ++ ) {
                if(vm.myRecommendList[i].id == id) {
                    recommendObj = vm.myRecommendList[i];
                    if(vm.myRecommendList[i].expand == true) {
                        vm.myRecommendList[i].expand = false;
                        return;
                    } else {
                        vm.myRecommendList[i].expand = true;
                    }
                }
            }
            recommendService.getRecommendInfo(sessionId, id).then(function (result) {
                recommendObj.info = result;
            }).catch(function (error) {
                errorService.processError(error);
            })
        }

        function closeDetail(id) {
            for(var i = 0, length = vm.myRecommendList.length; i < length; i ++ ) {
                if(vm.myRecommendList[i].id == id) {
                    vm.myRecommendList[i].expand = false;
                }
            }
        }

        function checkRecommend(id, handle, reason) {
            recommendService.checkRecommend(sessionId, id, handle, reason).then(function () {
                utilService.showPrompt("处理成功");
                getMyRecommendList();
            }).catch(function (error) {
                errorService.processError(error);
            })
        }

        //浏览器后退触发事件
        $window.onpopstate = function () {
            // 获得存储在该历史记录点的currentPage对象
            var currentPage = $window.history.state;
            if (currentPage == null) {
                vm.currentPage = 1;
            } else {
                vm.currentPage = currentPage.currentPage;
            }
            getMyRecommendList();
        };
    }
});
