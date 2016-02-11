/**
 * Created by chocho on 01/10/15.
 */
app = angular.module("ngSemantic", []);

app.directive("ngPopup", [
    function() {
        return {
            restrict: "A",
            link: function(scope, elem, attr) {
                $(elem).popup();
            }
        };
    }
]);


app.directive("ngDropdown", [ "$timeout",
  function($timeout) {
    return {
      restrict: "AE",
      require: 'ngModel',
      scope : {
        ngDropdownChoice : "=",
        ngDropdown : "="
      },
      template : '<option value="{{tag[tagKey]}}" ng-repeat="tag in tagsList">{{tag[tagValue]}}</option>',
      link: function(scope, elem, attr) {

        console.log("dropdown");
        scope.tagKey = "_id";
        scope.tagValue = "_id";

        if(scope['ngDropdown'] == "" || scope['ngDropdown'] == null){
          scope['ngDropdown'] = {};
        }

        if(scope['ngDropdown']["key"]){
          scope.tagKey = scope['ngDropdown']["key"];
          scope.tagValue = scope['ngDropdown']["value"];
        }

        if(scope['ngDropdown']["value"]){
          scope.tagValue = scope['ngDropdown']["value"];
        }

        scope.$watch("ngDropdownChoice", function(value) {
          scope.tagsList = value;
          if(scope.tagsList != undefined && scope.tagsList)
            $timeout(function () {
              $(elem).dropdown(scope['ngDropdown']);
            }, 150);
        }, true);

      }
    };
  }
]);


app.directive("ngOpenModal", [
    function() {
        return {
            restrict: "AE",
            link: function(scope, elem, attr) {
                $(elem).on("click", function(){
                    $("#"+attr.ngOpenModal).modal("show");
                });
            }
        };
    }
]);

app.directive("ngSticky", [
    function() {
        return {
            restrict: "AE",
            link: function(scope, elem, attr) {
                $(elem).sticky({
                    context: attr.ngSticky
                })
            }
        };
    }
]);
