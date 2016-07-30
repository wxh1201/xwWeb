/**
 * Created by Leo Long on 2016/4/19.
 */
'use strict';
define([
    'angular',
    '../services/AuthService',
    '../services/OpportunityService',
    '../services/ErrorService',
    '../services/BusinessService',
    '../services/IndustryService',
    '../services/UserService',
    '../services/DistrictService'
], function (angular) {

    BusinessHallController.$inject = ['$stateParams','$rootScope','districtService','industryService','$location','$window','CONFIG', "$cookies", "$uibModal", "userService", "businessService", "authService", "OpportunityService", "errorService", '$scope'];

    return angular.module('xwWeb')
        .registerController('BusinessHallController', BusinessHallController);

    function BusinessHallController($stateParams,$rootScope,districtService,industryService,$location,$window,CONFIG, $cookies, $uibModal, userService, businessService, authService, OpportunityService, errorService, $scope) {
        var cityId = authService.getCityId();
        var sessionId = authService.getSessionId();
        var user = $cookies.getObject(sessionId);
        var vm = this;

        //init basic params
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;
        vm.list = [];
        vm.pluginId = "xw:"+$stateParams.pluginId;
        vm.validity = -1;//商机状态
        vm.keyword = "";
        vm.industryId = "";
        vm.smallIndustryId = "";
        vm.districtId = "";
        vm.businessAreaId = "";
        vm.industry = [];
        vm.smallIndustry = [];
        vm.district = [];
        vm.businessArea = [];
        vm.publishDateStart = "";
        vm.publishDateStartCollaspse = false;
        vm.publishDateEnd = "";
        vm.publishDateEndCollaspse = false;
        vm.isFlip = false;
        vm.currentResult = "query";
        vm.areaDisable = true;

        vm.queryParams = {industryId:0,districtId:0,minArea:-1,maxArea:-1,type:vm.pluginId};

        //page params
        vm.pageSize = CONFIG.pageSize;
        vm.pageNo = 0;
        vm.currentPage = 1;
        vm.totalCount = 0;


        //warning params
        vm.isIdentify = false;
        vm.showWarning = false;
        vm.warning = "需要通过了身份认证的，才可以查看业务大厅。";
        vm.queryDateMsg = "";
        vm.queryAreaMsg = "";


        vm.getMyServicesList = getMyServicesList;//翻页
        vm.collect = collect;//领取商机
        vm.addRemark = addRemark;//添加备注
        vm.enterPress = enterPress;//回车搜索
        vm.loadSmallIndustries = loadSmallIndustries;
        vm.loadBusinessAreas = loadBusinessAreas;
        vm.fireQueryOrSearch = fireQueryOrSearch;//查询，搜索发起

        ////////////////////////////////////////////////

        init();

        function init() {
            //initialize query params
            vm.industry = industryService.getIndustries();
            vm.district = districtService.getDistricts(cityId);
            if(vm.pluginId != 'xw:transfer' && vm.pluginId != 'xw:siting')
                vm.areaDisable = false;
            else
                vm.areaDisable = true;

            //confirm identity, cant use business hall without identity validation
            userService.getUserInfo(sessionId, user.id).then(function (result) {
                    var verify = result['certificates'];
                    if (verify.length == 0) {
                        vm.isIdentify = false;
                        vm.showWarning = true;
                    } else {
                        for (var i = 0; i < verify.length; i++) {
                            if (verify[i] == 5) {
                                query();
                                vm.isIdentify = true;
                            } else if (i == verify.length - 1) {
                                vm.showWarning = true;
                            }
                        }
                    }
                },
                function (error) {
                    errorService.processError(error);
                });
        }

        //fetch subindustries accord to industry id
        function loadSmallIndustries(industryId){
            vm.smallIndustry = industryService.getSmallIndustries(industryId);
            vm.smallIndustryId = "";
        }

        function loadBusinessAreas(districtId){
            vm.businessArea = districtService.getBusinessAreas(districtId);
            vm.businessAreaId = "";
        }

        //fire search by pressing enter
        function enterPress(e){
            var event = e || window.event;
            if(event.keyCode == 13){
                fireQueryOrSearch('search');
            }
        }

        //search function
        function search() {
            OpportunityService.search(sessionId,vm.keyword,vm.currentPage-1,vm.pageSize).then(function(result){
                vm.list = [];
                vm.totalCount = result['totalCount'];

                if( vm.totalCount == 0){
                    vm.warning = "没有搜索到结果";
                    vm.showWarning = true;
                }

                var items = result["objects"];
                for (var i = 0; i < result["objects"].length; i++) {
                    items[i].industry = '行业：'+ industryService.getIndustryBySamll(items[i].industryId);
                    if(items[i].pluginId == 'xw:transfer'){
                        items[i].transferType == 1 ? items[i].tramsferStatus = '类型：店铺转让' : items[i].tramsferStatus = '类型：出租招商';
                    }
                    vm.list.push(result["objects"][i]);
                }
            },function(error){
                errorService.processError(error);
            });
        }

        //query functions
        function query(){
            var validation = true;
            vm.queryDateMsg = "";
            vm.queryAreaMsg = "";

            if(vm.publishDateEnd < vm.publishDateStart && vm.publishDateStart != '' && vm.publishDateEnd != ''){
                validation = false;
                vm.queryDateMsg = "结束时间不能小于开始时间！";
            }

            if(vm.maxArea || vm.minArea || vm.minArea == 0 || vm.maxArea == 0){
                    if(vm.maxArea < vm.minArea && vm.maxArea){
                        validation = false;
                        vm.queryAreaMsg = "最小面积不能大于最大面积！";
                    }
                if((vm.minArea < 1 && vm.minArea) || (vm.maxArea < 1 && vm.maxArea) || vm.minArea == 0 || vm.maxArea == 0){
                    validation = false;
                    vm.queryAreaMsg = "面积不能小于1！";
                    }
                if(vm.maxArea > 999999999 || vm.minArea > 999999999){
                    validation = false;
                    vm.queryAreaMsg = "面积不能大于999999999！";
                }
            }

/*            if(parseInt(vm.maxArea) < parseInt(vm.minArea)){
                validation = false;
                vm.queryAreaMsg = "最大面积不能小于最小面积！";
            }else if(isNaN(parseInt(vm.minArea)) && isNaN(parseInt(vm.maxArea))){

            } else{
                vm.queryAreaMsg = "";
            };*/

            vm.queryParams.maxArea = vm.maxArea ? vm.maxArea : 99999999;
            vm.queryParams.minArea = vm.minArea ? vm.minArea : 1;
            vm.publishDateStart ? vm.queryParams.startTime = dateFormat(vm.publishDateStart) : delete vm.queryParams['startTime'];
            vm.publishDateEnd ? vm.queryParams.endTime = dateFormat(vm.publishDateEnd) : delete vm.queryParams['endTime'];

            if(validation){
                OpportunityService.query(sessionId,vm.queryParams,vm.currentPage-1,vm.pageSize).then(function(data){
                    vm.list = [];
                    vm.totalCount = data['totalCount'];
                    var items = data['objects'];

                    if( vm.totalCount == 0){
                        vm.warning = "没有搜索到结果";
                        vm.showWarning = true;
                    }

                    for(var i in items){
                        items[i].industry = '行业：'+ industryService.getIndustryBySamll(items[i].industryId);
                        if(items[i].pluginId == 'xw:transfer'){
                            items[i].transferType == 1 ? items[i].tramsferStatus = '类型：店铺转让' : items[i].tramsferStatus = '类型：出租招商';
                        }
                        vm.list.push(items[i]);
                    }
                },function(error){
                    errorService.processError(error);
                });
            }
        }

        //return database needed date format
        function dateFormat(date){
            var year = date.getFullYear();
            var month = parseInt(date.getMonth()+1)<10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
            var day = parseInt(date.getDate())<10 ? "0"+date.getDate() : date.getDate();
            return year+"-"+ month +"-"+ day +" 0:0:0";
        }

        //
        function fireQueryOrSearch(operation){
            vm.currentPage = 1;
            vm.showWarning = false;
            vm.currentResult = operation;
            if(vm.currentResult == 'search'){
                search();
            }else{
                vm.queryParams = {
                    type : vm.pluginId,
                    industryId : vm.smallIndustryId ? vm.smallIndustryId : (vm.industryId ? vm.industryId : 0),
                    districtId : vm.businessAreaId ? vm.businessAreaId : (vm.districtId ? vm.districtId : 0),
                };
                query();
            }
        }

        function getMyServicesList() {
            vm.list = [];
            $window.history.pushState({"currentPage": vm.currentPage}, '业务大厅', $location.absUrl());
            if(vm.isIdentify)
            vm.currentResult == 'query'? query() : search();
        }

        $window.onpopstate = function () {
            // 获得存储在该历史记录点的currentPage对象
            var currentPage = $window.history.state;

            if (currentPage == null) {
                vm.currentPage = 1;
            } else {
                vm.currentPage = currentPage.currentPage;
            }
            if(vm.isIdentify)
                vm.currentResult == 'query'? query() : search();
        };


        function collect(oppId,pluginId,index) {
            vm.popupInfo = {
                title: "领取业务",
                content: "",
                note: "",
                red:"",
                button: []
            };//初始化弹窗内容

            businessService.take(sessionId, oppId).then(function (result) {
                vm.list[index].status = 1;
                vm.popupInfo.button = [{
                    text: "查看该业务",
                    url: "index.main.businessDetail({businessId:" + result + "})"
                },{
                    text:"留在当前页",
                    url:"index.main.businessHall"
                }];
                getQuota(pluginId);
                $rootScope.$emit('quotaChanged');

            }, function (error) {
                vm.popupInfo.content = "抱歉：业务领取失败！";
                switch (error.code) {
                    case -30996 :
                        vm.popupInfo.note = "原因：没有该类业务限额或限额已满，查看限额规则了解如何获得更多限额！";
                        vm.popupInfo.button = [
                            {
                            text: "立即查看限额规则",
                            url: "index.main.limitPolicy"},
                            {
                            text:"取消",
                            url:"index.main.businessHall"}];
                        break;
                    case -31198 :
                        vm.popupInfo.note = "原因：该业务已被别人抢先领取";
                        vm.list[index].status = 1;
                        vm.popupInfo.button = [{
                            text:"确定",
                            url:"index.main.businessHall"}];
                        break;
                    default :
                        vm.popupInfo.note = error.message;
                        vm.popupInfo.button = [{
                            text:"确定",
                            url:"index.main.businessHall"}];
                        break;
                }
            });

            //get quota
            function getQuota(pluginId){
                businessService.getQuota(sessionId).then(function (result) {
                    vm.popupInfo.content = "恭喜您：领取业务成功！";
                    vm.popupInfo.note = "您该类业务限额还有" + (result[pluginId]["total"] - result[pluginId]["get"]) + "个";
                    vm.popupInfo.red = "font-red";
                }, function (error) {
                    errorService.processError(error);
                });
            }

            var modalInstance = $uibModal.open({
                animation: true,
                size: "sm",
                templateUrl: 'views/partial/popup.html',
                controllerAs: 'vm',
                controller: 'popupController',
                resolve: {
                    loadController: ['$q', function ($q) {
                        var deferred = $q.defer();
                        require(["controllers/popupController"], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }],
                    info: function () {
                        return vm.popupInfo;
                    }
                }
            });
            modalInstance.result.then(function (result) {
            }, function () {

            });
        }

        function addRemark(oppId) {
            $scope.oppId = oppId;
            var modalInstance = $uibModal.open({
                animation: true,
                size: "lg",
                templateUrl: 'views/partial/oppRemark.html',
                controllerAs: 'vm',
                controller: 'oppRemarkController',
                scope: $scope,
                resolve: {
                    loadController: ['$q', function ($q) {
                        var deferred = $q.defer();
                        require(["controllers/oppRemarkController"], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }],
                    oppId: function () {
                        return oppId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
            }, function () {

            });
        }
    }
});
