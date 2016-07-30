/**
 * Created by Leo Long on 2016/4/19.
 */
'use strict';
define([
    'angular',
    '../services/AuthService',
    '../services/OpportunityService',
    '../services/ErrorService',
    '../directives/scrollThumb/ScrollThumbDirective',
    '../services/IndustryService',
    '../services/BusinessService'
], function (angular) {
    businessOppDetailController.$inject = ['$stateParams','businessService',"industryService",'CONFIG',"authService", "OpportunityService", "errorService"];

    return angular.module('xwWeb')
        .registerController('businessOppDetailController', businessOppDetailController);

    function businessOppDetailController($stateParams,businessService,industryService, CONFIG,authService,OpportunityService,errorService){
        var vm = this;
        vm.oppId = $stateParams.oppId ? $stateParams.oppId : 0;
        vm.businessId = $stateParams.businessId ? $stateParams.businessId : 0;
        vm.info = {};
        vm.info.status = 0;
        vm.picUrl = [];
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;
        vm.industry = "";

        ///////////////////////////////

        var sessionId = authService.getSessionId();
        init();

        function init(){
            if(vm.businessId != 0){
                businessService.get(sessionId, vm.businessId).then(function (result) {
                    vm.oppId = result.opportunityId;
                    getInfo();
                },function(){});
            }else{
                getInfo();
            }

        }

        function getInfo(){
            OpportunityService.getInfo(sessionId,vm.oppId).then(function(data){
                vm.info = data;
                vm.industry = industryService.getIndustryBySamll(data.content.industryId);
                if(data['content']['photos'])
                    for(var i = 0 ; i< data['content']['photos'].length; i++){
                        vm.picUrl.push(data['content']['photos'][i].url);
                    }
            },function(){

            });
        }

    }
});

