/**
 * Created by Administrator on 2016/4/25.
 */
define([
    'angular'
], function(angular) {
    'use strict';

    popupController.$inject = ["$scope","$sce","info",'$uibModalInstance'];

    return angular.module('xwWeb')
        .registerController('popupController', popupController);

    function popupController($scope,$sce,info,$uibModalInstance){
        var vm = this;
        vm.info = info;
        vm.confirm = confirm;
        vm.content = "";

        //////////////////////
        

        function confirm(){
            $uibModalInstance.dismiss();
        }

    }
});

