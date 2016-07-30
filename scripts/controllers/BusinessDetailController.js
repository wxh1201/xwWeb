define([
    'angular',
    '../services/AuthService',
    '../services/BusinessService',
    '../services/PostService',
    '../services/ErrorService',
    '../directives/scrollThumb/ScrollThumbDirective',
    '../services/OpportunityService',
    '../services/RecommendService',
    '../controllers/businessOppDetailController',
    '../controllers/businessOppRemarkController',
    '../controllers/RecommendController',
    '../controllers/ExampleController',
    '../controllers/PriceController'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('businessDetailController', ['$uibModal','recommendService','OpportunityService','$scope', '$location', '$stateParams', 'CONFIG', 'authService', 'businessService', 'postService', 'errorService', businessDetailController]);

    function businessDetailController($uibModal,recommendService,OpportunityService,$scope, $location, $stateParams, CONFIG, authService, businessService, postService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        vm.pageName = "detail";
        vm.businessId = $stateParams.businessId;
        vm.defaultPicUrl = CONFIG.businessDetailDefaultPic;
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.inBusiness = 1;//业务中
        vm.inContract = 2;//签约中
        vm.finished = 3;//已成交
        vm.closed = 4;//已关闭
        vm.tabIndex = 0;//tab的index
        vm.isRenderedTab = [1,0,0,0,0,0,0,0,0,0,0];//用于判断是不是第一次加载

        vm.detail = {};//业务详情
        vm.opportunityId = 0;//商机ID
        vm.postDetail = {};//商机详情
        vm.postPhotos = [];//商机图片URL集合


        //商机状态
        vm.postWaitTake = 0;//待领取
        vm.postInBusiness = 1;//业务中
        vm.postHasFee = 2;//已收费
        vm.postHasTimeout = 3;//已过期

        vm.currentMilliseconds = new Date().getTime();
        vm.detailPage = 'detail';
        vm.remarkPage = 'remark';
        vm.recommendPage = 'recommend';
        vm.examplePage = 'example';
        vm.pricePage = 'price';

        vm.postpone = postpone;//延期
        vm.giveUp = giveUp;//放弃业务
        vm.invalid = invalid;//信息无效
        vm.isDanger = isDanger;//是否快过期
        vm.isWarnRemark = isWarnRemark;//是否提醒备注
        vm.take = take;//重新领取业务
        vm.improvePost = improvePost;//完善信息
        vm.tabSelected = tabSelected;

        get();
        function get() {
            vm.merge = {validity:0,recommendAmount:0,createTime:0};

            businessService.get(sessionId, vm.businessId).then(function (result) {
                vm.detail = result;
                vm.opportunityId = vm.detail.opportunityId;
                //商机详情

                OpportunityService.getInfo(sessionId,vm.opportunityId).then(function(data){
                    vm.merge.validity = data['validity'];
                    vm.merge.createTime = data['createTime'];
                    vm.detail = angular.merge({},vm.detail,vm.merge);
                   /* recommendService.getStatisticsOfTransferSiting(sessionId,vm.opportunityId).then(function(data){
                        vm.merge.recommendAmount = data;
                        vm.detail = angular.merge({},vm.detail,vm.merge);
                    },function(error){
                        errorService.processError(error);
                    });*/
                },function(error){
                    errorService.processError(error);
                });

                postService.get(sessionId, vm.opportunityId).then(function (result) {
                    vm.postDetail = result;
                    if (result.pluginId == vm.transferPluginId || result.pluginId == vm.recruitmentPluginId || result.pluginId == vm.reservationPluginId) {
                        for (var i = 0, length = result.content.photos.length; i < length; i++) {
                            vm.postPhotos.push(result.content.photos[i]['url']);
                        }
                    }
                })
            }, function (error) {
                errorService.processError(error);
            });
        }

        function improvePost() {
            $location.path("/post/" + vm.opportunityId + "/" + vm.businessId);
        }

        function postpone(businessId) {
            businessService.postpone(sessionId, businessId).then(function () {
                alert("延期成功");
                location.reload();
            }, function (error) {
                alert(error.message);
            })
        }

        function giveUp() {
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
                        return vm.businessId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                location.reload();
            }, function () {

            });
        }

        function invalid() {
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
                        return vm.businessId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                location.reload();
            }, function () {

            });
        }

        function isDanger(milliseconds) {
            if (Math.floor((milliseconds - $scope.currentMilliseconds) / 1000 / 3600 / 24) <= 2) {
                return true;
            }
            return false;
        }

        /**
         * 距离上次备注时间不超过5天，距离5天的时间小于2天时开始提醒
         * @param lastCommentTime
         * @returns {boolean}
         */
        function isWarnRemark(lastCommentTime) {
            var nowTime = $scope.currentMilliseconds;
            var warnTime = lastCommentTime + 5 * 24 * 3600 * 1000;

            if (nowTime >= warnTime) {
                return false;
            }

            if ((warnTime - nowTime) / (24 * 3600 * 1000) < 2) {
                return true;
            } else {
                return false;
            }
        }

        function take() {
            postService.take(sessionId, vm.opportunityId).then(function (result) {
                var businessId = result;
                $location.path("/businessDetail/" + businessId);
            }, function (error) {
                alert(error.message);
            })
        }

        function tabSelected(index){
            vm.isRenderedTab[index] = 1;
        }

    }
});
