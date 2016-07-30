/**
 * Created by Xiajingsi on 2016/6/13.
 */

(function () {
    return angular.module('xwWeb')
        .directive('prompt', prompt);

    function prompt() {
        return {
            restrict: 'E',
            scope:{
                promptText:'@text'
            },
            template: '<div class="prompt">{{promptText}}</div>'
        }
    }
})();
