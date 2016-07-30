/**
 * Created by xjs on 2016/4/26.
 */
define([
    'angular'
], function (angular) {
    angular.module('xwWeb')
        .$register.factory('cityService', cityService);

    cityService.$inject = [];

    function cityService() {
        return {
            getCity: transferObjToArr
        }

        //城市对象转换成json
        function transferObjToArr() {
            var Obj = {
                "1101": "\u5317\u4eac",
                "1201": "\u5929\u6d25",
                "1301": "\u77f3\u5bb6\u5e84",
                "1401": "\u592a\u539f",
                "1501": "\u547c\u548c\u6d69\u7279",
                "2101": "\u6c88\u9633",
                "2102": "\u5927\u8fde",
                "2103": "\u978d\u5c71",
                "2201": "\u957f\u6625",
                "2202": "\u5409\u6797",
                "2203": "\u56db\u5e73",
                "2301": "\u54c8\u5c14\u6ee8",
                "3101": "\u4e0a\u6d77",
                "3201": "\u5357\u4eac",
                "3202": "\u65e0\u9521",
                "3203": "\u5f90\u5dde",
                "3204": "\u5e38\u5dde",
                "3205": "\u82cf\u5dde",
                "3206": "\u5357\u901a",
                "3301": "\u676d\u5dde",
                "3302": "\u5b81\u6ce2",
                "3303": "\u6e29\u5dde",
                "3307": "\u91d1\u534e",
                "3401": "\u5408\u80a5",
                "3402": "\u829c\u6e56",
                "3408": "\u5b89\u5e86",
                "3501": "\u798f\u5dde",
                "3502": "\u53a6\u95e8",
                "3503": "\u8386\u7530",
                "3505": "\u6cc9\u5dde",
                "3506": "\u6f33\u5dde",
                "3507": "\u5357\u5e73",
                "3601": "\u5357\u660c",
                "3604": "\u4e5d\u6c5f",
                "3607": "\u8d63\u5dde",
                "3701": "\u6d4e\u5357",
                "3702": "\u9752\u5c9b",
                "3706": "\u70df\u53f0",
                "3707": "\u6f4d\u574a",
                "3710": "\u5a01\u6d77",
                "3713": "\u4e34\u6c82",
                "4101": "\u90d1\u5dde",
                "4103": "\u6d1b\u9633",
                "4107": "\u65b0\u4e61",
                "4114": "\u5546\u4e18",
                "4201": "\u6b66\u6c49",
                "4205": "\u5b9c\u660c",
                "4206": "\u8944\u9633",
                "4301": "\u957f\u6c99",
                "4302": "\u682a\u6d32",
                "4401": "\u5e7f\u5dde",
                "4403": "\u6df1\u5733",
                "4404": "\u73e0\u6d77",
                "4406": "\u4f5b\u5c71",
                "4407": "\u6c5f\u95e8",
                "4413": "\u60e0\u5dde",
                "4419": "\u4e1c\u839e",
                "4420": "\u4e2d\u5c71",
                "4501": "\u5357\u5b81",
                "4502": "\u67f3\u5dde",
                "4503": "\u6842\u6797",
                "4601": "\u6d77\u53e3",
                "4602": "\u4e09\u4e9a",
                "5001": "\u91cd\u5e86",
                "5101": "\u6210\u90fd",
                "5107": "\u7ef5\u9633",
                "5201": "\u8d35\u9633",
                "5203": "\u9075\u4e49",
                "5301": "\u6606\u660e",
                "5303": "\u66f2\u9756",
                "6101": "\u897f\u5b89",
                "6103": "\u5b9d\u9e21",
                "6104": "\u54b8\u9633",
                "6106": "\u5ef6\u5b89",
                "6201": "\u5170\u5dde"
            };
            var arr = [];
            var arrKey = Object.keys(Obj);

            for (var key = 0; key < arrKey.length; key++) {
                arr[key] = {};
                var objKey = arrKey[key];
                var objValue = Obj[objKey];
                //arr[key][objKey] = objValue;
                arr[key].c = objKey;
                arr[key].n = objValue;
            }
            return arr;
        }
    }
});




