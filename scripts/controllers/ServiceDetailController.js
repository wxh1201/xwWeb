/**
 * Created by xiajingsi on 2016/4/13.
 */
define([
    'angular',
    '../config/CONFIG',
    '../services/AuthService',
    '../services/ErrorService',
    '../services/ServiceService',
    '../services/ShopService',
    '../services/ContractService',
    '../services/RequirementService',
    '../services/ServiceHistoryService',
    '../services/ServiceRemarkService',
    '../directives/scrollThumb/ScrollThumbDirective',
    '../services/PaginationService'
], function (angular) {

    'use strict';

    return angular.module('xwWeb')
        .registerController('serviceDetailController', ['CONFIG', 'authService', '$stateParams', 'errorService', 'serviceService', 'requirementService', 'serviceHistoryService', 'serviceRemarkService', 'shopService', '$window', '$location', 'paginationService', serviceDetailController]);

    function serviceDetailController(CONFIG, authService, $stateParams, errorService, serviceService, requirementService, serviceHistoryService, serviceRemarkService, shopService, $window, $location, paginationService) {
        //基本参数
        var vm = this;
        var sessionId = authService.getSessionId();
        var serviceId = $stateParams.serviceId;
        var activeTab = $stateParams.active;
        var cssId = $stateParams.cssId;
        vm.serviceStatus  = $stateParams.serviceStatus;
        //vm.status = '';

        if(activeTab == 1) {
            vm.activeTab = 1;
        } else if (activeTab == 2){
            vm.activeTab = 2;
        } else {
            vm.activeTab  = 0;
        }
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";

        vm.historySubmited = false;
        vm.remarkSubmited = false;

        //查询参数
        vm.shopId = '';
        vm.currentPage = 1;
        vm.historyCurrentPage = 1;//记录的当前页
        vm.remarkCurrentPage = 1;//备注的翻页
        vm.pageSize = CONFIG.pageSize;
        vm.historyContent ='';
        vm.remark = '';

        //查询结果
        vm.pluginId = '';
        vm.defaultPicUrl = CONFIG.postDefaultPic;
        vm.photos = [];
        vm.serviceList = [];
        vm.requirement = {};
        vm.reqContent = {};
        vm.postPhotos = [];
        vm.recruitmentReq = [];
        vm.serviceDetail = {};
        vm.cssId = '';
        vm.serviceHistory = '';//服务记录
        vm.serviceHistoryId = '';//新增服务记录id
        vm.serviceRemark = ''; //服务备注
        vm.serviceRemarkId = '';//新增服务备注id
        vm.cssStatus = '';//当前服务状态


        //被暴露的方法
        vm.refresh = refresh;
        vm.shopRefresh = shopRefresh;
        vm.abort = abort;
        vm.cancelAbort = cancelAbort;
        vm.addServiceHistory = addServiceHistory;
        vm.addServiceRemark = addServiceRemark;
        vm.getServiceRemarklist = getServiceRemarklist;
        vm.getServiceHistoryList = getServiceHistoryList;
        vm.clearCurrentPage = clearCurrentPage;
        vm.pageGetServiceHistoryList = pageGetServiceHistoryList;
        vm.pageGetServiceRemarklist = pageGetServiceRemarklist;

        //新的获取服务详情
        getServiceDetail();

        pageGetServiceHistoryList();
        pageGetServiceRemarklist();
        //getServiceRemarklist();
        //getServiceHistoryList();

        ////////////////////////////////

        //获取服务详情
        function getServiceDetail() {
            serviceService.getServiceDetail(sessionId, serviceId, cssId).then(function (result) {
                vm.serviceDetail = result;
                vm.pluginId = result.pluginId;
                vm.shopId = result.shopId;
                vm.cssId = result.cssId;
                vm.cssStatus = result.cssStatus;
                vm.status = result.status;
                vm.serviceDetail.perPrice = (result.perPrice/100).toFixed(2);
                if(vm.pluginId != vm.reservationPluginId) {
                    vm.requirement = result.item;
                    if(vm.requirement[0].content.photos.length > 0){
                        for(var i = 0, length = vm.requirement[0].content.photos.length; i < length; i ++) {
                            vm.photos.push(vm.requirement[0].content.photos[i].url);
                        }
                    }
                }
                if(vm.serviceDetail.mode == 2) {
                    vm.serviceDetail.calMonth = Math.floor(vm.serviceDetail.days/30);
                    vm.serviceDetail.calDay = vm.serviceDetail.days%30;
                }

            }, function (error) {
                errorService.processError(error);
            })
        }

        //刷新(除消费的刷新)
        function refresh(requirementId) {
            requirementService.refresh(sessionId, requirementId).then(function () {
                alert("刷新成功")
            }, function (error) {
                errorService.processError(error);
            })
        }

        //消费的店铺刷新
        function shopRefresh() {
            shopService.refresh(sessionId, vm.shopId).then(function () {
                alert("刷新成功")
            }, function (error) {
                errorService.processError(error);
            })
        }

        //放弃服务
        function abort() {
            serviceService.abort(sessionId, cssId).then(function () {
                alert("已放弃服务");
                getServiceDetail();
            }, function (error) {
                errorService.processError(error);
            })
        }

        //取消放弃服务
        function cancelAbort() {
            serviceService.cancelAbort(sessionId, cssId).then(function () {
                alert("取消放弃服务成功");
                getServiceDetail();
            }, function (error) {
                errorService.processError(error);
            })
        }

        function pageGetServiceHistoryList() {
            $window.history.pushState({"historyCurrentPage": vm.historyCurrentPage}, '', $location.absUrl());
            console.log($window.history.state, "$window.history.state");
            getServiceHistoryList();
        }

        function getServiceHistoryList() {
            serviceHistoryService.getList(sessionId, serviceId, vm.historyCurrentPage -1, vm.pageSize).then(function (result) {
                vm.serviceHistory = result["objects"];
                vm.totalHistoryCount = result.totalCount;
            }, function (error) {
                errorService.processError(error);
            })
        }

        function addServiceHistory(isValid) {
            vm.historySubmited = true;
            if(!isValid) {
                return;
            }
            serviceHistoryService.add(sessionId, serviceId, vm.historyContent).then(function (result) {
                vm.serviceHistoryId = result;
                angular.element(document.querySelector(".history-content")).val("");
                getServiceHistoryList();
            }, function (error) {
                errorService.processError(error);
            })
        }

        function pageGetServiceRemarklist () {
            $window.history.pushState({"remarkCurrentPage": vm.remarkCurrentPage}, '', $location.absUrl());
            console.log($window.history.state, "$window.history.state");
            getServiceRemarklist();
        }

        function getServiceRemarklist() {
            serviceRemarkService.getList(sessionId, serviceId, vm.remarkCurrentPage -1, vm.pageSize).then(function (result) {
                vm.serviceRemark = result["objects"];
                vm.totalRemarkCount = result.totalCount;
            }, function (error) {
                errorService.processError(error);
            })
        }

        function addServiceRemark(isValid) {
            vm.remarkSubmited = true;
            if(!isValid) {
                return;
            }
            serviceRemarkService.add(sessionId, serviceId, vm.remark).then(function (result) {
                vm.serviceRemarkId = result;
                angular.element(document.querySelector(".remark-content")).val("");
                getServiceRemarklist();
            }, function (error) {
                errorService.processError(error);
            })
        }

        function clearCurrentPage() {
            vm.remarkCurrentPage = 1;
            vm.historyCurrentPage = 1;
        }

        //浏览器后退触发事件
        $window.onpopstate = function () {
            // 获得存储在该历史记录点的currentPage对象
            var currentPage = $window.history.state;
            console.log(currentPage, "currentPage");
            if(currentPage == null) {
                vm.historyCurrentPage = 1;
                vm.remarkCurrentPage = 1;
                getServiceHistoryList();
                getServiceRemarklist();
            } else {
                if(currentPage.historyCurrentPage) {
                    vm.historyCurrentPage = currentPage.historyCurrentPage;
                    getServiceHistoryList();
                } else {
                    vm.historyCurrentPage = 1;
                    getServiceHistoryList();
                }

                if(currentPage.remarkCurrentPage) {
                    vm.remarkCurrentPage = currentPage.remarkCurrentPage;
                    getServiceRemarklist();
                } else {
                    vm.remarkCurrentPage = 1;
                    getServiceRemarklist();
                }
            }

        };
    }
});
