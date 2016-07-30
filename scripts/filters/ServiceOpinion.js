/**
 * 服务评价
 */
(function(){
  angular.module('xwWeb')
  .filter('serviceOpinion', function() {
    return function(input) {
      if (typeof input == "undefined") {
        return "";
      }
      var opinions = {
        "0": "非常满意",
        "1": "满意",
        "2": "一般",
        "4": "不满意",
        "5": "很不满意"
      }
      return opinions[input] ? opinions[input] : "";
    }
  })
})();