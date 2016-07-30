/**
 * Created by Administrator on 2016/5/13.
 */
define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/RemarkService',
    '../services/ErrorService'
], function (angular) {
    angular.module('xwWeb')
        .registerController('oppRemarkController', ['$timeout','oppId','$stateParams', 'authService', 'remarkService', 'errorService','$uibModalInstance', oppRemarkController]);

    function oppRemarkController($timeout,oppId,$stateParams, authService,  remarkService, errorService,$uibModalInstance) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.businessId = $stateParams.businessId;


        vm.opportunityId = oppId;
        vm.content = "";
        vm.errorMessage = "";
        vm.myCssVar = "";

        vm.addRemark = addRemark;//添加备注
        vm.cancel = cancel;//弹窗关闭
        vm.enterPress = enterPress;

        function addRemark() {
            if(vm.content == ""){
                vm.errorMessage = "内容不能为空！";
                vm.myCssVar = "modal-toast-active";
                $timeout(function(){vm.myCssVar = "";},600,true);
                return;
            }

            remarkService.add(sessionId, vm.opportunityId, 0, vm.content).then(function (result) {
                    vm.errorMessage = "提交成功！";
                    vm.myCssVar = "modal-toast-active";
                    vm.content = "";
                    $timeout(function(){$uibModalInstance.dismiss();},600);
            }, function (error) {
                errorService.processError(error);
            })
        }

        function enterPress(e){
            var event = e || window.event;
            if(event.keyCode == 13){
                addRemark();
            }
        }

        function cancel(){
            $uibModalInstance.dismiss();
        }
    }
});
