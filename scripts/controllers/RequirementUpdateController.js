/**
 * Created by Administrator on 2016/5/4.
 */
define([
    'angular',
    '../services/ErrorService',
    '../services/AuthService',
    '../services/RequirementService',
    '../services/IndustryService',
    '../services/ShopService'


], function (angular) {
    return angular.module('xwWeb')
        .registerController('requirementUpdateController', ['$timeout', 'CONFIG', '$scope', 'Upload','$stateParams', 'requirementService', 'errorService', 'authService', 'industryService', 'shopService', requirementUpdateController]);

    function requirementUpdateController($timeout, CONFIG, $scope, Upload, $stateParams, requirementService, errorService, authService, industryService, shopService) {
        //基础参数
        var vm = this;
        var sessionId = authService.getSessionId();
        var requirementId = $stateParams.requirementId;
        var shopId = $stateParams.shopId;

        vm.allPluginId = "all:all";
        vm.transferPluginId = "xw:transfer";
        vm.sitingPluginId = "xw:siting";
        vm.recruitmentPluginId = "xw:recruitment";
        vm.reservationPluginId = "xw:reservation";
        vm.submitted = false;
        vm.smallIndustryId = '';
        var suitableIndustryContainer = 'suitableIndustryContainer';

        vm.shopTransferType = 1;//店铺转让类型
        vm.attractInvestmentType = 2;//出租招商
        vm.emptyTransferSelect = [
            {
                "value": 1,
                "name": "是"
            },
            {
                "value": 2,
                "name": "否"
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
        vm.rentsSelect = [
            {"value": "1", "name": "0-5000元/月", "minRent": 0, "maxRent": 5000},
            {"value": "2", "name": "5000-10000元/月", "minRent": 5000, "maxRent": 10000},
            {"value": "3", "name": "10000-20000元/月", "minRent": 10000, "maxRent": 20000},
            {"value": "4", "name": "20000-40000元/月", "minRent": 20000, "maxRent": 40000},
            {"value": "5", "name": "40000-60000元/月", "minRent": 40000, "maxRent": 60000},
            {"value": "6", "name": "60000元/月以上", "minRent": 60000, "maxRent": 14100653}
        ];

        //参数
        vm.suitableIndustryIds = [];
        vm.rentId = '';
        $scope.suitableIndustryIds = vm.suitableIndustryIds;

        //查询结果
        vm.detail = {};
        vm.photos = [];
        vm.requirement = {};
        vm.shop = {};

        //外部方法
        vm.getRequirement = getRequirement;//获取需求详情
        vm.update = update;//修改需求
        vm.loadSmallIndustries = loadSmallIndustries;
        vm.addIndustriesId = addIndustriesId;
        vm.uploadFile =uploadFile;
        vm.removeThumb = removeThumb;

        //初始化方法
        getRequirement();//获取需求详情
        loadIndustries();
        getShopInfo();//获取店铺信息
        //$timeout(transferInit(), 1000);

        /////////////////////////////////

        function getRequirement() {
            requirementService.getRequirementDetail(requirementId).then(function (result) {

                vm.requirement = result;
                vm.requirement.content.cost = parseFloat((vm.requirement.content.cost/1000000).toFixed(2));
                vm.requirement.content.rent = parseInt((vm.requirement.content.rent/100).toFixed(0));
                $scope.suitableIndustryIds = vm.requirement.content.suitableIndustryIds;
                if(vm.requirement.pluginId == vm.transferPluginId) {
                    vm.photos = vm.requirement.content.photos;
                    transferInit();
                }
                if(vm.requirement.pluginId == vm.sitingPluginId) {
                    vm.minRent = vm.requirement.content.minRent / 100;
                    vm.maxRent = vm.requirement.content.maxRent / 100;
                    for (var i = 0; i < vm.rentsSelect.length; i++) {
                        if (vm.rentsSelect[i]['minRent'] == vm.minRent && vm.rentsSelect[i]['maxRent'] == vm.maxRent) {
                            vm.rentId = vm.rentsSelect[i]['value'];
                        }
                    }
                }

            }, function (error) {
                errorService.processError(error);
            })
        }

        function transferInit() {
            $timeout(function () {
                initPhoto('transferThumbContainer');
            }, 1);
        }

        function update(isvalid) {
            vm.submitted = true;
            if(!isvalid) {
                return
            }

            var params = getParams(vm.requirement.pluginId);

            requirementService.update(sessionId, requirementId, vm.requirement.pluginId, params).then(function () {
                alert("修改成功");
                //getRequirement();
            }, function (error) {
                errorService.processError(error);
            })
        }

        function getParams(pluginId) {
            var params = {};
            params.content = {};
            switch (pluginId) {
                case vm.transferPluginId:
                    params = {
                        contact: vm.requirement.contact,
                        title: vm.requirement.title,
                        slogan: vm.requirement.slogan,
                        description: vm.requirement.description ? vm.requirement.description: '',
                        content: {}
                    };
                    params.content = {
                        rent: vm.requirement.content.rent * 100,
                        businessStatus: vm.requirement.content.businessStatus ? vm.requirement.content.businessStatus: 0,
                        suitableIndustryIds: $scope.suitableIndustryIds ? $scope.suitableIndustryIds:[],
                        photos: vm.requirement.content.photos ? vm.requirement.content.photos : '',
                        shopName: vm.requirement.content.shopName ? vm.requirement.content.shopName: '',
                        address: vm.requirement.content.address
                    };
                    if(vm.requirement.content.type == 1){
                        params.content.cost = vm.requirement.content.cost * 1000000;
                        params.content.emptyTransfer = vm.requirement.content.emptyTransfer ? vm.requirement.content.emptyTransfer : 1;
                    }
                    break;
                case vm.sitingPluginId:
                    params = {
                        contact: vm.requirement.contact,
                        title: vm.requirement.title,
                        description: vm.requirement.description
                    };
                    var minRent = getRentRange(vm.rentId).minRent;
                    var maxRent = getRentRange(vm.rentId).maxRent;
                    params.content = {
                        minRent:  minRent * 100,
                        maxRent:  maxRent * 100
                    };
                    break;
                case vm.recruitmentPluginId:
                    params = {
                        contact: vm.requirement.contact,
                        slogan: vm.requirement.slogan,
                        description: vm.requirement.description ?  vm.requirement.description : '',
                        content: {}
                    };
                    break;
                default:
                    break;
            }
            return params;
        }

        //加载行业
        function loadIndustries() {
            vm.industriesSelect = industryService.getIndustries();
        }

        //加载小行业
        function loadSmallIndustries(industryId) {
            vm.smallIndustryId = "";
            vm.smallIndustriesSelect = industryService.getSmallIndustries(industryId);
        }

        //添加适合行业
        function addIndustriesId() {
            var suitableIndustryId = 0;
            if(vm.smallIndustryId  == '') {
                alert("请选择确定的行业");
                return;
            } else {
                suitableIndustryId = parseInt(vm.smallIndustryId);
                if($.inArray(suitableIndustryId, vm.requirement.content.suitableIndustryIds) == -1){
                    vm.requirement.content.suitableIndustryIds.push(suitableIndustryId);
                    $scope.suitableIndustryIds = vm.requirement.content.suitableIndustryIds
                } else {
                    alert("该行业已添加");
                }
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

        function getShopInfo() {
            shopService.getShopInfo(sessionId, shopId).then(function (result) {
                vm.shop = result;
            }, function (error) {
                errorService.processError(error);
            })
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
            var elm = document.getElementById(thumbContainer);
            for (var i = 0, length = vm.photos.length; i < length; i++) {
                var id = vm.photos[i]['id'];
                var url = vm.photos[i]['url'];
                //添加缩略图节点
                var thumb = '<thumb id="' + id + '" url="' + url + '" remove="vm.removeThumb(id)"/>';
                angular.element(elm).injector().invoke(function ($compile) {
                    var $scope = angular.element(elm).scope();
                    angular.element(elm).append($compile(thumb)($scope));   // .append();
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
    }
});
