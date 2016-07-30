define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('giveUpBusinessController', ['$rootScope','authService', '$uibModalInstance', 'businessId', 'businessService', 'errorService', giveUpBusinessController]);

    function giveUpBusinessController($rootScope,authService, $uibModalInstance, businessId, businessService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.submitted = false;
        vm.businessId = businessId;
        vm.reason;
        vm.otherReason = "";
        vm.errorMessage = "";


        vm.submit = submit;
        vm.cancel = cancel;

        function submit(isValid) {
            vm.submitted = true;
            if (!isValid) {
                return;
            }
            if (vm.reason == "other" && vm.otherReason != "") {
                vm.reason = vm.otherReason;
            }
            businessService.abort(sessionId, vm.businessId, true, vm.reason).then(function (result) {
                $uibModalInstance.close(result);
            }, function (error) {
                errorService.processError(error);
            });
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
});
