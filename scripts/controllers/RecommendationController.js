/**
 * Created by xiajingsi on 2016/4/23.
 */
define([
    'angular',
    '../services/AuthService',
    '../services/ErrorService',
    '../services/ResourceService',
    '../services/PreferenceService',
    '../services/ServiceService',
    '../services/RecommendService',
    '../services/ShopService',
    '../services/DistrictService',
    '../services/IndustryService',
    '../services/CityService',
    '../services/RequirementService',
    '../services/PaginationService'

], function (angular) {
    return angular.module('xwWeb')
        .registerController('recommendationController', ['CONFIG', '$stateParams', 'authService', 'errorService', 'recommendService', 'shopService', 'requirementService', '$q', 'districtService', 'industryService', 'cityService', 'resourceService', 'paginationService', '$window', recommendationController]);

    function recommendationController(CONFIG, $stateParams, authService, errorService, recommendService, shopService, requirementService, $q, districtService, industryService, cityService, resourceService, paginationService, $window) {
        var vm = this;
        var sessionId = authService.getSessionId();
        var cityId = authService.getCityId();
        var serviceId = $stateParams.serviceId;
        var pluginId = $stateParams.pluginId;

        var params = $stateParams.params;
        if(pluginId == 'xw:reservation') {
            var shopId = params;
        } else {
            var requirementId = params;
        }

        //页面所需基本数
        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.pluginId = pluginId;
        vm.submitted = false;
        vm.complete = false;

        //查询参数
        vm.status = -1;
        //vm.pluginId = vm.allPluginId;
        vm.orderType = vm.takeTimeOrder;
        vm.currentPage = 1;
        vm.pageSize = CONFIG.pageSize;
        vm.mobile = '';
        vm.batchAddArr = [];
        vm.checkbox = '';
        vm.industry = 0;//行业，0表示全部
        vm.cityId = cityId;//城市默认为用户当前所在城市
        //vm.districtId = 0;//区域，0表示全部
        //vm.businessAreaId = 0;
        //vm.smallIndustryId = 0;
        //vm.industryId = 0;
        vm.statusSelect = [
            {"value": "-1", "name": "全部"},
            {"value": "0", "name": "未推荐"},
            {"value": "1", "name": "已推荐"}
        ];
        vm.orderBy = 0;
        vm.orderBySelect = [
            {"value": "0", "name": "最优匹配"},
            {"value": "1", "name": "最近发布"},
            {"value": "2", "name": "最近刷新"}
        ];
        vm.minArea = '';
        vm.maxArea = '';


        //查询结果
        vm.recommendation = [];
        vm.totalCount = 0;
        vm.pageTitle = '';//当前推荐的消费店名或者需求标题
        vm.pluginId = pluginId;

        //外部方法
        //vm.changeStatus = changeStatus;//改变状态
        vm.loadSmallIndustries = loadSmallIndustries;//获取小行业
        vm.loadBusinessAreas = loadBusinessAreas;//获取商圈
        vm.singelRecommend = singelRecommend; //添加推荐
        vm.batchRecommend = batchRecommend;//批量推荐
        vm.matchTransfer = matchTransfer;
        vm.matchSiting = matchSiting;
        vm.pageMatchTransfer = pageMatchTransfer;//分页和首次加载调用接口
        vm.pageMatchSiting = pageMatchSiting;
        vm.searchMatchTransfer =searchMatchTransfer;//分页和首次加载调用接口
        vm.searchMatchSiting = searchMatchSiting;


        //对象方法
        loadIndustries();//加载行业
        loadDistricts(cityId);
        getServiceInfo();

        if(pluginId == vm.transferPluginId) {
            pageMatchSiting()
        } else if(pluginId == vm.sitingPluginId) {
            pageMatchTransfer()
        } else {
            alert("前端错误");
        }


        ///////////////////////////////

        function searchMatchTransfer(valid) {
            vm.submitted = true;
            if(!valid) {
                console.log("! valid");
                return;
            }
            matchTransfer();
        }

        function pageMatchTransfer() {
            paginationService.paginationPushStatus(vm.currentPage, '');
            matchTransfer()
        }

        function matchTransfer() {
            var params = getParams();
            if(params == undefined) {
                return;
            }
            resourceService.matchTransfer(sessionId, parseInt(serviceId), params, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.recommendation = result["objects"];
                vm.totalCount = result.totalCount;
                vm.complete = true;
            }).catch(function (error) {
                errorService.processError(error);
            })
        }

        function searchMatchSiting(valid) {
            vm.submitted = true;
            if(!valid) {
                console.log("! valid");
                return;
            }
            matchSiting();
        }

        function pageMatchSiting() {
            paginationService.paginationPushStatus(vm.currentPage, '');
            matchSiting()
        }

        function matchSiting() {
            var params = getParams();
            if(params == undefined) {
                return;
            }
            resourceService.matchSiting(sessionId, parseInt(serviceId), params, vm.currentPage - 1, vm.pageSize).then(function (result) {
                vm.recommendation = result["objects"];
                vm.totalCount = result.totalCount;
                vm.complete = true;
            }).catch(function (error) {
                errorService.processError(error);
            })
        }


        function getParams() {
            vm.areaError = false;
            if(vm.minArea > vm.maxArea) {
                vm.areaError = true;
                return ;
            }
            var params = {
                orderBy: parseInt(vm.orderBy)
            };

            if(vm.mobile) {
                params['mobile'] = vm.mobile;
            }

            if(parseInt(vm.minArea)) {
                params['minArea'] = parseInt(vm.minArea);
            }

            if(parseInt(vm.maxArea)) {
                params['maxArea'] = parseInt(vm.maxArea);
            }

            //vm.smallIndustryId 虽然初始化为0，但是当view页面中选择全部时，vm.smallIndustryId是undefined,所以下面的if判断是合理的
            //更好的方法是不初始化。
            if( parseInt(vm.smallIndustryId)) {
                params["industryId"] =  parseInt(vm.smallIndustryId);
            } else if (parseInt(vm.industryId)) {
                params["industryId"] = parseInt(vm.industryId);
            }

            if (parseInt(vm.businessAreaId)) {
                //这边判断vm.cityId 是否等于0而不是判断是否存在，是因为vm.cityId已经给全部赋值为0了。
                //if (vm.cityId != 0) {
                    params["districtId"] = parseInt(vm.businessAreaId);
                //}
            }
            // else if (parseInt(vm.districtId)) {
            //     if (vm.cityId != 0) {
            //         params["districtId"] = parseInt(vm.districtId);
            //     }
            // } else if(parseInt(vm.cityId)) {
            //     params["districtId"] = parseInt(vm.cityId);
            // }

            return params;
        }


        function getServiceInfo() {
            if(pluginId == 'xw:reservation') {
                shopService.getShopInfo(sessionId, shopId).then(function (result) {
                    vm.pageTitle = result.name;
                }, function (error) {
                    errorService.processError(error);
                })
            } else {
                requirementService.getRequirementDetail(requirementId).then(function (result) {
                    vm.pageTitle = result.title;
                }, function (error) {
                    errorService.processError(error);
                })
            }
        }


        function singelRecommend(resourceId) {
            var recommendationObj;
            for(var i = 0, length = vm.recommendation.length; i < length; i ++ ) {
                if(vm.recommendation[i].id == resourceId) {
                    recommendationObj = vm.recommendation[i];
                }
            }

            recommendService.add(sessionId,resourceId, serviceId).then(function () {
                angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#B5FF99');
                for(var i = 0, length = vm.recommendation.length; i < length; i ++ ) {
                    vm.recommendation[i].id == resourceId;
                    recommendationObj.hasRecommendation = 1;
                }
            }).catch(function (error) {
                angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#FFBDBD');
                errorService.processError(error);
            });

            if(recommendationObj.checked) {
                recommendationObj.checked = false;//推荐成功，radio的勾选去掉
            }
        }

        function batchRecommend() {
            var checkedNum = 0;
            var sum = 0;
            for(var i = 0, length = vm.recommendation.length; i < length; i ++) {
                if(vm.recommendation[i].checked) {
                    sum = sum + 1;
                }
            }
            if(sum > 10 ) {
                alert("不能同时推荐超过10个");
                return;
            }
            for(var i = 0, length = vm.recommendation.length; i < length; i ++) {
               if(vm.recommendation[i].checked) {
                   checkedNum = checkedNum +1;
                   singelRecommend(vm.recommendation[i].id);
                   vm.recommendation[i].checked = false;//发送请求后去掉勾选。
               }
            }

            if(checkedNum == 0) {
                alert("选择您要推荐的客户");
            }
        }

        //changeStatus
        // function changeStatus(status) {
        //     vm.status = status;
        // }

        function loadSmallIndustries(industryId) {
            vm.smallIndustriesSelect = industryService.getSmallIndustries(industryId);
        }

        function loadBusinessAreas(districtId) {
            vm.businessAreasSelect = districtService.getBusinessAreas(districtId);
        }

        function loadIndustries() {
            vm.industriesSelect = industryService.getIndustries();
        }

        function loadDistricts(cityId) {
            vm.districtsSelect = districtService.getDistricts(cityId);
        }

        // function loadCity() {
        //     vm.cities = cityService.getCity();
        //     vm.cities.unshift({"c": "0", "n": "全部"});
        // }

        //浏览器后退触发事件
        $window.onpopstate = function () {
            // 获得存储在该历史记录点的currentPage对象
            var currentPage = $window.history.state;
            if (currentPage == null) {
                vm.currentPage = 1;
            } else {
                vm.currentPage = currentPage.currentPage;
            }

            if(vm.pluginId == vm.sitingPluginId) {
                matchTransfer()
            } else if (vm.pluginId == vm.transferPluginId){
                matchSiting()
            }

        };

    }

});


