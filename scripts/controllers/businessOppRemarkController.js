'use strict';
define([
    'angular',
    '../services/AuthService',
    '../services/OpportunityService',
    '../services/ErrorService',
    '../directives/scrollThumb/ScrollThumbDirective',
    '../services/IndustryService',
    '../services/BusinessService',
    '../services/RemarkService'
], function (angular) {
    businessOppRemarkController.$inject = ['remarkService','$stateParams','businessService',"authService", "errorService"];

    return angular.module('xwWeb')
        .registerController('businessOppRemarkController', businessOppRemarkController);

    function businessOppRemarkController(remarkService,$stateParams,businessService,authService,errorService){
        var vm = this;
        vm.oppId = $stateParams.oppId ? $stateParams.oppId : 0;
        vm.businessId = $stateParams.businessId ? $stateParams.businessId : 0;
        vm.showClass = "";
        vm.activeTab = 0;
        vm.list = [];
        vm.pageSize = 30;
        vm.currentPage = 1;
        vm.totalCount = 0;
        vm.remarkContent = "";
        vm.remarkWarnShow = true;
        vm.remarkWarnMsg = "";
        vm.void = false;
        vm.xwHidden = "xwhidden";//css类，用于显示隐藏提示框
        vm.oppStatus = "";

        vm.addRemark = addRemark;

        ///////////////////////////////

        var sessionId = authService.getSessionId();
        init();

        function init(){
            if(vm.businessId != 0){
                businessService.get(sessionId, vm.businessId).then(function (result) {
                    vm.oppId = result.opportunityId;
                    getRemarkList();
                },function(){});
            }else{
                getRemarkList();
            }

        }

        function addRemark(){
            if(vm.remarkContent == ""){
                vm.remarkWarnMsg = "请填写备注内容";
                vm.void = true;
            }else if(vm.remarkContent.length > 300){
                vm.remarkWarnMsg = "备注不超过300字！";
                vm.void = true;
            }else{
                remarkService.add(sessionId, vm.oppId, 0, vm.remarkContent).then(function () {
                    vm.remarkContent = "";
                    vm.xwHidden = "";
                    vm.currentPage = 1;
                    vm.void = false;

                    getRemarkList();
                    $timeout(function(){vm.xwHidden = "xwhidden";},600,true);
                }, function (error) {
                    errorService.processError(error);
                });
            }
        }

        function getRemarkList(){
            remarkService.getList(sessionId,vm.oppId,vm.currentPage-1,vm.pageSize).then(function(data){
                vm.totalCount = data.totalCount;
                vm.list = data['objects'];
            },function(){

            });
        }

    }
});

