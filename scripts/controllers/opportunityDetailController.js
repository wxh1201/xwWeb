/**
 * Created by Leo Long on 2016/4/19.
 */
'use strict';
define([
    'angular',
    '../services/AuthService',
    '../services/OpportunityService',
    '../services/ErrorService',
    '../services/UserService',
    '../directives/scrollThumb/ScrollThumbDirective',
    '../services/BusinessService',
    '../services/IndustryService',
    '../services/RemarkService',
    '../controllers/businessOppDetailController',
    '../controllers/businessOppRemarkController'
], function (angular) {

    oppDetailController.$inject = ['$rootScope','$timeout',"remarkService","industryService","businessService",'CONFIG', "$uibModal","$stateParams",  "authService", "OpportunityService", "errorService"];

    return angular.module('xwWeb')
        .registerController('oppDetailController', oppDetailController);

    function oppDetailController($rootScope,$timeout,remarkService,industryService,businessService, CONFIG,$uibModal,$stateParams,authService,OpportunityService,errorService){
        var vm = this;
        vm.oppId = $stateParams.oppId;
        vm.info = {};
        vm.info.status = 0;
        vm.collect = collect;

        ///////////////////////////////

        var sessionId = authService.getSessionId();
        init();


        function init(){
            for(var i=0;;i++){
                if($stateParams.activeTab == i){
                    vm.activeTab = i;
                    break;
                }
            }

            OpportunityService.getInfo(sessionId,vm.oppId).then(function(data){
                vm.info = data;
                vm.industry = industryService.getIndustryBySamll(data.content.industryId);
                if(data['content']['photos'])
                for(var i = 0 ; i< data['content']['photos'].length; i++){
                    vm.picUrl.push(data['content']['photos'][i].url);
                }
                //show warning msg
                if(vm.info.status != 0){
                    switch (vm.info.status){
                        case 1:
                            vm.oppStatus = "该业务已经被 "+vm.info['salesNickname']+" 领取了。您不能领取该业务";
                            break;
                        case 2:
                            if(vm.info['salesNickname'] != null)
                                vm.oppStatus = "该业务已收费，签约员工："+vm.info['salesNickname'];
                            else
                                vm.oppStatus = "该业务已收费，商家主动签约";
                            break;
                        case 3:
                            vm.oppStatus = "该业务已过期。您不能领取该业务";
                            break;
                    }
                    vm.showClass = "xwshow";
                }
            },function(){

            });
        }

        function collect(){
            vm.popupInfo = {
                        title:"领取业务",
                        content:"",
                        note:"",
                        red:"",
                        button:[]
                    };
            businessService.take(sessionId,vm.info.opportunityId).then(function(result){
                vm.popupInfo.button = [{
                    text:"查看该业务",
                    url:"index.main.businessDetail({businessId:"+result+"})"
                },
                {
                    text:"留在当前页",
                    url:"index.main.opportunityDetail"
                }];
                vm.info.status = 1;
                var pluginId = vm.info.pluginId;
                vm.oppStatus = "领取成功";
                $rootScope.$emit('quotaChanged');

                businessService.getQuota(sessionId).then(function(result){
                    vm.popupInfo.content = "恭喜您：领取业务成功！";
                    vm.popupInfo.note = "您该类业务限额还有"+(result[pluginId]["total"]-result[pluginId]["get"])+"个";
                    vm.popupInfo.red = "font-red";
                },function (error) {
                    errorService.processError(error);
                });

            },function(error){
                vm.popupInfo.content = "抱歉：业务领取失败！";
                switch (error.code){
                    case -30996 :
                        vm.popupInfo.note = "原因：没有该类业务限额或限额已满，查看限额规则了解如何获得更多限额！";
                        vm.popupInfo.button = [
                            {
                            text:"立即查看限额规则",
                            url:"index.main.limitPolicy"
                            },
                            {
                                text:"取消",
                                url:"index.main.opportunityDetail"}];
                        break;
                    case -31198 :
                        vm.popupInfo.note = "原因：该业务已被别人抢先领取";
                        vm.popupInfo.button = [{
                            text:"确定",
                            url:"index.main.opportunityDetail"}];
                        break;
                    default :
                        vm.popupInfo.note = error.message;
                        vm.popupInfo.button = [{
                            text:"确定",
                            url:"index.main.opportunityDetail"}];
                        break;
                }
            });

            var modalInstance = $uibModal.open({
                animation: true,
                size:"sm",
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
        };
    }
});
