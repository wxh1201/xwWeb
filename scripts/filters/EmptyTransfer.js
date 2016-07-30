(function() {
  angular.module('xwWeb')
    .filter('emptyTransfer', function() {
      return function(input) {
        var emptyTransferTypes = {
          "1":"可",
          "2":"不可"
        }
        input = typeof input != "undefined" ? input.toString() : "";
        return emptyTransferTypes[input] ? emptyTransferTypes[input] : '';
      }
    })
})();
