define([
    'require',
    'angular',
    '../services/AuthService',
    '../services/PostService',
    '../services/DistrictService',
    '../services/IndustryService',
    '../services/PositionService',
    '../services/ResourceService',
    '../services/PreferenceService',
    '../services/ErrorService',
    '../services/CityService',
    '../services/RemarkService'

], function (require, angular) {
    return angular.module('xwWeb')
        .registerController('postController', ['remarkService','$timeout','$stateParams','$scope', 'CONFIG', '$location', '$filter', 'Upload', 'authService', 'postService', 'districtService', 'industryService', 'positionService', 'resourceService', 'preferenceService', 'errorService', 'cityService', postController]);

    function postController(remarkService,$timeout,$stateParams,$scope, CONFIG, $location, $filter, Upload, authService, postService, districtService, industryService, positionService, resourceService, preferenceService, errorService, cityService) {


        var sessionId = authService.getSessionId();
        var vm = this;
        var map = null;
        vm.opportunityId = $stateParams.oppId ? $stateParams.oppId : 0;
        vm.businessId = $stateParams.businessId ? $stateParams.businessId : 0;
        vm.isRevamp = $stateParams.oppId ? true : false;
        vm.submitted = false;
        vm.sitingFormSubmitted = false;
        vm.recruitmentFormSubmitted = false;
        vm.remarkSubmitted = false;
        vm.cityId = authService.getCityId();
        vm.showMaped = false;
        vm.currentStep = 0;
        vm.errorMessage = "";
        vm.suitableIndustryMsg = "";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.shopTransferType = 1;//店铺转让类型
        vm.attractInvestmentType = 2;//出租招商
        vm.xwHidden = "xwhidden";
        vm.transferTypes = [
            {
                "value": vm.shopTransferType,
                "name": "店铺转让"
            },
            {
                "value": vm.attractInvestmentType,
                "name": "出租招商"
            }
        ];
        vm.businessStatusSelect = [
            {
                "value": 1,
                "name": "营业中"
            },
            {
                "value": 2,
                "name": "未营业"
            }
        ];
        vm.industriesSelect = [];
        vm.suitableIndustriesSelect = [];
        vm.smallIndustriesSelect = [];
        vm.suitableSmallIndustriesSelect = [];
        vm.districtsSelect = [];
        vm.businessAreasSelect = [];
        vm.positionsSelect = [];
        vm.suitableIndustryIds = [];

        vm.areasSelect = [
            {"value": "1", "name": "0-20平米", "minArea": 0, "maxArea": 20},
            {"value": "2", "name": "20-50平米", "minArea": 20, "maxArea": 50},
            {"value": "3", "name": "50-100平米", "minArea": 50, "maxArea": 100},
            {"value": "4", "name": "100-200平米", "minArea": 100, "maxArea": 200},
            {"value": "5", "name": "200-300平米", "minArea": 200, "maxArea": 300},
            {"value": "6", "name": "300-500平米", "minArea": 300, "maxArea": 500},
            {"value": "7", "name": "500-800平米", "minArea": 500, "maxArea": 800},
            {"value": "8", "name": "800-1200平米", "minArea": 800, "maxArea": 1200},
            {"value": "9", "name": "1200-1500平米", "minArea": 1200, "maxArea": 1500},
            {"value": "10", "name": "1500-2000平米", "minArea": 1500, "maxArea": 2000},
            {"value": "11", "name": "2000-3000平米", "minArea": 2000, "maxArea": 3000},
            {"value": "12", "name": "3000-4000平米", "minArea": 3000, "maxArea": 4000},
            {"value": "13", "name": "4000-5000平米", "minArea": 4000, "maxArea": 5000},
            {"value": "14", "name": "5000-6000平米", "minArea": 5000, "maxArea": 6000},
            {"value": "15", "name": "6000-7000平米", "minArea": 6000, "maxArea": 7000},
            {"value": "16", "name": "7000-8000平米", "minArea": 7000, "maxArea": 8000},
            {"value": "17", "name": "8000-9000平米", "minArea": 8000, "maxArea": 9000},
            {"value": "18", "name": "9000-10000平米", "minArea": 9000, "maxArea": 10000},
            {"value": "19", "name": "10000-11000平米", "minArea": 10000, "maxArea": 11000},
            {"value": "20", "name": "11000-12000平米", "minArea": 11000, "maxArea": 12000},
            {"value": "21", "name": "12000-13000平米", "minArea": 12000, "maxArea": 13000},
            {"value": "22", "name": "13000平米以上", "minArea": 13000, "maxArea": 999999}
        ];

        vm.rentSelect = [
            {"value": "1", "name": "0-5000元/月", "sitingMinRent": 0, "sitingMaxRent": 5000},
            {"value": "2", "name": "5000-10000元/月", "sitingMinRent": 5000, "sitingMaxRent": 10000},
            {"value": "3", "name": "10000-20000元/月", "sitingMinRent": 10000, "sitingMaxRent": 20000},
            {"value": "4", "name": "20000-40000元/月", "sitingMinRent": 20000, "sitingMaxRent": 40000},
            {"value": "5", "name": "40000-60000元/月", "sitingMinRent": 40000, "sitingMaxRent": 60000},
            {"value": "6", "name": "60000元/月以上", "sitingMinRent": 60000, "sitingMaxRent": 999999}
        ];
        vm.rentSelectId = '';
        vm.minRent = '';
        vm.maxRent = '';

        vm.pluginId = "";
        vm.mobile = "";
        vm.contact = "";
        vm.remark = "";
        vm.transferType = "";//类型，店铺转让或出租招商
        vm.shopName = "";
        vm.address = "";
        vm.industryId = "";
        vm.smallIndustryId = "";
        vm.suitableIndustryId = "";
        vm.suitableSmallIndustryId = "";
        vm.districtId = "";
        vm.businessAreaId = "";
        vm.longitude = "";
        vm.latitude = "";
        vm.transferFee = "";
        vm.rent = '';
        vm.area = '';
        vm.businessStatus = 1;//设置默认经营状态为营业中
        vm.photos = [];
        vm.slogan = "";
        vm.title = "";
        vm.negotiable = false;

        vm.districtIds = [];
        vm.areaId = "";
        vm.minArea = '';
        vm.maxArea = '';
        vm.sitingMinRent = '';
        vm.sitingMaxRent = '';

        vm.positionIndustryId = "";
        vm.positionId = "";
        vm.positionIds = [];
        vm.recruitNumber = "";

        vm.emptyTransfer = 1;//设置默认可空转
        vm.markered = false;//用户是否已经在地图上标注目标地点。

        vm.exitOpportunityId = "";//已存在商机的Id
        vm.lock = false;//商机没锁定
        vm.remarkContent = "";

        //方法
        vm.goToStep = goToStep;//切换步骤
        vm.select = select;//选择类型
        vm.lock = lock;//锁定
        vm.transferPost = transferPost;//发布转店信息
        vm.transferPostAndTake = transferPostAndTake;//发布并领取转店信息
        vm.sitingPost = sitingPost;//发布找店信息
        vm.sitingPostAndTake = sitingPostAndTake;//发布并领取找店信息
        vm.recruitmentPost = recruitmentPost;//发布招聘信息
        vm.recruitmentPostAndTake = recruitmentPostAndTake;//发布并领取招聘信息
        vm.reservationPost = reservationPost;//发布消费信息
        vm.reservationPostAndTake = reservationPostAndTake;//发布并领取消费信息
        vm.loadIndustries = loadIndustries;//获取大行业
        vm.loadSmallIndustries = loadSmallIndustries;//获取大行业下面的小行业
        vm.loadDistricts = loadDistricts;//获取城市下面的区域
        vm.loadBusinessAreas = loadBusinessAreas;//获取区域下面的商圈
        vm.changeBusinessArea = changeBusinessArea;//选择商圈时触发
        vm.loadPositions = loadPositions;//获取行业下面的职位
        vm.showMap = showMap;//显示地图
        vm.uploadFile = uploadFile;//上传图片
        vm.removeThumb = removeThumb;//删除缩略图
        vm.addDistrict = addDistrict;//添加区域
        vm.removeDistrict = removeDistrict;//移除区域
        vm.addPosition = addPosition;//添加职位
        vm.removePosition = removePosition;//移除职位
        vm.hiddenMap = hiddenMap;//收起地图
        vm.clearExitOpportunityId = clearExitOpportunityId;
        vm.titleInit = titleInit;//标题初始化
        vm.sloganInit = sloganInit;//根据小行业改广告语
        vm.loadSuitableSmallIndustries = loadSuitableSmallIndustries;
        vm.addSuitableIndustry = addSuitableIndustry;
        vm.removeSelectedItem = removeSelectedItem;
        vm.addRemark = addRemark;


        goToStep(1);
        loadIndustries();
        loadDistricts();
        loadCity();
        if(vm.opportunityId != 0) revampInit();

        function revampInit() {
            postService.get(sessionId, vm.opportunityId).then(function (result) {
                vm.pluginId = result.pluginId;
                vm.contact = result.contact;
                vm.mobile = result.mobile;
                vm.title = result.title;
                vm.remark = result.description;
                var content = result.content;
                if (vm.pluginId == vm.transferPluginId) {
                    vm.transferType = content.type;
                    vm.shopName = content.shopName;
                    vm.address = content.address;
                    vm.slogan = content['slogan'];
                    vm.suitableIndustryIds = content['suitableIndustryIds'] ? content['suitableIndustryIds'] : [];
                    vm.negotiable = content['negotiable'] == 1 ? true : false;

                    if (content.industryId) {
                        var smallIndustryId = content.industryId.toString();
                        vm.industryId = parseInt(smallIndustryId.substr(0, 2));
                        loadSmallIndustries(vm.industryId);//加载小行业数据
                        vm.smallIndustryId = parseInt(smallIndustryId);
                    }
                    var businessAreaId = content.districtId.toString();

                    vm.cityId = businessAreaId.substr(0, 4);
                    loadDistricts(vm.cityId);

                    vm.districtId = businessAreaId.substr(0, 6);
                    loadBusinessAreas(vm.districtId);//加载商圈数据

                    vm.businessAreaId = businessAreaId;

                    vm.longitude = content.longitude;
                    vm.latitude = content.latitude;
                    vm.area = content.area == 0 ? "" : content.area;
                    vm.rent = content.rent == 0 ? "" : content.rent / 100;
                    vm.transferFee = content.transferFee == 0 ? "" : content.transferFee / 1000000;
                    vm.businessStatus = content.businessStatus;
                    vm.photos = content.photos;
                    vm.emptyTransfer = content.emptyTransfer;

                    initTransfer();
                } else if (vm.pluginId == vm.sitingPluginId) {
                    var smallIndustryId = content.industryId;
                    vm.industryId = parseInt(smallIndustryId / 100);
                    loadSmallIndustries(vm.industryId);//加载小行业数据
                    vm.smallIndustryId = smallIndustryId;
                    vm.slogan = content['slogan'];

                    vm.minArea = content.minArea;
                    vm.maxArea = content.maxArea;

                    vm.minRent = content.minRent / 100;
                    vm.maxRent = content.maxRent / 100;

                    for (var i = 0; i < vm.rentSelect.length; i++) {
                        if (vm.rentSelect[i]['sitingMinRent'] == vm.minRent && vm.rentSelect[i]['sitingMaxRent'] == vm.maxRent) {
                            vm.rentSelectId = vm.rentSelect[i]['value'];
                        }
                    }
                    vm.districtIds = content.districtIds;
                } else if (vm.pluginId == vm.recruitmentPluginId) {
                    vm.shopName = content.shopName;
                    vm.address = content.address;

                    var smallIndustryId = content.industryId.toString();
                    vm.industryId = parseInt(smallIndustryId.substr(0, 2));
                    loadSmallIndustries(vm.industryId);//加载小行业数据
                    vm.smallIndustryId = parseInt(smallIndustryId);

                    var businessAreaId = content.districtId.toString();
                    vm.districtId = businessAreaId.substr(0, 6);
                    loadBusinessAreas(vm.districtId);//加载商圈数据
                    if(businessAreaId.length > 6) {
                        vm.businessAreaId = businessAreaId;
                    } else {
                        vm.businessAreaId = "";
                    }

                    vm.recruitNumber = content.recruitNumber ? content.recruitNumber : "";

                    vm.longitude = content.longitude;
                    vm.latitude = content.latitude;
                    vm.photos = content.photos;
                    vm.positionIds = content.positionIds;
                    initRecruitment();
                } else if (vm.pluginId == vm.reservationPluginId) {
                    vm.shopName = content.shopName;
                    vm.address = content.address;

                    var smallIndustryId = content.industryId.toString();
                    vm.industryId = parseInt(smallIndustryId.substr(0, 2));
                    loadSmallIndustries(vm.industryId);//加载小行业数据
                    vm.smallIndustryId = content.industryId;

                    var businessAreaId = content.districtId.toString();
                    vm.districtId = businessAreaId.substr(0, 6);
                    loadBusinessAreas(vm.districtId);//加载商圈数据
                    if(businessAreaId.length > 6) {
                        vm.businessAreaId = businessAreaId;
                    } else {
                        vm.businessAreaId = "";
                    }

                    vm.longitude = content.longitude;
                    vm.latitude = content.latitude;

                    vm.photos = content.photos;
                    initReservation();
                }

            }, function (error) {
                errorService.processError(error);
            })
        }
        function initTransfer() {
            angular.element(document).ready(function () {
                initMap("transferMapContainer");
                $timeout(function () {
                    initPhoto("transferThumbContainer")
                }, 1);
            });
        }

        function initSiting() {
            angular.element(document).ready(function () {
                // initDistrict("sitingDistrictContainer");
            });
        }

        function initRecruitment() {
            angular.element(document).ready(function () {
                initMap("recruitmentMapContainer");
                initPosition("recruitmentPositionContainer");
                $timeout(function () {
                    initPhoto("recruitmentThumbContainer");
                }, 1);
            });
        }

        function initReservation() {
            angular.element(document).ready(function () {
                initMap("reservationMapContainer");
                $timeout(function () {
                    initPhoto("reservationThumbContainer")
                }, 1);
            });
        }

        //初始化地图
        function initMap(container) {
            if(vm.longitude == 0 || vm.latitude == 0){
                showMap(container);
            } else {
                vm.showMaped = true;
                require(['http://api.map.baidu.com/getscript?v=2.0&ak=sIq3pmhG5n4xVuKQ8eKr1BiV0hsLP2ek'], function () {
                    map = new BMap.Map(container);
                    var point = new BMap.Point(vm.longitude, vm.latitude);
                    map.centerAndZoom(point, 16);
                    var marker = new BMap.Marker(point);// 创建标注
                    vm.markered = true;
                    map.addOverlay(marker);             // 将标注添加到地图中
                    marker.enableDragging();           // 可拖拽
                    marker.addEventListener("dragend", function (e) {
                        vm.longitude = e.point.lng;
                        vm.latitude = e.point.lat;
                    });

                    map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放
                    map.addControl(new BMap.MapTypeControl());//添加地图类型控件
                    map.addControl( new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
                    map.addControl( new BMap.NavigationControl({enableGeolocation: true})); //左上角，添加默认缩放平移控件
                    map.addControl( new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));//右上角，仅包含平移和缩放按钮

                    //添加标注
                    addMarker(map, marker);
                });
            }
        }
        //添加标注
        function addMarker(map, marker) {
            map.addEventListener("click",function(e){
                vm.markered = true;
                map.clearOverlays();
                marker = new BMap.Marker(e.point);
                vm.longitude = e.point.lng;
                vm.latitude = e.point.lat;
                map.addOverlay(marker);
                if(vm.address == '' || vm.address == undefined) {
                    geocoding(vm.longitude, vm.latitude);
                }
            });
        }
        //初始化图片
        function initPhoto(thumbContainer) {
            thumbContainer = $('#' + thumbContainer);
            for (var i = 0, length = vm.photos.length; i < length; i++) {
                var id = vm.photos[i]['id'];
                var url = vm.photos[i]['url'];
                //添加缩略图节点
                var thumb = '<thumb id="' + id + '" url="' + url + '" remove="vm.removeThumb(id)"/>';
                angular.element(thumbContainer).injector().invoke(function ($compile) {
                    var $scope = angular.element(thumbContainer).scope();
                    thumbContainer.append($compile(thumb)($scope));
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        }

        function goToStep(step) {
            vm.currentStep = step;
            if(step == 3) vm.shopName = vm.contact + "的店";
        }

        function titleInit(){
            if(vm.title == "" || typeof vm.title == 'undefined') {
                vm.title = "";
                if (vm.businessAreaId)
                    for (var i = 0; i < vm.businessAreasSelect.length; i++) {
                        if (vm.businessAreasSelect[i]['c'] == vm.businessAreaId) {
                            vm.title += vm.businessAreasSelect[i]['n'] + "-";
                            break;
                        }
                    }
                if (vm.smallIndustryId)
                    for (var i = 0; i < vm.smallIndustriesSelect.length; i++) {
                        if (vm.smallIndustriesSelect[i]['c'] == vm.smallIndustryId) {
                            vm.title += vm.smallIndustriesSelect[i]['n'] + "-";
                            break;
                        }
                    }
                if(vm.pluginId == vm.sitingPluginId)
                    vm.title += "找店";
                else vm.title += vm.transferType == 1 ? "店铺转让" : "出租招商";
            }
        }

        function sloganInit(){
            vm.slogan = "";
            if(vm.smallIndustryId)
                for(var i = 0; i < vm.smallIndustriesSelect.length ;i++){
                    if(vm.smallIndustriesSelect[i]['c'] == vm.smallIndustryId){
                        vm.slogan += vm.smallIndustriesSelect[i]['n'];
                        break;
                    }
                }
        }

        function select(pluginId) {
            vm.pluginId = pluginId;
            goToStep(2)
        }

        function lock() {
            postService.lock(sessionId, vm.mobile, vm.contact, vm.pluginId).then(function () {
                goToStep(3);
            }, function (error) {
                if(error.code == -31195) {
                    vm.exitOpportunityId = JSON.parse(error.message).id;
                } else if(error.code == -31194) {
                    vm.lock = true;
                } else {
                    errorService.processError(error);
                }
            });
        }

        function transferPost(isValid) {
            vm.submitted = true;
            if (!isValid || !vm.markered || vm.suitableIndustryIds.length == 0) {
                return;
            }
            var params = getTransferPostParams();

            //更新商机
            if(vm.isRevamp){
                postService.update(sessionId, vm.opportunityId, params).then(function () {
                    alert("已保存成功");
                    $location.path("/businessDetail/" + vm.businessId);
                }, function (error) {
                    errorService.processError(error);
                });
                return;
            }

            //发布商机
            postService.post(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result;
                goToStep(4);
            }, function (error) {
                errorService.processError(error);
            });
            //添加资源
            resourceService.add(sessionId, vm.mobile, vm.contact).then(function (result) {
                var resourceId = result;
                //添加偏好
                addTransferPreference(sessionId, resourceId);
            }, function (error) {
                //errorService.processError(error);
            });
        }

        function transferPostAndTake(isValid) {
            vm.submitted = true;
            if (!isValid || !vm.markered || vm.suitableIndustryIds.length == 0) {
                return;
            }

            var params = getTransferPostParams();
            postService.postAndTake(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result.opportunityId;
                vm.businessId = result.id;
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
            //添加资源
            resourceService.add(sessionId, vm.mobile, vm.contact).then(function (result) {
                var resourceId = result;
                //添加偏好
                addTransferPreference(sessionId, resourceId);
            }, function (error) {
                //errorService.processError(error);
            });
        }

        function getTransferPostParams () {
            var params = {
                type: parseInt(vm.transferType),
                shopName: vm.shopName,
                address: vm.address,
                districtId: vm.businessAreaId ? parseInt(vm.businessAreaId) : parseInt(vm.districtId),
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                //businessStatus: parseInt(vm.businessStatus),
                area: parseInt(vm.area),
                rent: parseInt(vm.rent * 100),
                photos: vm.photos,
                description: vm.remark,
                title:vm.title,
                slogan:vm.slogan,
                suitableIndustryIds:vm.suitableIndustryIds
            };
            //当类型为出租招商时行业为非必填
            //当类型为出租招商时行业为非必填
            if (vm.transferType == vm.attractInvestmentType) {
                if (vm.smallIndustryId) {
                    params['industryId'] = parseInt(vm.smallIndustryId);
                }
                if(vm.transferFee != null && vm.transferFee != undefined) {
                    params['transferFee'] = parseInt(vm.transferFee * 1000000);
                }

            } else if (vm.transferType == vm.shopTransferType) {
                params['industryId'] = parseInt(vm.smallIndustryId);
                if(vm.transferFee != null && vm.transferFee != undefined) {
                    params['transferFee'] = parseInt(vm.transferFee * 1000000);
                    params['negotiable'] = vm.negotiable ? 1 : 0;
                }
            }


            //经营状态
            if (vm.businessStatus) {
                params.businessStatus = parseInt(vm.businessStatus);
            }
            if(vm.transferType == vm.shopTransferType){
                if(vm.emptyTransfer != null && vm.emptyTransfer != undefined) {
                    params["emptyTransfer"] = parseInt(vm.emptyTransfer);
                }
            }
            return params;
        }

         //添加转店偏好
        function addTransferPreference(sessionId, resourceId) {
            var content = {
                type: parseInt(vm.transferType),
                cityId: parseInt(vm.cityId),
                districtId: vm.businessAreaId ? parseInt(vm.businessAreaId) : parseInt(vm.districtId),
                address: vm.address,
                description: vm.remark
            };
            //当类型为出租招商时行业为非必填
            if (vm.transferType == vm.attractInvestmentType) {
                if (vm.smallIndustryId) {
                    content['industryId'] = parseInt(vm.smallIndustryId);
                }
            } else {
                content['industryId'] = parseInt(vm.smallIndustryId);
            }
            preferenceService.add(sessionId, resourceId, vm.pluginId, content).then(function (result) {

            }, function (error) {
                errorService.processError(error);
            });
        }

        function sitingPost(isValid) {
            vm.sitingFormSubmitted = true;
            if (!isValid) {
                return;
            }
            if (vm.districtIds.length == 0) {
                return;
            }

            if(vm.minArea > vm.maxArea) {
                alert("最小面积不能大于最大面积");
                return;
            } else {
                var params =  getSitingParams();

                //更新商机
                if(vm.isRevamp){
                    postService.update(sessionId, vm.opportunityId, params).then(function () {
                        alert("已保存成功");
                        $location.path("/businessDetail/" + vm.businessId);
                    }, function (error) {
                        errorService.processError(error);
                    });
                    return;
                }

                postService.post(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                    vm.opportunityId = result;
                    goToStep(4);
                }, function (error) {
                    errorService.processError(error);
                });
                //添加资源
                resourceService.add(sessionId, vm.mobile, vm.contact).then(function (result) {
                    var resourceId = result;
                    //添加偏好
                    addSitingPreference(sessionId, resourceId);
                }, function (error) {
                    //errorService.processError(error);
                });
            }
        }

        function sitingPostAndTake(isValid) {
            vm.sitingFormSubmitted = true;
            if (!isValid) {
                return;
            }
            if (vm.districtIds.length == 0) {
                return;
            }
            if(vm.minArea > vm.maxArea) {
                alert("最小面积不能大于最大面积");
                return;
            } else {
                var params = getSitingParams();
                postService.postAndTake(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                    vm.opportunityId = result.opportunityId;
                    vm.businessId = result.id;
                    $location.path("/businessDetail/" + vm.businessId);
                }, function (error) {
                    errorService.processError(error);
                });
                //添加资源
                resourceService.add(sessionId, vm.mobile, vm.contact).then(function (result) {
                    var resourceId = result;
                    //添加偏好
                    addSitingPreference(sessionId, resourceId);
                }, function (error) {
                    //errorService.processError(error);
                });
            }
        }


        //添加找店偏好
        function addSitingPreference(sessionId, resourceId) {

            for (var i = 0; i < vm.districtIds.length; i++) {
                var districtId = vm.districtIds[i];
                var content = {
                    cityId: parseInt(vm.cityId),
                    industryId: parseInt(vm.smallIndustryId),
                    districtId: parseInt(districtId),
                    minArea: parseInt(vm.minArea),
                    maxArea: parseInt(vm.maxArea),
                    description: vm.remark,
                    minRent: parseInt(vm.minRent * 100),
                    maxRent: parseInt(vm.maxRent * 100)
                };

                preferenceService.add(sessionId, resourceId, vm.pluginId, content).then(function (result) {

                }, function (error) {
                    errorService.processError(error);
                });
            }

        }

        function getSitingParams() {

            var rent = getRentRange(vm.rentSelectId);
            vm.minRent = rent['minRent'];
            vm.maxRent = rent['maxRent'];
            //var area = getAreaRange(vm.areaId);
            //vm.minArea = area['minArea'];
            //vm.maxArea = area['maxArea'];
            var params = {
                industryId: parseInt(vm.smallIndustryId),
                districtIds: vm.districtIds,
                minArea: parseInt(vm.minArea),
                maxArea: parseInt(vm.maxArea),
                minRent: parseInt(vm.minRent * 100) ,
                maxRent: parseInt(vm.maxRent * 100),
                description: vm.remark,
                title:vm.title,
                slogan:vm.slogan
            }

            return params;
        }

        function recruitmentPost(isValid) {
            vm.recruitmentFormSubmitted = true;
            if (!isValid  || !vm.markered) {
                return;
            }
            if (vm.positionIds.length == 0) {
                return;
            }

            var params = getRecruitmentParams();

            //更新商机
            if(vm.isRevamp){
                postService.update(sessionId, vm.opportunityId, params).then(function () {
                    alert("已保存成功");
                    $location.path("/businessDetail/" + vm.businessId);
                }, function (error) {
                    errorService.processError(error);
                });
                return;
            }

            postService.post(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result;
                goToStep(4);
            }, function (error) {
                errorService.processError(error);
            });
        }

        function recruitmentPostAndTake(isValid) {
            vm.recruitmentFormSubmitted = true;
            if (!isValid || !vm.markered) {
                return;
            }
            if (vm.positionIds.length == 0) {
                return;
            }

            var params = getRecruitmentParams();

            postService.postAndTake(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result.opportunityId;
                vm.businessId = result.id;
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
        }

        //获取招聘的参数
        function getRecruitmentParams() {
            var params = {
                shopName: vm.shopName,
                address: vm.address,
                industryId: parseInt(vm.smallIndustryId),
                districtId: vm.businessAreaId ? parseInt(vm.businessAreaId) : parseInt(vm.districtId),
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                photos: vm.photos,
                positionIds: vm.positionIds,
                recruitNumber: vm.recruitNumber,
                description: vm.remark
            };

            return params;
        }

        function reservationPost(isValid) {
            vm.submitted = true;
            if (!isValid  || !vm.markered) {
                return;
            }
            var params = getReservationParams();

            //发布商机
            postService.post(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result;
                goToStep(4);
            }, function (error) {
                errorService.processError(error);
            });
        }

        function reservationPostAndTake(isValid) {
            vm.submitted = true;
            if (!isValid  || !vm.markered) {
                return;
            }

            var params = getReservationParams();

            //发布并领取
            postService.postAndTake(sessionId, vm.mobile, vm.contact, vm.pluginId, vm.remark, params).then(function (result) {
                vm.opportunityId = result.opportunityId;
                vm.businessId = result.id;
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
        }

        function getReservationParams() {
            var params = {
                shopName: vm.shopName,
                address: vm.address,
                industryId: parseInt(vm.smallIndustryId),
                districtId: vm.businessAreaId ? parseInt(vm.businessAreaId) : parseInt(vm.districtId),
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                photos: vm.photos,
                description: vm.remark
            };
            return params;
        }

        function loadIndustries() {
            vm.industriesSelect = industryService.getIndustries();
            vm.suitableIndustriesSelect = industryService.getIndustries();
        }

        function loadSmallIndustries(industryId) {
            vm.smallIndustryId = "";
            vm.smallIndustriesSelect = industryService.getSmallIndustries(industryId);
        }

        function loadDistricts() {
            vm.districtsSelect = districtService.getDistricts(vm.cityId);
            //改变城市，去掉标注
            vm.markered = false;

            //找店插件，改变城市，清空已选的商圈
            if(vm.pluginId == vm.sitingPluginId) {
                vm.districtIds = [];
            }

            vm.businessAreasSelect = [];//城市加载后要把上个城市的商圈清楚
        }

        //xjs：获取所有的城市
        function loadCity() {
           vm.cities =  cityService.getCity();
        }

        function loadBusinessAreas(districtId) {
            vm.businessAreaId = "";
            vm.businessAreasSelect = districtService.getBusinessAreas(districtId);
            //如果是转店或者是招聘或者是消费，切换区域的时候如果地图已显示则重新加载地图
            if (vm.pluginId == vm.transferPluginId || vm.pluginId == vm.recruitmentPluginId || vm.pluginId == vm.reservationPluginId) {
                var mapContainer = "";
                if (vm.pluginId == vm.transferPluginId) {
                    mapContainer = 'transferMapContainer';
                } else if (vm.pluginId == vm.recruitmentPluginId) {
                    mapContainer = 'recruitmentMapContainer';
                } else if (vm.pluginId == vm.reservationPluginId) {
                    mapContainer = 'reservationMapContainer';
                }
                if (vm.showMaped) {
                    showMap(mapContainer);
                }
            }
        }

        function changeBusinessArea() {
            if (vm.pluginId == vm.transferPluginId || vm.pluginId == vm.recruitmentPluginId || vm.pluginId == vm.reservationPluginId) {
                var mapContainer = "";
                if (vm.pluginId == vm.transferPluginId) {
                    mapContainer = 'transferMapContainer';
                } else if (vm.pluginId == vm.recruitmentPluginId) {
                    mapContainer = 'recruitmentMapContainer';
                } else if (vm.pluginId == vm.reservationPluginId) {
                    mapContainer = 'reservationMapContainer';
                }
                if (vm.showMaped) {
                    showMap(mapContainer);
                }
            }
        }

        function loadPositions(industryId) {
            vm.positionsSelect = positionService.getPositions(industryId);
        }

        function showMap(container) {
            vm.showMaped = true;
            var marker;//标注
            // if(vm.markered) {
            //     map = new BMap.Map(container);
            //     var point = new BMap.Point(vm.longitude, vm.latitude);
            //     map.centerAndZoom(point, 16);
            //     marker = new BMap.Marker(new BMap.Point(vm.longitude, vm.latitude));
            //     map.addOverlay(marker);
            // } else {
                // 百度地图API功能
                require(['http://api.map.baidu.com/getscript?v=2.0&ak=sIq3pmhG5n4xVuKQ8eKr1BiV0hsLP2ek'], function () {
                    var localSearch = new BMap.LocalSearch(new BMap.Map());

                    var cityName = $filter('cityName')(vm.cityId);
                    var districtName = vm.districtId ? $filter('districtName')(vm.districtId) : "";
                    var businessArea = vm.businessAreaId ? $filter('districtName')(vm.businessAreaId) : "";
                    var keyword = cityName + districtName + businessArea;

                    localSearch.search(keyword);

                    localSearch.setSearchCompleteCallback(function (searchResult) {
                        map = new BMap.Map(container);
                        var resultPoint = searchResult.getPoi(0).point;
                        var point;
                        if(vm.markered) {
                            point = new BMap.Point(vm.longitude, vm.latitude);
                            marker = new BMap.Marker(new BMap.Point(vm.longitude, vm.latitude));
                            map.addOverlay(marker);
                        } else {
                            point = resultPoint;
                        }

                        map.centerAndZoom(point, 16);
                        map.addControl(new BMap.MapTypeControl());//添加地图类型控件
                        map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放

                        map.addControl( new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
                        map.addControl( new BMap.NavigationControl({enableGeolocation: true})); //左上角，添加默认缩放平移控件
                        map.addControl( new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));//右上角，仅包含平移和缩放按钮

                        //添加标注
                        map.addEventListener("click",function(e){
                            vm.markered = true;
                            map.clearOverlays();
                            marker = new BMap.Marker(e.point);
                            vm.longitude = e.point.lng;
                            vm.latitude = e.point.lat;
                            map.addOverlay(marker);
                            if(vm.address == '' || vm.address == undefined) {
                                geocoding(vm.longitude, vm.latitude);
                            }
                        });

                        //标注可拖动
                        if(marker != null){
                            marker.enableDragging();           // 可拖拽
                            marker.addEventListener("dragend", function (e) {
                                vm.longitude = e.point.lng;
                                vm.latitude = e.point.lat;
                            })
                        }
                    });


                });
            // }
        }

        //创建一个地址解析器
        function geocoding(longitude, latitude) {
            var geoc = new BMap.Geocoder();
            var pt =  new BMap.Point(longitude, latitude);
            geoc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                 vm.address = addComp.street + addComp.streetNumber;
                $scope.$apply();
            });
        }

        function hiddenMap() {
            vm.showMaped = false;
        }

        function uploadFile(file, errFiles, thumbContainer) {
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
                    //添加缩略图节点
                    var thumb = '<thumb id="' + photo.id + '" url="' + photo.url + '" remove="vm.removeThumb(id)"/>';
                    thumbContainer = $('#' + thumbContainer);
                    angular.element(thumbContainer).injector().invoke(function ($compile) {
                        var $scope = angular.element(thumbContainer).scope();
                        thumbContainer.append($compile(thumb)($scope));
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
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

        //添加区域
        function addDistrict() {
            if (vm.businessAreaId || vm.districtId || vm.cityId) {
                var districtId = 0;
                if (vm.businessAreaId) {
                    if ($.inArray(parseInt(vm.businessAreaId), vm.districtIds) != -1) {//如果已存在则不能添加
                        alert("商圈已存在");
                    } else if ($.inArray(parseInt(vm.businessAreaId.substr(0, 6)), vm.districtIds) != -1) {//如果不存在但所属的区域已经存在，则不能添加
                        alert("商圈所属区域已添加");
                    } else if ($.inArray(parseInt(vm.businessAreaId.substr(0, 4)), vm.districtIds) != -1) {
                        alert("商圈所属城市已添加");
                    } else {
                        districtId = parseInt(vm.businessAreaId);
                        vm.districtIds.push(districtId);
                    }
                } else if (vm.districtId) {

                    if ($.inArray(parseInt(vm.districtId), vm.districtIds) != -1) {//如果已存在则不能添加
                        alert("区域已存在");
                    } else if ($.inArray(parseInt(vm.districtId.substr(0, 4)), vm.districtIds) != -1){
                        alert("区域所属的城市已添加");
                    } else {
                        if(vm.districtIds.length != 0) {
                            var districtIds = vm.districtIds;
                            var length = districtIds.length;
                            for (var i = length -1; i >= 0; i--) {//如果不存在但底下的商圈有一个已存在，则删除已添加的商圈
                                if (districtIds[i].toString().substr(0, 6) == vm.districtId) {//区域或商圈存在,
                                    vm.districtIds.splice(i, 1);
                                }
                            }
                        }
                        districtId = parseInt(vm.districtId);
                        vm.districtIds.push(districtId);

                    }
                } else {
                    if ($.inArray(parseInt(vm.cityId), vm.districtIds) != -1) {//如果已存在则不能添加
                        alert("城市已存在");
                    } else {
                        if(vm.districtIds.length != 0) {
                            var districtIds = vm.districtIds;
                            var length = districtIds.length;
                            for (var i = length -1; i >= 0; i--) {//如果不存在但底下的商圈有一个已存在，则删除已添加的商圈
                                if (districtIds[i].toString().substr(0, 4) == vm.cityId) {//区域或商圈存在
                                    vm.districtIds.splice(i, 1);
                                }
                            }
                        }
                        districtId = parseInt(vm.cityId);
                        vm.districtIds.push(districtId);
                    }
                }
            }
        }

        //删除区域
        function removeDistrict(id) {
            for (var i = 0, length = vm.districtIds.length; i < length; i++) {
                if (vm.districtIds[i] == id) {
                    vm.districtIds.splice(i, 1);
                    break;
                }
            }
        }

        //获取最小面积和最大面积
        function getAreaRange(areaId) {
            var areas = vm.areasSelect;
            var areaRangeMap = {};
            for (var i = 0; i < areas.length; i++) {
                areaRangeMap[areas[i]['value']] = areas[i];
            }
            if (areaRangeMap[areaId]) {
                var area = areaRangeMap[areaId];
                return {
                    minArea: area['minArea'],
                    maxArea: area['maxArea']
                }
            }
            return {
                minArea: 0,
                maxArea: 0
            }
        }

        //获取最小租金和最大租金
        function getRentRange(rentSelectId) {
            var rents = vm.rentSelect;
            var rentRangeMap = {};
            for (var i = 0; i < rents.length; i++) {
                rentRangeMap[rents[i]['value']] = rents[i];
            }
            if (rentRangeMap[rentSelectId]) {
                var rent = rentRangeMap[rentSelectId];
                return {
                    minRent: rent['sitingMinRent'],
                    maxRent: rent['sitingMaxRent']
                }
            }
            return {
                minArea: 0,
                maxArea: 0
            }
        }

        //初始化职位
        function initPosition(positionContainer) {
            positionContainer = $('#' + positionContainer);
            for (var i = 0, length = vm.positionIds.length; i < length; i++) {
                var position = '<position id="' + vm.positionIds[i] + '" remove="vm.removePosition(id)" />';
                angular.element(positionContainer).injector().invoke(function ($compile) {
                    var $scope = angular.element(positionContainer).scope();
                    positionContainer.append($compile(position)($scope));
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        }
        //添加职位
        function addPosition(positionContainer) {
            if (vm.positionId && $.inArray(parseInt(vm.positionId), vm.positionIds) == -1) {
                vm.positionIds.push(parseInt(vm.positionId));
                var position = '<position id="' + vm.positionId + '" remove="vm.removePosition(id)" />';
                positionContainer = $('#' + positionContainer);
                angular.element(positionContainer).injector().invoke(function ($compile) {
                    var $scope = angular.element(positionContainer).scope();
                    positionContainer.append($compile(position)($scope));
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        }

        //删除职位
        function removePosition(id) {
            for (var i = 0, length = vm.positionIds.length; i < length; i++) {
                if (vm.positionIds[i] == id) {
                    vm.positionIds.splice(i, 1);
                    break;
                }
            }
        }

        function clearExitOpportunityId() {
            vm.exitOpportunityId = '';
        }

        //////leo long///////////
        function addSuitableIndustry(){
            vm.suitableIndustryMsg = "";
            if(vm.suitableSmallIndustryId) {
                for(var i in vm.suitableIndustryIds){
                    if(vm.suitableSmallIndustryId == vm.suitableIndustryIds[i]){vm.suitableIndustryMsg = "该业态已存在！"; return;}
                    if(vm.suitableIndustryId == vm.suitableIndustryIds[i]){
                        vm.suitableIndustryMsg = "已添加了，该业态的行业！";
                        return;
                    }
                }
                vm.suitableIndustryIds.push(vm.suitableSmallIndustryId);
            }else if(vm.suitableIndustryId){
                var suitableIndustryIds = vm.suitableIndustryIds;//used to recur
                for(var i in suitableIndustryIds){
                    if(vm.suitableIndustryId == suitableIndustryIds[i]) {vm.suitableIndustryMsg = "该行业已存在！"; return;}
                    var smallIndustriesSelect = industryService.getSmallIndustries(vm.suitableIndustryId);
                    for(var item in smallIndustriesSelect){
                        console.info(suitableIndustryIds[i]);
                        console.info(smallIndustriesSelect[item]['c']);
                        console.info(i);
                        if(suitableIndustryIds[i] == smallIndustriesSelect[item]['c']){
                            removeSelectedItem('industry',suitableIndustryIds[i]);
                        }
                    }
                }
                vm.suitableIndustryIds.push(vm.suitableIndustryId);
            }
            vm.suitableIndustryId = "";
            vm.suitableSmallIndustryId = "";
            vm.suitableSmallIndustriesSelect = [];
        }

        function loadSuitableSmallIndustries(){
            vm.suitableSmallIndustryId = "";
            vm.suitableSmallIndustriesSelect = industryService.getSmallIndustries(vm.suitableIndustryId);
        }

        function removeSelectedItem(t,id) {
            switch(t){
                case "industry" :
                    var index = vm.suitableIndustryIds.indexOf(id);
                    if (index > -1) {
                        vm.suitableIndustryIds.splice(index, 1);
                    }
                    break;
                default :
                    break;
            }
        }

        function addRemark(isValid){
            console.info(isValid);
            vm.remarkSubmitted = true;
            if (!isValid) {
                return;
            }

            remarkService.add(sessionId, vm.opportunityId, 0, vm.remarkContent).then(function () {
                vm.xwHidden = "";
                $timeout(function(){vm.xwHidden = "xwhidden"; location.reload();},600,true);
            }, function (error) {
                errorService.processError(error);
            });
        }
    }
});
