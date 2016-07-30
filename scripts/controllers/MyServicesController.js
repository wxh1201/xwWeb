/**
 * Created by xiajingsi on 2016/4/13.
 */
define([
	'angular',
	'../services/AuthService',
	'../services/ErrorService',
	'../services/ServiceService',
	'../services/DistrictService',
	'../services/IndustryService',
	'../services/CityService',
	'../services/ServiceHistoryService',
	'../services/ServiceRemarkService',
	'../services/RequirementService',
	'../services/PaginationService',
	'../services/UtilService'
], function(angular) {

	'use strict';

	return angular.module('xwWeb')
		.registerController('myServicesController', ['CONFIG', 'authService', 'serviceService', 'errorService', 'districtService', 'industryService', 'cityService', 'requirementService', 'serviceHistoryService', 'serviceRemarkService', '$window', 'paginationService', '$uibModal', '$stateParams','utilService', myServicesController]);

	function myServicesController(CONFIG, authService, serviceService, errorService, districtService, industryService, cityService, requirementService, serviceHistoryService, serviceRemarkService, $window, paginationService, $uibModal, $stateParams,utilService) {
		var sessionId = authService.getSessionId();
		var vm = this;
		var pageFlag = false;

		//基本参数
		vm.allPluginId = "all:all";
		vm.transferPluginId = "xw:transfer";
		vm.sitingPluginId = "xw:siting";
		vm.recruitmentPluginId = "xw:recruitment";
		vm.reservationPluginId = "xw:reservation";
		vm.submitted = false;

		//查询参数
		vm.currentPage = 1; //必须是1，插件会自动调用当前页数来显示
		vm.pageSize = CONFIG.pageSize;
		vm.serviceStatus = 1;
		vm.statusSelect = [{
			"value": "0",
			"name": "全部"
		}, {
			"value": "1",
			"name": "服务中"
		}, {
			"value": "2",
			"name": "已结束"
		}, {
			"value": "3",
			"name": "已放弃"
		}];

		vm.status = 1;
		/*************************************************/
		if($stateParams.serviceHall == "serviceHall"){
			vm.status = 0;
		};
		/**********************************************/

		 //默认状态为服务中
		vm.pluginIdSelect = [{
			"value": "all:all",
			"name": "类型"
		}, {
			"value": "xw:transfer",
			"name": "转店"
		}, {
			"value": "xw:siting",
			"name": "找店"
		}, {
			"value": "xw:recruitment",
			"name": "招聘"
		}, {
			"value": "xw:reservation",
			"name": "消费"
		}];
		vm.pluginId = "all:all"; //默认查找全部
		vm.industry = 0; //行业，0表示全部
		vm.cityId = 0; //城市默认为用户当前所在城市
		vm.districtId = 0; //区域，0表示全部
		vm.onlyAborting = false; //不仅显示申请放弃中
		vm.onlyHasRecommendation = false; //不仅显示有推荐处理的服务
		vm.orderBySelect = [{
			"value": "1",
			"name": "最近签约"
		}, {
			"value": "2",
			"name": "最近结束"
		}, {
			"value": "3",
			"name": "跟进时间"
		}];

		vm.orderBy = "1"; //默认按最近签约
		vm.businessAreaId = 0;
		vm.smallIndustryId = 0;
		vm.historyContent = '';
		vm.remark = '';

		//查询结果
		vm.totalCount = 0;
		vm.numPages = 1;
		vm.serviceList = [];
		vm.serviceHistoryId = ''; //新增服务记录id
		vm.serviceRemarkId = ''; //新增服务备注id

		//向外部提供的方法
		vm.loadSmallIndustries = loadSmallIndustries; //获取小行业
		vm.loadBusinessAreas = loadBusinessAreas; //获取小行业
		vm.loadDistricts = loadDistricts;
		vm.refresh = refresh; //刷新
		vm.getServingListNew = getServingListNew;
		//vm.addServiceHistory = addServiceHistory;//暂时没用到的添加服务记录方法
		//vm.addServiceRemark = addServiceRemark;//暂时没用到的添加服务备注方法
		vm.getServingListNewBySearch = getServingListNewBySearch; //搜索条用的获取服务列表方法
		vm.pageGetServingListNew = pageGetServingListNew; //添加无刷新改链接后的获取服务列表方法
		vm.abort = abort;
		vm.cancelAbort = cancelAbort;
		vm.caseRemark = caseRemark;

		loadIndustries(); //加载行业
		loadCity(); //加载城市
		pageGetServingListNew(); //获取服务列表，同分页的一样

		///////////////////////

		function getServingListNewBySearch(valid) {
			vm.submitted = true;
			if (!valid) {
				return;
			}
			pageFlag = true;
			getServingListNew();
		}

		function pageGetServingListNew() {
			paginationService.paginationPushStatus(vm.currentPage, '我的服务');
			getServingListNew();
		}

		function getServingListNew(serviceHallQueryCriteria) {
			vm.serviceHallQueryCriteria = serviceHallQueryCriteria;
			var params = {
				mobile: parseInt(vm.mobile) ? vm.mobile : '',
				cityId: parseInt(vm.cityId) ? parseInt(vm.cityId) : 0,
				onlyAborting: vm.onlyAborting,
				onlyHasRecommendation: vm.onlyHasRecommendation,
				orderBy: parseInt(vm.orderBy)
			};

			if (pageFlag) {
				pageFlag = false;
				vm.currentPage = 1;
			}

			if (vm.smallIndustryId) {
				params["industry"] = parseInt(vm.smallIndustryId);
			} else if (vm.industryId) {
				params["industry"] = parseInt(vm.industryId);
			} else {
				params["industry"] = 0
			}

			if (parseInt(vm.businessAreaId)) {
				if (vm.cityId == 0) {
					params["districtId"] = 0;
				} else {
					params["districtId"] = parseInt(vm.businessAreaId);
				}
			} else if (parseInt(vm.districtId)) {
				if (vm.cityId == 0) {
					params["districtId"] = 0;
				} else {
					params["districtId"] = parseInt(vm.districtId);
				}
			} else {
				params["districtId"] = 0;
			}
			/**************************************/
			var paramsSearch = {
				mobile: parseInt(vm.mobile) ? vm.mobile : '',
				industry: undefined,
				cityId: undefined,
				districtId: undefined,
				onlyAborting: vm.onlyAborting,
				onlyHasRecommendation: vm.onlyHasRecommendation,
				orderBy: parseInt(vm.orderBy)
			};
			var paramsQuery = {
				mobile: undefined,
				industry: params["industry"],
				cityId: parseInt(vm.cityId) ? parseInt(vm.cityId) : 0,
				districtId: params["districtId"],
				onlyAborting: vm.onlyAborting,
				onlyHasRecommendation: vm.onlyHasRecommendation,
				orderBy: parseInt(vm.orderBy)
			};

			if (serviceHallQueryCriteria == "search") {
				serviceService.getServingListNew(sessionId, "all:all", vm.status, paramsSearch, vm.currentPage - 1, vm.pageSize).then(function(result) {
					vm.serviceList = result["objects"];
					vm.totalCount = result.totalCount;
				}, function(error) {
					errorService.processError(error);
				})
			} else if (serviceHallQueryCriteria == "query") {
				serviceService.getServingListNew(sessionId, vm.pluginId, vm.status, paramsQuery, vm.currentPage - 1, vm.pageSize).then(function(result) {
					vm.serviceList = result["objects"];
					vm.totalCount = result.totalCount;
				}, function(error) {
					errorService.processError(error);
				})

				/********************************************************/
			} else {
				serviceService.getServingListNew(sessionId, vm.pluginId, vm.status, params, vm.currentPage - 1, vm.pageSize).then(function(result) {
					console.log(result["objects"]);
                    vm.serviceList = result["objects"];
                    vm.totalCount = result.totalCount;
                    vm.complete = true;
				}, function(error) {
					errorService.processError(error);
				})
			}

		}

		function loadIndustries() {
			vm.industriesSelect = industryService.getIndustries();
		}

		function loadSmallIndustries(industryId) {
			vm.smallIndustriesSelect = industryService.getSmallIndustries(industryId);
		}

		function loadBusinessAreas(districtId) {
			vm.businessAreasSelect = districtService.getBusinessAreas(districtId);
		}

		function loadDistricts(cityId) {
			vm.districtsSelect = districtService.getDistricts(cityId);
			//			console.log(vm.districtsSelect);
			/*******************************/
			if (vm.districtsSelect) {
				vm.districtsSelect.unshift({
					"c": "0",
					"n": "选择区"
				})
			}

			if (cityId == 0) {
				vm.businessAreasSelect = [];
				vm.districtsSelect = [];
			}
			/******************************************/
//			vm.districtId = vm.districtsSelect[0].c
				// vm.districtsSelect.unshift({"0":[{"c":"0","n":"全部"}]});
				// console.log(vm.districtsSelect, 'vm.districtsSelect loadBusinessAreas');
		}

		function loadCity() {
			vm.cities = cityService.getCity();
			vm.cities.unshift({
				"c": "0",
				"n": "全国"
			});
		}

		//刷新
		function refresh(requirementId) {
			requirementService.refresh(sessionId, requirementId).then(function() {
				utilService.showPrompt("刷新成功")
			}, function(error) {
				errorService.processError(error);
			})
		}

		//浏览器后退触发事件
		$window.onpopstate = function() {
			// 获得存储在该历史记录点的currentPage对象
			var currentPage = $window.history.state;
			if (currentPage == null) {
				vm.currentPage = 1;
			} else {
				vm.currentPage = currentPage.currentPage;
			}
			getServingListNew();
		};

		//放弃服务
		function abort(cssId) {
			serviceService.abort(sessionId, cssId).then(function() {
				utilService.showPrompt("已放弃服务");
				for (var i = 0, length = vm.serviceList.length; i < length; i++) {
					if (vm.serviceList[i].cssId == cssId) {
						vm.serviceList[i].serviceStatus = 1;
					}

				}
			}, function(error) {
				errorService.processError(error);
			})
		}

		//取消放弃服务
		function cancelAbort(cssId) {
			serviceService.cancelAbort(sessionId, cssId).then(function() {
				utilService.showPrompt("取消放弃服务成功");
				for (var i = 0, length = vm.serviceList.length; i < length; i++) {
					if (vm.serviceList[i].cssId == cssId) {
						vm.serviceList[i].serviceStatus = 0;
					}
				}
			}).catch(function(error) {
				errorService.processError(error);
			});
		}

		function caseRemark(id, isExistExam, pluginId) {
            var serviceObj;
            for(var i = 0, length = vm.serviceList.length; i < length; i ++) {
                if(vm.serviceList[i].id == id) {
                    serviceObj = vm.serviceList[i];
                }
            };
			var modalInstance = $uibModal.open({
				animation: true,
				size: "md",
				keyboard: true,
				templateUrl: 'views/partial/caseRemark.html',
				controllerAs: 'vm',
				controller: 'caseRemarkController',
				resolve: {
					loadController: ['$q', function($q) {
						var deferred = $q.defer();
						require(["controllers/CaseRemarkController"], function() {
							deferred.resolve();
						});
						return deferred.promise;
					}],
					serviceId: function() {
						return id;
					},
                    isExistExam: function () {
                        return isExistExam
                    },
                    pluginId: function () {
                        return pluginId
                    }
				}
			});
			modalInstance.closed.then(function() {
                console.log("modal result");
                getServingListNew();
			}, function() {

			});
		}

		function addServiceHistory() {
			serviceHistoryService.getList(sessionId, serviceId, vm.historyContent).then(function(result) {
				vm.serviceHistoryId = result;
			}, function(error) {
				errorService.processError(error);
			})
		}

		function addServiceRemark() {
			serviceRemarkService.getList(sessionId, serviceId, vm.remark).then(function(result) {
				vm.serviceRemarkId = result;
			}, function(error) {
				errorService.processError(error);
			})
		}

		/***********刘开2016-06-03******************************/
		/**
		 * 客服领取服务
		 *
		 * @param sessionId  客服session
		 * @param serviceId  服务Id
		 * @return           客服服务ID
		 */
		vm.take = take;

		function take(myService) {

			var serviceId = myService.id;
			serviceService.take(sessionId, serviceId).then(
				function() {
					utilService.showPrompt("领取服务成功，请在我的服务中进行服务");
					myService.hide = true;
				},
				function(error) {
					$window.alert(error.message);
					console.log(error);
				}
			)
		}

		/***********************************************************/
	}
});
