/**
 * Created by Xiajingsi on 2016/6/8.
 */
define([
    'angular',
    '../services/AuthService',
    '../services/ExampleService',
    '../services/ErrorService',
    '../services/UtilService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('caseRemarkController', ['authService', '$uibModalInstance', 'errorService', 'Upload', 'CONFIG', 'exampleService', 'serviceId', 'isExistExam', 'pluginId', 'utilService', caseRemarkController]);

    function caseRemarkController(authService, $uibModalInstance, errorService, Upload, CONFIG, exampleService, serviceId, isExistExam, pluginId, utilService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.submitted = false;
        vm.photos = [];
        vm.remarkContent = '';
        console.log(pluginId, "pluginId");
        vm.pluginId = pluginId;

        vm.uploadFile = uploadFile;
        vm.submit = submit;
        vm.cancel = cancel;
        vm.removeThumb = removeThumb;

        if(isExistExam == 1) {
            getExample();
        }

        function submit(isValid) {
            vm.submitted = true;
            if (!isValid) {
                console.log("!isValid");
                return;
            }
            exampleService.setServiceExample(sessionId, serviceId, vm.photos, vm.remarkContent).then(function () {
                utilService.showPrompt("备注案例成功");
                $uibModalInstance.dismiss();
            }).catch(function (error) {
                errorService.processError(error);
            })
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }


        function getExample() {
            exampleService.get(sessionId, serviceId).then(function (result) {
                vm.remarkContent = result.procedure;
                vm.photos = result.photos;
            }).catch(function (error) {
                errorService.processError(error);
            })
        }


        function uploadFile(file, errFiles) {
            vm.f = file;
            vm.errorFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: CONFIG.uploadUrl + '?sessionId=' + sessionId,
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    file.result = response.data;
                    //存储图片信息
                    var photo = {
                        id: file.result.fileId,
                        url: file.result.url
                    };
                    vm.photos.push(photo);
                }, function (response) {
                    vm.uploadErrorMessage = "上传失败";
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                })
            }
        }

        //删除缩略图
        function removeThumb(id) {
            for (var i = 0, length = vm.photos.length; i < length; i++) {
                if (vm.photos[i]['id'] == id) {
                    vm.photos.splice(i, 1);
                    break;
                }
            }
        }
    }
});
