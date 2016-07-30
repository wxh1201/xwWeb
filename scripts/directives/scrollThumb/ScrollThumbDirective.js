define([
  'angular'
], function(angular) {
  return angular.module('xwWeb')
    .registerDirective('scrollThumb', scrollThumb);

  function scrollThumb() {
    return {
      restrict: 'E',
      scope: {
        bigPics: "=",
        smallPics: "=",
      },
      controller: ["$scope", scrollThumbController],
      templateUrl: 'scripts/directives/scrollThumb/scrollThumb.html',
    }

    function scrollThumbController($scope) {
      var animate_time=200;//动画时间：0.2秒
      var index = 0;
      var page = 1;

      $scope.focus = function(current){
        index = current;
        $(".scrollpic li").removeClass("current");
        $("#" + current).addClass("current");
        $(".scrollThumbContainer .focuspic").animate({"marginLeft":current*-392},{duration:animate_time,queue:false});
      };

      $scope.goToPage = function(page) {
        index = (page - 1) * 3;
        $(".scrollpic li").removeClass("current");
        $("#" + index).addClass("current");
        $(".scrollThumbContainer .focuspic").animate({"marginLeft":index*-392},{duration:animate_time,queue:false});
        $(".scrollpic ul").animate({"marginLeft":index*-112},{duration:animate_time,queue:false});
      }

      $scope.prev = function() {
        page = page - 1;
        $scope.goToPage(page);
      }

      $scope.hasPrev = function() {
        return page > 1;
      }

      $scope.next = function() {
        page = page + 1;
        $scope.goToPage(page);
      }

      $scope.hasNext = function(picnumber) {
        return page < Math.ceil(picnumber/3);
      }


    }
  }
});