//添加推荐
// function add(resourceId) {
//     var recommendationObj = {};
//     for(var i = 0, length = vm.recommendation.length; i < length; i++ ) {
//         if (vm.recommendation[i].id  == resourceId) {
//             recommendationObj = vm.recommendation[i];
//             break;
//         }
//     }
//
//     var deferred = $q.defer();
//
//     if(pluginId != 'xw:reservation') {
//         recommendService.add(sessionId, resourceId, requirementId, preferenceId).then(function () {
//             angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#B5FF99');
//             recommendationObj.hasRecommend = true;
//             deferred.resolve();
//         }, function (error) {
//             angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#FFBDBD');
//             deferred.reject();
//             errorService.processError(error);
//
//         });
//     } else {
//         recommendService.addResRecommendation(sessionId, resourceId, shopId, preferenceId).then(function () {
//             angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#B5FF99');
//             recommendationObj.hasRecommend = true;
//             deferred.resolve();
//         }, function (error) {
//             angular.element(document.querySelector("#id" + resourceId)).css("background-color", '#FFBDBD');
//             deferred.reject();
//             errorService.processError(error);
//         });
//     }
//
//     return deferred.promise;
// }


// function getRecommendation() {
//     if(pluginId != 'xw:reservation') {
//         recommendService.match(sessionId, requirementId, vm.status, vm.mobile,  vm.currentPage - 1, vm.pageSize).then(function (result) {
//             vm.recommendation = result["objects"];
//             vm.totalCount = result.totalCount;
//         }, function (error) {
//             errorService.processError(error);
//         });
//     } else {
//         recommendService.matchResRecommendation(sessionId, shopId, vm.status, vm.mobile, vm.currentPage - 1, vm.pageSize).then(function (result) {
//             vm.recommendation = result["objects"];
//             vm.totalCount = result.totalCount;
//         }, function (error) {
//             errorService.processError(error);
//         });
//     }
// }
