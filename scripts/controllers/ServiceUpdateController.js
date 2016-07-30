/**
 * Created by xiajingsi on 2016/5/10.
 */
define([
    'require',
    'angular',
    '../services/AuthService',
    '../services/DistrictService',
    '../services/IndustryService',
    '../services/PositionService',
    '../services/ErrorService',
    '../services/CityService',
    '../services/RequirementService',
    '../services/ShopService'
], function (require, angular) {
    return angular.module('xwWeb')
        .registerController('serviceUpdateController', ['CONFIG', '$stateParams', '$location', '$filter', 'Upload', 'authService', 'postService', 'districtService', 'industryService', 'positionService', 'errorService', 'cityService',serviceUpdateController]);

    function serviceUpdateController(CONFIG, $stateParams, $location, $filter, Upload, authService, postService, districtService, industryService, positionService, errorService, cityService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        var requirementId = $stateParams.requirementId;

        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.shopTransferType = 1;//店铺转让类型
        vm.attractInvestmentType = 2;//出租招商
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
        vm.emptyTransferSelect = [
            {
                "value": 1,
                "name": "是"
            },
            {
                "value": 2,
                "name": "否"
            }
        ]
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

        vm.rentsSelect = [
            {"value": "1", "name": "0-5000", "minRent": 0, "maxRent": 5000},
            {"value": "2", "name": "5000-10000", "minRent": 5000, "maxRent": 10000},
            {"value": "3", "name": "10000-20000", "minRent": 10000, "maxRent": 20000},
            {"value": "4", "name": "20000-40000", "minRent": 20000, "maxRent": 40000},
            {"value": "5", "name": "40000-60000", "minRent": 40000, "maxRent": 60000},
            {"value": "6", "name": "60000以上", "minRent": 60000, "maxRent": 14100653},

        ]

        init();//初始化数据


        function init() {

        }

        function initTransfer() {
            angular.element(document).ready(function () {
                initPhoto("transferThumbContainer")
            });
        }

        function initSiting() {
            angular.element(document).ready(function () {
                initDistrict("sitingDistrictContainer");
            });
        }

        function initRecruitment() {
            angular.element(document).ready(function () {
                initMap("recruitmentMapContainer");
                initPosition("recruitmentPositionContainer");
                initPhoto("recruitmentThumbContainer");
            });
        }

        function initReservation() {
            angular.element(document).ready(function () {
                initMap("reservationMapContainer");
                initPhoto("reservationThumbContainer")
            });
        }

        function transferPost(isValid) {
            vm.submitted = true;
            if (!isValid) {
                return;
            }
            var params = {
                contact: vm.contact,
                description: vm.remark,
                type: parseInt(vm.transferType),
                shopName: vm.shopName,
                address: vm.address,
                districtId: parseInt(vm.businessAreaId),
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                photos: vm.photos,
            };
            console.log(params, "params");
            //当类型为出租招商时行业为非必填
            //TODO:修改各字段统一
            if (vm.transferType == vm.attractInvestmentType) {
                if (vm.smallIndustryId) {
                    params['industryId'] = parseInt(vm.smallIndustryId);
                }
            } else if (vm.transferType == vm.shopTransferType) {
                params['industryId'] = parseInt(vm.smallIndustryId);

                if (vm.emptyTransfer) {
                    params['emptyTransfer'] = parseInt(vm.emptyTransfer);
                }
            }
            if (vm.transferFee) {
                params['transferFee'] = vm.transferFee * 100;
            }

            if (vm.area) {
                params['area'] = parseInt(vm.area);
            }

            if (vm.rent) {
                params['rent'] = vm.rent * 100;
            }


            if (vm.businessStatus) {
                params['businessStatus'] = parseInt(vm.businessStatus);
            }

            postService.update(sessionId, vm.opportunityId, params).then(function (result) {
                alert("已保存成功");
                $location.path("/businessDetail/" + vm.businessId);
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
            var area = getAreaRange(vm.areaId);
            vm.minArea = area['minArea'];
            vm.maxArea = area['maxArea'];

            var params = {
                contact: vm.contact,
                industryId: parseInt(vm.smallIndustryId),
                districtIds: vm.districtIds,
                minArea: parseInt(vm.minArea),
                maxArea: parseInt(vm.maxArea),
                description: vm.remark
            }

            if (vm.rentId) {
                var rent = getRentRange(vm.rentId);
                vm.minRent = rent['minRent'];
                vm.maxRent = rent['maxRent'];
                params['minRent'] = vm.minRent * 100;
                params['maxRent'] = vm.maxRent * 100;
            }
            postService.update(sessionId, vm.opportunityId, params).then(function (result) {
                alert("已保存成功");
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
        }


        function recruitmentPost(isValid) {
            vm.recruitmentFormSubmitted = true;
            if (!isValid) {
                return;
            }
            if (vm.positionIds.length == 0) {
                return;
            }
            var params = {
                contact: vm.contact,
                shopName: vm.shopName,
                industryId: parseInt(vm.smallIndustryId),
                positionIds: vm.positionIds,
                districtId: parseInt(vm.businessAreaId),
                address: vm.address,
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                description: vm.remark,
                photos: vm.photos
            };
            if (vm.recruitNumber) {
                params['recruitNumber'] = parseInt(vm.recruitNumber);
            }
            postService.update(sessionId, vm.opportunityId, params).then(function (result) {
                alert("已保存成功");
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
        }

        function reservationPost(isValid) {
            vm.submitted = true;
            if (!isValid) {
                return;
            }
            var params = {
                contact: vm.contact,
                description: vm.remark,
                shopName: vm.shopName,
                address: vm.address,
                industryId: parseInt(vm.smallIndustryId),
                districtId: parseInt(vm.businessAreaId),
                longitude: parseFloat(vm.longitude),
                latitude: parseFloat(vm.latitude),
                photos: vm.photos
            };

            postService.update(sessionId, vm.opportunityId, params).then(function (result) {
                alert("已保存成功");
                $location.path("/businessDetail/" + vm.businessId);
            }, function (error) {
                errorService.processError(error);
            });
        }


        function loadIndustries() {
            vm.industriesSelect = industryService.getIndustries();
        }

        function loadSmallIndustries(industryId) {
            vm.smallIndustryId = "";
            vm.smallIndustriesSelect = industryService.getSmallIndustries(industryId);
        }

        function loadDistricts() {
            vm.districtsSelect = districtService.getDistricts(vm.cityId);
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

        //地图展示
        function showMap(container) {
            vm.showMaped = true;
            var marker;//标注
            if(vm.markered) {
                marker = new BMap.Marker(new BMap.Point(vm.longitude, vm.latitude));
                map.addOverlay(marker);
            } else {
                require(['http://api.map.baidu.com/getscript?v=2.0&ak=sIq3pmhG5n4xVuKQ8eKr1BiV0hsLP2ek'], function () {
                    // 百度地图API功能
                    var localSearch = new BMap.LocalSearch(new BMap.Map());
                    localSearch.setSearchCompleteCallback(function (searchResult) {
                        map = new BMap.Map(container);
                        var point = searchResult.getPoi(0).point;
                        vm.longitude = point.lng;
                        vm.latitude = point.lat;
                        map.centerAndZoom(point, 16);
                        marker = new BMap.Marker(point);// 创建标注
                        vm.markered = true;
                        map.addOverlay(marker);             // 将标注添加到地图中
                        marker.enableDragging();           // 可拖拽
                        marker.addEventListener("dragend", function (e) {
                            vm.longitude = e.point.lng;
                            vm.latitude = e.point.lat;
                        })

                        map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放
                        map.addControl(new BMap.MapTypeControl());//添加地图类型控件
                        map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
                        map.addControl(new BMap.NavigationControl({enableGeolocation: true})); //左上角，添加默认缩放平移控件
                        map.addControl(new BMap.NavigationControl({
                            anchor: BMAP_ANCHOR_TOP_RIGHT,
                            type: BMAP_NAVIGATION_CONTROL_SMALL
                        }));//右上角，仅包含平移和缩放按钮

                        //添加标注
                        map.addEventListener("click", function (e) {
                            vm.markered = true;
                            map.clearOverlays();
                            marker = new BMap.Marker(e.point);
                            vm.longitude = e.point.lng;
                            vm.latitude = e.point.lat;
                            map.addOverlay(marker);
                        });

                    });
                    var cityName = $filter('cityName')(vm.cityId);
                    var districtName = vm.districtId ? $filter('districtName')(vm.districtId) : "";
                    var businessArea = vm.businessAreaId ? $filter('districtName')(vm.businessAreaId) : "";
                    var keyword = cityName + districtName + businessArea;
                    localSearch.search(keyword);
                });
            }

        }

        //初始化地图
        function initMap(container) {
            //TODO:经纬度为0的判断，如果经纬度为0的处理是？如果为0，则显示区域信息。经纬度怎么是0呢？
            if(vm.longitude == 0 || vm.latitude){
                showMap(container);
            } else {
                vm.showMaped = true;
                require(['http://api.map.baidu.com/getscript?v=2.0&ak=sIq3pmhG5n4xVuKQ8eKr1BiV0hsLP2ek'], function () {
                    map = new BMap.Map(container);
                    var point = new BMap.Point(vm.longitude, vm.latitude);
                    console.log(vm.longitude, "vm.longitude")
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
                    map.addEventListener("click",function(e){
                        vm.markered = true;
                        map.clearOverlays();
                        marker = new BMap.Marker(e.point);
                        vm.longitude = e.point.lng;
                        vm.latitude = e.point.lat;
                        map.addOverlay(marker);
                    });
                });
            }
        }

        //设置经纬度
        function setLocation(longitude, latitude) {
            vm.longitude = longitude;
            vm.latitude = latitude;
        }

        //上传文件
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
        function addDistrict(districtContainer) {
            if (vm.businessAreaId || vm.districtId) {
                var districtId = 0;
                if (vm.businessAreaId) {
                    if ($.inArray(vm.businessAreaId, vm.districtIds) != -1) {//如果已存在则不能添加
                        return;
                    } else {
                        if ($.inArray(vm.businessAreaId.substr(0, 6), vm.districtIds) != -1) {//如果不存在但所属的区域已经存在，则不能添加
                            return;
                        }
                    }
                    districtId = parseInt(vm.businessAreaId);
                } else {
                    if ($.inArray(vm.districtId, vm.districtIds) != -1) {//如果已存在则不能添加
                        return;
                    } else {
                        for (var i = 0, districtIds = vm.districtIds, length = districtIds.length; i < length; i++) {//如果不存在但底下的商圈有一个已存在，则不能添加
                            if (districtIds[i].toString().substr(0, 6) == vm.districtId) {
                                return;
                            }
                        }
                    }
                    districtId = parseInt(vm.districtId);
                }
                vm.districtIds.push(districtId);
                var district = '<district id="' + districtId + '" remove="vm.removeDistrict(id)" />';
                districtContainer = $('#' + districtContainer);
                angular.element(districtContainer).injector().invoke(function ($compile) {
                    var $scope = angular.element(districtContainer).scope();
                    districtContainer.append($compile(district)($scope));
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

        }

        //初始化区域
        //TODO；修改市后要把前面已选的商圈删除
        function initDistrict(districtContainer) {
            districtContainer = $('#' + districtContainer);
            for (var i = 0; i < vm.districtIds.length; i++) {
                var district = '<district id="' + vm.districtIds[i] + '" remove="vm.removeDistrict(id)" />';
                angular.element(districtContainer).injector().invoke(function ($compile) {
                    var $scope = angular.element(districtContainer).scope();
                    districtContainer.append($compile(district)($scope));
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
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
        function getRentRange(rentId) {
            var rents = vm.rentsSelect;
            var rentRangeMap = {};
            for (var i = 0; i < rents.length; i++) {
                rentRangeMap[rents[i]['value']] = rents[i];
            }
            if (rentRangeMap[rentId]) {
                var rent = rentRangeMap[rentId];
                return {
                    minRent: rent['minRent'],
                    maxRent: rent['maxRent']
                }
            }
            return {
                minRent: 0,
                maxRent: 0
            }
        }

        //添加职位
        function addPosition(positionContainer) {
            if (vm.positionId && $.inArray(vm.positionId, vm.positionIds) == -1) {
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

        //删除职位
        function removePosition(id) {
            for (var i = 0, length = vm.positionIds.length; i < length; i++) {
                if (vm.positionIds[i] == id) {
                    vm.positionIds.splice(i, 1);
                    break;
                }
            }
        }

        //xjs：获取所有的城市
        function loadCity() {
            vm.cities =  cityService.getCity();
        }

        //隐藏地图
        function hiddenMap() {
            vm.showMaped = false;
        }
    }
});
