define([
    'angular',
    '../services/AuthService',
    '../services/UserService',
    '../services/ErrorService'
], function (angular) {
    return angular.module('xwWeb')
        .registerController('cityController', ['$rootScope', '$location', 'authService', 'userService', 'errorService', cityController]);

    function cityController($rootScope, $location, authService, userService, errorService) {
        var sessionId = authService.getSessionId();
        var vm = this;
        $rootScope.$on('$locationChangeSuccess', function (evt, newUrl, oldUrl) {
            vm.originUrl = oldUrl;
        })
        vm.change = change;

        vm.cities = {
            "a": [
                {
                    "id": "2103",
                    "name": "鞍山"
                },
                {
                    "id": "3408",
                    "name": "安庆"
                }
            ],
            "b": [
                {
                    "id": "1101",
                    "name": "北京"
                },
                {
                    "id": "3403",
                    "name": "蚌埠"
                },
                {
                    "id": "6103",
                    "name": "宝鸡"
                }
            ],
            "c": [
                {
                    "id": "2201",
                    "name": "长春"
                },
                {
                    "id": "3204",
                    "name": "常州"
                },
                {
                    "id": "4301",
                    "name": "长沙"
                },
                {
                    "id": "4307",
                    "name": "常德"
                },
                {
                    "id": "5001",
                    "name": "重庆"
                },
                {
                    "id": "5101",
                    "name": "成都"
                }
            ],
            "d": [
                {
                    "id": "2102",
                    "name": "大连"
                },
                {
                    "id": "2306",
                    "name": "大庆"
                },
                {
                    "id": "4419",
                    "name": "东莞"
                },
                {
                    "id": "5106",
                    "name": "德阳"
                }
            ],
            "f": [
                {
                    "id": "3412",
                    "name": "阜阳"
                },
                {
                    "id": "3501",
                    "name": "福州"
                },
                {
                    "id": "4406",
                    "name": "佛山"
                }
            ],
            "g": [
                {
                    "id": "3607",
                    "name": "赣州"
                },
                {
                    "id": "4401",
                    "name": "广州"
                },
                {
                    "id": "4503",
                    "name": "桂林"
                },
                {
                    "id": "5201",
                    "name": "贵阳"
                }
            ],
            "h": [
                {
                    "id": "1501",
                    "name": "呼和浩特"
                },
                {
                    "id": "2301",
                    "name": "哈尔滨"
                },
                {
                    "id": "3301",
                    "name": "杭州"
                },
                {
                    "id": "3401",
                    "name": "合肥"
                },
                {
                    "id": "3717",
                    "name": "菏泽"
                },
                {
                    "id": "4304",
                    "name": "衡阳"
                },
                {
                    "id": "4413",
                    "name": "惠州"
                },
                {
                    "id": "4601",
                    "name": "海口"
                },
                {
                    "id": "6107",
                    "name": "汉中"
                }
            ],
            "j": [
                {
                    "id": "2202",
                    "name": "吉林"
                },
                {
                    "id": "3304",
                    "name": "嘉兴"
                },
                {
                    "id": "3307",
                    "name": "金华"
                },
                {
                    "id": "3604",
                    "name": "九江"
                },
                {
                    "id": "3701",
                    "name": "济南"
                },
                {
                    "id": "3708",
                    "name": "济宁"
                },
                {
                    "id": "4210",
                    "name": "荆州"
                },
                {
                    "id": "4407",
                    "name": "江门"
                }
            ],
            "k": [
                {
                    "id": "4102",
                    "name": "开封"
                },
                {
                    "id": "5301",
                    "name": "昆明"
                }
            ],
            "l": [
                {
                    "id": "3713",
                    "name": "临沂"
                },
                {
                    "id": "4103",
                    "name": "洛阳"
                },
                {
                    "id": "4502",
                    "name": "柳州"
                },
                {
                    "id": "6201",
                    "name": "兰州"
                }
            ],
            "m": [
                {
                    "id": "5107",
                    "name": "绵阳"
                }
            ],
            "n": [
                {
                    "id": "3201",
                    "name": "南京"
                },
                {
                    "id": "3206",
                    "name": "南通"
                },
                {
                    "id": "3302",
                    "name": "宁波"
                },
                {
                    "id": "3507",
                    "name": "南平"
                },
                {
                    "id": "3601",
                    "name": "南昌"
                },
                {
                    "id": "4113",
                    "name": "南阳"
                },
                {
                    "id": "4501",
                    "name": "南宁"
                },
                {
                    "id": "5113",
                    "name": "南充"
                }
            ],
            "p": [
                {
                    "id": "3503",
                    "name": "莆田"
                }
            ],
            "q": [
                {
                    "id": "3505",
                    "name": "泉州"
                },
                {
                    "id": "3702",
                    "name": "青岛"
                },
                {
                    "id": "5303",
                    "name": "曲靖"
                }
            ],
            "s": [
                {
                    "id": "1301",
                    "name": "石家庄"
                },
                {
                    "id": "2101",
                    "name": "沈阳"
                },
                {
                    "id": "2203",
                    "name": "四平"
                },
                {
                    "id": "3101",
                    "name": "上海"
                },
                {
                    "id": "3205",
                    "name": "苏州"
                },
                {
                    "id": "3306",
                    "name": "绍兴"
                },
                {
                    "id": "4114",
                    "name": "商丘"
                },
                {
                    "id": "4203",
                    "name": "十堰"
                },
                {
                    "id": "4403",
                    "name": "深圳"
                },
                {
                    "id": "4405",
                    "name": "汕头"
                },
                {
                    "id": "4602",
                    "name": "三亚"
                }
            ],
            "t": [
                {
                    "id": "1201",
                    "name": "天津"
                },
                {
                    "id": "1302",
                    "name": "唐山"
                },
                {
                    "id": "1401",
                    "name": "太原"
                },
                {
                    "id": "3212",
                    "name": "泰州"
                },
                {
                    "id": "3310",
                    "name": "台州"
                }
            ],
            "w": [
                {
                    "id": "3202",
                    "name": "无锡"
                },
                {
                    "id": "3303",
                    "name": "温州"
                },
                {
                    "id": "3402",
                    "name": "芜湖"
                },
                {
                    "id": "3707",
                    "name": "潍坊"
                },
                {
                    "id": "3710",
                    "name": "威海"
                },
                {
                    "id": "4201",
                    "name": "武汉"
                }
            ],
            "x": [
                {
                    "id": "3203",
                    "name": "徐州"
                },
                {
                    "id": "3502",
                    "name": "厦门"
                },
                {
                    "id": "4107",
                    "name": "新乡"
                },
                {
                    "id": "4110",
                    "name": "许昌"
                },
                {
                    "id": "4206",
                    "name": "襄阳"
                },
                {
                    "id": "4303",
                    "name": "湘潭"
                },
                {
                    "id": "6101",
                    "name": "西安"
                },
                {
                    "id": "6104",
                    "name": "咸阳"
                },
                {
                    "id": "6301",
                    "name": "西宁"
                }
            ],
            "y": [
                {
                    "id": "3210",
                    "name": "扬州"
                },
                {
                    "id": "3706",
                    "name": "烟台"
                },
                {
                    "id": "4205",
                    "name": "宜昌"
                },
                {
                    "id": "4309",
                    "name": "益阳"
                },
                {
                    "id": "5115",
                    "name": "宜宾"
                },
                {
                    "id": "6106",
                    "name": "延安"
                },
                {
                    "id": "6108",
                    "name": "榆林"
                },
                {
                    "id": "6401",
                    "name": "银川"
                }
            ],
            "z": [
                {
                    "id": "3506",
                    "name": "漳州"
                },
                {
                    "id": "3703",
                    "name": "淄博"
                },
                {
                    "id": "4101",
                    "name": "郑州"
                },
                {
                    "id": "4302",
                    "name": "株洲"
                },
                {
                    "id": "4404",
                    "name": "珠海"
                },
                {
                    "id": "4408",
                    "name": "湛江"
                },
                {
                    "id": "4420",
                    "name": "中山"
                },
                {
                    "id": "5203",
                    "name": "遵义"
                }
            ]
        };

        vm.hotCities = [
            {
                "id": "1101",
                "name": "北京"
            },
            {
                "id": "3101",
                "name": "上海"
            },
            {
                "id": "4401",
                "name": "广州"
            },
            {
                "id": "4403",
                "name": "深圳"
            },
            {
                "id": "3301",
                "name": "杭州"
            },
            {
                "id": "5001",
                "name": "重庆"
            }
        ];

        function change(cityId) {
            userService.setCity(sessionId, cityId).then(function (result) {
                authService.restoreSession(sessionId);
                $location.url(vm.originUrl);
            }, function (error) {
                errorService.processError(error);
            });
        }


    }
});
