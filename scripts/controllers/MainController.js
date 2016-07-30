define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/ErrorService'
], function (angular) {
    angular.module('xwWeb')
        .registerController('mainController', ['$rootScope','CONFIG', 'authService', 'businessService','errorService', mainController]);

    function mainController($rootScope,CONFIG, authService, businessService, errorService) {
        authService.loginRequired();
        var sessionId = authService.getSessionId();
        var vm = this;

        //基础参数
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.transferGet = vm.transferTotal = 0;
        vm.sitingGet = vm.sitingTotal = 0;
        vm.recruitmentGet = vm.recruitmentTotal = 0;
        vm.reservationGet = vm.reservationTotal = 0;

        vm.keyword = "";
        vm.nickname = authService.getNickname();
        vm.cityId = authService.getCityId();

        vm.search = search;
        getQuota();

        //////////////////////////////////////////]

        $rootScope.$on('quotaChanged',function(){getQuota();});

        function search() {
            if (vm.keyword != "") {
                var searchUrl = CONFIG.searchUrl;
                window.open(searchUrl + "/" + vm.keyword, "_blank");
            }
        }

        function getQuota() {
            businessService.getQuota(sessionId).then(function (result) {
                vm.transferGet = result[vm.transferPluginId] ? result[vm.transferPluginId]["get"] : 0;
                vm.transferTotal = result[vm.transferPluginId] ? result[vm.transferPluginId]["total"] : 0;
                vm.sitingGet = result[vm.sitingPluginId] ? result[vm.sitingPluginId]["get"] : 0;
                vm.sitingTotal = result[vm.sitingPluginId] ? result[vm.sitingPluginId]["total"] : 0;
                vm.recruitmentGet = result[vm.recruitmentPluginId] ? result[vm.recruitmentPluginId]["get"] : 0;
                vm.recruitmentTotal = result[vm.recruitmentPluginId] ? result[vm.recruitmentPluginId]["total"] : 0;
                vm.reservationGet = result[vm.reservationPluginId] ? result[vm.reservationPluginId]["get"] : 0;
                vm.reservationTotal = result[vm.reservationPluginId] ? result[vm.reservationPluginId]["total"] : 0;
            }, function (error) {
                errorService.processError(error);
            })
        }

    }

    angular.module('xwWeb')
        .registerController('siderbarController', ['$location', '$scope', siderbarController]);

    function siderbarController($location, $scope) {
        var vm = this;
        vm.absUrl = $location.absUrl();
        var urlArr = vm.absUrl.split("/");
        var size = urlArr.length;
        var urlValue = '';
        for(var i = 0; i< size; i ++) {
            if(urlArr[i].indexOf("#") != -1){
                urlValue = urlArr[i+1];
                if(urlValue == 'businessHall') {
                    urlValue = urlArr[i + 2];
                }
            }
        }
        
        angular.element(document.querySelector("#" + urlValue)).addClass("activeSiderbar");
    }

});
