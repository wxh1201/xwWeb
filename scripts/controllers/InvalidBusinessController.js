define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('invalidBusinessController', ['$rootScope','authService', '$uibModalInstance', 'businessId', 'businessService', 'errorService', invalidBusinessController]);

    function invalidBusinessController($rootScope,authService, $uibModalInstance, businessId, businessService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.submitted = false;
        vm.businessId = businessId;
        vm.reason;
        vm.errorMessage = "";


        vm.submit = submit;
        vm.cancel = cancel;

        function submit(isValid) {
            vm.submitted = true;
            if (!isValid) {
                return;
            }
            businessService.abort(sessionId, vm.businessId, false, vm.reason).then(function (result) {
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
