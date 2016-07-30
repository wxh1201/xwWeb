define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('businessController', ['$rootScope','CONFIG', '$uibModal', 'authService', 'businessService', 'errorService', businessController]);

    function businessController($rootScope,CONFIG, $uibModal, authService, businessService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        //页面所需基本数
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.defaultPicUrl = CONFIG.postDefaultPic;
        vm.transferGet = vm.transferTotal = 0;
        vm.sitingGet = vm.sitingTotal = 0;
        vm.recruitmentGet = vm.recruitmentTotal = 0;
        vm.reservationGet = vm.reservationTotal = 0;
        vm.currentMilliseconds = new Date().getTime();


        vm.takeTimeOrder = 0;//按领取时间排序
        vm.finishTimeOrder = 1;//按结束时间排序
        vm.inBusiness = 1;//业务中
        vm.inContract = 2;//签约中
        vm.finished = 3;//已成交
        vm.closed = 4;//已关闭

        //查询参数
        vm.status = vm.inBusiness;
        vm.pluginId = vm.allPluginId;
        vm.orderType = vm.takeTimeOrder;
        vm.currentPage = 1;
        vm.pageSize = CONFIG.pageSize;

        //查询结果
        vm.totalCount = 0;
        vm.list = [];

        //对象方法
        vm.getList = getList;
        vm.changePlugin = changePlugin;
        vm.changeStatus = changeStatus;
        vm.changeOrderType = changeOrderType;
        vm.isDanger = isDanger;//是否快过期
        vm.giveUp = giveUp;//放弃业务
        vm.invalid = invalid;//信息无效

        getList();//获取列表

        function getList() {
            businessService.getList(sessionId, vm.pluginId, vm.status, vm.orderType, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.totalCount = result.totalCount;
                vm.list = result.objects;
            }, function (error) {
                errorService.processError(error);
            });
        }

        function changePlugin(pluginId) {
            vm.pluginId = pluginId;
            getList();
        }

        function changeStatus(status) {
            vm.status = status;
            getList();
        }

        function changeOrderType(orderType) {
            vm.orderType = orderType;
            getList();
        }

        function isDanger(milliseconds) {
            if (Math.floor((milliseconds - vm.currentMilliseconds) / 1000 / 3600 / 24) <= 2) {
                return true;
            }
            return false;
        }

        function giveUp(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: "sm",
                templateUrl: 'views/partial/giveUpBusiness.html',
                controllerAs: 'vm',
                controller: 'giveUpBusinessController',
                resolve: {
                    loadController: ['$q', function ($q) {
                        var deferred = $q.defer();
                        require(["controllers/GiveUpBusinessController"], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }],
                    businessId: function () {
                        return id;
                    }
                }
            });
            modalInstance.result.then(function () {
                $rootScope.$emit('quotaChanged');
                getList();
            }, function () {

            });
        }

        function invalid(id) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: "sm",
                templateUrl: 'views/partial/invalidBusiness.html',
                controllerAs: 'vm',
                controller: 'invalidBusinessController',
                resolve: {
                    loadController: ['$q', function ($q) {
                        var deferred = $q.defer();
                        require(["controllers/InvalidBusinessController"], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }],
                    businessId: function () {
                        return id;
                    }
                }
            });
            modalInstance.result.then(function () {
                $rootScope.$emit('quotaChanged');
                getList();
            }, function () {

            });
        }
    }
});
